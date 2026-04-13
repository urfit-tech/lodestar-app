# Lodestar-App 效能深度分析報告

## 專案概覽

- **框架**: React 17 + TypeScript (CRA + react-app-rewired)
- **UI 庫**: Ant Design v3 + Chakra UI + styled-components + Emotion
- **資料層**: Apollo Client 3 + Hasura GraphQL + SWR + Axios
- **原始碼**: ~638 個 TS/TSX 檔案, ~24,000 LOC
- **路由**: 80+ 個頁面路由 (react-router v5)
- **自動產生型別檔**: `hasura.d.ts` 161,375 行 (5.8MB)

---

## 嚴重度分級

| 等級 | 說明 | 影響 |
|------|------|------|
| P0 | 嚴重 — 直接導致效能問題 | 使用者可感知的卡頓或延遲 |
| P1 | 高 — 顯著影響載入或渲染效能 | 初始載入慢、不必要的 re-render |
| P2 | 中 — 累積性效能損耗 | Bundle 過大、記憶體使用偏高 |
| P3 | 低 — 最佳化建議 | 開發體驗與長期維護性 |

---

## P0: 嚴重效能瓶頸

### 1. LoadablePage 中 React.lazy() 在每次 render 時重新建立

**檔案**: `src/LoadablePage.tsx:25`

```tsx
const LoadablePage: React.FC<{ pageName: string }> = ({ pageName }) => {
  // ...
  const PageComponent = React.lazy(() => import(`./pages/${pageName}`))  // 每次 render 重新建立！
  return <PageComponent />
}
```

**問題**: `React.lazy()` 寫在元件函式體內，每次 render 都會產生一個全新的 lazy 元件。這會導致：
- 子元件每次 render 都完整 unmount 再 remount
- 所有子元件的內部狀態 (state) 全部遺失
- 重複載入同一個 chunk
- 潛在的記憶體洩漏

**影響**: 每次導航或任何父元件 re-render 都會觸發頁面完整重建。

**修復方案**:
```tsx
// 使用 Map 快取已建立的 lazy 元件
const pageCache = new Map<string, React.LazyExoticComponent<any>>()

function getPageComponent(pageName: string) {
  if (!pageCache.has(pageName)) {
    pageCache.set(pageName, React.lazy(() => import(`./pages/${pageName}`)))
  }
  return pageCache.get(pageName)!
}

const LoadablePage: React.FC<{ pageName: string }> = ({ pageName }) => {
  const PageComponent = getPageComponent(pageName)
  return <PageComponent />
}
```

---

### 2. Context Provider 值未 memoize — 全樹 re-render

**檔案**: `src/contexts/AudioPlayerContext.tsx:142-217`

```tsx
// 每次 render 都建立新的物件參考
<AudioPlayerContext.Provider
  value={{
    visible,
    title,
    // ...所有值
    changePlayingState: state => { setIsPlaying(state) },  // 每次建立新函式
    close: () => { ... },  // 每次建立新函式
    setup: options => { ... },  // 每次建立新函式
  }}
>
```

**受影響的 Context (全部有相同問題)**:
| Context | 檔案 | 問題 |
|---------|------|------|
| AudioPlayerContext | `src/contexts/AudioPlayerContext.tsx:142-217` | 7 個 inline handler 函式 |
| PodcastPlayerContext | `src/contexts/PodcastPlayerContext.tsx:162-203` | 7 個 inline handler 函式 |
| MediaPlayerContext | `src/contexts/MediaPlayerContext.tsx:125-138` | 3 個 inline handler 函式 |
| CartContext | `src/contexts/CartContext.tsx:58-117` | 6 個 inline handler 函式，value 物件未 memoize |
| NotificationContext | `src/contexts/NotificationContext.tsx:38-49` | value 物件未 memoize |

**影響**: Application.tsx 有 8 層嵌套的 Provider。任何一層的狀態變動都會建立新的 value 物件參考，導致所有使用該 Context 的子元件 re-render，然後串聯影響下層 Provider。

**修復方案**:
```tsx
// 所有 handler 使用 useCallback
const changePlayingState = useCallback((state: boolean) => {
  setIsPlaying(state)
}, [])

// Provider value 使用 useMemo
const value = useMemo(() => ({
  visible, title, audioUrl, /* ...其他值 */
  changePlayingState,
  close,
  setup,
}), [visible, title, audioUrl, /* ...其他依賴 */, changePlayingState, close, setup])

return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
```

---

### 3. setTimeout 在 render 路徑中呼叫 (非 useEffect 內)

**檔案 1**: `src/contexts/CartContext.tsx:52`
```tsx
const CartProvider: React.FC = ({ children }) => {
  // ...
  setTimeout(() => setIsCartInitRequired(true), 2000)  // 每次 render 都排程！
```

**檔案 2**: `src/contexts/NotificationContext.tsx:32`
```tsx
const NotificationProvider: React.FC = ({ children }) => {
  // ...
  setTimeout(() => setIsNotificationInitRequired(true), 2000)  // 每次 render 都排程！
```

**問題**: `setTimeout` 寫在元件函式體中而非 `useEffect` 內。每次 re-render 都會新增一個 setTimeout，且沒有 cleanup 機制。這會：
- 產生大量 pending timeout
- 觸發無限次 setState
- 造成不必要的 re-render 循環

**修復方案**:
```tsx
useEffect(() => {
  const timer = setTimeout(() => setIsCartInitRequired(true), 2000)
  return () => clearTimeout(timer)
}, []) // 只在 mount 時執行一次
```

---

## P1: 高度影響效能

### 4. Apollo Client 大量使用 `fetchPolicy: 'no-cache'`

**共 18 處**跳過 Apollo 快取，每次都發送網路請求：

| 檔案 | 行號 |
|------|------|
| `src/hooks/exam.ts` | 351 |
| `src/hooks/appointment.ts` | 261 |
| `src/hooks/activity.ts` | 148 |
| `src/hooks/programPackage.ts` | 135 |
| `src/hooks/project.ts` | 24, 56 |
| `src/hooks/merchandise.ts` | 334 |
| `src/hooks/program.ts` | 383, 845 |
| `src/hooks/podcast.ts` | 207 |
| `src/components/issue/issueHelper.tsx` | 40 |
| `src/components/program/ProgramContentEbookReader.tsx` | 711 |
| `src/components/project/ProjectProgramCollectionSection.tsx` | 133 |
| `src/components/profile/ProfileAccountAdminCard.tsx` | 191, 199 |
| `src/components/page/LittlestarLastTimePodcastSection.tsx` | 226 |
| `src/pages/member/ProgramIssueCollectionAdminPage.tsx` | 98 |
| `src/services/cart/CartOperator.ts` | 184 |

**影響**: 重複的網路請求增加延遲與伺服器負載。

**修復方案**: 大多數情況應使用 `cache-and-network` 或 `cache-first`，僅在確實需要最新資料的場景使用 `network-only`。

---

### 5. 搜尋頁面的巨型 GraphQL 查詢

**檔案**: `src/hooks/search.ts:22-250+`

`SEARCH_PRODUCT_COLLECTION` 查詢在一次請求中同時查詢 6 種產品類型：
- programs
- program_packages
- activities
- projects
- podcasts
- merchandises

每種類型都包含大量巢狀欄位 (tags, categories, roles, plans, aggregates)。

**問題**:
- 嚴重 over-fetching
- 回應 payload 非常龐大
- 無分頁限制
- 不管使用者查看哪個 tab 都會全部查詢

**修復方案**:
- 依 tab 分拆查詢，只在使用者切換到該 tab 時才載入
- 加入分頁 (`limit`/`offset`)
- 使用 GraphQL fragments 減少重複欄位

---

### 6. 積極的輪詢機制

**檔案**: `src/components/issue/issueHelper.tsx:25-58`

```tsx
pollUntilTheNextReplyNotFromAuthorOfIssueUpdated()
// 使用 polling(1000) - 每 1 秒查詢一次，且 fetchPolicy: 'no-cache'
```

**影響**: 每秒一次的 GraphQL 查詢，完全跳過快取，持續到條件滿足為止。

**修復方案**: 改用 GraphQL Subscription 或增加輪詢間隔 (至少 5-10 秒)，並加入指數退避。

---

### 7. braft-editor CSS 全域載入

**檔案**: `src/Application.tsx:3-4`
```tsx
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
```

**問題**: 富文本編輯器的 CSS 在應用程式啟動時就載入，即使大部分頁面不需要。

**修復方案**: 將 CSS import 移到實際使用 braft-editor 的元件中，配合 lazy loading。

---

### 8. moment.js 被大量使用（同時存在 dayjs）

**統計**:
- `moment` 在 **51 個檔案**中被匯入
- `dayjs` 也在部分檔案中使用
- moment.js 壓縮後約 **67KB**，dayjs 僅 **2KB**

**影響**: 兩個日期庫同時存在，增加 bundle 大小約 70KB+。

**修復方案**: 統一使用 dayjs 取代 moment.js，逐步遷移 51 個檔案。

---

## P2: 中等效能影響

### 9. 完全沒有使用 React.memo

**統計**:
| 最佳化手段 | 使用次數 | 檔案數 |
|-----------|---------|--------|
| `React.memo` | **0** | 0 |
| `useCallback` | 48 | 21 |
| `useMemo` | 42 | 14 |
| `.map()` 列表渲染 | **839** | 250+ |

**問題**: 638 個元件檔案中沒有任何一個使用 `React.memo`，而有 839 處 `.map()` 列表渲染。任何父元件的 re-render 都會導致所有子元件重新渲染。

**修復方案**:
- 高頻率渲染的列表項目元件加上 `React.memo`
- 大量資料的列表考慮使用虛擬化 (react-window / react-virtuoso)
- 將 `useCallback` / `useMemo` 使用率提高，特別是在 Context consumers 和列表元件中

---

### 10. 多重 CSS-in-JS 庫

**同時使用**:
- `styled-components` (v5.1.1) — 主要 CSS-in-JS 方案
- `@emotion/react` + `@emotion/styled` (v11) — 少量使用
- `antd` with Less — Ant Design 元件樣式
- SCSS (`styles.scss`) — 全域樣式

**問題**: 
- 多個 CSS-in-JS runtime 增加 bundle 大小
- `styled-components` 的 `disableCSSOMInjection` 在 Application.tsx 中被啟用，這會降低 CSS 注入效能

**修復方案**: 統一為一種 CSS-in-JS 方案，移除未大量使用的 @emotion。

---

### 11. helpers/index.ts 巨型 barrel 檔案阻礙 tree-shaking

**檔案**: `src/helpers/index.ts` (558 行, 45 個 export)

```tsx
import moment from 'moment'
import axios from 'axios'
import { throttle } from 'lodash'
// ...更多頂層 import
```

**問題**: 任何檔案只要 `import { anyHelper } from '../helpers'` 就會拉入所有 45 個函式及其依賴 (moment, axios, lodash 等)，嚴重阻礙 tree-shaking。

**修復方案**: 將 helpers 拆分為獨立模組：
```
src/helpers/
  date.ts      (moment/dayjs 相關)
  format.ts    (格式化)
  url.ts       (URL 處理)
  tracking.ts  (追蹤相關)
  index.ts     (僅 re-export)
```

---

### 12. Ant Design v3 — 過時且臃腫

**當前版本**: `antd: 3` (已停止維護)

**問題**:
- v3 的 bundle 大小遠大於 v4/v5
- 缺少現代最佳化 (tree-shaking 支援差)
- 安全性與相容性風險
- 依賴 Less (額外的編譯成本)

**修復方案**: 升級至 antd v5 (重大工程，建議分階段進行)。

---

### 13. localStorage 在 render 路徑中同步讀取

**受影響檔案**:
- `src/contexts/AudioPlayerContext.tsx:60` — `localStorage.getItem('playing')`
- `src/contexts/PodcastPlayerContext.tsx:43-48` — 多次 localStorage 存取
- `src/contexts/LocaleContext.tsx:79` — `localStorage.getItem('kolable.app.language')`

**問題**: `localStorage.getItem()` 是同步阻塞操作，在 render 路徑中呼叫會阻塞主執行緒。

**修復方案**: 將 localStorage 讀取移入 `useState` 的初始化函式（lazy initialization）：
```tsx
const [playing] = useState(() => {
  const stored = localStorage.getItem('playing')
  return stored ? JSON.parse(stored) : defaultValue
})
```

---

### 14. package.json 缺少 sideEffects 宣告

**問題**: `package.json` 沒有 `"sideEffects"` 欄位，webpack 無法安全地 tree-shake 未使用的模組。

**修復方案**:
```json
{
  "sideEffects": ["*.css", "*.scss", "*.less"]
}
```

---

## P3: 最佳化建議

### 15. Node.js 版本過舊

**當前**: Node 14.16.0 (已 EOL)

**影響**: 無法使用新版 webpack/babel 的效能最佳化，且有安全風險。

**建議**: 升級至 Node 18 LTS 或 20 LTS。

### 16. React 版本可升級

**當前**: React 17.0.2

**建議**: 升級至 React 18，可獲得：
- Automatic Batching (自動合併多個 setState)
- Concurrent Features
- `useTransition` / `useDeferredValue` 用於非急迫更新
- React Server Components (未來)

### 17. 追蹤庫全域載入

**全域載入的追蹤庫** (影響每個頁面的初始載入):
- `react-ga` (Google Analytics)
- `react-facebook-pixel`
- `react-hotjar`
- `react-gtm-module`

**建議**: 使用動態 import 延遲載入追蹤庫，在首次互動後再初始化。

### 18. SignupPropertyModal 使用 document.location.href 作為 key

**檔案**: `src/Application.tsx:43`
```tsx
<SignupPropertyModal key={document.location.href} />
```

**問題**: 每次 URL 變動都會 unmount/remount 此 modal，造成不必要的 DOM 操作。

---

## 改善計劃：分階段執行

### 第一階段：快速修復 (1-2 天) — 預期效能提升 30-40%

| # | 任務 | 影響 | 複雜度 |
|---|------|------|--------|
| 1 | 修復 LoadablePage 的 React.lazy() 快取問題 | P0 | 低 |
| 2 | 修復 CartContext/NotificationContext 的 setTimeout 問題 | P0 | 低 |
| 3 | 將所有 Context Provider 的 value 加上 useMemo | P0 | 中 |
| 4 | 將所有 Context Provider 的 handler 函式加上 useCallback | P0 | 中 |
| 5 | 將 braft-editor CSS 移到使用它的元件中 | P1 | 低 |
| 6 | 修復 localStorage 同步讀取問題 | P2 | 低 |

### 第二階段：資料層最佳化 (3-5 天) — 預期效能提升 20-30%

| # | 任務 | 影響 | 複雜度 |
|---|------|------|--------|
| 7 | 審查並修正 18 處 `fetchPolicy: 'no-cache'` | P1 | 中 |
| 8 | 拆分 SEARCH_PRODUCT_COLLECTION 查詢 | P1 | 中 |
| 9 | 為集合查詢加入分頁 | P1 | 中 |
| 10 | 修改 issue polling 機制 (增加間隔/使用 subscription) | P1 | 中 |
| 11 | 設定 Apollo Client 的 type policies 與快取策略 | P1 | 高 |

### 第三階段：Bundle 最佳化 (1-2 週) — 預期 bundle 縮小 25-35%

| # | 任務 | 影響 | 複雜度 |
|---|------|------|--------|
| 12 | moment.js → dayjs 遷移 (51 個檔案) | P1 | 中 |
| 13 | 拆分 helpers/index.ts barrel 檔案 | P2 | 中 |
| 14 | 移除 @emotion (統一使用 styled-components) | P2 | 中 |
| 15 | 加入 package.json sideEffects 宣告 | P2 | 低 |
| 16 | 延遲載入追蹤庫 (GA, FB Pixel, Hotjar, GTM) | P3 | 中 |

### 第四階段：渲染效能最佳化 (2-3 週) — 預期互動效能提升 20-30%

| # | 任務 | 影響 | 複雜度 |
|---|------|------|--------|
| 17 | 為高頻列表項目元件加入 React.memo | P2 | 中 |
| 18 | 導入虛擬列表 (react-window) 處理大量資料列表 | P2 | 中 |
| 19 | 增加 useCallback/useMemo 使用率 | P2 | 中 |
| 20 | 拆分 1000+ 行的大型元件 | P2 | 高 |

### 第五階段：架構升級 (長期) — 全面現代化

| # | 任務 | 影響 | 複雜度 |
|---|------|------|--------|
| 21 | 升級 Node.js 至 18/20 LTS | P3 | 中 |
| 22 | 升級 React 至 v18 | P3 | 高 |
| 23 | 升級 Ant Design v3 → v5 | P2 | 非常高 |
| 24 | 考慮遷移至 Vite (取代 CRA + webpack) | P3 | 高 |
| 25 | react-router v5 → v6 | P3 | 高 |

---

## 效能監測建議

1. **加入 Bundle 分析到 CI**: 使用 `source-map-explorer` (已配置) 或 `webpack-bundle-analyzer`
2. **設定效能預算**: 限制 JS bundle 大小上限
3. **加入 Lighthouse CI**: 自動化效能評分監測
4. **使用 React DevTools Profiler**: 找出具體的慢 render 元件
5. **設定 Web Vitals 監測**: 追蹤 LCP, FID, CLS 等核心指標

---

## 總結

最嚴重的三個效能問題：
1. **LoadablePage 的 React.lazy() bug** — 每次 render 重建頁面元件
2. **Context Provider 值未 memoize** — 8 層 Provider 串聯觸發全樹 re-render
3. **setTimeout 在 render 路徑中** — 產生無限的 timer 排程

修復這三個 P0 問題可以帶來最顯著的效能改善，且實作難度低、風險小。建議優先處理。
