# Bundle entry slim + editor lazy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `assets/index-*.js` 從 1,097 kB 砍到 < 500 kB（stretch），且把 `editor`（braft-editor, 417 kB）chunk 完全踢出 `build/index.html` modulepreload。

**Architecture:** 四個獨立 commit，各自處理一條 entry → preload 的拖累鏈。

1. **Task D**：`vite.config.ts` 新增 5 個 named groups（`router` / `craft` / `forms` / `carousel` / `messenger`），把這些重型 lib 抽出 `lib` 共用大桶。
2. **Task A**：抽 `src/pages/AppPage/AppCraftRenderer.tsx`，把 `@craftjs/core`、22 個 `components/page` sections、`CraftElement` barrel、`CraftBlock`、`MessengerChat` 改 `React.lazy()`。entry 最大宗減重。
3. **Task B**：`Application.tsx` 的 `SignupPropertyModal` / `InAppBrowserWarningModal` / `GlobalPodcastPlayer` 改 `React.lazy()` + `Suspense fallback={null}`。
4. **Task C**：`AppointmentCard.tsx` 把 issue modal 整段抽到 `AppointmentIssueModal.tsx` 並 lazy 載入；首次開啟後保留掛載以保 antd 3 `Form.create` state。

**Tech Stack:** React 17, Vite 8 (rolldown), `@craftjs/core`, `@tanstack/react-router`, antd 3, braft-editor, react-hook-form, react-slick, lodestar-app-element。

**Spec:** `docs/superpowers/specs/2026-05-12-bundle-entry-and-editor-lazy-design.md`

**Branch:** `codex-react17-vite-migration`（沿用既有）

---

## Task D: vite.config.ts 新增 named groups

**Files:**
- Modify: `vite.config.ts:206-239`（`build.rolldownOptions.output.codeSplitting.groups` 陣列末端）

**目的：** 在動 lazy 之前，先把這 5 個 lib 分離到自己的 named chunk，方便後續 stats.html 與 modulepreload 觀察改變。

- [ ] **Step 1: 在 codeSplitting.groups 陣列末端追加 5 個 group**

開啟 `vite.config.ts`，找到 `groups: [...]` 區塊（目前最後一條是 `{ name: 'screenshot', test: /node_modules[\\/]html2canvas/, priority: 25 },`），在 `screenshot` 之後、`]` 之前插入：

```ts
{ name: 'router', test: /node_modules[\\/]@tanstack[\\/]/, priority: 25 },
{ name: 'craft', test: /node_modules[\\/]@craftjs[\\/]/, priority: 25 },
{ name: 'forms', test: /node_modules[\\/](react-hook-form|@hookform[\\/])/, priority: 25 },
{ name: 'carousel', test: /node_modules[\\/](react-slick|slick-carousel)[\\/]/, priority: 25 },
{ name: 'messenger', test: /node_modules[\\/]react-messenger-customer-chat[\\/]/, priority: 25 },
```

完成後 `groups` 陣列共 16 條規則。

- [ ] **Step 2: 跑 build 確認 chunk 切分**

Run: `ANALYZE=true pnpm build`

Expected: build 成功；`build/assets/` 內出現 `router-*.js`、`craft-*.js`、`forms-*.js`、`carousel-*.js`、`messenger-*.js` 五個新檔。

驗證指令：

```bash
ls build/assets/ | grep -E '^(router|craft|forms|carousel|messenger)-[A-Za-z0-9_]+\.js$'
```

Expected output: 五行檔名各一行。

- [ ] **Step 3: 確認 entry 仍可載入（無 broken import）**

Run: `pnpm test`

Expected: 全部既有測試 pass（`tests/AppPageRouteFallback.test.ts`、`tests/contexts/AppProviderStability.test.tsx`、`tests/contexts/NotificationContext.test.tsx`、`tests/hooks/ebook.test.tsx`、`tests/router/tanstackRuntime.test.tsx`、`tests/components/common/routerPath.test.ts`）。

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "perf(bundle): split router/craft/forms/carousel/messenger into named chunks"
```

---

## Task A: 抽 AppCraftRenderer 並 lazy

**Files:**
- Create: `src/pages/AppPage/AppCraftRenderer.tsx`
- Modify: `src/pages/AppPage/index.tsx`

**目的：** `AppPage` 是所有路由的 root component，靜態 import `@craftjs/core` + section barrel 等大塊。把實際 craft 渲染搬到 lazy chunk，entry 卸下這條鏈。

- [ ] **Step 1: 建立 AppCraftRenderer.tsx**

Create `src/pages/AppPage/AppCraftRenderer.tsx`：

```tsx
import { Editor, Frame } from '@craftjs/core'
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import MessengerChat from '../../components/common/MessengerChat'
import {
  ActivityIntroSection,
  ActivitySection,
  BlndCTASection,
  BlndPostSection,
  CoverSection,
  CreatorListSection,
  CreatorSection,
  CustomCoverSection,
  IntroSection,
  LittlestarFeaturedPodcastSection,
  LittlestarLastTimePodcastSection,
  MisaFeatureSection,
  MisaNavigationBar,
  NavSection,
  PodcastAlbumCollectionSection,
  PostSection,
  ProgramIntroSection,
  ProgramSection,
  ReferrerSection,
  StaticBlock,
  StaticCoverSection,
  TableListSection,
  TeacherSection,
} from '../../components/page'
import HaohaomingSection from '../../components/page/HaohaomingSection'
import CraftBlock from './CraftBlock'

export type SectionType =
  | 'homeCover'
  | 'homeActivity'
  | 'homeCreator'
  | 'homePost'
  | 'homeProgram'
  | 'homeProgramCategory'
  | 'messenger'

const craftElementResolver = { ...CraftElement }

const sectionConverter = {
  homeActivity: ActivitySection,
  homeActivityIntro: ActivityIntroSection,
  homeCreator: CreatorSection,
  homeCreatorList: CreatorListSection,
  homeCover: CoverSection,
  homeCustomCover: CustomCoverSection,
  homeStaticCover: StaticCoverSection,
  homeNav: NavSection,
  homePost: PostSection,
  homeProgram: ProgramSection,
  homeProgramCategory: ProgramSection,
  homeProgramIntro: ProgramIntroSection,
  homePodcastCollection: PodcastAlbumCollectionSection,
  homeReferrer: ReferrerSection,
  homeStatic: StaticBlock,
  homeTeacher: TeacherSection,
  homeIntro: IntroSection,
  messenger: MessengerChat,
  homeTableList: TableListSection,
  homeBlndPost: BlndPostSection,
  homeBlndCTA: BlndCTASection,
  homeMisaFeature: MisaFeatureSection,
  homeMisaNav: MisaNavigationBar,
  homeLittlestarLastTimePodcast: LittlestarLastTimePodcastSection,
  homeLittlestarFeaturedPodcast: LittlestarFeaturedPodcastSection,
  homeHaohaoming: HaohaomingSection,
}

type Props = {
  craftData: { [key: string]: any } | null
  appPageSections: { id: string; options: any; type: SectionType }[]
}

const AppCraftRenderer: React.FC<Props> = ({ craftData, appPageSections }) => {
  if (craftData) {
    return (
      <Editor enabled={false} resolver={craftElementResolver}>
        <CraftBlock craftData={craftData} />
      </Editor>
    )
  }
  return (
    <Editor enabled={false} resolver={craftElementResolver}>
      <Frame>
        <>
          {appPageSections.map(section => {
            const Section = sectionConverter[section.type as keyof typeof sectionConverter]
            if (!Section) {
              return null
            }
            return <Section key={section.id} options={section.options} />
          })}
        </>
      </Frame>
    </Editor>
  )
}

export default AppCraftRenderer
```

- [ ] **Step 2: 改 AppPage/index.tsx，移除 craft 相關 static imports**

開啟 `src/pages/AppPage/index.tsx`。

刪除以下 import（行 2–5、行 24–49、行 57）：

```tsx
import { Editor, Frame } from '@craftjs/core'
...
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
...
import {
  ActivityIntroSection,
  ActivitySection,
  BlndCTASection,
  BlndPostSection,
  CoverSection,
  CreatorListSection,
  CreatorSection,
  CustomCoverSection,
  IntroSection,
  LittlestarFeaturedPodcastSection,
  LittlestarLastTimePodcastSection,
  MisaFeatureSection,
  MisaNavigationBar,
  NavSection,
  PodcastAlbumCollectionSection,
  PostSection,
  ProgramIntroSection,
  ProgramSection,
  ReferrerSection,
  StaticBlock,
  StaticCoverSection,
  TableListSection,
  TeacherSection,
} from '../../components/page'
import HaohaomingSection from '../../components/page/HaohaomingSection'
...
import CraftBlock from './CraftBlock'
```

也刪除原本的 `MessengerChat` import：

```tsx
import MessengerChat from '../../components/common/MessengerChat'
```

刪除 `craftElementResolver`、`sectionConverter`、`SectionType` 三個檔案頂層宣告（行 59、行 61–99）。

新增於既有 import 區塊（保留 `React, { useContext, useEffect, useState }` + `Suspense` 從 react 一併 import）：

```tsx
import React, { Suspense, useContext, useEffect, useState } from 'react'
```

並在檔案頂層、所有 import 之後加：

```tsx
import type { SectionType } from './AppCraftRenderer'

const AppCraftRenderer = React.lazy(() => import('./AppCraftRenderer'))
```

注意：`import type` 在 build 階段擦除，不會把 lazy module 拖回 entry。

- [ ] **Step 3: 改 AppPage render JSX：以 AppCraftRenderer 取代 Editor block**

在 `AppPage` 函式 render 內，找到目前的：

```tsx
<DefaultLayout {...currentAppPage.options}>
  {currentAppPage.craftData ? (
    <Editor enabled={false} resolver={craftElementResolver}>
      <CraftBlock craftData={currentAppPage.craftData} />
    </Editor>
  ) : (
    <Editor enabled={false} resolver={craftElementResolver}>
      <Frame>
        <>
          {currentAppPage.appPageSections.map(section => {
            const Section = sectionConverter[section.type]
            if (!sectionConverter[section.type]) {
              return null
            }
            return <Section key={section.id} options={section.options} />
          })}
        </>
      </Frame>
    </Editor>
  )}
</DefaultLayout>
```

整段替換成：

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

- [ ] **Step 4: 跑 build 並驗證 entry / modulepreload**

Run: `ANALYZE=true pnpm build`

Expected:
- build 成功
- `build/assets/index-*.js` 大小減少（baseline 1,097 kB → 預期 ~600–800 kB；後續 Task B/C 再降）
- `build/index.html` modulepreload 清單不再含 `editor-*.js`

驗證指令：

```bash
ls -la build/assets/index-*.js
grep -oE 'modulepreload[^>]*"/assets/[^"]*"' build/index.html | sort -u
```

Expected：modulepreload 清單中應消失 `editor-*.js`、`craft-*.js`、`carousel-*.js`、`messenger-*.js`。

`router-*.js` 仍應在清單中（`AppRouter` 在 entry chain），可接受。

- [ ] **Step 5: 跑 vitest 與既有 AppPage route fallback 測試**

Run: `pnpm test`

Expected: 全部 pass，特別注意 `tests/AppPageRouteFallback.test.ts` 不應 regression（測 `shouldRenderRouteFallbackWhileLoading` 行為，與 lazy chunk 拆分無關，但驗證 import 路徑無 break）。

- [ ] **Step 6: 手動 smoke 驗證**

啟 dev server：`pnpm dev`

驗證以下 4 條路徑無 regression：

1. 訪問 / 首頁 → 看 section converter 渲染（loading 短暫 fallback 後出現首頁 sections，braft 摘要正常）
2. 訪問任一 craft data 頁（後台 CMS 建立的 app_page，e.g. `/about-us` 若有），確認 `CraftBlock` 渲染正常
3. 訪問 /programs（lazy route，不應觸發 AppCraftRenderer），devtools Network 確認不下載 `craft-*.js`、`carousel-*.js`、`editor-*.js`
4. 訪問任一非 craft 路由 → 正常進入路由元件

- [ ] **Step 7: Commit**

```bash
git add src/pages/AppPage/AppCraftRenderer.tsx src/pages/AppPage/index.tsx
git commit -m "perf(bundle): lazy-load AppCraftRenderer to defer craftjs and section barrel"
```

---

## Task B: Application.tsx 全域元件 lazy

**Files:**
- Modify: `src/Application.tsx`

**目的：** `SignupPropertyModal` / `InAppBrowserWarningModal` / `GlobalPodcastPlayer` 是全路由共用的全域元件，目前 static import 直接進 entry。它們各自體積不大但連帶 modal / FB SDK 等鏈進 entry。改 lazy 後三者皆獨立 chunk。

- [ ] **Step 1: 改 Application.tsx，三個元件改 React.lazy**

開啟 `src/Application.tsx`。

刪除：

```tsx
import InAppBrowserWarningModal from './components/common/InAppBrowserWarningModal'
import SignupPropertyModal from './components/common/SignupPropertyModal'
import GlobalPodcastPlayer from './components/podcast/GlobalPodcastPlayer'
```

在 `const GlobalAudioPlayer = React.lazy(...)` 上方或下方（合併位置以保 import 群乾淨）新增：

```tsx
const SignupPropertyModal = React.lazy(() => import('./components/common/SignupPropertyModal'))
const InAppBrowserWarningModal = React.lazy(() => import('./components/common/InAppBrowserWarningModal'))
const GlobalPodcastPlayer = React.lazy(() => import('./components/podcast/GlobalPodcastPlayer'))
```

- [ ] **Step 2: 在 JSX 各別包 Suspense fallback={null}**

找到 `AppRouter` 的 children 段：

```tsx
<AppRouter extra={extraRouteProps}>
  <GlobalPodcastPlayer />
  <Suspense fallback={null}>
    <GlobalAudioPlayer />
  </Suspense>
  <SignupPropertyModal key={document.location.href} />
  <InAppBrowserWarningModal />
</AppRouter>
```

替換成：

```tsx
<AppRouter extra={extraRouteProps}>
  <Suspense fallback={null}>
    <GlobalPodcastPlayer />
  </Suspense>
  <Suspense fallback={null}>
    <GlobalAudioPlayer />
  </Suspense>
  <Suspense fallback={null}>
    <SignupPropertyModal key={document.location.href} />
  </Suspense>
  <Suspense fallback={null}>
    <InAppBrowserWarningModal />
  </Suspense>
</AppRouter>
```

- [ ] **Step 3: 跑 build 並驗證 chunk 切分**

Run: `ANALYZE=true pnpm build`

Expected:
- build 成功
- `build/assets/` 內出現 `SignupPropertyModal-*.js`、`InAppBrowserWarningModal-*.js`、`GlobalPodcastPlayer-*.js` 三個獨立 lazy chunk（檔名取自原 default export，rolldown 預設行為）
- `build/index.html` modulepreload 不再包含這三個 chunk

驗證指令：

```bash
ls build/assets/ | grep -E '(SignupPropertyModal|InAppBrowserWarningModal|GlobalPodcastPlayer)-[A-Za-z0-9_]+\.js$'
grep -c 'SignupPropertyModal\|InAppBrowserWarningModal\|GlobalPodcastPlayer' build/index.html
```

Expected：第一條三行；第二條 0（modulepreload 清單與內聯 script 都不含）。

- [ ] **Step 4: 跑 vitest**

Run: `pnpm test`

Expected: 全 pass。`tests/contexts/AppProviderStability.test.tsx` 不該 regression（測 Application provider 樹的穩定性）。

- [ ] **Step 5: 手動 smoke 驗證**

啟 dev server：`pnpm dev`

驗證：

1. 一般 desktop Chrome 開站 → 不應看到 InAppBrowserWarning（modal 仍正常運作，僅 lazy 載入）
2. 模擬 LINE / FB In-App User-Agent（devtools → Network → User-Agent override）→ InAppBrowserWarningModal 顯示
3. 登入新註冊帳號或缺 signup_property 的帳號 → SignupPropertyModal 觸發
4. 訪問 podcast 頁啟動播放 → GlobalPodcastPlayer 顯示底部 player；切換內容、暫停、close 行為正常
5. 切換路由（含 `pathname.includes('contents')` 觸發 podcast close 的場景）→ podcast 自動關閉行為正常

- [ ] **Step 6: Commit**

```bash
git add src/Application.tsx
git commit -m "perf(bundle): lazy-load Application global modals and GlobalPodcastPlayer"
```

---

## Task C: AppointmentIssueModal lazy

**Files:**
- Create: `src/components/appointment/AppointmentIssueModal.tsx`
- Modify: `src/components/appointment/AppointmentCard.tsx`

**目的：** `AppointmentCard` 靜態 `import BraftEditor`，把 `editor` chunk 變成 `MemberPage` lazy 鏈的依賴 → modulepreload。把 issue modal（唯一用 braft 的部分）抽到 lazy 子元件，徹底斷鏈。

- [ ] **Step 1: 建立 AppointmentIssueModal.tsx**

Create `src/components/appointment/AppointmentIssueModal.tsx`：

```tsx
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Form, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { createUploadFn, dateRangeFormatter } from '../../helpers'
import appointmentMessages from './translation'

const StyledModalTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledModalMetaBlock = styled.div`
  padding: 0.75rem;
  background-color: var(--gray-lighter);
  border-radius: 4px;
`

type Props = {
  visible: boolean
  onClose: () => void
  loading: boolean
  isFinished: boolean
  isCanceled: boolean
  form: FormComponentProps['form']
  appointmentIssue: string | null
  orderProduct: { startedAt: Date | null; endedAt: Date | null }
  appId: string
  authToken: string | null
  onSubmit: () => void
}

const AppointmentIssueModal: React.FC<Props> = ({
  visible,
  onClose,
  loading,
  isFinished,
  isCanceled,
  form,
  appointmentIssue,
  orderProduct,
  appId,
  authToken,
  onSubmit,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Modal width={660} visible={visible} footer={null} onCancel={onClose}>
      <StyledModalTitle className="mb-3">
        {formatMessage(appointmentMessages.AppointmentCard.appointmentIssue)}
      </StyledModalTitle>
      <StyledModalMetaBlock className="mb-3">
        <span className="mr-2">{formatMessage(appointmentMessages.AppointmentCard.appointmentDate)}</span>
        {orderProduct.startedAt && orderProduct.endedAt ? (
          <span>
            {dateRangeFormatter({
              startedAt: orderProduct.startedAt,
              endedAt: orderProduct.endedAt,
              dateFormat: 'MM/DD(dd)',
            })}
          </span>
        ) : null}
      </StyledModalMetaBlock>
      <div className="mb-3">
        <strong className="mb-2">{formatMessage(appointmentMessages.AppointmentCard.createAppointmentIssue)}</strong>
        <div>{formatMessage(appointmentMessages.AppointmentCard.appointmentIssueDescription)}</div>
      </div>

      <Form colon={false} className={isFinished || isCanceled ? 'd-none' : ''}>
        <Form.Item>
          {form.getFieldDecorator('appointmentIssue', {
            initialValue: BraftEditor.createEditorState(appointmentIssue),
          })(
            <StyledBraftEditor
              language="zh-hant"
              contentClassName="short-bf-content"
              controls={[
                'headings',
                'bold',
                'italic',
                'underline',
                'strike-through',
                'remove-styles',
                'separator',
                'text-align',
                'separator',
                'list-ul',
                'list-ol',
                'blockquote',
                'code',
                'separator',
                'link',
                'hr',
                'media',
              ]}
              media={{
                uploadFn: createUploadFn(appId, authToken),
                accepts: { video: false, audio: false },
                externals: { image: true, video: false, audio: false, embed: true },
              }}
            />,
          )}
        </Form.Item>
      </Form>

      {isFinished && <BraftContent>{appointmentIssue}</BraftContent>}
      {isCanceled && <BraftContent>{appointmentIssue}</BraftContent>}
      {!isFinished && !isCanceled && (
        <ButtonGroup display="flex" marginTop="24px" justifyContent="flex-end">
          <Button variant="outline" marginRight="8px" onClick={onClose}>
            {formatMessage(appointmentMessages['*'].cancel)}
          </Button>
          <Button isLoading={loading} colorScheme="primary" onClick={onSubmit}>
            {formatMessage(appointmentMessages['*'].save)}
          </Button>
        </ButtonGroup>
      )}
    </Modal>
  )
}

export default AppointmentIssueModal
```

- [ ] **Step 2: 改 AppointmentCard.tsx——清除 braft 相關 imports 與只在 issue modal 使用的 styled util**

開啟 `src/components/appointment/AppointmentCard.tsx`。

刪除以下 import：

```tsx
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
```

```tsx
import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
```

保留以下 import（其他 modal 仍用）：

```tsx
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
```

把 helpers import 中的 `createUploadFn` 移除（只在 issue modal 用，已搬至 lazy）：

```tsx
import { createUploadFn, dateRangeFormatter, downloadFile, getFileDownloadableLink, handleError } from '../../helpers'
```

改為：

```tsx
import { dateRangeFormatter, downloadFile, getFileDownloadableLink, handleError } from '../../helpers'
```

刪除 `StyledModalMetaBlock` 整段宣告（只在 issue modal 用，已搬到 lazy 子元件）：

```tsx
const StyledModalMetaBlock = styled.div`
  padding: 0.75rem;
  background-color: var(--gray-lighter);
  border-radius: 4px;
`
```

保留 `StyledModalTitle`、`StyledModalSubTitle`、`StyledScheduleTitle`、`StyledLabel` 等其他 styled util（仍被 reschedule / cancel / result modals 用）。

- [ ] **Step 3: 在 AppointmentCard.tsx 加 lazy import 與 hasOpenedIssueModal state**

開啟 `src/components/appointment/AppointmentCard.tsx`，import 區末端新增：

```tsx
const AppointmentIssueModal = React.lazy(() => import('./AppointmentIssueModal'))
```

在 `AppointmentCard` 元件內、現有 `const [issueModalVisible, setIssueModalVisible] = useState(false)` 之後加：

```tsx
const [hasOpenedIssueModal, setHasOpenedIssueModal] = useState(false)
```

`React` 已從 `import React, { useState }` 引入；確認 import 行為：

```tsx
import React, { Suspense, useEffect, useState } from 'react'
```

（將 `Suspense`、`useEffect` 一併加入既有 React import；若 useEffect 已存在則不重複。目前 AppointmentCard 只 import `useState`，需要追加 `Suspense, useEffect`。）

在 hooks 區塊（其他 `useState` 與 hooks 之後、`handleSubmit` 之前）加：

```tsx
useEffect(() => {
  if (issueModalVisible && !hasOpenedIssueModal) {
    setHasOpenedIssueModal(true)
  }
}, [issueModalVisible, hasOpenedIssueModal])
```

- [ ] **Step 4: 替換 issue modal JSX 為 lazy 子元件**

找到原本的 `{/* issue modal */}` 段（從 `<Modal width={660} visible={issueModalVisible}` 到該 `</Modal>`）整段刪除。

在原位置插入：

```tsx
{/* issue modal */}
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

注意：保留 cancel modal、reschedule modal、reschedule confirm modal、reschedule result modal 四個 modal 不動。

- [ ] **Step 5: 確認 AppointmentCard 內無殘留 braft 引用**

Run:

```bash
grep -n 'BraftEditor\|StyledBraftEditor\|BraftContent\|braft-editor' src/components/appointment/AppointmentCard.tsx
```

Expected: 無輸出（檔內已無 braft 相關代碼）。

- [ ] **Step 6: 跑 build 並驗證 editor chunk 退出 modulepreload**

Run: `ANALYZE=true pnpm build`

Expected:
- build 成功
- `build/assets/AppointmentIssueModal-*.js` 出現（內含 braft-editor 對 editor chunk 的 lazy reference）
- `build/index.html` modulepreload 清單**完全不含 `editor-*.js`**

驗證指令：

```bash
grep 'editor-' build/index.html | grep modulepreload
ls build/assets/ | grep AppointmentIssueModal
```

Expected：第一條無輸出；第二條 1 行。

- [ ] **Step 7: 確認 entry chunk 量化目標**

Run:

```bash
ls -la build/assets/index-*.js
```

Expected: entry size < 500 kB（stretch；可接受 500–650 kB）。記錄實際數字。

若 entry 仍 > 650 kB，檢查 stats.html 確認還有哪些大宗在 entry 鏈：

```bash
open build/stats.html
```

- [ ] **Step 8: 跑 vitest**

Run: `pnpm test`

Expected: 全 pass。

- [ ] **Step 9: 手動 smoke 驗證**

啟 dev server：`pnpm dev`

操作：

1. 登入有預約紀錄的會員，進入 `/members/:memberId`，看到 AppointmentCard 清單
2. 點擊「提問單」按鈕 → 觀察 devtools Network 出現 `AppointmentIssueModal-*.js` + `editor-*.js` 下載 → Modal 開啟、Braft 編輯器運作正常
3. 輸入 rich text 內容，點「儲存」→ 確認 `updateAppointmentIssue` 成功（toast `saveSuccessfully`）
4. 關閉 Modal 後再次點「提問單」→ 不再下載（chunk 已 cache），Modal 內容保留剛才輸入的草稿（antd Form state 保留）
5. 對 isFinished / isCanceled 的預約點「提問單」→ read-only `BraftContent` 顯示原內容
6. 確認 reschedule modal、cancel modal 在功能 / 樣式 / loading 行為上無 regression（這些 modal 不在 lazy 範圍）

- [ ] **Step 10: Commit**

```bash
git add src/components/appointment/AppointmentIssueModal.tsx src/components/appointment/AppointmentCard.tsx
git commit -m "perf(bundle): lazy-load AppointmentIssueModal to defer braft-editor"
```

---

## 整體驗收

四個 task 完成後，跑一次完整驗收：

- [ ] **完整 build + chunk 量化**

```bash
ANALYZE=true pnpm build
ls -la build/assets/index-*.js
grep -oE 'modulepreload[^>]*"/assets/[^"]*"' build/index.html | sort -u
```

驗收清單：

| 指標 | Baseline | 預期 | 實際 |
|---|---|---|---|
| `index-*.js` 大小 | 1,097 kB | < 500 kB（stretch） | (記錄) |
| modulepreload 含 `editor-*.js` | yes | **no** | (記錄) |
| modulepreload 含 `craft-*.js` | yes（在 lib） | **no** | (記錄) |
| modulepreload 含 `carousel-*.js` | yes（在 lib） | **no** | (記錄) |
| modulepreload 含 `messenger-*.js` | yes（在 lib） | **no** | (記錄) |
| modulepreload 含 `forms-*.js` | yes（在 lib） | **no** | (記錄) |
| modulepreload 含 `router-*.js` | yes（在 lib） | yes（獨立） | (記錄) |

- [ ] **完整 test pass**

```bash
pnpm test
```

- [ ] **手動串流驗證關鍵路徑**

1. / 首頁 craft section
2. /members/:memberId 預約提問單 modal lazy 載入
3. /podcasts/:id 播放（GlobalPodcastPlayer 啟動）
4. SignupPropertyModal / InAppBrowserWarning Modal 觸發場景
5. 任一 lazy route 進入，network 不下載 editor / craft 鏈
6. antd DatePicker / Form 任一頁無 regression

---

## Rollback 策略

每 task 一個獨立 commit，按需 `git revert <task-commit>` 可分別回滾。

Task 間依賴：
- Task A 不依賴 Task D（即使沒 named groups 也能 lazy）
- Task B 不依賴任何前置
- Task C 不依賴任何前置
- 建議照 D → A → B → C 順序，因 Task D 純 config 風險最低，Task A 收益最大。
