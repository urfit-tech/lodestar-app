# Jest → Vitest 遷移設計

- 日期：2026-05-12
- 對象專案：`lodestar-app`
- 目前狀態：已 React 17 + Vite 8 化，測試仍跑在 Jest 26 + babel-jest

## 背景與目標

專案 build pipeline 已換成 Vite 8 (`vite.config.ts`)，但測試仍由 Jest 26 + `babel-jest` 執行。這帶來兩套互相獨立的 transform pipeline：

- Vite 端：esbuild/oxc + 多支自訂 plugin（`react-compiler`、`craSvgComponentPlugin`、`chakraStyledSystemCompatPlugin`、`lodestarAppElementCompatPlugin`、antd style import、`@/` alias 等）。
- Jest 端：`babel-jest` 搭 `@babel/preset-env / preset-react / preset-typescript`，並以 `transformIgnorePatterns` 特例豁免 `lodestar-app-element`，以 `moduleNameMapper` 處理 `react-router` / `react-router-dom`。

目標是讓測試共用 Vite 的 transform pipeline，消除上述重複設定，並把測試檔從 source code 樹中抽離至 `tests/`，同時引入 `@/` alias 讓 import 更穩定。

非目標：
- 不重寫測試到 `@testing-library/react`（仍維持 `react-dom` + `react-dom/test-utils`）。
- 不變動 `.intl.babelrc`（為 `trans:compile` 抽 react-intl messages 用，與測試無關）。
- 不引入 coverage、UI、watch 額外 script（YAGNI）。
- 不調整 CI workflow（既有 `.github/workflows/*` 沒有跑 `pnpm test`，pre-commit 只跑 `lint-staged`）。

## 現況盤點

### 測試檔（6 個）

| 路徑 | Jest API 使用 |
|---|---|
| `src/__tests__/AppPageRouteFallback.test.ts` | 無 mock，只用 `describe/it/expect` |
| `src/components/common/routerPath.test.ts` | 無 mock |
| `src/contexts/AppProviderStability.test.tsx` | `jest.fn`、`jest.mock('@apollo/client', …)`、`jest.Mock`（型別） |
| `src/contexts/NotificationContext.test.tsx` | `jest.fn`、`jest.mock('../hooks/data', …)`、`jest.useFakeTimers`、`jest.useRealTimers`、`jest.advanceTimersByTime` |
| `src/hooks/ebook.test.tsx` | `jest.fn`、`jest.mock('@apollo/client', …)` |
| `src/router/tanstackRuntime.test.tsx` | 無 mock，匯入 `tanstackRuntime.mjs` |

全部使用 `react-dom` 的 `render` / `unmountComponentAtNode` + `react-dom/test-utils` 的 `act`，沒有用 `@testing-library/react`。

### Jest 設定（`jest.config.js`）

- `testEnvironment: 'jsdom'`
- `transform`: `babel-jest` 搭三支 preset
- `moduleNameMapper`: 把 `react-router` / `react-router-dom` 映射到 `src/router/reactRouterCompat.tsx`
- `transformIgnorePatterns`: 豁免 `lodestar-app-element` 讓 Jest transform 它
- `moduleFileExtensions`: `ts, tsx, js, jsx, mjs, json`

### Vite 設定相關

- `vite.config.ts` 的 `resolve.alias` 已經把 `react-router` / `react-router-dom` 映射到 compat shim — Vitest 沿用即可。
- `vite.config.ts` 的 `define` 設定 `process.env.NODE_ENV` 等，Vitest 透過 `mergeConfig` 沿用。
- `tsconfig.json`：`baseUrl: "."`、已有 `paths` 設 `react-router(-dom)`、`include: ["src"]`、`types: ["vite/client"]`。

## 設計

### 整合方式：獨立 `vitest.config.ts` + `mergeConfig` 沿用 `vite.config.ts`

考慮兩種方式：

1. **獨立 `vitest.config.ts`，`mergeConfig` 沿用** ← 採用
2. 在 `vite.config.ts` 同檔加 `test` 區塊

採用 1 的理由：production build config 不被 vitest 型別與測試專屬欄位污染；測試設定獨立檔較好維護；缺點僅是多解析一份 config，可忽略。

### 套件變動

移除：
- `jest@26.6.0`
- `babel-jest@26.6.3`
- `jest-environment-jsdom@26.6.2`

新增（devDependencies）：
- `vitest` — 須挑與 `vite@^8.0.11` 相容的版本（安裝前用 `pnpm view vitest peerDependencies` 確認 peer range）。若 vitest 尚未支援 vite 8，停下並回報，不強行降版 vite。
- `jsdom`

保留：
- `.intl.babelrc`（給 `trans:compile` 用）

### 設定檔變動

#### 新增 `vitest.config.ts`（repo root）

```ts
/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfigFactory from './vite.config'

// mode: 'development' 而非 'test'，讓 vite.config.ts 內的 loadEnv() 能讀到 .env.development，
// 進而把 VITE_* 變數注入 define 區塊（process.env.REACT_APP_*）。
// command: 'serve' 讓 nodeEnv 解析為 'development'。
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

- `globals: true` 提供 `describe / it / expect / beforeEach / afterEach / vi` 全域，免去把這些顯式 import 進每個測試檔。
- `include` 只指向 `tests/`，明確排除 `src/`。

#### 修改 `vite.config.ts`

在 `resolve.alias` 增加：

```ts
'@': path.resolve(__dirname, 'src'),
```

不更動現有的 `react-router` / `react-router-dom` / `ajv` / `jsonwebtoken` alias。

#### 修改 `tsconfig.json`

- `compilerOptions.paths` 增加 `"@/*": ["src/*"]`
- `compilerOptions.types` 從 `["vite/client"]` 改為 `["vite/client", "vitest/globals"]`
- `include` 從 `["src"]` 改為 `["src", "tests"]`

#### 刪除 `jest.config.js`

`moduleNameMapper` 與 `transformIgnorePatterns` 由 Vite 的 alias 與 transform pipeline 取代，不需要在 Vitest 端重複。

### 檔案搬移

從 `src/**/*.test.{ts,tsx}` 搬到 `tests/`，鏡像目錄結構：

| 原路徑 | 新路徑 |
|---|---|
| `src/__tests__/AppPageRouteFallback.test.ts` | `tests/AppPageRouteFallback.test.ts` |
| `src/components/common/routerPath.test.ts` | `tests/components/common/routerPath.test.ts` |
| `src/contexts/AppProviderStability.test.tsx` | `tests/contexts/AppProviderStability.test.tsx` |
| `src/contexts/NotificationContext.test.tsx` | `tests/contexts/NotificationContext.test.tsx` |
| `src/hooks/ebook.test.tsx` | `tests/hooks/ebook.test.tsx` |
| `src/router/tanstackRuntime.test.tsx` | `tests/router/tanstackRuntime.test.tsx` |

搬完後刪掉空的 `src/__tests__/` 資料夾。

### Import 改寫（搬移後一起做）

搬到 `tests/` 後，所有對 source 的相對 import 改用 `@/` alias，避免 `../../src/...` 的脆弱相對路徑：

| 原 import | 新 import |
|---|---|
| `'./NotificationContext'` | `'@/contexts/NotificationContext'` |
| `'../components/common/routeFallback'` | `'@/components/common/routeFallback'` |
| `'./tanstackRuntime.mjs'` | `'@/router/tanstackRuntime.mjs'` |
| `'./ebook'` | `'@/hooks/ebook'` |
| `'./routerPath'` | `'@/components/common/routerPath'` |

第三方 import（如 `lodestar-app-element/src/contexts/AppContext`、`@apollo/client`、`@tanstack/react-router`、`react-dom`、`react-dom/test-utils`）不動。

### Jest API → Vitest API 替換

機械式替換，全程約 15 處：

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.fn((args) => …)` | `vi.fn((args) => …)` |
| `jest.mock('mod', factory)` | `vi.mock('mod', factory)` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.useRealTimers()` | `vi.useRealTimers()` |
| `jest.advanceTimersByTime(n)` | `vi.advanceTimersByTime(n)` |
| `jest.Mock`（型別） | `Mock`（從 `'vitest'` import） |

`vi` 由 `globals: true` 自動提供，不需 import；但 `Mock` 型別必須顯式 `import type { Mock } from 'vitest'`。

範例（`AppProviderStability.test.tsx` 頂端）：

```ts
import type { Mock } from 'vitest'

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
```

行為等價性說明：
- `vi.mock` 與 `jest.mock` 同樣會 hoist 到檔案頂端，現有 mock 寫法照搬即可。
- `vi.useFakeTimers()` 預設多 fake 一些 timer 種類（`queueMicrotask` 等），但本案只用 `setTimeout` + `advanceTimersByTime`，行為等價。

### scripts 變動

`package.json`：

```jsonc
// 改前
"test": "jest --passWithNoTests --watchAll=false",
// 改後
"test": "vitest run --passWithNoTests"
```

不新增 `test:watch`、`test:ui`、`test:coverage`（YAGNI，之後需要再加）。

## 遷移執行順序

刻意把「裝新環境並驗證能跑」與「移除舊 deps」分開，避開中間 broken state：

1. 安裝 `vitest`、`jsdom`（保留 jest 相關 deps）
2. 改 `tsconfig.json`（加 `@/*` paths、加 `tests` include、加 `vitest/globals` types）
3. 改 `vite.config.ts`（加 `@` alias）
4. 新增 `vitest.config.ts`
5. 建立 `tests/` 並搬移 6 個測試檔
6. 在 `tests/` 內做 import 改寫（`@/`）與 jest → vi 替換
7. 改 `package.json` 的 `test` script
8. 跑 `pnpm test`，6 個測試全綠才往下
9. 移除 jest、babel-jest、jest-environment-jsdom
10. 刪除 `jest.config.js`
11. 刪除空的 `src/__tests__/`
12. 再跑一次 `pnpm test` 與 `pnpm build` 確認沒回歸

## 成功判準

- `pnpm test` 退出碼為 0，6 個測試全 pass。
- `pnpm build` 不出錯（驗證 `vite.config.ts` 的 alias 改動沒影響 production build）。
- 以下指令無結果（除 lockfile 外）：
  ```sh
  git grep -nE 'jest\.(fn|mock|Mock|useFakeTimers|useRealTimers|advanceTimersByTime)' src tests
  ```
- `package.json` 不再含 `jest` / `babel-jest` / `jest-environment-jsdom`。
- 不存在 `jest.config.js`。

## 風險與緩解

- **vitest × vite 8 相容性**：vite 8 為較新版本，需確認 vitest peer 範圍。執行步驟 1 前用 `pnpm view vitest peerDependencies` 檢查；若不相容，停下回報，不擅自降 vite 版本。
- **vite plugin 在 test 環境的副作用**：`react-compiler`、`craSvgComponentPlugin`、`chakraStyledSystemCompatPlugin`、`lodestarAppElementCompatPlugin` 在測試環境也會跑——這正是用 `mergeConfig` 想要的效果（取代原本 `transformIgnorePatterns` 對 lodestar-app-element 的特例豁免）。預期行為一致，但需在步驟 8 觀察測試 console 是否有新 warning。
- **`globals: true` 與 TS 型別**：`Mock` 型別必須顯式 `import type from 'vitest'`，不依賴 globals — 不會發生「能跑但型別錯」的情況。
- **moduleNameMapper 失效**：原 `jest.config.js` 的 `react-router(-dom)` 映射已由 `vite.config.ts` 的 `resolve.alias` 同等覆蓋，不需在 Vitest 額外補。

## 不在本次範圍

- 將測試改寫到 `@testing-library/react`
- 加 coverage、UI、watch 等額外 scripts
- 重寫任何 source code
- 變動 CI workflow 或 pre-commit hook
- 動 `.intl.babelrc` 或 `trans:compile` pipeline
