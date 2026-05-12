# Jest → Vitest 遷移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將測試 runner 從 Jest 26 + babel-jest 遷移到 Vitest，並把 6 個測試檔從 `src/` 搬到 root `tests/`、引入 `@/` alias。

**Architecture:** 獨立 `vitest.config.ts` 透過 `mergeConfig` 沿用 `vite.config.ts` 的 plugin 與 alias 設定；測試檔用 `@/` alias 引 src；機械式替換 `jest.*` → `vi.*`。

**Tech Stack:** Vite 8, Vitest, jsdom, TypeScript, pnpm, React 17。

**Spec:** `docs/superpowers/specs/2026-05-12-jest-to-vitest-design.md`

---

## File Structure

新增：
- `vitest.config.ts`（root）
- `tests/AppPageRouteFallback.test.ts`
- `tests/components/common/routerPath.test.ts`
- `tests/contexts/AppProviderStability.test.tsx`
- `tests/contexts/NotificationContext.test.tsx`
- `tests/hooks/ebook.test.tsx`
- `tests/router/tanstackRuntime.test.tsx`

修改：
- `package.json`（移除 jest deps、改 test script、加 vitest/jsdom）
- `tsconfig.json`（paths 加 `@/*`、include 加 `tests`、types 加 `vitest/globals`）
- `vite.config.ts`（resolve.alias 加 `@`）

刪除：
- `jest.config.js`
- `src/__tests__/AppPageRouteFallback.test.ts`
- `src/components/common/routerPath.test.ts`
- `src/contexts/AppProviderStability.test.tsx`
- `src/contexts/NotificationContext.test.tsx`
- `src/hooks/ebook.test.tsx`
- `src/router/tanstackRuntime.test.tsx`
- 空的 `src/__tests__/` 資料夾

---

## Task 1：安裝 Vitest 與 jsdom

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1：確認 Vitest 對 Vite 8 的 peer 相容**

Run：
```bash
pnpm view vitest peerDependencies
```

Expected：輸出含 `vite:` 欄位且版本範圍涵蓋 `^8`（例如 `>=5.0.0` 或 `>=6.0.0`）。若版本範圍最多到 vite 7，**停下回報**，不擅自降級 vite。

- [ ] **Step 2：安裝 vitest 與 jsdom**

Run：
```bash
pnpm add -D vitest jsdom
```

- [ ] **Step 3：確認安裝成功**

Run：
```bash
grep -E '"(vitest|jsdom)"' package.json
```

Expected：兩行結果，分別含 `vitest` 與 `jsdom`。

- [ ] **Step 4：Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add vitest and jsdom"
```

---

## Task 2：加 `@/` alias 到 tsconfig.json 與 vite.config.ts

**Files:**
- Modify: `tsconfig.json:14-17`
- Modify: `vite.config.ts:133-140`

- [ ] **Step 1：改 `tsconfig.json` 的 `paths`**

把：
```json
"paths": {
  "react-router": ["src/router/reactRouterCompat.tsx"],
  "react-router-dom": ["src/router/reactRouterCompat.tsx"]
},
```
改成：
```json
"paths": {
  "@/*": ["src/*"],
  "react-router": ["src/router/reactRouterCompat.tsx"],
  "react-router-dom": ["src/router/reactRouterCompat.tsx"]
},
```

- [ ] **Step 2：改 `vite.config.ts` 的 `resolve.alias`**

把：
```ts
resolve: {
  alias: {
    ajv: path.resolve(__dirname, 'src/vite-compat/ajv.ts'),
    jsonwebtoken: path.resolve(__dirname, 'src/vite-compat/jsonwebtoken.ts'),
    'react-router': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
    'react-router-dom': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
  },
},
```
改成：
```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    ajv: path.resolve(__dirname, 'src/vite-compat/ajv.ts'),
    jsonwebtoken: path.resolve(__dirname, 'src/vite-compat/jsonwebtoken.ts'),
    'react-router': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
    'react-router-dom': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
  },
},
```

- [ ] **Step 3：跑 `pnpm build` 確認沒打壞 build**

Run：
```bash
pnpm build
```

Expected：build 成功、退出碼 0、`build/` 目錄產生。

- [ ] **Step 4：Commit**

```bash
git add tsconfig.json vite.config.ts
git commit -m "feat: add @ alias pointing to src"
```

---

## Task 3：新增 vitest.config.ts、更新 tsconfig 與 test script

**Files:**
- Create: `vitest.config.ts`
- Modify: `tsconfig.json:23,25`
- Modify: `package.json:8`

- [ ] **Step 1：建立 `vitest.config.ts`（repo root）**

```ts
/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfigFactory from './vite.config'

// mode: 'development' 而非 'test'，讓 vite.config.ts 內的 loadEnv() 能讀到 .env.development
// 進而把 VITE_* 變數注入 define 區塊（process.env.REACT_APP_*）。
// command: 'serve' 讓 vite.config.ts 內的 nodeEnv 解析為 'development'。
const viteConfig = viteConfigFactory({ command: 'serve', mode: 'development' })

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
)
```

- [ ] **Step 2：改 `tsconfig.json` 的 `types`**

把：
```json
"types": ["vite/client"]
```
改成：
```json
"types": ["vite/client", "vitest/globals"]
```

- [ ] **Step 3：改 `tsconfig.json` 的 `include`**

把：
```json
"include": ["src"]
```
改成：
```json
"include": ["src", "tests"]
```

- [ ] **Step 4：改 `package.json` 的 `scripts.test`**

把：
```json
"test": "jest --passWithNoTests --watchAll=false",
```
改成：
```json
"test": "vitest run --passWithNoTests",
```

- [ ] **Step 5：跑 vitest 確認設定可載入**

Run：
```bash
pnpm test
```

Expected：輸出含 `No test files found` 之類訊息（因為 `tests/` 還不存在），退出碼為 0（`--passWithNoTests` 生效）。**舊測試仍在 `src/`，但 `include` 已不抓 src，所以暫時被略過——這是預期狀態。**

- [ ] **Step 6：Commit**

```bash
git add vitest.config.ts tsconfig.json package.json
git commit -m "feat: configure vitest with merged vite config"
```

---

## Task 4：搬移並啟用 `routerPath.test.ts`（最簡單，無 mock）

**Files:**
- Create: `tests/components/common/routerPath.test.ts`
- Delete: `src/components/common/routerPath.test.ts`

- [ ] **Step 1：建立 `tests/components/common/routerPath.test.ts`**

```ts
import { isProfilePathname, isProfileRoutePath, PROFILE_ROUTE_PATH, toTanStackRoutePath } from '@/components/common/routerPath'

describe('toTanStackRoutePath', () => {
  it('converts React Router params to TanStack Router params', () => {
    expect(toTanStackRoutePath('/programs/:programId/contents/:programContentId')).toBe(
      '/programs/$programId/contents/$programContentId',
    )
  })

  it('keeps the root route unchanged', () => {
    expect(toTanStackRoutePath('/')).toBe('/')
  })

  it('detects the legacy profile route path', () => {
    expect(isProfileRoutePath(PROFILE_ROUTE_PATH)).toBe(true)
    expect(isProfileRoutePath('/members/:memberId')).toBe(false)
  })

  it('detects profile pathnames without catching unrelated single-segment paths', () => {
    expect(isProfilePathname('/@eddy')).toBe(true)
    expect(isProfilePathname('/@eddy/')).toBe(true)
    expect(isProfilePathname('/not-found')).toBe(false)
    expect(isProfilePathname('/@eddy/settings')).toBe(false)
  })
})
```

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/components/common/routerPath.test.ts
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/components/common/routerPath.test.ts
```

Expected：4 tests passed、退出碼 0。

- [ ] **Step 4：Commit**

```bash
git add tests/components/common/routerPath.test.ts
git commit -m "test: move routerPath tests to tests/ with @ alias"
```

---

## Task 5：搬移 `AppPageRouteFallback.test.ts`（無 mock、無 jest API）

**Files:**
- Create: `tests/AppPageRouteFallback.test.ts`
- Delete: `src/__tests__/AppPageRouteFallback.test.ts`

- [ ] **Step 1：建立 `tests/AppPageRouteFallback.test.ts`**

```ts
import { shouldRenderRouteFallbackWhileLoading } from '@/components/common/routeFallback'

const routesMap = {
  home: {
    path: '/',
    pageName: 'HomePage',
  },
  program: {
    path: '/programs/:programId',
    pageName: 'ProgramPage',
  },
}

describe('shouldRenderRouteFallbackWhileLoading', () => {
  it('does not render the HomePage fallback while the CMS homepage is loading', () => {
    expect(shouldRenderRouteFallbackWhileLoading(routesMap, '/')).toBe(false)
  })

  it('keeps route fallback available for non-home application routes', () => {
    expect(shouldRenderRouteFallbackWhileLoading(routesMap, '/programs/program-1')).toBe(true)
  })
})
```

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/__tests__/AppPageRouteFallback.test.ts
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/AppPageRouteFallback.test.ts
```

Expected：2 tests passed、退出碼 0。

- [ ] **Step 4：Commit**

```bash
git add tests/AppPageRouteFallback.test.ts
git commit -m "test: move AppPageRouteFallback tests to tests/ with @ alias"
```

---

## Task 6：搬移 `tanstackRuntime.test.tsx`（無 jest API，但需驗 .mjs import）

**Files:**
- Create: `tests/router/tanstackRuntime.test.tsx`
- Delete: `src/router/tanstackRuntime.test.tsx`

- [ ] **Step 1：建立 `tests/router/tanstackRuntime.test.tsx`**

```tsx
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from '@tanstack/react-router'
import { Outlet, RootRoute, Route, Router, RouterProvider, useRouter } from '@/router/tanstackRuntime.mjs'

const HomePage = () => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        router.history.push('/programs/d883b7d3-4de5-401b-b435-f681297e20c7')
        router.history.notify?.()
      }}
    >
      open program
    </button>
  )
}

const ProgramPage = () => <div>program detail</div>

const createTestRouter = () => {
  const rootRoute = new RootRoute({
    component: () => <Outlet />,
  })
  const homeRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
  })
  const programRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/programs/$programId',
    component: ProgramPage,
  })

  return new Router({
    history: createMemoryHistory({ initialEntries: ['/'] }),
    routeTree: rootRoute.addChildren([homeRoute, programRoute]),
  })
}

describe('RouterProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('navigates from the home route to a program route without rendering stale matches', async () => {
    const router = createTestRouter()
    await router.load()

    act(() => {
      render(<RouterProvider router={router as any} />, container)
    })

    expect(container.textContent).toContain('open program')

    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(container.textContent).toContain('program detail')
  })
})
```

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/router/tanstackRuntime.test.tsx
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/router/tanstackRuntime.test.tsx
```

Expected：1 test passed、退出碼 0。

> **若失敗**：常見原因是 `tanstackRuntime.mjs` 的 ESM/CJS interop。Vitest 透過 Vite transform 處理 `.mjs`，行為應與既有 `vite.config.ts` 一致。先檢查錯誤訊息，不要急著改 import 形式。

- [ ] **Step 4：Commit**

```bash
git add tests/router/tanstackRuntime.test.tsx
git commit -m "test: move tanstackRuntime tests to tests/ with @ alias"
```

---

## Task 7：搬移並改寫 `ebook.test.tsx`（jest.fn + jest.mock）

**Files:**
- Create: `tests/hooks/ebook.test.tsx`
- Delete: `src/hooks/ebook.test.tsx`

- [ ] **Step 1：建立 `tests/hooks/ebook.test.tsx`**

```tsx
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useGetEbookTrialPercentage } from '@/hooks/ebook'

let mockQueryData: any

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings: TemplateStringsArray) => strings.join('')),
  useQuery: () => ({
    data: mockQueryData,
  }),
}))

describe('useGetEbookTrialPercentage', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('returns 0 when the program content has no ebook trial row', () => {
    mockQueryData = {
      program_content_ebook: [],
    }

    const Consumer = () => {
      const percentage = useGetEbookTrialPercentage('390559cb-037e-4f1f-b4d2-10490940f053')

      return <span>{percentage}</span>
    }

    act(() => {
      render(<Consumer />, container)
    })

    expect(container.textContent).toBe('0')
  })
})
```

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/hooks/ebook.test.tsx
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/hooks/ebook.test.tsx
```

Expected：1 test passed、退出碼 0。

- [ ] **Step 4：Commit**

```bash
git add tests/hooks/ebook.test.tsx
git commit -m "test: move ebook tests to tests/, swap jest for vi"
```

---

## Task 8：搬移並改寫 `NotificationContext.test.tsx`（jest.fn + jest.mock + fake timers）

**Files:**
- Create: `tests/contexts/NotificationContext.test.tsx`
- Delete: `src/contexts/NotificationContext.test.tsx`

- [ ] **Step 1：建立 `tests/contexts/NotificationContext.test.tsx`**

```tsx
import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import NotificationContext, { NotificationProvider } from '@/contexts/NotificationContext'

const mockRefetchNotifications = vi.fn(() => Promise.resolve())
const mockNotifications: [] = []

vi.mock('@/hooks/data', () => ({
  useNotifications: () => ({
    loadingNotifications: false,
    errorNotifications: undefined,
    notifications: mockNotifications,
    unreadCount: 0,
    refetchNotifications: mockRefetchNotifications,
  }),
}))

describe('NotificationProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.useFakeTimers()
    mockRefetchNotifications.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    vi.useRealTimers()
  })

  it('keeps the context value stable when only internal initialization state changes', () => {
    let renderCount = 0

    const Consumer = React.memo(() => {
      useContext(NotificationContext)
      renderCount += 1
      return null
    })

    act(() => {
      render(
        <NotificationProvider>
          <Consumer />
        </NotificationProvider>,
        container,
      )
    })

    expect(renderCount).toBe(1)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(mockRefetchNotifications).toHaveBeenCalledTimes(1)
    expect(renderCount).toBe(1)
  })
})
```

> 注意 `vi.mock` 的目標路徑：原檔用 `'../hooks/data'` 相對路徑指向 `src/hooks/data`，搬到 `tests/contexts/` 後**不能**用相對路徑 `../hooks/data`（那會解析到 `tests/hooks/data`，不存在）。改用 `@/hooks/data` alias。

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/contexts/NotificationContext.test.tsx
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/contexts/NotificationContext.test.tsx
```

Expected：1 test passed、退出碼 0。

- [ ] **Step 4：Commit**

```bash
git add tests/contexts/NotificationContext.test.tsx
git commit -m "test: move NotificationContext tests to tests/, swap jest for vi"
```

---

## Task 9：搬移並改寫 `AppProviderStability.test.tsx`（jest.fn + jest.mock + jest.Mock 型別）

**Files:**
- Create: `tests/contexts/AppProviderStability.test.tsx`
- Delete: `src/contexts/AppProviderStability.test.tsx`

- [ ] **Step 1：建立 `tests/contexts/AppProviderStability.test.tsx`**

```tsx
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import type { Mock } from 'vitest'
import { AppProvider, useApp } from 'lodestar-app-element/src/contexts/AppContext'

type QueryResult = {
  data?: any
  loading: boolean
  error?: Error
  refetch: Mock
}

const mockRefetch = vi.fn()
let mockQueryResult: QueryResult

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings: TemplateStringsArray) => strings.join('')),
  useQuery: () => mockQueryResult,
}))

const appData = {
  currency: [
    {
      id: 'TWD',
      name: 'Taiwan Dollar',
      label: 'NT$',
      unit: '元',
      minor_units: 0,
    },
  ],
  app_by_pk: {
    id: 'demo-app',
    org_id: null,
    name: 'Demo App',
    title: 'Demo',
    description: 'Demo description',
    app_modules: [{ id: 'module-1', module_id: 'locale' }],
    app_plan_id: 'default',
    app_navs: [],
    app_settings: [{ key: 'title', value: 'Demo title' }],
    app_secrets: [],
    app_hosts: [{ host: 'localhost:3333' }],
    options: {},
    ended_at: null,
  },
}

describe('AppProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    mockRefetch.mockClear()
    mockQueryResult = {
      data: appData,
      loading: false,
      refetch: mockRefetch,
    }
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('keeps the last loaded app data while GET_APP is loading again', () => {
    const snapshots: Array<{ id: string; loading: boolean; title?: string }> = []

    const Consumer = () => {
      const app = useApp()
      snapshots.push({
        id: app.id,
        loading: app.loading,
        title: app.settings.title,
      })
      return null
    }

    act(() => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'Demo title',
    })

    mockQueryResult = {
      loading: true,
      refetch: mockRefetch,
    }

    act(() => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: true,
      title: 'Demo title',
    })
  })
})
```

> 變更摘要：(1) 加 `import type { Mock } from 'vitest'`；(2) `refetch: jest.Mock` → `refetch: Mock`；(3) 全部 `jest.fn` / `jest.mock` 改 `vi.fn` / `vi.mock`。

- [ ] **Step 2：移除舊測試檔**

Run：
```bash
git rm src/contexts/AppProviderStability.test.tsx
```

- [ ] **Step 3：跑該檔的測試**

Run：
```bash
pnpm test tests/contexts/AppProviderStability.test.tsx
```

Expected：1 test passed、退出碼 0。

- [ ] **Step 4：跑全部 6 個測試做中繼確認**

Run：
```bash
pnpm test
```

Expected：6 tests passed（各檔合計）、退出碼 0。

- [ ] **Step 5：Commit**

```bash
git add tests/contexts/AppProviderStability.test.tsx
git commit -m "test: move AppProviderStability tests to tests/, swap jest for vi"
```

---

## Task 10：清理舊 Jest 痕跡

**Files:**
- Modify: `package.json`（移除 jest devDeps）
- Delete: `jest.config.js`
- Delete: 空的 `src/__tests__/` 資料夾

- [ ] **Step 1：移除 jest 相關 devDependencies**

Run：
```bash
pnpm remove jest babel-jest jest-environment-jsdom
```

Expected：`package.json` 中 `jest`、`babel-jest`、`jest-environment-jsdom` 三條 devDependencies 消失。

- [ ] **Step 2：刪除 `jest.config.js`**

Run：
```bash
git rm jest.config.js
```

- [ ] **Step 3：刪除空的 `src/__tests__/`**

Run：
```bash
rmdir src/__tests__ 2>/dev/null || true
```

> 若 `src/__tests__/` 已被前面 `git rm` 自動清空，這條會成功；若不存在則無動作。

- [ ] **Step 4：驗證沒有殘留的 jest 參照**

Run：
```bash
git grep -nE 'jest\.(fn|mock|Mock|useFakeTimers|useRealTimers|advanceTimersByTime)' -- src tests
```

Expected：無輸出。

Run：
```bash
grep -E '"(jest|babel-jest|jest-environment-jsdom)"' package.json || echo "clean"
```

Expected：印出 `clean`。

- [ ] **Step 5：Commit**

```bash
git add package.json pnpm-lock.yaml jest.config.js
git commit -m "chore: remove jest and legacy test configuration"
```

> 若 `git status` 還顯示 `src/__tests__/` 為刪除，一併 `git add` 進來。

---

## Task 11：最終驗證

**Files:** 無

- [ ] **Step 1：完整跑一次測試**

Run：
```bash
pnpm test
```

Expected：6 tests passed（分布在 6 個檔）、退出碼 0。

- [ ] **Step 2：完整跑一次 production build**

Run：
```bash
pnpm build
```

Expected：build 成功、退出碼 0。

- [ ] **Step 3：最後一次驗證沒有殘留**

Run：
```bash
git grep -nE 'jest\.(fn|mock|Mock|useFakeTimers|useRealTimers|advanceTimersByTime)' -- src tests
```

Expected：無輸出。

Run：
```bash
test -f jest.config.js && echo "STILL EXISTS" || echo "ok"
```

Expected：印出 `ok`。

- [ ] **Step 4：（無需 commit，本任務只是驗證）**

如所有驗證通過，遷移完成。

---

## Risks & Mitigations

- **vitest 與 vite 8 peer 不相容**：Task 1 Step 1 會先檢查；若不相容停下回報，不擅自降 vite。
- **`tanstackRuntime.mjs` ESM/CJS interop**：Vitest 沿用 vite transform，應與 dev server 行為一致；Task 6 Step 3 萬一失敗，從錯誤訊息開始查，不要急著改寫 import。
- **`vi.useFakeTimers()` 預設行為差異**：預設多 fake 些 timer 種類（如 `queueMicrotask`），但本案僅用 `setTimeout` + `advanceTimersByTime`，行為等價。若 `NotificationContext.test.tsx` 異常，可考慮 `vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })`。
- **`vi.mock` hoist 行為**：與 `jest.mock` 一致皆會 hoist 到頂層；現有寫法（先宣告 `mockRefetch = vi.fn()` 再 `vi.mock(...)`）能正常運作，因為 hoist 後對外引用的 `mockRefetch` 仍可被 factory 內捕獲（變數宣告也會 hoist，但賦值在 mock factory 呼叫時才執行；factory 在每次 import 時才求值）。
