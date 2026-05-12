# Bundle entry slim + editor lazy 設計

- 日期：2026-05-12
- 對象專案：`lodestar-app`
- 前置：`docs/superpowers/specs/2026-05-12-bundle-optimization-design.md`（Task 1/2/3/5 已完成）

## 背景

上一輪 bundle 優化後，`ANALYZE=true pnpm build` 結果：

- `assets/index-*.js`（entry）= 1,097 kB
- `assets/editor-*.js`（braft-editor）= 417 kB，仍出現在 `build/index.html` 的 modulepreload 清單
- `assets/lib-*.js` 共用桶仍把 `react-hook-form`、`react-slick`、`@craftjs/*`、`@tanstack/react-router` 等捲進 entry 路徑

stretch 目標 entry < 500 kB 仍差距大。

## 根因確認

`src/components/common/AppRouter.tsx:4` 靜態 `import AppPage`，`AppPage` 為 root route 元件、所有路由共用，且靜態 import：

- `@craftjs/core`（Editor / Frame）
- `../../components/page` barrel（22 個 section，內含 `PostSection`、`BlndPostSection`，兩者再 `import BraftEditor`）
- `lodestar-app-element/src/components/common/CraftElement` barrel
- `CraftBlock`、`HaohaomingSection`
- `MessengerChat`（連帶 `react-messenger-customer-chat`）

`Application.tsx` 靜態 import `SignupPropertyModal`、`InAppBrowserWarningModal`、`GlobalPodcastPlayer` 三個全域元件。

`AppointmentCard.tsx`（受 `MemberPage/AppointmentPlanCollectionBlock` 用）靜態 `import BraftEditor`，把 editor chunk 變成 `MemberPage` lazy chunk 的依賴 → 進 modulepreload。

`react-hook-form`、`react-slick` 在 codebase 全部只被 lazy page 使用，但 vite config 沒有對應 named group，rolldown 把它們合進 `lib` 共用 chunk，與 entry 的其他 shared deps 一起 modulepreload。

## 目標

- entry chunk < 500 kB（stretch；達成度視 `@tanstack/react-router` 自身大小而定）
- `editor` chunk 完全退出 `build/index.html` modulepreload 清單
- `craft`、`forms`、`carousel`、`messenger` 等重型 lib 變成 lazy-only chunk

## 非目標

- Element 端 locale eager glob（lodestar-app-element 的 `import.meta.glob({ eager: true })`）不在本輪處理。
- locale inline messages (~153 kB) 本輪保留不動。
- 不替換 PostSection / BlndPostSection 的 braft-editor 使用為 `getBraftContent`（backlog，見文末）。
- 不重做 antd 3 → 4 升級。

## 整體策略

四個獨立子任務，可分別 commit、互不依賴、可分別 rollback：

1. **Task A**：抽 `AppCraftRenderer`，於 `AppPage` 內以 `React.lazy()` 載入。craftjs / section barrel / CraftElement / CraftBlock / MessengerChat 全進此 lazy chunk。
2. **Task B**：`Application.tsx` 三個全域元件（`SignupPropertyModal`、`InAppBrowserWarningModal`、`GlobalPodcastPlayer`）改 `React.lazy()` + `Suspense fallback={null}`。
3. **Task C**：`AppointmentCard` 抽 `AppointmentIssueModal`，braft-editor / StyledBraftEditor / BraftContent 全部移入 lazy 子元件；首次開啟後保留掛載以保 antd Form state。
4. **Task D**：`vite.config.ts` 新增 5 個 named groups（`router`、`forms`、`carousel`、`craft`、`messenger`），確保這幾個 lib 各自獨立 chunk，不混進 `lib` 共用桶。

沿用既有分支 `codex-react17-vite-migration`，不開新 PR。

## Task A：抽 AppCraftRenderer + lazy

### 新檔案 `src/pages/AppPage/AppCraftRenderer.tsx`

承接 `AppPage` 內以下責任：

- import `Editor`、`Frame` from `@craftjs/core`
- import `* as CraftElement` from `lodestar-app-element/src/components/common/CraftElement`
- import `MessengerChat`、`CraftBlock`、`HaohaomingSection`
- import 22 個 sections from `../../components/page`
- 持有 `craftElementResolver` 與 `sectionConverter` 常數
- 匯出 `SectionType` type

Props：

```ts
type Props = {
  craftData: { [key: string]: any } | null
  appPageSections: { id: string; options: any; type: SectionType }[]
}
```

Render：與目前 `AppPage` 內 `<Editor>...<CraftBlock>` / `<Editor>...<Frame>{sections}</Frame>` 完全等價的兩條分支。

### `src/pages/AppPage/index.tsx` 改動

刪除：`@craftjs/core`、section barrel、`HaohaomingSection`、`CraftBlock`、`MessengerChat` 五段 import，與 `craftElementResolver`、`sectionConverter`、`SectionType` 三個常數／type（移至 `AppCraftRenderer.tsx`）。

新增：

```tsx
const AppCraftRenderer = React.lazy(() => import('./AppCraftRenderer'))
```

JSX 中 `<DefaultLayout {...currentAppPage.options}>` 內：

```tsx
<DefaultLayout {...currentAppPage.options}>
  <Suspense fallback={<LoadingPage />}>
    <AppCraftRenderer
      craftData={currentAppPage.craftData}
      appPageSections={currentAppPage.appPageSections}
    />
  </Suspense>
</DefaultLayout>
```

`usePage` 內的 `appPages[].appPageSections[].type` 仍打成 `SectionType`——把 `SectionType` 從 `AppCraftRenderer.tsx` `export type` 出來，於 `usePage` 用 `import type { SectionType } from './AppCraftRenderer'`，不會回頭把 lazy module 拖進 entry（type-only import 在 build 階段擦除）。

### 影響

- `craftjs` named chunk 改由 `AppCraftRenderer` lazy chunk reference
- section barrel + CraftElement 主體進入同一 lazy chunk
- editor chunk 透過 `PostSection` / `BlndPostSection` 被 lazy chunk 引用（不進 entry）
- `react-slick` 透過 `CoverSection` / `CreatorSection` 被 lazy chunk 引用
- `react-messenger-customer-chat` 進入 lazy chunk

### 風險

- 首頁第一次 paint 多一個 fallback flash（`LoadingPage`）：首屏經驗從「Loading → 直接 render section」變成「Loading（appPages query）→ Loading（lazy chunk）→ render section」。實測 chunk 通常 < 200 ms 落地，多數使用者察覺不到第二段。可接受。
- `Frame` 內的 craft node tree 在 `Editor enabled={false}` 下不參與 craft 編輯狀態，無 state 跨 mount 問題。
- 不影響非 craftData / 無 appPageSections 的路由：`AppPage` 在這些路由直接走 `renderFallback`，不會觸發 `AppCraftRenderer` import。

### 驗證

- `ANALYZE=true pnpm build`：confirm `stats.html` 內 `craft` named chunk 為 lazy（不在 entry modulepreload）
- `build/index.html` 的 modulepreload 清單不再含 craftjs / section barrel chunks
- 手動：訪問 / 首頁 section 渲染正常；CMS app_page craftData 路由（如客製化頁）渲染正常

## Task B：Application.tsx 全域元件 lazy

### 改動

`src/Application.tsx`：

- 刪除：`SignupPropertyModal`、`InAppBrowserWarningModal`、`GlobalPodcastPlayer` 三個 static import
- 新增：

```tsx
const SignupPropertyModal = React.lazy(() => import('./components/common/SignupPropertyModal'))
const InAppBrowserWarningModal = React.lazy(() => import('./components/common/InAppBrowserWarningModal'))
const GlobalPodcastPlayer = React.lazy(() => import('./components/podcast/GlobalPodcastPlayer'))
```

- JSX 三個元件分別包 `<Suspense fallback={null}>`（與既有 `GlobalAudioPlayer` 一致）

### 風險

- `GlobalPodcastPlayer`：內部 `useEffect` 觀察 pathname 自動關閉播放。首次 mount 延遲幾十 ms，對「初次未啟用播放」場景無影響；對「離開頁時自動關 podcast」場景延遲可忽略。
- `SignupPropertyModal` 以 `key={document.location.href}` 重新掛載——lazy 不破壞此行為，因為 `React.lazy()` 元件第一次 import 後快取，後續 re-mount 不再走 dynamic import。
- `InAppBrowserWarningModal`：只在 InApp browser 偵測到時才 render content；延遲對偵測無影響（內部 useEffect 仍在 mount 後跑）。

### 驗證

- `ANALYZE=true pnpm build`：`SignupPropertyModal`、`InAppBrowserWarningModal`、`GlobalPodcastPlayer` 各自獨立 lazy chunk
- 手動：
  - 一般 desktop 流程：register 完成 / login 後 SignupPropertyModal 觸發行為正常
  - LINE / FB / IG In-App 開啟：InAppBrowserWarningModal 顯示
  - 進入 podcast 頁觸發播放：GlobalPodcastPlayer 正常顯示與切換內容

## Task C：AppointmentCard issue modal lazy

### 新檔案 `src/components/appointment/AppointmentIssueModal.tsx`

承接 `AppointmentCard` 目前的 issue modal（`<Modal width={660} visible={issueModalVisible}>`）整段，包括：

- braft-editor / StyledBraftEditor / BraftContent imports
- `BraftEditor.createEditorState(orderProduct.appointmentIssue)` 為 form initialValue
- 完整 Modal JSX：title、meta block、Form、`<StyledBraftEditor>` 控制項清單、isFinished / isCanceled 分支、cancel / save ButtonGroup

Props：

```ts
type Props = {
  visible: boolean
  onClose: () => void
  loading: boolean
  isFinished: boolean
  isCanceled: boolean
  form: FormComponentProps['form']  // antd 3 Form.create 注入，型別來自 'antd/lib/form'
  appointmentIssue: string | null
  orderProduct: { startedAt: Date | null; endedAt: Date | null }
  appId: string
  authToken: string | null
  onSubmit: () => void
}
```

`useIntl` 在 lazy 子元件內部呼叫，不需要從外部 prop 傳 formatMessage。

### `AppointmentCard.tsx` 改動

刪除：

- `import BraftEditor from 'braft-editor'`
- `import 'braft-editor/dist/index.css'`、`'braft-editor/dist/output.css'`
- `import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'`
- 整段 issue modal JSX（搬至 `AppointmentIssueModal`）

新增：

```tsx
const AppointmentIssueModal = React.lazy(() => import('./AppointmentIssueModal'))

// 在 state hooks 區：
const [hasOpenedIssueModal, setHasOpenedIssueModal] = useState(false)
useEffect(() => {
  if (issueModalVisible && !hasOpenedIssueModal) setHasOpenedIssueModal(true)
}, [issueModalVisible, hasOpenedIssueModal])
```

JSX：

```tsx
{hasOpenedIssueModal && (
  <Suspense fallback={null}>
    <AppointmentIssueModal
      visible={issueModalVisible}
      onClose={() => setIssueModalVisible(false)}
      loading={loading}
      isFinished={isFinished}
      isCanceled={isCanceled}
      form={form}
      appointmentIssue={orderProduct.appointmentIssue}
      orderProduct={{ startedAt: orderProduct.startedAt, endedAt: orderProduct.endedAt }}
      appId={appId}
      authToken={authToken}
      onSubmit={handleSubmit}
    />
  </Suspense>
)}
```

`handleSubmit` 內的 `form.validateFields` 不需改動。

### 為何 `hasOpenedIssueModal` 而非每次 `issueModalVisible && <Modal/>`

antd 3 `Form.create` 的 form state 綁在 wrapped component instance，且 antd 3 Form.Item 的 `getFieldDecorator` 必須在 component lifecycle 內呼叫。若每次關閉 modal 都 unmount，下次開啟需要重新呼叫 `getFieldDecorator`，會丟失既有 form value 與 initialValue 重置。

採「首次開啟後保留掛載」可避免 antd Form state 重置問題，同時保證首次未開啟者不下載 editor。

### 風險

- `form` prop 跨 component 傳遞：antd 3 `Form.create` 的 `WrappedFormUtils` 是純 object instance，跨元件邊界沒問題。
- 首次開啟 modal 時 lazy chunk 載入延遲：fallback null 期間 modal 不顯示，使用者按下「提問單」按鈕後可能感覺到 100–300 ms 空白。在 ButtonGroup 加入 `loading` 視覺指示可緩和，但 YAGNI——首次開啟一次即快取，後續即時。
- `BraftEditor.createEditorState` 在 lazy 模組內 evaluation：依舊每次 render 都會跑，但只在 modal 開啟後才會掛載，對 entry 零影響。

### 驗證

- `ANALYZE=true pnpm build`：editor chunk 不在 `MemberPage` lazy chunk 的 import 鏈
- `build/index.html` modulepreload 不含 editor chunk
- 手動：
  - 進入 /members/:memberId 預約列表
  - 點「提問單」→ modal 開啟，Braft 編輯器運作正常
  - 輸入內容、儲存
  - 再次開啟 modal，內容保留（已 mount，未 unmount）
  - 取消 / 完成狀態下顯示 read-only BraftContent

## Task D：vite.config.ts named groups

### 改動

`vite.config.ts:206-239` 的 `build.rolldownOptions.output.codeSplitting.groups` 新增 5 條：

```ts
{ name: 'router', test: /node_modules[\\/]@tanstack[\\/]/, priority: 25 },
{ name: 'craft', test: /node_modules[\\/]@craftjs[\\/]/, priority: 25 },
{ name: 'forms', test: /node_modules[\\/](react-hook-form|@hookform[\\/])/, priority: 25 },
{ name: 'carousel', test: /node_modules[\\/](react-slick|slick-carousel)[\\/]/, priority: 25 },
{ name: 'messenger', test: /node_modules[\\/]react-messenger-customer-chat[\\/]/, priority: 25 },
```

附加至既有 groups 陣列末端（在 `screenshot` 之後）；priority 25 與現有 same-tier 一致，rolldown 取首個匹配。本 5 條與既有 11 條規則正則互不重疊。

### 效果

- `router` chunk：因 `AppRouter` 仍為 entry chain 一部份，會被 entry modulepreload。但獨立 chunk 便於 stats 觀察與後續 lazy router 設計（YAGNI 本輪）。
- `craft` chunk：受 lazy `AppCraftRenderer` 引用，不進 entry preload。
- `forms` / `carousel`：因所有 consumer 皆為 lazy page，獨立 chunk lazy-loaded。
- `messenger` chunk：受 lazy `AppCraftRenderer`（內含 `MessengerChat`）引用，lazy。

### 風險

- 新增 named group 不影響 build 正確性，僅影響 chunk 命名與分組。
- 與既有 `editor` / `react-core` / `chakra` / `apollo` / `date` / `utils` / `antd` / `fullcalendar` / `markdown-editor` / `ebook` / `screenshot` 規則無正則重疊。

### 驗證

- `ANALYZE=true pnpm build`：stats 內出現 `router`、`craft`、`forms`、`carousel`、`messenger` named chunks
- modulepreload 清單：`craft` / `forms` / `carousel` / `messenger` 不應出現

## 量化目標

| 指標 | Baseline | Target |
|---|---|---|
| entry chunk `index-*.js` | 1,097 kB | < 500 kB（stretch；接受 500–600 kB） |
| `editor` chunk 在 modulepreload | yes | no |
| `craft` chunk 在 modulepreload | yes（混在 lib） | no |
| `forms` chunk 在 modulepreload | n/a（混在 lib） | no |
| `carousel` chunk 在 modulepreload | n/a（混在 lib） | no |
| `messenger` chunk 在 modulepreload | n/a（混在 lib） | no |
| `router` chunk | n/a（混在 lib） | yes 獨立（仍 preload） |

預期殘餘 entry 組成：
- `@tanstack/react-router` 透過 `router` chunk preload（~80–120 kB）
- locale inline messages（~153 kB）
- `Application.tsx` + `AppRouter.tsx` + `LocaleContext` + 各 Context Provider + `AppPage` shell（不含 craft renderer）+ `DefaultLayout` shell
- 共用 helper / hooks 鏈

## 執行順序

1. **Task D**（vite config named groups）—— 純 config，先做後可立即觀察 chunk 切分變化
2. **Task A**（AppCraftRenderer lazy）—— 最高 CP 值，砍最多 entry 重量
3. **Task B**（Application 全域元件 lazy）—— 機械式改動
4. **Task C**（AppointmentIssueModal lazy）—— 唯一需要拆 component 的部分

每 task 一個 commit，沿用既有 `codex-react17-vite-migration` 分支。

## 測試策略

### Hard gates（每 task 完成時）

| Task | 指令 | 通過標準 |
|---|---|---|
| D | `ANALYZE=true pnpm build` | stats 內出現 5 個新 named chunks |
| A | `ANALYZE=true pnpm build` | entry 不含 `@craftjs`、section barrel、CraftElement；modulepreload 不含 editor / craft |
| B | `ANALYZE=true pnpm build` | `SignupPropertyModal` / `InAppBrowserWarningModal` / `GlobalPodcastPlayer` 各自獨立 lazy chunk |
| C | `ANALYZE=true pnpm build` | `MemberPage` lazy chunk 依賴鏈不含 editor chunk |

### 全部完成後

- `pnpm build`：entry chunk 量化檢核（目標 < 500 kB stretch）
- `pnpm test`
- 手動驗收：
  - / 首頁 craft section 渲染（含舊式 sectionConverter 與 craftData 兩條分支）
  - 任一 lazy route page（如 /programs/:id）開啟，entry preload 不含 editor
  - /members/:memberId 預約提問單 modal：開啟、儲存、再開、isFinished / isCanceled read-only
  - SignupPropertyModal、InAppBrowserWarningModal、GlobalPodcastPlayer 場景
  - 任一 antd DatePicker / Form 頁面無 regression

### Rollback

每 task 獨立 commit；`git revert <task-commit>` 可單獨回滾。

## CI 影響

- 無新 env var；無新 build step
- 不影響 vitest config

## Backlog（本輪不做）

- **B-1**：PostSection / BlndPostSection 改用 `getBraftContent` helper，完全砍掉這兩個 consumer 的 braft-editor 依賴（純文字提取場景，行為等價但 `getBraftContent` 用 `JSON.parse + block.text` 而非 `toHTML().replace(/<[^>]+>/gi, '')`，需確認 abstract 50 char 截斷顯示）。執行後即使 craft-renderer chunk 被下載，也不會連帶下載 editor 鏈。
- **B-2**：lodestar-app-element 端 locale eager glob（vite.config.ts `lodestarAppElementCompatPlugin` 注入 `{ eager: true }`）改 lazy + macro 注入初始 messages。8 個 element locale（共 ~190 kB）退出 modulepreload。
- **B-3**：locale inline messages 切共用 keys vs page-specific keys，inline 只保留共用部分，page-specific keys lazy。複雜度高，僅在 entry < 500 kB 仍差距大時考慮。
