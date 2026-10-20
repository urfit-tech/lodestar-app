# 前端型別與 production build 修正（2026-10-20）

## 結果與根因

在原編譯器／測試型別修正後，使用者擴大範圍要求清除既有建置阻擋。本次完整型別診斷從 32 個降至 0；不更改 strict、不排除來源或測試、不略過 CRA 型別檢查。

原 TypeScript 4.4.3 無法解析 SWR 2.2.5 的 inline type export；app 另有 react-reader。根編譯器已升為 4.9.5，符合 CRA 4 的 ^3.2.1 || ^4 peer range，補 @types/jest 26.0.24 與 Promise mocks。剩餘業務錯誤可在基準以相同工具重現；auth 新增的錯誤只在測試型別，已修正。先前「只列既有業務錯誤」的範圍已由本次修正取代。

- 原基準：`ec5a3463f924c7d059c379d7d48d164255ea423c`。
- 原 auth HEAD：`1a8003e1b0b2d728b266fd8727b49d6ece8bc975`（[#749](https://github.com/urfit-tech/lodestar-app/pull/749)）。
- 前輪 fresh subagent review 僅涵蓋編譯器／測試型別 commit；本輪新增業務修正經主 agent 複查，仍待同事 review。

## 本輪變更

- 修正活動／作品日期的 DeepPick、文章 hook 推導型別，以及 MeetingPage 已選取的 GraphQL `name` 欄位宣告。
- 修正回覆表單：一般留言不需要 issue；沒有提交 handler 時不可送出；失敗保留內容並顯示錯誤；僅在 issue 與 polling callback 齊全時輪詢。
- 電子書目錄的顏色分支改成合法 props；購買按鈕移除套件不支援的 `onAuthRequired`，保留原 onClick 登入判斷。
- 折扣陣列改用有型別的 slice，維持原本 index > boundary 的分割位置；驗證空陣列、折扣保留與數量上限。
- 教室 metadata 僅保留字串 ID，補 Chakra Text props 型別。
- 以 Yarn 原生 patch 修補目前 element v1.95.14 對應 commit `c44a0ae2cb5ac3707d641002ccc8af1e921b17b7` 的五個來源檔；不升級 element。

## 驗證

- Node 18.20.8／Yarn 4.15.0／TypeScript 4.9.5。
- `tsc --noEmit --pretty false`：通過，0 diagnostics。
- 全部 13 suites／163 tests 通過，包括原 auth 測試。
- production build：通過。保留既有 ESLint／Browserslist 警告，沒有透過新增忽略設定消除錯誤；CI=false 是原 build script 行為。
- `yarn install --immutable --immutable-cache --mode=skip-build` 成功。使用獨立完整 node_modules，沒有引用主 checkout 的 node_modules。原有依賴 selector 的版本與 checksum 未變，lockfile 增加原始／patched element 的定位。
- app 的原 workflow 已使用 mise／Yarn 4，這次未改部署 workflow。
- 前輪以 CRA 4 的 webpack 4.44.2／fork-ts-checker 4.1.6 實測 TS 4.9.5：合法 fixture 通過、故意錯誤可被攔下、修復後恢復通過。@typescript-eslint 4.33 宣告支援範圍 <4.5，實測成功不代表所有 parser 行為受官方保證。

## 依賴與部署順序

本 PR [#750](https://github.com/urfit-tech/lodestar-app/pull/750) 的 base 為 `develop`，包含原 auth PR 的 ancestry。原 auth PR 未合併前，GitHub diff 會包含 auth 變更。先合併原 auth PR，再處理本 PR；如果採 squash／rebase merge，以原 auth HEAD `1a8003e1b0b2d728b266fd8727b49d6ece8bc975` 為界，只把後續修正 rebase 到新 base，確認 diff 後重跑驗證，避免重複引入 auth commits。

此處是同事 review 後的計畫，這輪沒有 merge、部署或 tag：

1. app #749 → #750；admin #764 → #766，各自的 auth 與建置修正作為同一部署單位。先部署這兩個前端。
2. 再部署 backend #426，沿用 doc §8、§10、§12 的契約。此輪不改 retryAfter、60 秒冷卻、每會員每小時 5 封或既有同 IP 15 分鐘 200 次登入限流。
3. element #142 → #143 之後另外發 tag；目前 app／admin 的 patch 固定於舊版 element，不需要先更新套件。未來升級 tag 時，確認上游已包含相同修正，再移除本地 patch；auth 本地相容副本／replacement 也要另驗證後才能移除。

新前端＋舊後端：仍處理既有成功／拒絕回應，缺少 retryAfter 時使用 60 秒 fallback。新前端＋新後端：顯示對應拒絕訊息及實際 retryAfter。舊前端＋新後端：仍可能忽略 retryAfter、顯示 Axios 原始錯誤或卡載入，因此維持前端先部署。此次型別／建置修正不改這些相容性規則。

## CI

此 develop PR 沒有適用的 PR checks；不能把「無檢查」寫成 CI 通過。 最新 HEAD／結果記錄於 PR 描述。
