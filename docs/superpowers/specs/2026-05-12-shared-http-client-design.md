# Shared HTTP Client 設計

- 日期：2026-05-12
- 對象專案：`lodestar-app-element`、`lodestar-app`
- 目標版本：`axios@1.16.0`（2026-05-12 以 `pnpm view axios version` 確認）
- 發布目標：`lodestar-app-element` 新 commit + 新 tag，`lodestar-app` 更新 tag dependency 並重生 `pnpm-lock.yaml`

## 背景與目標

`lodestar-app` 與 `lodestar-app-element` 目前有多處直接 import axios 並自行組 URL、headers、錯誤處理與 response parsing。GraphQL 已經透過 Apollo client 集中管理 auth token，但 REST 呼叫仍分散在 helpers、hooks、contexts、components、pages 和 services 裡。

這次目標是把 REST HTTP 邊界收斂到 `lodestar-app-element`，讓 element 與 app 共用同一套 factory、domain clients、response helper 和 error helper，同時把 axios 從 `0.21.4` 升級到 `1.16.0` 並完整修正 axios 1.x 相容性。

成功標準：

- `lodestar-app-element` 提供可被 `lodestar-app` 直接引用的 shared HTTP module。
- `lodestar-app-element/src` 與 `lodestar-app/src` 裡可安全分類的 backend REST 呼叫改用 shared clients。
- 直接 backend axios 呼叫不再散落在 feature code；只留下明確例外。
- `CancelToken` 等 axios 0.x 舊模式清除，改成 axios 1.x 推薦模式。
- `lodestar-app-element` commit、push、tag 成功，`lodestar-app` package.json 與 lockfile 更新到新 tag。

非目標：

- 不把 GraphQL Apollo client 改寫成 axios 或 shared HTTP。
- 不把 presigned S3 URL、外部 IP/geolocation API、完整外部 URL 強行套進 backend clients。
- 不重構 backend API response schema。
- 不重新設計 auth/session 流程，只讓 REST client 使用既有 auth token。

## 現況盤點

`lodestar-app` 目前依賴：

```json
"lodestar-app-element": "urfit-tech/lodestar-app-element#v1.95.7",
"axios": "0.21.4"
```

`lodestar-app-element` 目前也使用 `axios@0.21.4`，最新本地 tag 為 `v1.95.7`。`lodestar-app` 的 pnpm lockfile 會把 GitHub tag resolved 到 commit tarball，因此 element 發新 tag 後，app 需要更新 package.json 並跑 `pnpm install`。

HTTP backend base 分成三組：

| backend | env in `lodestar-app` | legacy env in `lodestar-app-element` | route owner |
|---|---|---|---|
| app backend | `VITE_API_BASE_ROOT` | `REACT_APP_API_BASE_ROOT` | `lodestar-app-backend` |
| lodestar server | `VITE_LODESTAR_SERVER_ENDPOINT` | `REACT_APP_LODESTAR_SERVER_ENDPOINT` | `lodestar-server` |
| kolable server | `VITE_KOLABLE_SERVER_ENDPOINT` | `REACT_APP_KOLABLE_SERVER_ENDPOINT` | `kolable-server` |

已知 raw axios 例外：

- presigned S3 upload/download URL：URL 是 backend 回傳的完整 signed URL，不能套 backend baseURL 或 auth interceptor。
- `https://ipapi.co/json/`、`https://api.ipify.org/`：第三方外部服務。
- caller 傳入的完整 URL，例如部分 download/material link。

## 採用方案

採用「shared factory + domain clients + lazy token getter」。

不採用單一 global axios instance，因為這個 app 同時打三個 backend 與外部 URL；單一 instance 會讓 baseURL、Authorization、withCredentials 和 error shape 混在一起。

不採用 React Provider 作為唯一入口，因為不少 REST 呼叫在 helper/service 中，不適合強依賴 React hooks。React component/hook 可以在自己的 scope 內建立 client 或取得 module helper，但 shared HTTP module 本身保持純 TypeScript。

## Module 設計

新增於 `lodestar-app-element/src/services/http/`：

```text
src/services/http/
  index.ts
  types.ts
  error.ts
  response.ts
  factory.ts
  clients.ts
```

### `types.ts`

提供 shared 型別：

```ts
export type GetAuthToken = () => string | null | undefined

export type StandardApiResponse<T> = {
  code: string
  message?: string
  result: T
}

export type HttpClientOptions = {
  baseURL: string | undefined
  getAuthToken?: GetAuthToken
  withCredentials?: boolean
  timeoutMs?: number
}
```

`baseURL` 允許 `undefined` 是為了讓缺 env 時能在 factory 裡丟出一致錯誤，而不是 call site 自己組出 `"undefined/path"`。

### `error.ts`

提供專案自己的 error surface：

```ts
export class ApiError extends Error {
  code?: string
  status?: number
  details?: unknown
  isNetworkError: boolean
}

export const isApiError = (error: unknown): error is ApiError
export const normalizeHttpError = (error: unknown): ApiError
```

`normalizeHttpError` 使用 `axios.isAxiosError` 判斷 axios 1.x error，抽出：

- HTTP status
- backend `code`
- backend `message`
- response data
- network/no-response 狀態

feature code 只依賴 `ApiError`，不直接依賴 axios error shape。

### `response.ts`

提供 response helper：

```ts
export const unwrapApiResponse = <T>(data: StandardApiResponse<T>): T
export const isStandardApiResponse = <T = unknown>(data: unknown): data is StandardApiResponse<T>
```

不強迫所有 request 自動 unwrap，因為 `lodestar-server` 多數 endpoint 目前回傳 raw data，而 `lodestar-app-backend` 多數 endpoint 回傳 `{ code, message, result }`。call site 應明確選擇：

- `client.request<T>()`：回傳 raw response data。
- `client.requestResult<T>()`：期待 standard response，成功時回傳 `result`，失敗時丟 `ApiError`。

### `factory.ts`

`createHttpClient(options)` 包 axios instance：

- 設定 `baseURL`。
- 設定有限 timeout，預設 `15000` ms。
- request interceptor 每次 request 前呼叫 `getAuthToken()`，動態寫入 `Authorization: Bearer ...`。
- 不使用 module global token state。
- 不預設 `withCredentials`，需要 cookie 的 auth/payment request 由 call site 或 domain helper 明確指定。
- response interceptor 不自動 unwrap；只負責 normalize error。

headers 必須用 axios 1.x 型別安全寫法，不在各 call site 散落 cast。

### `clients.ts`

提供 domain factory：

```ts
export const createAppBackendClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string }) => ...
export const createLodestarServerClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string }) => ...
export const createKolableServerClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string }) => ...
```

也提供 env resolver：

```ts
export const resolveAppBackendBaseUrl = () =>
  process.env.REACT_APP_API_BASE_ROOT || importMetaEnv('VITE_API_BASE_ROOT')
```

實作要避免直接在 CRA 編譯環境使用不存在的 `import.meta.env` 語法。`lodestar-app-element` 原始碼會被 CRA 和 Vite 兩種環境消費，因此 env resolver 需要以安全方式讀取：

- CRA build：`process.env.REACT_APP_*`
- Vite consuming app：目前 `vite.config.ts` 已把 `VITE_*` 映射成 `process.env.REACT_APP_*`，所以 shared module 可以優先使用 `process.env.REACT_APP_*`
- app 專屬 wrapper 若需要，也可從 `import.meta.env.VITE_*` 顯式傳 baseURL 進 factory

## Auth Token 策略

採用 lazy getter：

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})
```

理由：

- 避免登入、refresh token、switch member 後 client 仍持有舊 token。
- 避免全域 `setAuthToken()` 導致測試或多 member context 污染。
- 保留 helper/service 使用彈性。

token optional 的 endpoint 不會強制帶 header；getter 回傳空值時不寫 `Authorization`。

## Axios 1.16 完整遷移策略

這次不採用「最小修正保留可跑」。升級 axios 時要主動把 axios 0.x 舊模式清掉。

必做項目：

- `axios@0.21.4` 升級為 `axios@1.16.0`。
- `CancelToken.source()` 全部改成 `AbortController` + `signal`。
- error 判斷改用 `axios.isAxiosError`。
- error 對外輸出改用 `ApiError`。
- request interceptor headers 以 axios 1.x 相容型別設定。
- 不讓 call site 直接依賴 axios 0.x 的 response/error 細節。
- 如遇 endpoint response shape 不一致，建立明確 endpoint helper，而不是用 `any` 混過。

已知要處理的 call site：

- `lodestar-app/src/hooks/program.ts` 的 program content fetch 目前使用 `CancelToken`，需改為 `AbortController`。

如果 axios 1.x 造成 TypeScript 或 runtime 差異，處理原則是修到乾淨可維護，不用舊 API workaround。

## Migration Scope

### `lodestar-app-element`

要改用 shared clients 的區域：

- `src/contexts/AuthContext.tsx`
- `src/hooks/checkout.ts`
- `src/hooks/data.ts`
- `src/helpers/index.ts`
- `src/helpers/conversionApi.ts`
- `src/components/common/AIBot.tsx`
- `src/components/modals/CouponSelectionModal.tsx`
- `src/components/modals/CheckoutProductModal.tsx`

其中 auth/register/login/refresh/sms/switch-member/force-login 等需要 cookie 的 request，保留 `withCredentials: true` 但透過 client request options 明確指定，不做全域設定。

### `lodestar-app`

要改用 shared clients 的區域：

- `src/helpers/index.ts`
- `src/hooks/task.ts`
- `src/hooks/checkout.ts`
- `src/hooks/payment.ts`
- `src/hooks/program.ts`
- `src/hooks/activity.ts`
- `src/hooks/programPackage.ts`
- `src/hooks/merchandise.ts`
- `src/hooks/activityTicket.ts`
- `src/hooks/voucher.ts`
- `src/hooks/issue.ts`
- `src/contexts/PodcastPlayerContext.tsx`
- `src/contexts/MediaPlayerContext.tsx`
- `src/contexts/ProgressContext.tsx`
- `src/services/orderPayment/OrderPaymentStrategy.ts`
- backend-bound axios calls in pages/components such as payment, meeting, voucher, member class, profile, program content, appointment, sale/refund

可保留 direct axios 或外部 helper 的例外：

- presigned S3 URL `PUT`
- `downloadFile` with arbitrary full URL config
- `ipapi.co` geolocation
- `api.ipify.org`
- material/ebook/full external URL fetch
- type-only imports such as `AxiosPromise` if still needed

遷移後要用 `rg` 確認剩餘 `import axios from 'axios'` 與 `Axios from 'axios'` 只出現在上述例外或 shared HTTP module。

## Package 與發布流程

### `lodestar-app-element`

1. 更新 `package.json` 的 `axios` 到 `1.16.0`。
2. 更新 lockfile；此 repo 目前有 `yarn.lock`，需用 repo 既有 package manager 更新。
3. 實作 shared HTTP module 與 call site 遷移。
4. 跑可用的 build/type/test 驗證。
5. commit。
6. 建 tag。若 implementation 前最新 tag 仍是 `v1.95.7`，新 tag 使用 `v1.95.8`；若最新 tag 已變，先重新檢查後遞增。
7. push commit 與 tag 到 `origin`。

### `lodestar-app`

1. 更新 `package.json`。以目前已確認的 tag 狀態，預期更新為：

```json
"axios": "1.16.0",
"lodestar-app-element": "urfit-tech/lodestar-app-element#v1.95.8"
```

若 implementation 前 `lodestar-app-element` 最新 tag 已不是 `v1.95.7`，先用實際新建的 tag 取代 `v1.95.8`。

2. 跑 `pnpm install`，更新 `pnpm-lock.yaml`。
3. 遷移 `src` call sites。
4. 跑 verification。
5. commit app 端變更。

## Verification

最低驗證：

### `lodestar-app-element`

- package manager install/update 成功。
- TypeScript 或 build script 可跑則必跑。
- 若 CRA/Node 14/本機 Node 版本造成 build blocker，記錄 blocker 與已完成的替代驗證。
- `rg` 確認 direct backend axios calls 已收斂。

### `lodestar-app`

- `pnpm install` 成功。
- `pnpm build` 成功。
- 針對 touched hooks/helpers/components 的既有 tests 可跑則執行。
- `rg` 確認 direct backend axios calls 已收斂，只剩明確例外。

### Manual Risk Checks

- 登入/refresh/switch member 仍帶 cookie 與 Bearer token。
- 上傳 signed URL 不會被 backend client 的 baseURL 或 auth interceptor 影響。
- `lodestar-server` raw data endpoint 不被錯誤 unwrap。
- payment/order endpoints 的 `{ code, message, result }` 錯誤會轉成 `ApiError`。

## 風險與緩解

| 風險 | 緩解 |
|---|---|
| axios 1.x headers 型別與 interceptor API 差異 | 全部集中在 `factory.ts`，feature code 不碰 axios headers 型別 |
| `lodestar-app-element` 同時被 CRA 與 Vite 消費 | shared module 主要讀 `process.env.REACT_APP_*`，app 端也可顯式傳入 Vite env |
| 不同 backend response shape 不一致 | 分離 `request` 與 `requestResult`，不做全域自動 unwrap |
| token stale | 使用 lazy `getAuthToken()`，不使用 global token setter |
| presigned/external URL 被誤套 interceptor | 明確列為 raw axios/external helper 例外 |
| tag 在 implementation 前已被別人推進 | 建 tag 前重新讀最新 tag，再遞增 |

## 實作邊界

這份 spec 的 implementation 應分兩個 commit stream：

1. `lodestar-app-element`：shared HTTP module、axios 升級、element call site 遷移、tag 發布。
2. `lodestar-app`：更新 element tag dependency、axios 升級、pnpm install、app call site 遷移。

兩邊都要避免碰 unrelated local changes。若任一 repo 在 implementation 開始時不是 clean worktree，先盤點差異並只操作本任務相關檔案。
