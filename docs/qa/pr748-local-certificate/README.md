# PR #748 本機隔離證書驗證

日期：2026-10-20（Asia/Taipei）。**本機限定通過；不等同測試站驗收。**

## 測試版本與環境

- 前端：`fd808521bbc02067c2dd1bd1099c1bbe3f9f66c2`；後端 #425：`db6a444775c23ea532e98f4f9a65c48f5305011a`。
- 原版下載對照：前端 develop 基線 `ec5a3463f924c7d059c379d7d48d164255ea423c` 的 `CertificateContentBlock` 與 `CreateVirtualCredentials`。原始元件未修改；兩版使用相同合成資料、頁面外框、CSS 與瀏覽器。
- 獨立 Docker project `pr748-local-qa`：PostgreSQL 16、Hasura v2.22.0、Redis 7；服務僅綁定 127.0.0.1。未使用既有容器或遠端資料庫。
- 本機頁面與 API：`127.0.0.1:17480`；Hasura：17481；PostgreSQL：17482；Redis：17483；背景圖服務：17484。背景使用不同 origin 並允許測試頁 CORS，實際經過圖片載入與 canvas 匯出。
- 在獨立資料庫建立兩位會員 `qa-owner` / `qa-other`，皆為 general-member，密碼以 bcrypt 儲存。只有持有人有一張證書。全部名稱、email、證書內容都是合成資料。
- `member_certificate`、`certificate`、`certificate_template` 的 anonymous / general-member select permissions 與關聯，擷取自 Hasura origin/master `e066a6e61b72d77b1ef24c9d7ad1fd6c544c0c19`。未開放 member_certificate 匿名資料，未修改 Hasura repo。

## 實際執行範圍與限制

瀏覽器執行 PR 的 `MemberCertificatePage`、公開及本人 hooks、公開／本人內容元件、`VirtualCredentials`、DOMPurify、Mustache 與真實 html2canvas。後端執行 PR 的 `accessBoundary`、public router/controller/service、admin Apollo client 與 Redis；API 回應、GraphQL 回應及 PNG 皆未 mock。

這是**功能隔離 harness**，不是完整應用部署：登入表單／AuthContext 由本機測試外框提供；本機登入端點查詢真實測試會員及 bcrypt 密碼後簽發 HS256 JWT，由真實 Hasura 驗簽與執行 row permissions。Apollo 使用本機 HTTP 連線。租戶固定為測試 app；VIP、全站導覽／頁面 metadata、Braft 說明外框簡化。未驗證正式 AuthProvider 的 cookie／refresh／SSO、完整租戶解析、CDN、正式圖床 CORS 或全站權限。此紀錄也不代表所有模板或所有尺寸均已驗證。

## 結果

| 情境 | 實測結果 |
| --- | --- |
| 匿名開啟分享頁 | 公開 API 200，僅五欄位；頁面沒有私人 values、email、自訂背景或原版模板。正常頁面流程沒有發出本人 GraphQL 查詢。 |
| 持有人登入後下載 | 本人 GraphQL 回傳 1 筆；實際下載 PNG 包含原背景、金色邊框、姓名、課程、自訂資格、證書編號、日期與 `PRIVATE-ISSUED-748` 測試標記。 |
| 原版 PNG 回歸比較 | 相同頁面外框下，新舊實際下載均為 **1880 × 1388**，RGBA 像素差異 **0**，檔案 SHA-256 相同。此尺寸為沿用原版 transform/scale 後的實際輸出，不宣稱為 2400px。 |
| 另一會員登入 | 本人查詢帶 qa-other 的 JWT 與 memberId，Hasura 回傳 0 筆；分享頁仍顯示 QA Holder，沒有錯用查看者姓名，也沒有私人內容。 |
| 匿名／另一會員下載 | 兩張摘要 PNG 均為 **2400 × 740**，像素及檔案 SHA-256 相同，只含公開證書欄位。 |
| 直接指定持有人查詢 | 在 HTTP GraphQL 請求刻意將 owner filter 設為 qa-owner：匿名 0 筆、qa-other 0 筆、qa-owner 1 筆。證明此資料邊界不是單靠 UI 隱藏。 |
| 不重整切換帳號／登出 | 持有人切換 qa-other 時私人內容移除；登出後僅剩公開內容，DOM 沒有私人標記、email 或背景 URL。 |
| 瀏覽器錯誤 | 本次最後一輪證書操作擷取的 error logs 為空。 |

公開 API 對三種身分均只回傳 `holderName`、`certificateTitle`、`deliveredAt`、`expiredAt`、`number`，沒有 email、member_id、完整 values 或模板。欄位限制的結論涵蓋本次分享頁、公開端點與 member_certificate 查詢，**不是整個既有 Hasura schema 的權限保證**。

初次對照曾使用不同頁面外框，出現少量渲染像素差異；改用與 PR 相同外框後重新下載，最終對照為 0 像素差異。只保存最終同條件基線作為比較成品。

## 證據

- [持有人下載 PNG](owner-download.png)、[原版基線 PNG](baseline-download.png)
- [匿名摘要 PNG](anonymous-download.png)、[另一會員摘要 PNG](other-member-download.png)
- [持有人畫面](owner-page.png)、[匿名畫面](anonymous-page.png)、[另一會員畫面](other-member-page.png)
- [像素與 SHA-256 比較](png-comparison.json)、[實際 API／Hasura 驗證](api-verification.json)
- [去除憑證的 HTTP 紀錄](http-audit.jsonl)、[另一會員 DOM](other-member-dom.json)、[切換帳號 DOM](owner-to-other-dom.json)、[登出 DOM](logout-dom.json)

HTTP 紀錄只保存合成身分、operation、欄位名稱、筆數與私人測試值是否出現，不保存 password、JWT 或 admin secret。

測試站先前公開端點回 401 的問題仍未驗收。仍須 backend 先部署，待測試站提供確認版本與測試帳號／證書後完成同樣三種身分與真實 PNG 驗收。本次未 merge。
