# Shared HTTP Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move backend REST calls in `lodestar-app-element` and `lodestar-app` onto shared HTTP clients while upgrading both repos to `axios@1.16.0`.

**Architecture:** `lodestar-app-element` owns a pure TypeScript HTTP module with factory, domain clients, response helpers, and normalized errors. `lodestar-app` consumes that module through the Git tag dependency, then migrates backend-bound call sites while leaving presigned and external full-URL requests explicit.

**Tech Stack:** React 17, TypeScript 4.4, Axios 1.16, CRA in `lodestar-app-element`, Vite 8 + pnpm in `lodestar-app`, Git tag dependency.

---

## File Structure

### `lodestar-app-element`

- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/types.ts`
  - Shared public types: token getter, standard API response, request config, client interface.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.ts`
  - `ApiError`, `isApiError`, `normalizeHttpError`.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.ts`
  - `isStandardApiResponse`, `unwrapApiResponse`.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/factory.ts`
  - Axios 1.x instance factory, token interceptor, response/error behavior.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/clients.ts`
  - Backend-specific factories and env resolvers.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/index.ts`
  - Public exports.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.test.ts`
  - Response helper tests.
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.test.ts`
  - Error normalization tests.
- Modify: `/Users/eddy/urfit/lodestar-app-element/package.json`
  - Upgrade `axios` to `1.16.0`.
- Modify: `/Users/eddy/urfit/lodestar-app-element/yarn.lock`
  - Regenerate after dependency update.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/contexts/AuthContext.tsx`
  - Replace backend axios calls with `createAppBackendClient`.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/hooks/checkout.ts`
  - Replace checkout/order backend calls.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/hooks/data.ts`
  - Replace lodestar-server call.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/helpers/index.ts`
  - Replace sign-url backend calls; preserve presigned PUT raw axios.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/helpers/conversionApi.ts`
  - Replace tracking backend call.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/common/AIBot.tsx`
  - Replace openai chat backend call.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/modals/CouponSelectionModal.tsx`
  - Replace exchange backend call.
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/modals/CheckoutProductModal.tsx`
  - Replace credit-card backend call.

### `lodestar-app`

- Modify: `/Users/eddy/urfit/lodestar-app/package.json`
  - Upgrade `axios` to `1.16.0` and update `lodestar-app-element` to the new tag.
- Modify: `/Users/eddy/urfit/lodestar-app/pnpm-lock.yaml`
  - Regenerate after `pnpm install`.
- Modify: `/Users/eddy/urfit/lodestar-app/src/helpers/index.ts`
  - Replace app backend and lodestar-server calls; preserve presigned PUT and arbitrary download URL.
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/task.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/checkout.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/payment.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/program.ts`
  - Replace backend calls and migrate `CancelToken` to `AbortController`.
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/activity.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/programPackage.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/merchandise.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/activityTicket.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/voucher.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/issue.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/PodcastPlayerContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/MediaPlayerContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/ProgressContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/services/orderPayment/OrderPaymentStrategy.ts`
- Modify backend-bound page/component call sites found by the verification search in Task 8.

---

### Task 1: Preflight And Version Guard

**Files:**
- Read: `/Users/eddy/urfit/lodestar-app/package.json`
- Read: `/Users/eddy/urfit/lodestar-app-element/package.json`
- Read: `/Users/eddy/urfit/lodestar-app-element/yarn.lock`

- [ ] **Step 1: Verify both worktrees before editing**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app status --short
git -C /Users/eddy/urfit/lodestar-app-element status --short
```

Expected: no output. If either repo has output, inspect it and avoid touching unrelated files.

- [ ] **Step 2: Re-check latest element tag**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app-element fetch --tags origin
git -C /Users/eddy/urfit/lodestar-app-element tag --sort=-version:refname | sed -n '1,5p'
```

Expected first line: `v1.95.7`. If the first line differs, set `ELEMENT_TAG` to the next patch tag after that value and use it in every later command and package edit.

- [ ] **Step 3: Re-check axios latest**

Run:

```bash
pnpm view axios version
```

Expected: `1.16.0`. If npm returns a newer version, use that newer version only after checking axios release notes and adjusting this plan for new breaking changes.

- [ ] **Step 4: Keep a direct-call baseline**

Run:

```bash
rg -n "from ['\"]axios['\"]|Axios from ['\"]axios['\"]|axios\\.(get|post|put|patch|delete|request)|Axios\\.(get|post|put|patch|delete|request)|axios\\s*\\(|Axios\\s*\\(" /Users/eddy/urfit/lodestar-app-element/src /Users/eddy/urfit/lodestar-app/src > /private/tmp/lodestar-axios-baseline.txt
wc -l /private/tmp/lodestar-axios-baseline.txt
```

Expected: baseline file exists and has nonzero line count.

---

### Task 2: Add Element HTTP Module Tests

**Files:**
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.test.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.test.ts`

- [ ] **Step 1: Create response helper tests**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.test.ts`:

```ts
import { ApiError } from './error'
import { isStandardApiResponse, unwrapApiResponse } from './response'

describe('HTTP response helpers', () => {
  it('detects standard backend responses', () => {
    expect(isStandardApiResponse({ code: 'SUCCESS', result: { id: 'order_1' } })).toBe(true)
    expect(isStandardApiResponse({ result: { id: 'order_1' } })).toBe(false)
    expect(isStandardApiResponse(null)).toBe(false)
  })

  it('unwraps SUCCESS result payloads', () => {
    expect(unwrapApiResponse({ code: 'SUCCESS', message: 'ok', result: { link: 'https://example.com' } })).toEqual({
      link: 'https://example.com',
    })
  })

  it('throws ApiError for non-success backend responses', () => {
    expect(() => unwrapApiResponse({ code: 'E_FORBIDDEN', message: 'Forbidden', result: null })).toThrow(ApiError)
  })
})
```

- [ ] **Step 2: Create error normalization tests**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.test.ts`:

```ts
import { ApiError, isApiError, normalizeHttpError } from './error'

describe('HTTP error helpers', () => {
  it('keeps existing ApiError instances', () => {
    const original = new ApiError('Original message', { code: 'E_ORIGINAL', status: 409 })

    expect(normalizeHttpError(original)).toBe(original)
    expect(isApiError(original)).toBe(true)
  })

  it('normalizes axios response errors', () => {
    const error = normalizeHttpError({
      isAxiosError: true,
      message: 'Request failed with status code 403',
      response: {
        status: 403,
        data: {
          code: 'E_FORBIDDEN',
          message: 'Forbidden',
          result: { reason: 'missing permission' },
        },
      },
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error.code).toBe('E_FORBIDDEN')
    expect(error.status).toBe(403)
    expect(error.message).toBe('Forbidden')
    expect(error.isNetworkError).toBe(false)
  })

  it('normalizes axios network errors', () => {
    const error = normalizeHttpError({
      isAxiosError: true,
      message: 'Network Error',
      request: {},
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Network Error')
    expect(error.isNetworkError).toBe(true)
  })

  it('normalizes unknown thrown values', () => {
    const error = normalizeHttpError('broken')

    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('broken')
    expect(error.isNetworkError).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail before implementation**

Run:

```bash
yarn --cwd /Users/eddy/urfit/lodestar-app-element test --watchAll=false src/services/http
```

Expected: FAIL because `./error` and `./response` do not exist.

---

### Task 3: Implement Element HTTP Module

**Files:**
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/types.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/factory.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/clients.ts`
- Create: `/Users/eddy/urfit/lodestar-app-element/src/services/http/index.ts`

- [ ] **Step 1: Add shared types**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/types.ts`:

```ts
import { AxiosRequestConfig } from 'axios'

export type GetAuthToken = () => string | null | undefined

export type StandardApiResponse<T> = {
  code: string
  message?: string | null
  result: T
}

export type HttpClientOptions = {
  baseURL?: string
  getAuthToken?: GetAuthToken
  timeoutMs?: number
  withCredentials?: boolean
}

export type HttpRequestConfig<TData = unknown> = AxiosRequestConfig<TData> & {
  url: string
}

export type HttpClient = {
  request: <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>) => Promise<T>
  requestResult: <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>) => Promise<T>
  get: <T = unknown>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>) => Promise<T>
  post: <T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: Omit<HttpRequestConfig<TData>, 'url' | 'method' | 'data'>,
  ) => Promise<T>
  postResult: <T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: Omit<HttpRequestConfig<TData>, 'url' | 'method' | 'data'>,
  ) => Promise<T>
}
```

- [ ] **Step 2: Add normalized error implementation**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/error.ts`:

```ts
import axios from 'axios'

type ApiErrorOptions = {
  code?: string
  status?: number
  details?: unknown
  isNetworkError?: boolean
}

export class ApiError extends Error {
  code?: string
  status?: number
  details?: unknown
  isNetworkError: boolean

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.details = options.details
    this.isNetworkError = options.isNetworkError ?? false
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

const getBackendCode = (data: unknown) =>
  data && typeof data === 'object' && 'code' in data ? String((data as { code?: unknown }).code || '') : undefined

const getBackendMessage = (data: unknown) =>
  data && typeof data === 'object' && 'message' in data
    ? String((data as { message?: unknown }).message || '')
    : undefined

export const normalizeHttpError = (error: unknown): ApiError => {
  if (isApiError(error)) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    const code = getBackendCode(data)
    const message = getBackendMessage(data) || error.message || code || 'HTTP request failed'

    return new ApiError(message, {
      code,
      status,
      details: data || error.toJSON?.() || error,
      isNetworkError: Boolean(error.request && !error.response),
    })
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { details: error })
  }

  return new ApiError(String(error), { details: error })
}
```

- [ ] **Step 3: Add response helpers**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/response.ts`:

```ts
import { ApiError } from './error'
import { StandardApiResponse } from './types'

export const isStandardApiResponse = <T = unknown>(data: unknown): data is StandardApiResponse<T> =>
  Boolean(data && typeof data === 'object' && 'code' in data && 'result' in data)

export const unwrapApiResponse = <T>(data: StandardApiResponse<T>): T => {
  if (data.code === 'SUCCESS') return data.result

  throw new ApiError(data.message || data.code || 'API request failed', {
    code: data.code,
    details: data,
  })
}
```

- [ ] **Step 4: Add axios factory**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/factory.ts`:

```ts
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'
import { normalizeHttpError } from './error'
import { unwrapApiResponse } from './response'
import { HttpClient, HttpClientOptions, HttpRequestConfig, StandardApiResponse } from './types'

const DEFAULT_TIMEOUT_MS = 15000

const requireBaseURL = (baseURL?: string) => {
  if (!baseURL) {
    throw new Error('HTTP client baseURL is required')
  }
  return baseURL
}

const withAuthHeader = (config: AxiosRequestConfig, token?: string | null) => {
  if (!token) return config

  const headers = AxiosHeaders.from(config.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  config.headers = headers
  return config
}

export const createHttpClient = (options: HttpClientOptions): HttpClient => {
  const instance = axios.create({
    baseURL: requireBaseURL(options.baseURL),
    timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    withCredentials: options.withCredentials,
  })

  instance.interceptors.request.use(config => withAuthHeader(config, options.getAuthToken?.()))

  const request = async <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>): Promise<T> => {
    try {
      const response = await instance.request<T, AxiosResponse<T>, TData>(config)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  const requestResult = async <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>): Promise<T> => {
    const data = await request<StandardApiResponse<T>, TData>(config)
    return unwrapApiResponse(data)
  }

  return {
    request,
    requestResult,
    get: (url, config) => request({ ...config, method: 'GET', url }),
    post: (url, data, config) => request({ ...config, method: 'POST', url, data }),
    postResult: (url, data, config) => requestResult({ ...config, method: 'POST', url, data }),
  }
}
```

- [ ] **Step 5: Add domain clients and env resolvers**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/clients.ts`:

```ts
import { createHttpClient } from './factory'
import { HttpClientOptions } from './types'

const getProcessEnv = (key: string) =>
  typeof process !== 'undefined' && process.env ? process.env[key] : undefined

export const resolveAppBackendBaseUrl = () => getProcessEnv('REACT_APP_API_BASE_ROOT')

export const resolveLodestarServerBaseUrl = () => getProcessEnv('REACT_APP_LODESTAR_SERVER_ENDPOINT')

export const resolveKolableServerBaseUrl = () => getProcessEnv('REACT_APP_KOLABLE_SERVER_ENDPOINT')

export const createAppBackendClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string } = {}) =>
  createHttpClient({
    ...options,
    baseURL: options.baseURL || resolveAppBackendBaseUrl(),
  })

export const createLodestarServerClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string } = {}) =>
  createHttpClient({
    ...options,
    baseURL: options.baseURL || resolveLodestarServerBaseUrl(),
  })

export const createKolableServerClient = (options: Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string } = {}) =>
  createHttpClient({
    ...options,
    baseURL: options.baseURL || resolveKolableServerBaseUrl(),
  })
```

- [ ] **Step 6: Add public exports**

Create `/Users/eddy/urfit/lodestar-app-element/src/services/http/index.ts`:

```ts
export * from './clients'
export * from './error'
export * from './factory'
export * from './response'
export * from './types'
```

- [ ] **Step 7: Upgrade element axios and lockfile**

Run:

```bash
cd /Users/eddy/urfit/lodestar-app-element
yarn add axios@1.16.0
```

Expected: `package.json` contains `"axios": "1.16.0"` and `yarn.lock` has axios 1.16 entries.

- [ ] **Step 8: Run HTTP module tests**

Run:

```bash
yarn --cwd /Users/eddy/urfit/lodestar-app-element test --watchAll=false src/services/http
```

Expected: PASS for `response.test.ts` and `error.test.ts`.

---

### Task 4: Migrate `lodestar-app-element` Backend Calls

**Files:**
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/contexts/AuthContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/hooks/checkout.ts`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/hooks/data.ts`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/helpers/index.ts`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/helpers/conversionApi.ts`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/common/AIBot.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/modals/CouponSelectionModal.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app-element/src/components/modals/CheckoutProductModal.tsx`

- [ ] **Step 1: Import clients where app backend routes are used**

In each file that currently calls `process.env.REACT_APP_API_BASE_ROOT`, add the import:

```ts
import { createAppBackendClient } from '../services/http'
```

Use the correct relative path from the file:

```ts
// src/contexts/AuthContext.tsx
import { createAppBackendClient } from '../services/http'

// src/hooks/checkout.ts
import { createAppBackendClient } from '../services/http'

// src/helpers/index.ts and src/helpers/conversionApi.ts
import { createAppBackendClient } from '../services/http'

// src/components/common/AIBot.tsx
import { createAppBackendClient } from '../../services/http'

// src/components/modals/CouponSelectionModal.tsx and CheckoutProductModal.tsx
import { createAppBackendClient } from '../../services/http'
```

- [ ] **Step 2: Replace auth-context app backend calls**

In `/Users/eddy/urfit/lodestar-app-element/src/contexts/AuthContext.tsx`, create a client inside `AuthProvider`:

```ts
const appBackendClient = useMemo(
  () =>
    createAppBackendClient({
      getAuthToken: () => authToken,
    }),
  [authToken],
)
```

Replace refresh/login/register/social/switch/sms/force-login calls with `request` or `requestResult`. For example, refresh-token becomes:

```ts
const { code, result } = await appBackendClient.request<{
  code: string
  result: { authToken: string }
}>({
  method: 'POST',
  url: '/auth/refresh-token',
  data: { appId, fingerPrintId, geoLocation: { ip, country, countryCode } },
  withCredentials: true,
})
```

General login becomes:

```ts
const { code, message, result } = await appBackendClient.request<{
  code: string
  message: string
  result: { authToken: string }
}>({
  method: 'POST',
  url: '/auth/general-login',
  data: { appId, account, password, fingerPrintId, geoLocation: { ip, country, countryCode } },
  withCredentials: true,
})
```

Switch member becomes:

```ts
return appBackendClient
  .request<{
    code: string
    message: string
    result: { authToken: string }
  }>({
    method: 'POST',
    url: '/auth/switch-member',
    data: { memberId },
    withCredentials: true,
  })
  .then(({ code, result }) => {
    if (code === 'SUCCESS') {
      setAuthToken(result.authToken)
    } else {
      throw new Error(code)
    }
  })
```

- [ ] **Step 3: Preserve GraphQL post-registration calls**

In `AuthContext.tsx`, keep direct `Axios.post(process.env.REACT_APP_GRAPHQL_PH_ENDPOINT, ...)` calls for the GraphQL endpoint unless they are moved to Apollo. These are not REST backend calls and are outside this scope.

- [ ] **Step 4: Replace checkout backend calls**

In `/Users/eddy/urfit/lodestar-app-element/src/hooks/checkout.ts`, change the React import to include `useMemo`:

```ts
import { useCallback, useEffect, useMemo, useState } from 'react'
```

Then create:

```ts
const appBackendClient = useMemo(
  () =>
    createAppBackendClient({
      getAuthToken: () => authToken,
    }),
  [authToken],
)
```

Replace checkout-order:

```ts
appBackendClient
  .request<{
    code: string
    message: string
    result: {
      orderProducts: OrderProductProps[]
      orderDiscounts: OrderDiscountProps[]
      shippingOption: ShippingOptionProps
    }
  }>({
    method: 'POST',
    url: '/payment/checkout-order',
    data: {
      appId,
      productIds,
      discountId,
      shipping,
      options,
    },
  })
```

Replace order/create:

```ts
return appBackendClient
  .request<{
    code: string
    message: string
    result: {
      orderId: string
      totalAmount: number
      paymentNo: string | null
      payToken: string | null
      products: { name: string; price: number }[]
      discounts: { name: string; price: number }[]
    }
  }>({
    method: 'POST',
    url: '/order/create',
    data: {
      clientBackUrl: window.location.origin,
      paymentModel: { type: paymentType, gateway: payment?.gateway, method: payment?.method },
      productIds,
      discountId,
      shipping,
      invoice,
      options,
      tracking: trackingOptions,
    },
  })
```

- [ ] **Step 5: Replace lodestar-server element calls**

In `/Users/eddy/urfit/lodestar-app-element/src/hooks/data.ts`, import:

```ts
import { createLodestarServerClient } from '../services/http'
```

Inside the hook with `authToken`, create:

```ts
const lodestarServerClient = useMemo(
  () =>
    createLodestarServerClient({
      getAuthToken: () => authToken,
    }),
  [authToken],
)
```

Replace:

```ts
const { data } = await axios.get(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}${route}`, {
  headers: { authorization: `Bearer ${authToken}` },
})
```

with:

```ts
const data = await lodestarServerClient.get<CouponFromLodestarAPI[]>(route, {
  params: { memberId, includeDeleted: false },
})
```

Keep the existing `data.map((coupon: CouponFromLodestarAPI) => ...)` mapping unchanged after the fetch.

- [ ] **Step 6: Replace helpers while preserving presigned URL PUT**

In `/Users/eddy/urfit/lodestar-app-element/src/helpers/index.ts`, create a client per helper call:

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})
```

Replace sign-url request with:

```ts
const signedUrl = await appBackendClient.requestResult<string>({
  method: 'POST',
  url: '/sys/sign-url',
  data: {
    operation: 'putObject',
    params: {
      Key: key,
      ContentType: file.type,
    },
  },
})
```

Keep the presigned PUT as raw axios:

```ts
return axios.put<{ status: number; data: string }>(url, file, {
  ...config,
  headers: {
    ...query,
    'Content-Type': file.type,
  },
})
```

- [ ] **Step 7: Replace remaining element backend calls**

For each remaining app backend call, replace full URL string with client-relative URL:

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})

await appBackendClient.request({
  method: 'POST',
  url: '/tracking',
  data: { payload: { data: conversionApiData, trackingType: 'facebook' }, eventName },
})
```

For credit-card calls needing cookies, use:

```ts
await appBackendClient.request({
  method: 'GET',
  url: '/payment/credit-cards',
  withCredentials: true,
})
```

- [ ] **Step 8: Verify element direct axios leftovers**

Run:

```bash
rg -n "from ['\"]axios['\"]|Axios from ['\"]axios['\"]|axios\\.(get|post|put|patch|delete|request)|Axios\\.(get|post|put|patch|delete|request)|axios\\s*\\(|Axios\\s*\\(" /Users/eddy/urfit/lodestar-app-element/src
```

Expected remaining direct uses:

- `src/services/http/*`
- presigned URL PUT in `src/helpers/index.ts`
- GraphQL endpoint posts in `src/contexts/AuthContext.tsx`
- `ipapi.co` in `src/hooks/util.ts`
- type-only imports such as `AxiosPromise`

Any `process.env.REACT_APP_API_BASE_ROOT` or `process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT` direct axios call must be migrated before continuing.

---

### Task 5: Verify, Commit, Tag, And Push `lodestar-app-element`

**Files:**
- Verify changed files in `/Users/eddy/urfit/lodestar-app-element`

- [ ] **Step 1: Run element focused tests**

Run:

```bash
yarn --cwd /Users/eddy/urfit/lodestar-app-element test --watchAll=false src/services/http
```

Expected: PASS.

- [ ] **Step 2: Run element build**

Run:

```bash
yarn --cwd /Users/eddy/urfit/lodestar-app-element build
```

Expected: PASS. If the build fails because the repo requires Node 14 while the current runtime is Node 22, capture the exact error and run the strongest available replacement check:

```bash
yarn --cwd /Users/eddy/urfit/lodestar-app-element test --watchAll=false src/services/http
```

- [ ] **Step 3: Confirm only intended files changed**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app-element status --short
git -C /Users/eddy/urfit/lodestar-app-element diff --stat
```

Expected: changes are limited to HTTP module files, migrated call sites, `package.json`, and `yarn.lock`.

- [ ] **Step 4: Commit element changes**

Run:

```bash
cd /Users/eddy/urfit/lodestar-app-element
git add package.json yarn.lock src/services/http src/contexts/AuthContext.tsx src/hooks/checkout.ts src/hooks/data.ts src/helpers/index.ts src/helpers/conversionApi.ts src/components/common/AIBot.tsx src/components/modals/CouponSelectionModal.tsx src/components/modals/CheckoutProductModal.tsx
git commit -m "feat: add shared http clients"
```

Expected: commit succeeds.

- [ ] **Step 5: Create and push element tag**

Run:

```bash
cd /Users/eddy/urfit/lodestar-app-element
git tag --sort=-version:refname | sed -n '1,3p'
git tag v1.95.8
git push origin master
git push origin v1.95.8
```

Expected: commit and tag push succeed. If latest tag is no longer `v1.95.7`, replace `v1.95.8` with the next patch tag before running `git tag`.

---

### Task 6: Update `lodestar-app` Dependencies

**Files:**
- Modify: `/Users/eddy/urfit/lodestar-app/package.json`
- Modify: `/Users/eddy/urfit/lodestar-app/pnpm-lock.yaml`

- [ ] **Step 1: Update app package.json**

In `/Users/eddy/urfit/lodestar-app/package.json`, set:

```json
"axios": "1.16.0",
"lodestar-app-element": "urfit-tech/lodestar-app-element#v1.95.8"
```

- [ ] **Step 2: Regenerate app lockfile**

Run:

```bash
cd /Users/eddy/urfit/lodestar-app
pnpm install
```

Expected:

- `pnpm-lock.yaml` resolves `axios@1.16.0`.
- `pnpm-lock.yaml` resolves `lodestar-app-element` to the commit behind `v1.95.8`.

- [ ] **Step 3: Verify installed element source exposes HTTP module**

Run:

```bash
test -f /Users/eddy/urfit/lodestar-app/node_modules/lodestar-app-element/src/services/http/index.ts
rg -n "createAppBackendClient|createLodestarServerClient|createKolableServerClient" /Users/eddy/urfit/lodestar-app/node_modules/lodestar-app-element/src/services/http
```

Expected: both commands succeed.

---

### Task 7: Migrate Core `lodestar-app` Helpers, Hooks, Contexts, And Services

**Files:**
- Modify: `/Users/eddy/urfit/lodestar-app/src/helpers/index.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/task.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/checkout.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/payment.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/program.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/activity.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/programPackage.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/merchandise.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/activityTicket.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/voucher.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/hooks/issue.ts`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/PodcastPlayerContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/MediaPlayerContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/contexts/ProgressContext.tsx`
- Modify: `/Users/eddy/urfit/lodestar-app/src/services/orderPayment/OrderPaymentStrategy.ts`

- [ ] **Step 1: Use element clients from app source**

Use this import in app files:

```ts
import {
  createAppBackendClient,
  createKolableServerClient,
  createLodestarServerClient,
} from 'lodestar-app-element/src/services/http'
```

Import only the factories used in each file.

- [ ] **Step 2: Convert app-backend helpers**

In `/Users/eddy/urfit/lodestar-app/src/helpers/index.ts`, replace sign-url and redeem-link backend calls with client calls:

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})

const signedUrl = await appBackendClient.requestResult<string>({
  method: 'POST',
  url: '/sys/sign-url',
  data: {
    operation: 'getObject',
    params: { Key: key },
  },
})
```

For redeem link:

```ts
return await appBackendClient.request<ApiResponse<{ link: string }>>({
  ...config,
  method: 'POST',
  url: '/discount/get-redeem-link',
  data: {
    type,
    target,
  },
})
```

Keep the presigned `axios.put(url, file, ...)` untouched.

- [ ] **Step 3: Convert task/payment/order service calls**

Use `createAppBackendClient({ getAuthToken: () => authToken })` for hook-based files and `createAppBackendClient({ getAuthToken: () => record.authToken })` in `OrderPaymentStrategy.ts`.

Example replacement for `src/hooks/task.ts`:

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})

appBackendClient
  .get<{ code: string; result: typeof task }>(`/tasks/${queue}/${taskId}`)
  .then(({ code, result }) => {
    if (cancelled) return
    setCode(code)
    setTask(result)
    if (!result || !result.finishedOn) {
      timer = setTimeout(() => setRetry(v => v + 1), 1000)
    }
  })
```

Example replacement for `OrderDefaultPaymentStrategy`:

```ts
import { createAppBackendClient, StandardApiResponse } from 'lodestar-app-element/src/services/http'

const appBackendClient = createAppBackendClient({
  getAuthToken: () => record.authToken,
})

const response = await appBackendClient.post<StandardApiResponse<{ taskId: string }>>('/tasks/payment/', {
  orderId: record.orderLogId,
  clientBackUrl: record.clientBackUrl,
  invoiceGatewayId: record.invoiceGatewayId,
})
```

- [ ] **Step 4: Convert lodestar-server hooks**

Use `createLodestarServerClient({ getAuthToken: () => authToken })` for lodestar-server endpoints.

Example replacement:

```ts
const lodestarServerClient = createLodestarServerClient({
  getAuthToken: () => authToken,
})

const data = await lodestarServerClient.get<ProgramContentResponse>(`/programs/${programId}/contents/${contentId}`, {
  signal: controller.signal,
})
```

- [ ] **Step 5: Replace `CancelToken` with `AbortController`**

In `/Users/eddy/urfit/lodestar-app/src/hooks/program.ts`, replace the current `CancelToken` block with:

```ts
useEffect(() => {
  const controller = new AbortController()
  const lodestarServerClient = createLodestarServerClient({
    getAuthToken: () => authToken,
  })

  setLoadingProgramContent(true)

  const getProgramContent = async () => {
    if (programId && contentId) {
      try {
        const data = await lodestarServerClient.get<ProgramContentResponse>(
          `/programs/${programId}/contents/${contentId}`,
          { signal: controller.signal },
        )
        setLoadingProgramContent(false)
        setProgramContent(data)
      } catch (thrown) {
        if (!controller.signal.aborted) {
          console.error(thrown)
          setLoadingProgramContent(false)
        }
      }
    }
  }

  getProgramContent()
  return () => {
    controller.abort()
  }
}, [authToken, contentId, programId])
```

After this replacement, `rg -n "CancelToken|cancelToken" /Users/eddy/urfit/lodestar-app/src /Users/eddy/urfit/lodestar-app-element/src` must return no output.

- [ ] **Step 6: Convert kolable-server calls**

Use `createKolableServerClient({ getAuthToken: () => authToken })`.

Example replacement for Zoom meet creation:

```ts
const kolableServerClient = createKolableServerClient({
  getAuthToken: () => authToken,
})

const response = await kolableServerClient.post<{ code: string; data?: { options?: { startUrl?: string; joinUrl?: string } } }>(
  '/kolable/meets/by-time',
  {
    startedAt,
    endedAt,
    eventId: event.id,
    autoRecording: false,
    service: 'zoom',
    nbfAt: null,
    expAt: null,
    hostMemberId: event.hostMemberId,
  },
)
```

- [ ] **Step 7: Verify core app leftovers**

Run:

```bash
rg -n "VITE_API_BASE_ROOT|VITE_LODESTAR_SERVER_ENDPOINT|VITE_KOLABLE_SERVER_ENDPOINT" /Users/eddy/urfit/lodestar-app/src/helpers /Users/eddy/urfit/lodestar-app/src/hooks /Users/eddy/urfit/lodestar-app/src/contexts /Users/eddy/urfit/lodestar-app/src/services
```

Expected: no backend direct URL composition in migrated files. Remaining matches must be video source URL construction or external full URL construction, not axios backend calls.

---

### Task 8: Migrate Remaining App Page And Component Backend Calls

**Files:**
- Modify backend-bound axios call sites returned by Step 1.

- [ ] **Step 1: Generate the remaining backend call list**

Run:

```bash
rg -n "axios\\.(get|post|put|patch|delete|request)|Axios\\.(get|post|put|patch|delete|request)|axios\\s*\\(|Axios\\s*\\(" /Users/eddy/urfit/lodestar-app/src/pages /Users/eddy/urfit/lodestar-app/src/components > /private/tmp/lodestar-app-remaining-page-component-axios.txt
cat /private/tmp/lodestar-app-remaining-page-component-axios.txt
```

Expected: list includes backend-bound payment, meeting, voucher, profile, program content, appointment, sale/refund calls plus allowed external/presigned calls.

- [ ] **Step 2: Migrate app-backend page/component calls**

For each remaining `VITE_API_BASE_ROOT` call, replace:

```ts
await axios.post(`${import.meta.env.VITE_API_BASE_ROOT}/payment/exchange`, payload, {
  headers: { authorization: `Bearer ${authToken}` },
})
```

with:

```ts
const appBackendClient = createAppBackendClient({
  getAuthToken: () => authToken,
})

await appBackendClient.post('/payment/exchange', payload)
```

For calls requiring cookies, preserve that behavior:

```ts
await appBackendClient.post('/auth/get-oauth-token', payload, {
  withCredentials: true,
})
```

- [ ] **Step 3: Migrate lodestar-server page/component calls**

For each remaining `VITE_LODESTAR_SERVER_ENDPOINT` call, replace:

```ts
await axios.post(`${import.meta.env.VITE_LODESTAR_SERVER_ENDPOINT}/mail-verification-code/send`, payload)
```

with:

```ts
const lodestarServerClient = createLodestarServerClient({
  getAuthToken: () => authToken,
})

await lodestarServerClient.post('/mail-verification-code/send', payload)
```

- [ ] **Step 4: Preserve explicit external and presigned calls**

Do not migrate these shapes:

```ts
await axios.get(materialLink, { responseType: 'blob' })
await axios.get(ebookUrl, config)
Axios.get('https://api.ipify.org/')
axios.get<IpApiResponseSuccess | IpApiResponseFail>('https://ipapi.co/json/')
axios.put(url, file, signedUrlHeaders)
```

Add a short comment only when the exception is easy to misread during future cleanup:

```ts
// Keep raw axios here because this is a presigned full URL, not an app backend route.
```

- [ ] **Step 5: Verify remaining app direct axios calls**

Run:

```bash
rg -n "from ['\"]axios['\"]|Axios from ['\"]axios['\"]|axios\\.(get|post|put|patch|delete|request)|Axios\\.(get|post|put|patch|delete|request)|axios\\s*\\(|Axios\\s*\\(" /Users/eddy/urfit/lodestar-app/src
```

Expected remaining direct uses:

- `src/helpers/index.ts` presigned PUT or arbitrary download URL.
- `src/hooks/util.ts` external geolocation.
- `src/components/contract/ContractBlock.tsx` external IP lookup.
- material/ebook/full external URL fetches.
- type-only axios imports if still required.

No direct axios call may build a URL from `VITE_API_BASE_ROOT`, `VITE_LODESTAR_SERVER_ENDPOINT`, or `VITE_KOLABLE_SERVER_ENDPOINT`.

---

### Task 9: App Verification And Commit

**Files:**
- Verify changed files in `/Users/eddy/urfit/lodestar-app`

- [ ] **Step 1: Run direct-call hygiene checks**

Run:

```bash
rg -n "CancelToken|cancelToken" /Users/eddy/urfit/lodestar-app/src /Users/eddy/urfit/lodestar-app-element/src
rg -n "axios\\.(get|post|put|patch|delete|request)|Axios\\.(get|post|put|patch|delete|request)|axios\\s*\\(|Axios\\s*\\(" /Users/eddy/urfit/lodestar-app/src | rg "VITE_API_BASE_ROOT|VITE_LODESTAR_SERVER_ENDPOINT|VITE_KOLABLE_SERVER_ENDPOINT"
```

Expected: no output.

- [ ] **Step 2: Run focused tests**

Run:

```bash
pnpm --dir /Users/eddy/urfit/lodestar-app test -- tests/hooks/ebook.test.tsx tests/contexts/AppProviderStability.test.tsx tests/contexts/NotificationContext.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run app build**

Run:

```bash
pnpm --dir /Users/eddy/urfit/lodestar-app build
```

Expected: PASS.

- [ ] **Step 4: Inspect app diff**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app status --short
git -C /Users/eddy/urfit/lodestar-app diff --stat
```

Expected: changes are limited to `package.json`, `pnpm-lock.yaml`, the implementation plan if it is being tracked, and migrated source files.

- [ ] **Step 5: Commit app changes**

Run:

```bash
cd /Users/eddy/urfit/lodestar-app
git add package.json pnpm-lock.yaml src docs/superpowers/plans/2026-05-12-shared-http-client.md
git commit -m "refactor: use shared http clients"
```

Expected: commit succeeds.

---

### Task 10: Final Cross-Repo Sanity Report

**Files:**
- Read-only verification across both repos.

- [ ] **Step 1: Capture final element state**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app-element status --short
git -C /Users/eddy/urfit/lodestar-app-element log --oneline -1
git -C /Users/eddy/urfit/lodestar-app-element tag --points-at HEAD
```

Expected:

- `status --short` has no output.
- last commit is `feat: add shared http clients`.
- tag output includes the new element tag.

- [ ] **Step 2: Capture final app state**

Run:

```bash
git -C /Users/eddy/urfit/lodestar-app status --short
git -C /Users/eddy/urfit/lodestar-app log --oneline -2
rg -n '"axios":|"lodestar-app-element":' /Users/eddy/urfit/lodestar-app/package.json
```

Expected:

- `status --short` has no output after commit.
- app log includes the implementation commit and the plan/spec commits.
- package.json shows `axios` at `1.16.0` and element at the new tag.

- [ ] **Step 3: Report verification**

Final report must include:

- New `lodestar-app-element` commit SHA.
- New `lodestar-app-element` tag.
- New `lodestar-app` commit SHA.
- Verification commands run and pass/fail status.
- Any build blocker with exact error text and replacement verification.
