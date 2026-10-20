# 前端型別檢查調查（2026-10-20）

## 結論與範圍

原基準分支就有 TypeScript 4.4.3 無法解析依賴宣告的問題。以相同的 TypeScript 4.9.5 與同一份既有依賴比較，auth PR 新增 10 個診斷，全部在測試檔；未發現 auth 產品程式新增型別錯誤。本次依約只修編譯器、測試型別及 auth 新增問題，保留並列出既有業務診斷。

此分支接續 [auth PR #749](https://github.com/urfit-tech/lodestar-app/pull/749) 的 HEAD；新 draft PR 的 base 仍為 `develop`。應先合併原 auth PR，再合併本 PR。原 PR 尚未合併時，GitHub diff 會包含其 auth 變更；本次新增修正以最後一個 `fix: restore compiler and test typings` commit 為準。原 auth PR 不因本次工作更新。

## 比較證據

- 基準：`ec5a3463f924c7d059c379d7d48d164255ea423c`（`origin/develop`）。
- auth HEAD：`1a8003e1b0b2d728b266fd8727b49d6ece8bc975`。
- 同 repo 的基準、auth、修正後均使用相同既有依賴；修正後僅替換根編譯器並新增 Jest 型別。
- TS 4.4.3 在基準的語法診斷：40 個；原 auth 的 CLI 檢查同樣卡在依賴語法。

| 狀態（TypeScript 4.9.5） | 診斷數 |
| --- | ---: |
| 原基準，尚未補 Jest 型別 | 426 |
| auth HEAD，尚未補 Jest 型別 | 436 |
| 本次修正後 | 32 |

比較鍵為「檔案路徑、TS code、完整訊息」並保留重複次數，忽略行號位移。剩餘 32 個診斷全部能在基準分支以同一編譯器重現；測試檔與 setupTests 的診斷為 0。這代表與 auth 變更無關，不表示原 TS 4.4 已能完成 semantic check。

## 根因與修正

1. 三個 repo 原本固定 TS 4.4.3，但 SWR 2.2.5 使用 `export { type ... }`。學員端另有 react-reader 2.0.4 使用相同語法。這種 inline type modifier 自 [TypeScript 4.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names) 才支援；既有 `skipLibCheck` 無法跳過語法解析。根編譯器升為 4.9.5，符合本地 react-scripts 4.0.3 的 peer range `^3.2.1 || ^4`。
2. 專案測試使用 `jest`、`expect`、`it` 等全域，但未宣告 `@types/jest`。補上 26.0.24，對齊既有 Jest 26。沒有改 tsconfig、排除測試、放寬 strict 或加入錯誤抑制。
3. auth 測試的 Promise mock 原為無回傳型別的 `jest.fn()`，`mockResolvedValue` 參數被推斷為 `never`。改成 `jest.fn<Promise<unknown>, any[]>()`，不改 runtime 測試行為。
4. 另外修正既有 oauthState fixture 的 JSON 與 tuple 型別；補齊 Jest 宣告後顯露的 3 個 TS2345 已歸零。
5. 新增 `yarn typecheck`（`tsc --noEmit`）統一入口；剩餘錯誤仍使命令回傳非零。lockfile 只更新編譯器與 Jest 型別所需 selector，沒有升級業務依賴。

### auth 新增診斷分布（修正前）

| 檔案 | 新增診斷 |
| --- | ---: |
| `src/contexts/AuthContext.test.tsx` | 2 |
| `src/pages/ForgotPasswordPage.test.tsx` | 2 |
| `src/pages/OAuth2Page.test.tsx` | 6 |

## 驗證

- 全部測試：11 suites、157 tests 通過；使用 Node 18.20.8、Jest 26 與既有 react-scripts。
- 完整型別檢查：仍有 32 個既有業務／套件來源診斷，預期 exit 2；不是全綠。
- 已比對 lockfile：Yarn 4 使用 update-lockfile 驗證；Yarn 1 用官方 lockfile parser 比對既有 resolution，未漂移。
- 使用隔離 worktree 與既有 node_modules 的隔離 overlay，另置 TS 4.9.5 與 Jest 型別。未執行從零完整安裝或 production build；測試結果不等同部署驗證。

```sh
yarn typecheck
CI=true NODE_OPTIONS=--openssl-legacy-provider yarn test --watch=false --watchman=false --runInBand
```

## 剩餘既有業務診斷

以下行號取自本次修正後。`node_modules/lodestar-app-element` 是消費端已安裝的套件來源，不是本次 element PR；學員端／後台沒有更換 element tag。完整訊息可用上述 typecheck 命令重現。

| 檔案:行 | Code | 訊息摘要 |
| --- | --- | --- |
| `src/components/appointment/discountOptimization.ts:115` | TS18046 | 'discountsWithPartialDiscount' is of type 'unknown'. |
| `src/components/appointment/discountOptimization.ts:118` | TS2322 | Type 'unknown' is not assignable to type 'DiscountForOptimizer[]'. |
| `src/components/appointment/discountOptimization.ts:119` | TS18046 | 'discountsWithPartialDiscount' is of type 'unknown'. |
| `src/components/common/SuggestItem.tsx:107` | TS2739 | Type '{}' is missing the following properties from type 'Readonly<Omit<MessageReplyCreationFormProps, "form">>': issue, onRefetch, pollingStatus, setPollingStatus |
| `src/components/practice/MessageSuggestItem.tsx:114` | TS2739 | Type '{ onSubmit: (content: any) => Promise<any>; }' is missing the following properties from type 'Readonly<Omit<MessageReplyCreationFormProps, "form">>': issue, onRefetch, pollingStatus, setPollingStatus |
| `src/components/program/ProgramContentMenu.tsx:836` | TS2698 | Spread types may only be created from object types. |
| `src/components/program/ProgramContentMenu.tsx:877` | TS2698 | Spread types may only be created from object types. |
| `src/pages/ActivityPage/ActivityPageHelmet.tsx:80` | TS2769 | No overload matches this call. |
| `src/pages/ActivityPage/ActivityPageHelmet.tsx:84` | TS2769 | No overload matches this call. |
| `src/pages/ActivityPage/ActivityPageHelmet.tsx:109` | TS2349 | This expression is not callable. |
| `src/pages/BlogPostPage/BlogPostPage.tsx:186` | TS7006 | Parameter 'tag' implicitly has an 'any' type. |
| `src/pages/BlogPostPage/BlogPostPage.tsx:239` | TS7006 | Parameter 'v' implicitly has an 'any' type. |
| `src/pages/HomePage/ProgramContentCard.tsx:114` | TS2741 | Property 'className' is missing in type '{ src: string; ratio: number; width: string; }' but required in type 'CustomRatioImageProps'. |
| `src/pages/MeetingPage/MeetingPage.tsx:140` | TS2339 | Property 'name' does not exist on type '{ __typename?: "member_public" \| undefined; id?: string \| null \| undefined; }'. |
| `src/pages/MemberClassPage/hooks.ts:66` | TS2322 | Type 'unknown[]' is not assignable to type 'string[]'. |
| `src/pages/ProgramPage/Primary/ProgramPlanCard/index.tsx:168` | TS2322 | Type '{ renderTrigger: ({ isLoading, onOpen, isSubscription }: { isLoading?: boolean \| undefined; isSubscription?: boolean \| undefined; disable?: boolean \| undefined; isLoginAlert?: boolean \| undefined; onOpen?… |
| `src/pages/ProgramPage/Primary/ProgramPlanCard/index.tsx:178` | TS2322 | Type '{ defaultProductId: string; onAuthRequired: () => void \| undefined; renderTrigger: ({ isLoading, onOpen }: { isLoading?: boolean \| undefined; isSubscription?: boolean \| undefined; disable?: boolean \| unde… |
| `src/pages/ProgramPage/Secondary/SecondaryProgramInfoCard.tsx:29` | TS7006 | Parameter 'props' implicitly has an 'any' type. |
| `src/pages/ProgramPage/Secondary/SecondaryProgramInfoCard.tsx:31` | TS7006 | Parameter 'props' implicitly has an 'any' type. |
| `src/pages/ProgramPage/Secondary/SecondaryProgramPlanCard/index.tsx:179` | TS2322 | Type '{ renderTrigger: ({ isLoading, onOpen, isSubscription }: { isLoading?: boolean \| undefined; isSubscription?: boolean \| undefined; disable?: boolean \| undefined; isLoginAlert?: boolean \| undefined; onOpen?… |
| `src/pages/ProgramPage/Secondary/SecondaryProgramPlanCard/index.tsx:189` | TS2322 | Type '{ defaultProductId: string; onAuthRequired: () => void \| undefined; renderTrigger: ({ isLoading, onOpen }: { isLoading?: boolean \| undefined; isSubscription?: boolean \| undefined; disable?: boolean \| unde… |
| `src/pages/ProgramPage/Secondary/SecondaryProgramPlanCard/SecondaryPaymentButton.tsx:77` | TS2322 | Type '{ defaultProductId: string; onAuthRequired: () => void \| undefined; renderTrigger: ({ isLoading, onOpen }: { isLoading?: boolean \| undefined; isSubscription?: boolean \| undefined; disable?: boolean \| unde… |
| `src/pages/ProjectPage/PortfolioPage.tsx:29` | TS2344 | Type '"id" \| "title" \| "description" \| "coverUrl" \| "createdAt" \| "views" \| "author.id" \| "author.name" \| "creator.id" \| "creator.name" \| "creator.pictureUrl" \| "author.pictureUrl" \| ... 10 more ... \| "projectR… |
| `src/pages/ProjectPage/PortfolioPage.tsx:134` | TS2769 | No overload matches this call. |
| `node_modules/lodestar-app-element/src/components/cards/ActivityCard.tsx:54` | TS2741 | Property 'className' is missing in type '{ width: string; ratio: number; src: string; }' but required in type 'CustomRatioImageProps'. |
| `node_modules/lodestar-app-element/src/components/cards/PostCard.tsx:137` | TS2741 | Property 'className' is missing in type '{ width: string; ratio: number; src: string; }' but required in type 'CustomRatioImageProps'. |
| `node_modules/lodestar-app-element/src/components/cards/ProgramContentCard.tsx:119` | TS2741 | Property 'className' is missing in type '{ src: string; ratio: number; width: string; }' but required in type 'CustomRatioImageProps'. |
| `node_modules/lodestar-app-element/src/components/collections/ActivityCollection.tsx:116` | TS2769 | No overload matches this call. |
| `node_modules/lodestar-app-element/src/components/collections/ActivityCollection.tsx:117` | TS2769 | No overload matches this call. |
| `node_modules/lodestar-app-element/src/components/collections/PostCollection.tsx:126` | TS2769 | No overload matches this call. |
| `node_modules/lodestar-app-element/src/components/collections/ProjectCollection.tsx:127` | TS2769 | No overload matches this call. |
| `node_modules/lodestar-app-element/src/components/common/Craftize.tsx:64` | TS2352 | Conversion of type 'StyledComponent<ElementComponent<P>, any, P & { className?: string \| undefined; children?: ReactNode; onClick?: (() => void) \| undefined; } & { responsive?: { mobile?: (P & { ...; }) \| undef… |

## 相容性與後續

本次新增 commit 僅影響開發編譯器與測試宣告，沒有改後端回應契約、冷卻時間或 auth runtime，無需配套後端部署。原 auth PR 所述的部署順序與新舊前後端相容性仍適用。app 與 admin 的修正不依賴 element 新 tag；element 也不在本次發布 tag。

剩餘業務型別問題需獨立確認元件 props、GraphQL schema、泛型／Date 型別契約後處理，未以 any 或 suppressions 隱藏。CI 結果記錄於新 draft PR 描述；CodeQL 成功不代表 typecheck 通過。尚未 merge、部署或發布。
