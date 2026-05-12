# Bundle 體積優化設計

- 日期：2026-05-12
- 對象專案：`lodestar-app`
- 目前狀態：已 React 17 + Vite 8（含 rolldown）化，production build 出現多個 > 500 kB chunk 警告

## 背景與目標

`pnpm build` 當前產出三個超大 chunk 並觸發 chunk size 警告：

| Chunk | Size | gzip |
|---|---|---|
| `vendors` | 5,692 kB | 1,513 kB |
| `index`（entry） | 1,511 kB | 402 kB |
| `antd` | 1,471 kB | 402 kB |

加上 `src/hooks/member.ts` 的 direct `eval` 警告（已先行於對話中修正為 `;(0, eval)(...)`）。

進一步以 `rollup-plugin-visualizer` 拆解 `stats.json` 後找到三條主要問題鏈：

1. **9 個語系 JSON 全部 eager 進入 entry chunk**（~1,064 kB 未壓縮）。檔案：`src/contexts/LocaleContext.tsx:12-22` 用 `import.meta.glob({ eager: true })`。
2. **AudioPlayer 鏈把 `hls.js` (938 kB) + `video.js` (843 kB) eager 拉進 vendors**。entry 路徑：`Application.tsx → DefaultLayout → GlobalAudioPlayer / PodcastPlayer → audio/AudioPlayer.tsx / common/AudioPlayer.tsx → import 'hls.js' / import 'video.js'`。
3. **`name: 'vendors'` catch-all 把重型 lazy-only 套件全合進 entry preloaded 的單一 chunk**：codemirror、html2canvas、@fullcalendar、draft-js、epubjs、braft-editor、jszip 等。`build/index.html` 的 `modulepreload` 強制下載整個 4.9 MB vendors。
4. **`moment-timezone` 在 vendors 佔 725 kB**，但全 codebase 9 個 import 點中 7 個其實沒用 timezone API，2 個有實際 tz 用途但可換 dayjs。

目標：把 entry 首屏關鍵路徑從 ~5.7 MB（gzip ~1.5 MB）縮到 < ~2.5 MB（gzip < ~700 kB），方式為精細拆 chunk + 把功能型程式碼 lazy 化。

非目標：

- 不升級 antd 3 → 4/5（規模獨立、與 bundle 優化分離）。
- 不重做路由架構或 SSR。
- 不修改 `lodestar-app-element` 原始碼（探勘結論：問題在 app 端 chunk 策略而非 element barrel）。
- 不全面替換 `moment` 為 `dayjs`（antd 3 直接依賴 `moment`，須保留）。

## 整體策略

四個獨立子任務，各自一個 commit、互不依賴、可分別驗證與 rollback：

1. **Task 3**：vendors chunk 拆細（hybrid C：移除 catch-all + 為重型專用 lib 加 named group）。純 vite config 變動。
2. **Task 5**：移除 `moment-timezone`，保留 `moment`。7 個檔案改 import、2 個檔案用 dayjs 改寫、`pnpm remove`。
3. **Task 1**：locales lazy load，預設 inline 語系由 `VITE_DEFAULT_LOCALE` 控制（default `zh-tw`）。
4. **Task 2**：audio / video player 元件 `React.lazy()` 包裝。

工作分支：沿用既有 `codex-react17-vite-migration`，不開新 PR。

## Task 3：Vendors chunk 拆細

### 修改檔案

- `vite.config.ts`：調整 `build.rolldownOptions.output.advancedChunks.groups`

### 設計

移除 `name: 'vendors'` catch-all，讓 rolldown 自動處理未命名的 node_modules（shared 自動聚合、only-one-page 自動 inline 進 page chunk）。保留並擴增明確 group：

| name | priority | test |
|---|---|---|
| `antd` | 30 | `node_modules[\\/]antd[\\/]` |
| `react-core` | 25 | `node_modules[\\/](react\|react-dom\|scheduler\|react-router\|react-router-dom\|history)[\\/]` |
| `apollo` | 25 | `node_modules[\\/](@apollo[\\/]\|graphql[\\/]\|graphql-tag[\\/]\|@graphql)` |
| `chakra` | 25 | `node_modules[\\/](@chakra-ui[\\/]\|@emotion[\\/]\|framer-motion[\\/])` |
| `date` | 25 | `node_modules[\\/](moment\|dayjs\|date-fns)[\\/]` |
| `utils` | 25 | `node_modules[\\/](lodash\|lodash-es\|ramda)[\\/]` |
| `editor` | 25 | `node_modules[\\/](braft-[^/]+\|draft-js\|draft-convert\|draftjs-utils)[\\/]` |
| `fullcalendar` | 25 | `node_modules[\\/]@fullcalendar[\\/]` |
| `markdown-editor` | 25 | `node_modules[\\/](codemirror\|easymde\|codemirror-spell-checker)[\\/]` |
| `ebook` | 25 | `node_modules[\\/](epubjs\|jszip)[\\/]` |
| `screenshot` | 25 | `node_modules[\\/]html2canvas` |

無 catch-all。

### 預期成效

- `build/index.html` 的 `modulepreload` 清單不再含 ~5 MB 的單一 chunk。
- editor / fullcalendar / markdown-editor / ebook / screenshot 五個重型 chunk 只在進入相應 lazy 頁面時下載。

### 風險與緩解

- 其他未命名 node_modules 由 rolldown 自動切，chunk 命名為 hash-only。可接受——這些是 lazy-only 小 chunk，使用者透過 stats.html 偵錯而非檔名。
- 若某個重型 lib 同時被「first paint 必經 page」與 lazy page 共用，rolldown 會將其塞進 entry preload 的 shared chunk。task 3 後跑 `stats.html` 比對。

### 驗證

1. `ANALYZE=true pnpm build`
2. 確認 `build/index.html` 的 `modulepreload` 不含大於 2 MB 的 chunk
3. `stats.html` 內五個重型 named chunk 內容符合預期

## Task 5：移除 moment-timezone

### 背景確認

- antd 3.26.20 在 `lib/{date-picker,calendar,time-picker}` 直接 `require('moment')`，**但無 require `moment-timezone`**。
- 全 codebase 無 `moment.tz.setDefault` / `moment.tz.guess` 之類全域副作用設定。
- lodestar-app-element 端的時區處理已用 `dayjs.tz`，不影響。

故移除 `moment-timezone` 對 antd 顯示零影響。

### 修改範圍

**A. 純 format / isBefore 用法（7 檔案）**——把 `import moment from 'moment-timezone'` 改為 `import moment from 'moment'`，行為一致：

- `src/components/page/PostSection.tsx:7`
- `src/components/page/BlndPostSection.tsx:8`
- `src/components/blog/PostPreviewMeta.tsx:4`
- `src/components/common/CertificateCard.tsx:2`
- `src/components/program/ProgramContentMenu.tsx:7`
- `src/pages/ProgramPage/Secondary/SecondaryProgramContentListItem.tsx:4`
- `src/pages/ProgramPage/Primary/ProgramContentListSection.tsx:6`

**B. 真用到 timezone（2 檔案）**——改用 dayjs：

- `src/components/ebook/EbookBookmarkModal.tsx:261`
  ```ts
  // 改：
  import dayjs from 'dayjs'
  // ...
  const formattedCreatedAt = dayjs(highlight.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
  ```

- `src/components/appointment/AppointmentCollectionTabs.tsx:435-436`
  ```ts
  // 改：
  import dayjs from 'dayjs'
  // ...
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  city: tz.split('/')[1] || tz,
  timezone: dayjs().tz(tz).format('Z'),
  ```

**C. 共用 dayjs setup**——新增 `src/dayjsSetup.ts`：

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
```

在 entry（`src/index.tsx` 或同等 bootstrap）import 一次。`utc` + `timezone` 兩個 plugin 已存在於 `optimizeDeps.include`。lodestar-app-element 也會 `dayjs.extend(timezone)`，重複 extend 是 idempotent。

**D. 移除依賴**：`pnpm remove moment-timezone`。

### 驗證

- `pnpm build`：`stats.html` 內 vendors / date chunk 無 `moment-timezone` 模組。
- `pnpm test`
- 手動：
  - Ebook bookmark `createdAt` 顯示為 Asia/Taipei 時間
  - AppointmentCollectionTabs 對應頁面 city / timezone 欄位送 API 值合理
  - ProgramContentMenu / SecondaryProgramContentListItem / ProgramContentListSection 的 MM/DD 顯示
  - Blog post / Certificate / Post(Blnd)Section 的 YYYY-MM-DD / YYYY/MM/DD 顯示
  - 任一 antd DatePicker / RangePicker 頁面無 regression

### bundle 預期

date chunk 從 82 kB 縮至 ~30 kB；總 bundle 減少 ~700 kB（含 moment-timezone 主體 + tz 資料）。

## Task 1：Locales lazy load

### 環境變數

`VITE_DEFAULT_LOCALE`：

- 預設值：`zh-tw`
- 接受值：`SUPPORTED_LOCALES` 內任一（`zh-tw` / `zh-cn` / `en-us` / `vi` / `id` / `ja` / `ko` / `de-de` / `acsi`）
- 未設或值不在支援清單 → fallback `zh-tw` 並 `console.warn`
- `.env.example` 加註解；`.env.development` 不必設定

### 設計

採 **`define` 巨集 + 同步 inline 預設 messages**，讓 env 真正改變 entry inline 內容。

**vite.config.ts**：

```ts
import fs from 'fs'

// 在 defineConfig 內：
const SUPPORTED_LOCALES = ['zh-tw', 'zh-cn', 'en-us', 'vi', 'id', 'ja', 'ko', 'de-de', 'acsi']
const requestedLocale = env.VITE_DEFAULT_LOCALE || 'zh-tw'
const defaultLocale = SUPPORTED_LOCALES.includes(requestedLocale) ? requestedLocale : 'zh-tw'
if (defaultLocale !== requestedLocale) {
  console.warn(`[vite] VITE_DEFAULT_LOCALE="${requestedLocale}" not supported, using "zh-tw"`)
}

const readJson = (p: string): string => fs.readFileSync(p, 'utf8')

define: {
  __DEFAULT_LOCALE__: JSON.stringify(defaultLocale),
  __DEFAULT_APP_MESSAGES__: readJson(`./src/translations/locales/${defaultLocale}.json`),
  __DEFAULT_ELEMENT_MESSAGES__: readJson(
    `./node_modules/lodestar-app-element/src/translations/locales/${defaultLocale}.json`,
  ),
}
```

`readJson` 回傳的是 JSON 字串，Vite 的 `define` 會直接以該值替換引用點（因為 JSON 字串本身就是合法的 JS literal）。

**`src/contexts/LocaleContext.tsx`**：

```ts
declare const __DEFAULT_LOCALE__: string
declare const __DEFAULT_APP_MESSAGES__: LocaleMessages
declare const __DEFAULT_ELEMENT_MESSAGES__: LocaleMessages

// dynamic loaders（不 eager）
const appLocaleLoaders = import.meta.glob('../translations/locales/*.json', {
  import: 'default',
}) as Record<string, () => Promise<LocaleMessages>>

const elementLocaleLoaders = import.meta.glob(
  '../../node_modules/lodestar-app-element/src/translations/locales/*.json',
  { import: 'default' },
) as Record<string, () => Promise<LocaleMessages>>

const initialLocale = __DEFAULT_LOCALE__
const initialMessages: LocaleMessages = { ...__DEFAULT_ELEMENT_MESSAGES__, ...__DEFAULT_APP_MESSAGES__ }
```

切換語系函式：

```ts
const changeLocale = async (target: string) => {
  if (target === currentLocale) return
  const [appMsg, elementMsg] = await Promise.all([
    appLocaleLoaders[`../translations/locales/${target}.json`](),
    elementLocaleLoaders[`../../node_modules/lodestar-app-element/src/translations/locales/${target}.json`](),
  ])
  setLocale(target)
  setMessages({ ...elementMsg, ...appMsg })
  moment.locale(target)
  dayjs.locale(target)
}
```

初始載入 detected locale ≠ `__DEFAULT_LOCALE__` 時：

- 第一個 paint 仍顯示 `initialMessages`（不阻塞 render）
- mount 時 useEffect 觸發 `changeLocale(detected)`，async 載完 swap
- IntlProvider 永遠拿到有效 messages 物件

### 預期成效

- entry chunk 內只 inline `__DEFAULT_LOCALE__` 對應的 messages（~120-140 kB 未壓縮，gzip ~30-35 kB）
- 其餘 8 個 locale 各為獨立 lazy chunk
- 完成 task 1 後 entry chunk 預估從目前約 1,440 kB（task 3 完成後）再降至 ~400 kB，相對 baseline 1,511 kB 累積砍約 1.1 MB

### 風險

- `define` 內 `readFileSync` 在 vite config 求值時讀檔——CI 流程須在 `pnpm install` 完成後再 `pnpm build`（既有流程已符合）。
- locale JSON 內若含 `\u` 或 control character 時 JSON 字串嵌入 JS 是合法的，但須確保 vite define 不轉義成壞 syntax；既有 vite 行為已驗證 JSON literal 注入安全（同類做法見 `getLegacyReactAppEnv`）。
- 若未來新增語系，需同步更新 `SUPPORTED_LOCALES` 兩處（`LocaleContext.tsx` 與 `vite.config.ts`）。可考慮抽共用 constant，但此次 YAGNI。

### 驗證

- `pnpm build`：預設 entry chunk 比對 inline zh-tw messages
- `VITE_DEFAULT_LOCALE=ja pnpm build`：entry chunk inline ja messages（透過 stats 對比）
- `VITE_DEFAULT_LOCALE=invalid pnpm build`：應印 warning、實際 inline zh-tw
- `pnpm test`
- 手動：
  - 預設 locale 首次開站文字立即顯示
  - 切換至非預設 locale：舊文字保留 → 載入完成 swap，無 spinner
  - 切回預設 locale：應命中已下載 cache、無延遲

## Task 2：Audio / Video player lazy

### 識別範圍

| 元件 | 路徑 | mount 位置 |
|---|---|---|
| `GlobalAudioPlayer` | `src/components/audio/GlobalAudioPlayer.tsx` | `Application.tsx` / `DefaultLayout` 全域 |
| `audio/AudioPlayer` | `src/components/audio/AudioPlayer.tsx` | 被 GlobalAudioPlayer 內部 import |
| `common/AudioPlayer` | `src/components/common/AudioPlayer.tsx` | 被 PodcastPlayer 或 layout 用 |
| `PodcastPlayer` | `src/components/podcast/PodcastPlayer.tsx` | layout / page |
| `VideoPlayer` | `src/components/common/VideoPlayer.tsx` | 多個 program / project page（已 lazy 頁但 player static import） |

實作時先 grep 確認每個 player 的真實 mount 點，再選擇 lazy 層級。

### 改寫模式

**模式 A：mount 點 lazy（全域常駐 player）**

```tsx
// 原：
import GlobalAudioPlayer from './audio/GlobalAudioPlayer'
<GlobalAudioPlayer />

// 改：
const GlobalAudioPlayer = React.lazy(() => import('./audio/GlobalAudioPlayer'))
<Suspense fallback={null}>
  <GlobalAudioPlayer />
</Suspense>
```

適用：`GlobalAudioPlayer`、`PodcastPlayer`。fallback null 可接受——player 沒佇列內容時本來 render null。

**模式 B：lazy 殼元件（頁面型 VideoPlayer）**

新增 `src/components/common/LazyVideoPlayer.tsx`：

```tsx
import React, { Suspense } from 'react'
import { Skeleton } from '@chakra-ui/skeleton'
import type { VideoJsPlayer } from 'video.js'
import type { VideoPlayerProps } from './VideoPlayer'

const VideoPlayer = React.lazy(() => import('./VideoPlayer'))

const LazyVideoPlayer = React.forwardRef<VideoJsPlayer, VideoPlayerProps>((props, ref) => (
  <Suspense fallback={<Skeleton h="200px" />}>
    <VideoPlayer {...props} ref={ref} />
  </Suspense>
))

export default LazyVideoPlayer
```

各 consumer 把 `import VideoPlayer from '...VideoPlayer'` 改為 `import VideoPlayer from '...LazyVideoPlayer'`，行為兼容。

`VideoPlayer.tsx` 需 `export type VideoPlayerProps`（若未 export）並改 `React.forwardRef` 結構，使 LazyVideoPlayer 殼能 forward ref。

### Fallback 策略

- 全域 player：`fallback={null}`
- VideoPlayer：`fallback={<Skeleton h="200px" />}`——保留容器高度避免 CLS

### 預期成效

- entry chunk 與其他主 chunk 不再含 `hls.js` / `video.js`
- 產生 hls.js / video.js / player 元件共用的 lazy chunk
- entry chunk 再降約 ~50 kB（player 元件殼）；vendors 等主 chunk 砍 ~1.8 MB（hls + video.js）

### 風險與緩解

- **forwardRef 透傳**：consumer（如 ProgramContentPlayer）的 ref 操作需驗證仍可拿到 VideoJsPlayer instance
- **React 17 Suspense + CSR**：本 app 已純 CSR build，Suspense 安全
- **Side-effect imports**（`video.js/dist/video-js.min.css`、`videojs-contrib-quality-levels`、`videojs-hls-quality-selector`）：在 VideoPlayer 內部 top-level import，會跟隨進 lazy chunk，符合預期
- **首次播放延遲**：使用者按下播放鍵後才開始下載 ~1.7 MB lib；實測通常 < 500 ms（取決於網路），影片本來就需 buffer，使用者不易察覺

### 驗證

- `ANALYZE=true pnpm build`：entry / page chunk 無 hls.js / video.js；產生 player 專屬 chunk
- `pnpm test`
- 手動：
  - 全域 audio player 首次按播放，hls 串流正常
  - PodcastPlayer 同上
  - Program content 影片播放：fallback skeleton 顯示 → player 接手 → quality selector 可用 → ref 操作正常

## 測試策略與成果驗收

### Hard gates（每 task 完成時）

| Task | 指令 | 通過標準 |
|---|---|---|
| 3 | `ANALYZE=true pnpm build` | index.html modulepreload 無 > 2 MB chunk；五個 named 重型 chunk 產生 |
| 5 | `pnpm build` + `pnpm test` | stats 內無 moment-timezone；指定 7 個檔案測試（若有）通過 |
| 1 | `pnpm build` × 2 + `pnpm test` | 不同 `VITE_DEFAULT_LOCALE` 各別只 inline 對應 locale；其他 locale 為 lazy chunk |
| 2 | `ANALYZE=true pnpm build` + `pnpm test` | entry / 主 chunk 無 hls.js / video.js |

### 手動驗收清單（全部 task 完成後）

- Locale 切換、初始載入不同偏好、預設語系命中 cache
- Audio：全域 player、PodcastPlayer 播放、切換內容、暫停、快轉
- Video：fallback 出現、quality selector、ref 行為
- Date：Ebook bookmark、AppointmentCollectionTabs、Program content publish 時間、Blog post / Certificate / PostSection 日期格式
- antd 時間元件：含 DatePicker / RangePicker / Calendar 頁面無 regression

### 量化目標

| Chunk | Baseline | Target |
|---|---|---|
| entry (`index.js`) | 1,511 kB | < 500 kB |
| vendors（單一） | 5,692 kB | 移除（拆成多個 ≤ 500 kB） |
| antd | 1,471 kB | 不動 |

首屏 modulepreload gzip 總和：~1.5 MB → < ~700 kB

### Rollback 策略

每 task 一個獨立 commit。`git revert <task-commit>` 可單獨回滾。

### CI 影響

- Task 1 `define` 內 `fs.readFileSync` 須在 `pnpm install` 之後執行；既有 CI 流程 `pnpm install` → `pnpm build` 已符合
- `rollup-plugin-visualizer` 採 `if (shouldAnalyze) await import(...)` 條件動態載入；CI 不指定 `ANALYZE` 時零影響

## 執行順序

1. Task 3（vendors 拆細）—— 純 config，最快、最易驗證
2. Task 5（moment-timezone 移除）—— 機械式 import 改寫 + 2 小重寫
3. Task 1（locales lazy）—— LocaleContext 重寫 + define 巨集
4. Task 2（player lazy）—— React.lazy + Suspense

每 task 一個 commit，沿用既有 `codex-react17-vite-migration` 分支。
