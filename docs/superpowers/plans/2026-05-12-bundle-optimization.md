# Bundle 體積優化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `pnpm build` 的 entry 首屏關鍵路徑（modulepreload 強制下載）從 ~5.7 MB（gzip ~1.5 MB）縮到 < ~2.5 MB（gzip < ~700 kB），方法是拆細 vendors chunk、移除 `moment-timezone`、locales 改 lazy load 並由 env 控制預設、把全域 audio player 改 React.lazy。

**Architecture:** 四個獨立子任務，每個一個 commit。Task 1 是純 `vite.config.ts` 變動（chunk 拆細）；Task 2 是機械式 import 改寫 + 兩處 dayjs 改寫；Task 3 引入 vite `define` 巨集把預設 locale 內容 inline 進 entry、其他 locale 走 dynamic glob；Task 4 用 `React.lazy()` 把 `GlobalAudioPlayer` 與 `MediaPlayerContext` 內部的 `<AudioPlayer>` 兩條 eager hls.js 鏈打斷。

**Tech Stack:** Vite 8（內建 rolldown）、React 17、TypeScript、antd 3.26.20、moment、dayjs、Apollo Client、Chakra UI、video.js、hls.js、rollup-plugin-visualizer。

**Spec:** `docs/superpowers/specs/2026-05-12-bundle-optimization-design.md`

---

## File Structure

**Created:**
- `src/dayjsSetup.ts` — 共用 dayjs `utc` + `timezone` plugin extend，由 entry 載入一次（Task 2）

**Modified:**
- `vite.config.ts` — `codeSplitting.groups` 移除 catch-all 加 5 個 named group（Task 1）；`define` 加入 `__DEFAULT_LOCALE__` / `__DEFAULT_APP_MESSAGES__` / `__DEFAULT_ELEMENT_MESSAGES__`（Task 3）
- `package.json` — `pnpm remove moment-timezone`（Task 2）
- `src/index.tsx` — import `./dayjsSetup`（Task 2）
- `src/contexts/LocaleContext.tsx` — 移除 eager glob、改 async loader + 用 define 巨集做初始同步 messages（Task 3）
- `src/contexts/MediaPlayerContext.tsx` — `import AudioPlayer` 改 `React.lazy()` + Suspense（Task 4）
- `src/Application.tsx` — `GlobalAudioPlayer` import 改 `React.lazy()` + Suspense（Task 4）
- `.env.example` — 新增 `VITE_DEFAULT_LOCALE` 註解（Task 3）

**Modified（Task 2 純 import path）：**
- `src/components/page/PostSection.tsx`
- `src/components/page/BlndPostSection.tsx`
- `src/components/blog/PostPreviewMeta.tsx`
- `src/components/common/CertificateCard.tsx`
- `src/components/program/ProgramContentMenu.tsx`
- `src/pages/ProgramPage/Secondary/SecondaryProgramContentListItem.tsx`
- `src/pages/ProgramPage/Primary/ProgramContentListSection.tsx`

**Modified（Task 2 dayjs 改寫）：**
- `src/components/ebook/EbookBookmarkModal.tsx`
- `src/components/appointment/AppointmentCollectionTabs.tsx`

**已先行 commit（前置上下文）：**
- `vite.config.ts` 的 hybrid C catch-all 已存在於 commit `ff139d5f`；本計畫 Task 1 在其上微調
- `rollup-plugin-visualizer` 已於 `ff139d5f` 安裝為 devDep，`ANALYZE=true` 啟用

**不修改：**
- `lodestar-app-element` 原始碼
- 任何 antd 元件用法
- 既有 `React.lazy()` 的 6 個 VideoPlayer consumer（已 lazy，無需重構）

---

## Task 1: Vendors chunk 拆細

**Files:**
- Modify: `vite.config.ts`（codeSplitting.groups）

---

- [ ] **Step 1: Baseline build**

Run:
```bash
ANALYZE=true pnpm build 2>&1 | tail -20
```

Expected: 看到 `vendors-*.js` 約 4.9 MB、`index-*.js` 約 1,440 kB、`antd-*.js` 約 1,471 kB，以及 `chakra` `apollo` `utils` `date` `react-core` 等具名 chunk。

記下這次的 entry chunk size 與 vendors chunk size 作為對比基準。

- [ ] **Step 2: 替換 codeSplitting.groups**

開啟 `vite.config.ts`，找到 `build.rolldownOptions.output.codeSplitting.groups` 區塊（約在 vite.config.ts:177-202）。整段 replace 為：

```ts
groups: [
  { name: 'antd', test: /node_modules[\\/]antd[\\/]/, priority: 30 },
  {
    name: 'react-core',
    test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|history)[\\/]/,
    priority: 25,
  },
  {
    name: 'apollo',
    test: /node_modules[\\/](@apollo[\\/]|graphql[\\/]|graphql-tag[\\/]|@graphql)/,
    priority: 25,
  },
  {
    name: 'chakra',
    test: /node_modules[\\/](@chakra-ui[\\/]|@emotion[\\/]|framer-motion[\\/])/,
    priority: 25,
  },
  { name: 'date', test: /node_modules[\\/](moment|dayjs|date-fns)[\\/]/, priority: 25 },
  { name: 'utils', test: /node_modules[\\/](lodash|lodash-es|ramda)[\\/]/, priority: 25 },
  {
    name: 'editor',
    test: /node_modules[\\/](braft-[^/]+|draft-js|draft-convert|draftjs-utils)[\\/]/,
    priority: 25,
  },
  { name: 'fullcalendar', test: /node_modules[\\/]@fullcalendar[\\/]/, priority: 25 },
  {
    name: 'markdown-editor',
    test: /node_modules[\\/](codemirror|easymde|codemirror-spell-checker)[\\/]/,
    priority: 25,
  },
  { name: 'ebook', test: /node_modules[\\/](epubjs|jszip)[\\/]/, priority: 25 },
  { name: 'screenshot', test: /node_modules[\\/]html2canvas/, priority: 25 },
],
```

**重要**：移除舊的 `{ name: 'vendors', test: /node_modules[\\/]/, priority: 10 }` 那一行（catch-all）。

- [ ] **Step 3: Build 驗證**

Run:
```bash
ANALYZE=true pnpm build 2>&1 | tail -30
```

Expected output 應該看到：
- 不再有單一 `vendors-*.js` 超過 2 MB；可能完全不見 `vendors-*.js`、或大小縮成幾百 kB
- 新增具名 chunk：`editor-*.js`、`fullcalendar-*.js`、`markdown-editor-*.js`、`ebook-*.js`、`screenshot-*.js`
- 其中 `editor` 約 ~340 kB、`fullcalendar` 約 ~360 kB、`markdown-editor` 約 ~404 kB、`ebook` 約 ~424 kB、`screenshot` 約 ~319 kB
- 若 build 失敗，回頭檢查 regex 語法（`[\\/]` 內的 backslash escape）

- [ ] **Step 4: 確認 entry HTML 不再 preload 巨大 chunk**

Run:
```bash
grep -E 'modulepreload' build/index.html
```

Expected: 清單中應該不再有 `vendors-*.js` 那一行（或若存在則明顯小於 2 MB）。可能保留的具名 chunk 像 `antd`、`apollo`、`chakra`、`react-core`、`utils`、`date`、`translation`（react-intl 的）依然會被 preload，這正常。

- [ ] **Step 5: 跑測試**

Run:
```bash
pnpm test
```

Expected: 全部通過（這個 task 不改業務邏輯，測試應該都不會受影響）。

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts
git commit -m "perf(bundle): split vendor chunk into named per-feature groups

Remove the vendors catch-all group and add explicit groups for the
remaining heavy libraries (editor, fullcalendar, markdown-editor, ebook,
screenshot). Lets rolldown auto-chunk smaller node_modules and keeps
feature-specific code out of the entry preload list.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 移除 moment-timezone

### Sub-task 2A：新增共用 dayjs setup

**Files:**
- Create: `src/dayjsSetup.ts`
- Modify: `src/index.tsx`

---

- [ ] **Step 1: 建立 `src/dayjsSetup.ts`**

寫入：

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
```

- [ ] **Step 2: 在 entry import setup**

開啟 `src/index.tsx`，於 `import App from './Application'` 之前加入：

```ts
import './dayjsSetup'
```

完整 import 區塊應該變成：

```ts
import React from 'react'
import { render } from 'react-dom'
import './dayjsSetup'
import App from './Application'
import { unregister } from './serviceWorker'
```

- [ ] **Step 3: Build smoke**

Run:
```bash
pnpm build 2>&1 | tail -5
```

Expected: build 通過。

### Sub-task 2B：純 import 改寫（7 檔案）

**Files:**
- Modify: `src/components/page/PostSection.tsx:7`
- Modify: `src/components/page/BlndPostSection.tsx:8`
- Modify: `src/components/blog/PostPreviewMeta.tsx:4`
- Modify: `src/components/common/CertificateCard.tsx:2`
- Modify: `src/components/program/ProgramContentMenu.tsx:7`
- Modify: `src/pages/ProgramPage/Secondary/SecondaryProgramContentListItem.tsx:4`
- Modify: `src/pages/ProgramPage/Primary/ProgramContentListSection.tsx:6`

---

- [ ] **Step 1: 改 PostSection import**

`src/components/page/PostSection.tsx:7`：
```ts
// 改前
import moment from 'moment-timezone'
// 改後
import moment from 'moment'
```

- [ ] **Step 2: 改 BlndPostSection import**

`src/components/page/BlndPostSection.tsx:8`，同上模式。

- [ ] **Step 3: 改 PostPreviewMeta import**

`src/components/blog/PostPreviewMeta.tsx:4`，同上。

- [ ] **Step 4: 改 CertificateCard import**

`src/components/common/CertificateCard.tsx:2`，同上。

- [ ] **Step 5: 改 ProgramContentMenu import**

`src/components/program/ProgramContentMenu.tsx:7`，同上。

- [ ] **Step 6: 改 SecondaryProgramContentListItem import**

`src/pages/ProgramPage/Secondary/SecondaryProgramContentListItem.tsx:4`，同上。

- [ ] **Step 7: 改 ProgramContentListSection import**

`src/pages/ProgramPage/Primary/ProgramContentListSection.tsx:6`，同上。

- [ ] **Step 8: Build smoke**

Run:
```bash
pnpm build 2>&1 | tail -5
```

Expected: build 通過。

### Sub-task 2C：EbookBookmarkModal 改 dayjs

**Files:**
- Modify: `src/components/ebook/EbookBookmarkModal.tsx:26, 261`

---

- [ ] **Step 1: 改 import**

`src/components/ebook/EbookBookmarkModal.tsx:26`：
```ts
// 改前
import moment from 'moment-timezone'
// 改後
import dayjs from 'dayjs'
```

- [ ] **Step 2: 改 format 呼叫**

`src/components/ebook/EbookBookmarkModal.tsx:261`：
```ts
// 改前
const formattedCreatedAt = moment(highlight.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
// 改後
const formattedCreatedAt = dayjs(highlight.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
```

**注意**：dayjs 的 `utc` 與 `timezone` plugin 已於 sub-task 2A 全域 extend，這裡直接用 `.tz()` 即可。

- [ ] **Step 3: 檢查同檔案內無其他 moment 使用**

Run:
```bash
grep -n "moment" src/components/ebook/EbookBookmarkModal.tsx
```

Expected: 應該無剩餘 `moment` 字串。若有殘留 moment 用法，提示使用者：本 sub-task 範圍只是替換 `.tz()` 那一行；若還有其他 moment 用法，請另外決定是否一併換成 dayjs。

### Sub-task 2D：AppointmentCollectionTabs 改 dayjs

**Files:**
- Modify: `src/components/appointment/AppointmentCollectionTabs.tsx:16-17, 435-436`

---

- [ ] **Step 1: 改 import**

`src/components/appointment/AppointmentCollectionTabs.tsx:16-17`：
```ts
// 改前
import moment from 'moment'
import momentTz from 'moment-timezone'
// 改後
import dayjs from 'dayjs'
```

**注意**：若該檔案內其他地方仍用 `moment(...)`，本步驟只移除 `momentTz` 那一行 import、保留 `moment` import。可先 grep：

```bash
grep -n "moment\b\|moment(" src/components/appointment/AppointmentCollectionTabs.tsx
```

若除了 line 435-436 之外仍有 `moment` 用法 → 保留 `import moment from 'moment'`，僅移除 `momentTz` import；以及把 line 436 的 `moment().zone(...)` 也改成 dayjs。

- [ ] **Step 2: 改 tz.guess 與 zone 呼叫**

`src/components/appointment/AppointmentCollectionTabs.tsx:435-436`：
```ts
// 改前
city: momentTz.tz.guess().split('/')[1],
timezone: moment().zone(momentTz.tz.guess()).format('Z'),
// 改後
city: (() => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return tz.split('/')[1] || tz
})(),
timezone: dayjs().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('Z'),
```

**為什麼用 `Intl.DateTimeFormat().resolvedOptions().timeZone`**：原本 `momentTz.tz.guess()` 是用瀏覽器原生 API 推測時區。`Intl.DateTimeFormat` 是該 API 的標準 spec、跨瀏覽器一致，行為等同 `moment.tz.guess()` 又不需 lib。

- [ ] **Step 3: 確認其他 moment 用法（若有）也轉換**

若 step 1 的 grep 顯示其他 line 仍用 `moment(...)`，請逐一檢視。預期這些都是純 `moment(date).format(...)` 用法可直接改成 `dayjs(date).format(...)`（dayjs 與 moment API 高度相容）。

- [ ] **Step 4: Build 驗證**

Run:
```bash
pnpm build 2>&1 | tail -10
```

Expected: build 通過、無 type error。

### Sub-task 2E：移除依賴並驗證

- [ ] **Step 1: pnpm remove**

Run:
```bash
pnpm remove moment-timezone
```

Expected: `moment-timezone` 從 `package.json` 移除、`pnpm-lock.yaml` 更新。**不可**移除 `moment` 本身。

- [ ] **Step 2: 確認沒有殘留 import**

Run:
```bash
grep -rn "moment-timezone" src/ 2>/dev/null
```

Expected: 無任何匹配。若有殘留，回頭修正。

- [ ] **Step 3: Build with analyze**

Run:
```bash
ANALYZE=true pnpm build 2>&1 | tail -10
```

Expected: build 通過。

- [ ] **Step 4: 確認 date chunk 不含 moment-timezone**

Run:
```bash
jq -r '
  .nodeMetas | to_entries[] | .value.id 
  | select(test("moment-timezone"))
' build/stats.json
```

Expected: 無輸出（moment-timezone 已完全從 bundle 消失）。

- [ ] **Step 5: 跑測試**

Run:
```bash
pnpm test
```

Expected: 全部通過。

- [ ] **Step 6: Commit**

```bash
git add src/dayjsSetup.ts src/index.tsx \
  src/components/page/PostSection.tsx src/components/page/BlndPostSection.tsx \
  src/components/blog/PostPreviewMeta.tsx src/components/common/CertificateCard.tsx \
  src/components/program/ProgramContentMenu.tsx \
  src/pages/ProgramPage/Secondary/SecondaryProgramContentListItem.tsx \
  src/pages/ProgramPage/Primary/ProgramContentListSection.tsx \
  src/components/ebook/EbookBookmarkModal.tsx \
  src/components/appointment/AppointmentCollectionTabs.tsx \
  package.json pnpm-lock.yaml
git commit -m "perf(bundle): drop moment-timezone, switch to dayjs for tz

7 files only used moment-timezone for plain format(), changed import to
moment. 2 files (EbookBookmarkModal, AppointmentCollectionTabs) actually
used .tz()/.tz.guess(); switched to dayjs + Intl.DateTimeFormat. moment
itself stays because antd 3 depends on it. Cuts ~700kB from bundle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Locales lazy load

### Sub-task 3A：vite.config.ts define 巨集

**Files:**
- Modify: `vite.config.ts`
- Modify: `.env.example`

---

- [ ] **Step 1: 加入 `fs` import 與 helper（vite.config.ts）**

開啟 `vite.config.ts`，在 import 區塊最上方加 `import fs from 'fs'`（如已有 `fs/promises` import，保留不衝突，但 sync read 仍需 `fs`）：

```ts
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
// ... 既有 import
```

- [ ] **Step 2: 在 `defineConfig(async ({ command, mode }) => { ... })` 函式內、env 載入後新增 default locale 解析**

找到 `const env = loadEnv(mode, process.cwd(), '')` 那一行，在其下方加入：

```ts
const SUPPORTED_LOCALES_FOR_BUILD = [
  'zh-cn', 'zh-tw', 'en-us', 'vi', 'id', 'ja', 'ko', 'de-de',
] as const
const requestedDefaultLocale = env.VITE_DEFAULT_LOCALE || 'zh-tw'
const resolvedDefaultLocale = (SUPPORTED_LOCALES_FOR_BUILD as readonly string[]).includes(
  requestedDefaultLocale,
)
  ? requestedDefaultLocale
  : 'zh-tw'
if (resolvedDefaultLocale !== requestedDefaultLocale) {
  console.warn(
    `[vite] VITE_DEFAULT_LOCALE="${requestedDefaultLocale}" not in SUPPORTED_LOCALES, using "zh-tw"`,
  )
}
const defaultAppMessagesJson = fs.readFileSync(
  path.resolve(__dirname, `src/translations/locales/${resolvedDefaultLocale}.json`),
  'utf8',
)
const defaultElementMessagesJson = fs.readFileSync(
  path.resolve(
    __dirname,
    `node_modules/lodestar-app-element/src/translations/locales/${resolvedDefaultLocale}.json`,
  ),
  'utf8',
)
```

**為何用 `readFileSync` 不 `await readFile`**：vite config 函式雖是 async，但 `define` 物件需在回傳前完備、值是同步字串。同步讀檔在 build 啟動期只發生一次、成本可忽略。

- [ ] **Step 3: 把 `define` 區塊擴增**

找到 `define: { ... __DEV__: ... 'process.env.NODE_ENV': ... }` 區塊，在其內加入三條：

```ts
define: {
  ...getLegacyReactAppEnv(env),
  __DEV__: JSON.stringify(nodeEnv !== 'production'),
  global: 'globalThis',
  'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  'process.env': {},
  __DEFAULT_LOCALE__: JSON.stringify(resolvedDefaultLocale),
  __DEFAULT_APP_MESSAGES__: defaultAppMessagesJson,
  __DEFAULT_ELEMENT_MESSAGES__: defaultElementMessagesJson,
},
```

**注意**：`__DEFAULT_APP_MESSAGES__` 與 `__DEFAULT_ELEMENT_MESSAGES__` 直接放 JSON 字串原文（不 `JSON.stringify`）。JSON 本身是合法 JS literal，vite 會把這個值原文替換到引用點，等同 inline 一個 object literal。對比 `__DEFAULT_LOCALE__` 需要 `JSON.stringify` 因為它是字串需要外層引號。

- [ ] **Step 4: 更新 .env.example**

開啟 `.env.example`，於檔尾加入：

```
# Default locale to inline into the entry chunk at build time.
# Must be one of: zh-cn, zh-tw, en-us, vi, id, ja, ko, de-de
# Falls back to zh-tw if unset or invalid.
VITE_DEFAULT_LOCALE=zh-tw
```

- [ ] **Step 5: Build smoke（先確認 define 不破壞 build）**

Run:
```bash
pnpm build 2>&1 | tail -10
```

Expected: build 通過。**目前 LocaleContext.tsx 還沒用到新的 `__DEFAULT_*__` 巨集**，所以此時 build 結果與 baseline 相同——這步只驗證 vite config 不爆掉。

### Sub-task 3B：LocaleContext.tsx 改寫

**Files:**
- Modify: `src/contexts/LocaleContext.tsx`

---

- [ ] **Step 1: 替換 import 與 glob 設定**

開啟 `src/contexts/LocaleContext.tsx`，替換 line 1-22 為：

```ts
import { gql, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'
import hasura from '../hasura'

type LocaleMessages = Record<string, string>

declare const __DEFAULT_LOCALE__: string
declare const __DEFAULT_APP_MESSAGES__: LocaleMessages
declare const __DEFAULT_ELEMENT_MESSAGES__: LocaleMessages

const appLocaleLoaders = import.meta.glob('../translations/locales/*.json', {
  import: 'default',
}) as Record<string, () => Promise<LocaleMessages>>
const elementLocaleLoaders = import.meta.glob(
  '../../node_modules/lodestar-app-element/src/translations/locales/*.json',
  { import: 'default' },
) as Record<string, () => Promise<LocaleMessages>>

const buildAppLoaderKey = (locale: string) => `../translations/locales/${locale}.json`
const buildElementLoaderKey = (locale: string) =>
  `../../node_modules/lodestar-app-element/src/translations/locales/${locale}.json`
```

**移除原本**：`import defaultLocaleMessages from '../translations/locales/en-us.json'` 與兩個 `{ eager: true }` glob。

- [ ] **Step 2: 改寫 LocaleProvider 內 messages state**

找到 `export const LocaleProvider: React.FC = ({ children }) => { ... }` 函式體，把 `useState(currentLocale)` 區塊改為：

```ts
const { enabledModules, settings, id: appId } = useApp()
const settingsDefaultLocale = settings['language'] || 'zh-tw'
const [currentLocale, setCurrentLocale] = useState<string>(__DEFAULT_LOCALE__)
const [messagesState, setMessagesState] = useState<{
  appMessages: LocaleMessages
  elementMessages: LocaleMessages
}>({
  appMessages: __DEFAULT_APP_MESSAGES__,
  elementMessages: __DEFAULT_ELEMENT_MESSAGES__,
})
```

**注意**：`defaultLocale` 變數原本是 `settings['language'] || 'zh-tw'`——用於 context value 的 `defaultLocale` field（給 consumer 看「app 設定的預設值」是什麼）。保留這個語意，但變數名稱改為 `settingsDefaultLocale` 避免與 `__DEFAULT_LOCALE__` 混淆。後續 context value 仍用這個變數。

- [ ] **Step 3: 加 async loader 工具函式（在 LocaleProvider 內部）**

在 `useState` 區塊之後、`useMemo languagesList` 之前加入：

```ts
const loadLocaleMessages = useCallback(async (locale: string) => {
  const appLoader = appLocaleLoaders[buildAppLoaderKey(locale)]
  const elementLoader = elementLocaleLoaders[buildElementLoaderKey(locale)]
  if (!appLoader && !elementLoader) {
    console.warn(`[locale] no messages for "${locale}"`)
    return null
  }
  const [appMessages, elementMessages] = await Promise.all([
    appLoader ? appLoader() : Promise.resolve({} as LocaleMessages),
    elementLoader ? elementLoader() : Promise.resolve({} as LocaleMessages),
  ])
  return { appMessages, elementMessages }
}, [])
```

- [ ] **Step 4: 改寫 mount useEffect（初始 detected locale 處理）**

找到原本的 `useEffect(() => { ... setCurrentLocale(currentLocale) ... }, [defaultLocale, enabledModules, settings])`（line 93-111）。整段替換為：

```ts
useEffect(() => {
  let detected = settingsDefaultLocale
  const cachedLocale = localStorage.getItem('kolable.app.language')?.toLowerCase()
  if (
    cachedLocale &&
    SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === cachedLocale.toLowerCase())
  ) {
    detected = cachedLocale
  } else if (Boolean(settings['language'])) {
    detected = settings['language']
  } else if (
    enabledModules.locale &&
    navigator.language &&
    SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === navigator.language.toLowerCase())
  ) {
    detected = navigator.language.toLowerCase()
  }

  if (detected === currentLocale) return

  let cancelled = false
  ;(async () => {
    const next = await loadLocaleMessages(detected)
    if (!next || cancelled) return
    setMessagesState(next)
    setCurrentLocale(detected)
    moment.locale(detected)
  })()
  return () => {
    cancelled = true
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [settingsDefaultLocale, enabledModules, settings])
```

**取消旗標** `cancelled` 避免 component unmount 後仍 setState 觸發 warning。

- [ ] **Step 5: 改寫 setCurrentLocale 為 async**

找到 `updateCurrentLocale` 區塊（原 line 124-129）。替換為：

```ts
const updateCurrentLocale = useCallback(
  async (newLocale: string) => {
    if (!SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === newLocale)) return
    if (newLocale === currentLocale) return
    const next = await loadLocaleMessages(newLocale)
    if (!next) return
    setMessagesState(next)
    setCurrentLocale(newLocale)
    localStorage.setItem('kolable.app.language', newLocale)
    moment.locale(newLocale)
  },
  [currentLocale, loadLocaleMessages],
)
```

**注意**：原本是同步 `setCurrentLocale`。Context 對外 type `setCurrentLocale?: (language: string) => void` 不限制回傳；新版回傳 Promise<void> 不破壞 consumer。

- [ ] **Step 6: 更新 messages 來源**

找到原本（line 113-122）：

```ts
moment.locale(currentLocale)
const localeMessages = localeMessageModules[`../translations/locales/${currentLocale}.json`] || defaultLocaleMessages
const elementMessages =
  elementMessageModules[`../../node_modules/lodestar-app-element/src/translations/locales/${currentLocale}.json`] ||
  {}

if (!localeMessages && !elementMessages) {
  console.warn('cannot load the locale:', currentLocale)
}
const messages = { ...elementMessages, ...localeMessages, ...appLocaleMessages }
```

替換為：

```ts
const messages = useMemo(
  () => ({
    ...messagesState.elementMessages,
    ...messagesState.appMessages,
    ...appLocaleMessages,
  }),
  [messagesState, appLocaleMessages],
)
```

**移除** `moment.locale(currentLocale)` 在 render body 的呼叫——這個副作用已搬進 sub-task 3B step 4/5 的 async 流程內。

- [ ] **Step 7: 更新 context value 的 defaultLocale field**

找到 `const contextValue = useMemo(...)`，把 `defaultLocale` 改為 `settingsDefaultLocale`（變數名稱已改）：

```ts
const contextValue = useMemo(
  () => ({
    defaultLocale: settingsDefaultLocale,
    currentLocale,
    setCurrentLocale: updateCurrentLocale,
    languagesList,
  }),
  [currentLocale, settingsDefaultLocale, languagesList, updateCurrentLocale],
)
```

- [ ] **Step 8: TypeScript 編譯通過驗證**

Run:
```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: 無 type error。若 `defaultLocale` 型別差異報錯，檢查 `LocaleContextProps.defaultLocale` 與 `updateCurrentLocale` 簽章。

- [ ] **Step 9: Build with analyze**

Run:
```bash
ANALYZE=true pnpm build 2>&1 | tail -15
```

Expected: build 通過。entry chunk size 應顯著縮小（baseline 1,440 kB → 期望 ~400 kB 級）。

- [ ] **Step 10: 驗證 entry chunk 只 inline 預設 locale**

Run:
```bash
jq -r '
  .nodeMetas as $metas
  | [.nodeParts | to_entries[]
      | $metas[.value.metaUid] as $meta
      | select($meta != null)
      | select($meta.id | test("translations/locales/"))
      | {chunk: ($meta.moduleParts | to_entries[0].key), id: $meta.id, size: .value.renderedLength}]
  | sort_by(-.size)
  | .[0:20]
' build/stats.json
```

Expected：
- 只有 `zh-tw.json`（app + element 各一份）落在 entry chunk（`assets/index-*.js`）
- 其他 7 個 locale 應分別在獨立 lazy chunk（不是 `index-*.js`）

- [ ] **Step 11: 跑不同 env 驗證**

Run:
```bash
VITE_DEFAULT_LOCALE=ja pnpm build 2>&1 | tail -5
```

Expected: build 通過。

Run（再次用上面的 jq 看 stats）：
```bash
jq -r '
  .nodeMetas as $metas
  | [.nodeParts | to_entries[]
      | $metas[.value.metaUid] as $meta
      | select($meta != null)
      | select($meta.id | test("translations/locales/.*\\.json$"))
      | select(($meta.moduleParts | to_entries[0].key) | startswith("assets/index-"))
      | $meta.id]
' build/stats.json
```

Expected: 只有 `ja.json`（app + element）。

把預設改回 `zh-tw`：

```bash
unset VITE_DEFAULT_LOCALE
pnpm build 2>&1 | tail -5
```

Expected: build 通過、stats 回到 `zh-tw.json` only。

- [ ] **Step 12: 跑測試**

Run:
```bash
pnpm test
```

Expected: 全部通過。若有 locale 相關測試需要新的 `declare const __DEFAULT_*__` 在 test 環境定義，加進 `vitest.config.ts` 或 setup file 的 `define`。

- [ ] **Step 13: 手動 smoke（開瀏覽器）**

Run:
```bash
pnpm start
```

開瀏覽器至 http://localhost:3333，做以下檢查：
1. 預設語系顯示為繁體中文
2. 切換至英文：原本繁中內容保留 → 載入後一次替換、無 spinner
3. 切換至日文：同上
4. 再切回繁中：因已 cached，應接近即時
5. Network 面板觀察：切換時應看到 `*.json` chunk 下載一次（非預設語系才會發生）

- [ ] **Step 14: Commit**

```bash
git add vite.config.ts src/contexts/LocaleContext.tsx .env.example
git commit -m "perf(bundle): lazy-load non-default locale messages

VITE_DEFAULT_LOCALE controls which locale (default zh-tw) gets inlined
into the entry chunk via vite define macros. Other locales become
dynamic-import chunks loaded only on language switch. Cuts ~1MB from
entry chunk.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Audio player lazy

**Files:**
- Modify: `src/Application.tsx`
- Modify: `src/contexts/MediaPlayerContext.tsx`

---

### Sub-task 4A：lazy `<GlobalAudioPlayer>` 於 Application.tsx

- [ ] **Step 1: 修改 import + 用法**

開啟 `src/Application.tsx`。

替換 line 3:
```ts
// 改前
import React from 'react'
// 改後
import React, { Suspense } from 'react'
```

刪除 line 5:
```ts
import GlobalAudioPlayer from './components/audio/GlobalAudioPlayer'
```

在 line 19（`import './styles.scss'`）之前加入：
```ts
const GlobalAudioPlayer = React.lazy(() => import('./components/audio/GlobalAudioPlayer'))
```

修改 `<GlobalAudioPlayer />` 的使用（原 line 40）：
```tsx
// 改前
<GlobalAudioPlayer />
// 改後
<Suspense fallback={null}>
  <GlobalAudioPlayer />
</Suspense>
```

- [ ] **Step 2: TypeScript 驗證**

Run:
```bash
pnpm tsc --noEmit 2>&1 | head -10
```

Expected: 無 error。

- [ ] **Step 3: Build smoke**

Run:
```bash
pnpm build 2>&1 | tail -10
```

Expected: build 通過。

### Sub-task 4B：lazy `<AudioPlayer>` 於 MediaPlayerContext.tsx

- [ ] **Step 1: 修改 import**

開啟 `src/contexts/MediaPlayerContext.tsx`。

替換 line 5：
```ts
// 改前
import React, { useEffect, useRef, useState } from 'react'
// 改後
import React, { Suspense, useEffect, useRef, useState } from 'react'
```

替換 line 7：
```ts
// 改前
import AudioPlayer from '../components/common/AudioPlayer'
// 改後
const AudioPlayer = React.lazy(() => import('../components/common/AudioPlayer'))
```

**注意**：`import 'video.js/dist/video-js.css'` 於 line 6 仍保留——這只是 CSS 檔，不會拉進 hls.js 或 video.js JS lib。CSS 在 Provider mount 時載入仍是 acceptable trade-off（替代方案是把 CSS 也搬進 lazy chunk，但這會延後到 AudioPlayer 實際 render 時才注入，可能造成短暫 unstyled flash）。

- [ ] **Step 2: 在 AudioPlayer 用法處包 Suspense**

找到 `<AudioPlayer ... />` 的使用點。Application 把 MediaPlayerContext.Provider 的 children 內可能 render `<AudioPlayer>`。

Run:
```bash
grep -n "AudioPlayer" src/contexts/MediaPlayerContext.tsx
```

預期會看到 1-2 處 JSX。每一處 wrap：

```tsx
// 改前
<AudioPlayer
  ... 各種 props
/>

// 改後
<Suspense fallback={null}>
  <AudioPlayer
    ... 各種 props
  />
</Suspense>
```

- [ ] **Step 3: TypeScript 驗證**

Run:
```bash
pnpm tsc --noEmit 2>&1 | head -10
```

Expected: 無 error。

- [ ] **Step 4: Build with analyze**

Run:
```bash
ANALYZE=true pnpm build 2>&1 | tail -15
```

Expected: build 通過。`hls.js` 不應在 entry 或主要 preloaded chunk 內。

- [ ] **Step 5: 驗證 hls.js / video.js 落點**

Run:
```bash
jq -r '
  .nodeMetas as $metas
  | [.nodeParts | to_entries[]
      | $metas[.value.metaUid] as $meta
      | select($meta != null)
      | select($meta.id | test("node_modules/.pnpm/(hls\\.js|video\\.js)@"))
      | {chunk: ($meta.moduleParts | to_entries[0].key), id: $meta.id, size: .value.renderedLength}]
  | group_by(.chunk)
  | map({chunk: .[0].chunk, modules: length, size_kb: ((map(.size) | add) / 1024 | floor)})
' build/stats.json
```

Expected: hls.js / video.js 應落在獨立的 lazy chunk（不是 `assets/index-*.js`）。

Run（確認 entry 不 preload 含 hls/video.js 的 chunk）：
```bash
grep modulepreload build/index.html
```

Expected: 所列出的 chunk 都不含 hls.js / video.js（可逐個用 stats 反查）。

- [ ] **Step 6: 跑測試**

Run:
```bash
pnpm test
```

Expected: 全部通過。

- [ ] **Step 7: 手動 smoke**

Run:
```bash
pnpm start
```

開瀏覽器：

1. **GlobalAudioPlayer 啟動測試**：找到一個會啟動 audio player 的 program content（含音訊資源），按播放
   - Network 面板：應看到 hls.js + video.js + AudioPlayer 元件 chunk 在按播放後才開始下載
   - 播放可正常運作
2. **GlobalPodcastPlayer**：開啟 podcast page、播放、暫停、切換內容
3. **MediaPlayer**：開 program content 的影音內容（會觸發 MediaPlayerContext 內的 AudioPlayer），測試播放流程
4. **VideoPlayer**：開 program 內容頁含影片的（如 ProgramContentPlayer 用 VideoPlayer），確認 video.js + quality selector + hls 串流正常

若 Suspense fallback 看到一閃 `null`，正常——player 沒佇列內容時本來 render null。

- [ ] **Step 8: Commit**

```bash
git add src/Application.tsx src/contexts/MediaPlayerContext.tsx
git commit -m "perf(bundle): lazy-load GlobalAudioPlayer and MediaPlayer AudioPlayer

GlobalAudioPlayer (audio chain) and AudioPlayer inside MediaPlayerContext
(media chain) both pulled hls.js into the entry preload chain. Wrapping
them in React.lazy + Suspense pushes hls.js + video.js into a shared
lazy chunk loaded only when audio/video playback is triggered.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## 全部完成後：最終驗收

- [ ] **Step 1: 跑最終 build**

```bash
ANALYZE=true pnpm build 2>&1 | tail -30
```

- [ ] **Step 2: 確認量化目標達成**

| Chunk | Baseline | Target |
|---|---|---|
| entry (`index-*.js`) | 1,511 kB | < 500 kB |
| 單一 vendors（合併） | 5,692 kB | 移除或 < 500 kB |
| antd | 1,471 kB | 不動（~1,471 kB） |

若 entry chunk 仍超過 500 kB，跑 stats jq 找出 top 30 in entry：

```bash
jq -r '
  .nodeMetas as $metas
  | [.nodeParts | to_entries[]
      | $metas[.value.metaUid] as $meta
      | select($meta != null)
      | select(($meta.moduleParts | to_entries[0].key) | startswith("assets/index-"))
      | {id: $meta.id, size: .value.renderedLength}]
  | sort_by(-.size)
  | .[0:30]
' build/stats.json
```

回報給 user 看下一輪可繼續優化的方向。

- [ ] **Step 3: 確認 entry HTML preload 清單**

```bash
grep modulepreload build/index.html
```

Expected: 不再有任何 chunk > 2 MB；總 gzip 估算應 < 700 kB。

- [ ] **Step 4: 完整跑測試**

```bash
pnpm test
```

Expected: 全部通過。

- [ ] **Step 5: 完整手動 smoke**

啟動 dev server，覆蓋以下驗收項：

- **Locale**：
  - 預設（zh-tw）首屏立即顯示
  - 切換到英文、日文、其他語系
  - 切回預設語系命中 cache
- **Audio / Podcast**：
  - GlobalAudioPlayer 播放音訊
  - GlobalPodcastPlayer 播放、暫停、切換內容
- **Video（既有 lazy）**：
  - Program content 含影片頁播放
  - Fallback skeleton / spinner 顯示
  - Quality selector 可切換
- **Date 顯示**：
  - Ebook bookmark createdAt（Asia/Taipei）
  - AppointmentCollectionTabs city / timezone 欄位
  - Program content publish 時間 MM/DD
  - Blog post / Certificate / PostSection 日期格式
- **antd 時間元件**：
  - 任一頁面含 DatePicker / RangePicker / Calendar / TimePicker
  - 確認顯示無 regression（task 2 拆 moment-timezone 對 antd 無影響的最終驗證）

---

## Self-Review Notes

- **VideoPlayer 重構**：spec 提到的 `LazyVideoPlayer` 殼元件未在此計畫中實作——探勘時發現 6 個 consumer 已各自 `React.lazy()` + Suspense，DRY 重構與 bundle 目標無關，依 YAGNI 原則略過。若日後想統一，可另起小計畫。
- **CSS side-effect `'video.js/dist/video-js.css'`**：保留在 `MediaPlayerContext.tsx` top-level import；只有 ~30 kB CSS、無 JS 拖累，不值得搬進 lazy chunk 換取 unstyled flash 風險。
- **moment.locale 動態載入**：未引入 `import.meta.glob` 動態載 `moment/locale/*` 檔。原本只有 `moment/locale/zh-tw` 同步 import，其他 locale 切換時 `moment.locale(target)` 會 silently fallback 到 'en'——這是既有行為，本計畫保留。若日後要修，需另起任務。
- **Test 環境的 `__DEFAULT_*__` 巨集**：若 vitest 跑到 import LocaleContext.tsx 的測試，需在 `vitest.config.ts` 或 setup file 加 `define`。task 3 step 12 會偵測到——若失敗則同步處理。
