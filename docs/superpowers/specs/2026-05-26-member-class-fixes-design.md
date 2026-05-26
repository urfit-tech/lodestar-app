# `/members/:memberId/class` 三個顯示 bug 修正設計

- **日期**：2026-05-26
- **作者**：Eddy（與 Claude 共筆）
- **影響範圍**：`src/pages/MemberClassPage/`
- **狀態**：草案，待 review

---

## 1. 背景

`/members/:memberId/class` 同一頁面以 `viewAs` 切換「參與課程（學生視角）」與「教學課程（老師視角）」。資料源是 `useMemberClassEvents()` 從 `temporally-exclusive-resource/batch/get/member` + `event/batch/get` 兩支 REST API 撈出來的 `event` 列表，每筆 event 的關鍵屬性都塞在 `event.event_metadata`（jsonb）裡。Admin 端（`lodestar-app-admin`）是寫入端，慣例由 `PersonalScheduleEditor` / `ClassGroupScheduleEditor` 建立。

## 2. 問題現況

### Bug #1 — 學生端「課程摘要」沒依語言分開

- 預期：日文課程歸到日文段、中文課程歸到中文段。
- 實際：日文課程被算到中文段，數字含糊不清。

### Bug #2 — 老師端「下一堂課」卡片顯示異常

- 預期：個人班顯示學生姓名、團體/學期班顯示對應字樣或學生名單。
- 實際：所有情境一律顯示「團體班」、沒有學生名字（即使是個人班）。

### Bug #3 — 老師端「課程摘要」把不同學生的個人班放在一起

- 預期：每位學生的個人班各自一張卡。
- 實際：不同學生、不同語言的個人班全部聚合成一張卡，數字混在一起。

## 3. Root cause

歸納為兩條：

### Root cause A — 個人班的分組鍵錯誤

`src/pages/MemberClassPage/hooks.ts`：

- `useStudentCourseSummaries`（行 321-395）與 `useTeacherCourseSummaries`（行 398-485）皆以 `classGroupId` 為唯一分組鍵：

  ```ts
  const key = e.classGroupId || 'unknown'
  ```

- `classGroupId` 的來源是 `transformToCalendarEvent`（行 148）：

  ```ts
  classGroupId: metadata.classId || event.source_target
  ```

- 對照 admin 端寫入慣例：
  - **學期班 / 團體班** 由 `ClassGroupScheduleEditor` 建立，metadata 一定帶 `classId`（對應 `class_group.id`）。
  - **個人班** 由 `PersonalScheduleEditor` 建立（`buildPersonalEventMetadata`），**不帶 classId**，會 fallback 到 `event.source_target`。同一 viewer 的所有個人 event 的 `source_target` 都是同一個 `temporally_exclusive_resource_id`，導致該 viewer 名下的所有個人 event 被塞進同一桶。

- 副作用：
  - Bug #1：`summary.language = first.language`（行 384、473），第一筆 event 的語言決定整桶語言，其他語言的個人 event 被吃掉。
  - Bug #3：老師名下不同學生的個人班全聚成一張卡。

### Root cause B — `CalendarEvent.students` 從未被填值

`transformToCalendarEvent`（hooks.ts:139）：

```ts
students: undefined,
```

學生名字解析只發生在 `useTeacherCourseSummaries` 內部的 `memberMap`（hooks.ts:438），**完全沒回灌到 `CalendarEvent`**。下游消費者：

- `NextUpCard.tsx:220-222`：

  ```ts
  viewAs === 'teacher'
    ? event.students && event.students.length > 0
      ? event.students.join(', ')
      : '團體班'
    : event.teacher
  ```

  `event.students` 永遠 undefined → 一律走到 fallback `'團體班'`，連個人班也顯示「團體班」、且看不到學生姓名。

- `ClassDashboard.tsx:265-275` 的 modal `roleValue` 也有相同問題（fallback 顯示「N 位」）。

### Root cause C（附帶）— `courseType` 判別與 admin 不一致

`hooks.ts:88-108` 的 `determineCourseType` 讀 `metadata.courseType` 與 title 關鍵字。Admin 端從未寫入 `metadata.courseType`，唯一權威欄位是 **`metadata.scheduleType`**（值為 `'personal' | 'semester' | 'group'`），由 `PersonalScheduleEditor` 與 `ClassGroupScheduleEditor` 寫入，所有 admin 端查詢分流（`scheduleManagement.ts:1328, 1778`）也以此為準。

`scheduleType` 雖然已被 `parseEventMetadata` 取出（hooks.ts:61）並放上 `CalendarEvent`（hooks.ts:154），但 `determineCourseType` 沒消費它。

## 4. 設計

### 4.1 統一三種班別判別

新增一個小 helper（位於 `hooks.ts`）：

```ts
const scheduleTypeToCourseType = (scheduleType?: string): CourseType | null => {
  switch (scheduleType) {
    case 'personal': return CourseType.Private
    case 'semester': return CourseType.Term
    case 'group':    return CourseType.Group
    default:         return null
  }
}
```

`transformToCalendarEvent` 改成：

```ts
courseType:
  scheduleTypeToCourseType(metadata.scheduleType) ??
  determineCourseType(event.event_metadata, event.title),
```

> 既有 `determineCourseType` 保留作為 fallback，避免少數沒寫 `scheduleType` 的舊資料變成預設值 `Group`。

### 4.2 分組鍵改為 schedule-type-aware

新增 helper：

```ts
const getSummaryGroupKey = (e: CalendarEvent): string => {
  if (e.scheduleType === 'personal') {
    // 一筆 order_log = 一個個人班「課程包」
    return e.orderIds?.[0] ? `personal:${e.orderIds[0]}` : `personal:unknown:${e.id}`
  }
  return e.classGroupId || `unknown:${e.id}`
}
```

`useStudentCourseSummaries` / `useTeacherCourseSummaries` 用此 key 取代原本的 `e.classGroupId || 'unknown'`。

**Edge cases**：

- 個人班 event 沒有 `orderIds`（理論上不會發生，admin 端 `buildPersonalEventMetadata` 一定塞 orderId）：fallback 成 `personal:unknown:${e.id}`，每筆獨立成卡，避免錯誤聚合。優於塞進一個 bucket。
- 非個人班沒有 classGroupId：同樣 fallback 成 `unknown:${e.id}`。
- summary 的 `language` 來源從 `first.language` 維持不變；分組鍵已包含個人班的訂單區隔，同一張卡裡的 event 必然同語言（因為 admin 端一筆 order 對應一個語言）。

### 4.3 學生名字解析上提到 `useMemberClassEvents`

目前狀態：

- `useTeacherCourseSummaries` 內部已收集 `allStudentIds` 並 query `member_public`。
- 但結果（memberMap）綁在 hook 內部，沒回灌 CalendarEvent。

改成：

1. 把「收集 studentIds → query member_public → 建 memberMap」這段邏輯**上提到 `useMemberClassEvents`**。
2. 在 `transformToCalendarEvent`（或 `filterByRole` 內 map 階段）把 `students: string[]` 填上去：

   ```ts
   students: (metadata.studentIds || []).map(id => memberMap.get(id)).filter(Boolean)
   ```

3. `useTeacherCourseSummaries` 移除內部的 memberMap query，直接讀 `event.students`。
4. NextUpCard 與 ClassDashboard modal 都自動受益。

### 4.4 NextUpCard 改用 `courseType` 判斷

`NextUpCard.tsx:218-223` 改成：

```ts
const rolePerson = (() => {
  if (viewAs !== 'teacher') return event.teacher
  const names = event.students ?? []
  if (event.courseType === CourseType.Private) {
    return names[0] || formatMessage(messages.notSpecified)
  }
  // 學期班 / 團體班
  if (names.length > 0) return names.join(', ')
  return event.courseType === CourseType.Term
    ? formatMessage(messages.termClass)
    : formatMessage(messages.groupClass)
})()
```

新增（或復用 ClassDashboard 的）i18n key：`memberClass.courseType.term`、`memberClass.courseType.group`、`memberClass.card.notSpecified`。

### 4.5 ClassDashboard modal 順手簡化

`ClassDashboard.tsx:265-275` 的 `roleValue`：因 `selectedEvent.students` 之後一定有值，可移除 `studentIds.length` fallback 那段，直接：

```ts
if (selectedEvent.students?.length) return selectedEvent.students.join('、')
return formatMessage(messages.notSpecified)
```

## 5. 測試計畫

加在 `NextUpCard.test.tsx` / `ClassDashboard.test.tsx`：

1. **NextUpCard — 老師視角個人班**：input event 帶 `scheduleType: 'personal'`、`studentIds: ['m1']`、resolved `students: ['小明']` → 顯示「學生：小明」，不顯示「團體班」。
2. **NextUpCard — 老師視角學期班**：`scheduleType: 'semester'`、`students: ['A', 'B']` → 顯示「學生：A, B」。
3. **NextUpCard — 老師視角團體班無學生**：`scheduleType: 'group'`、`students: []` → 顯示「團體班」（中性 fallback）。
4. **NextUpCard — 學生視角**：行為不變（顯示 teacher）。
5. **useStudentCourseSummaries**：兩個 event 同個 viewer、同 `source_target`、但不同 `orderIds[0]`、不同語言 → 產生 2 個 summary，語言各自正確。
6. **useTeacherCourseSummaries**：兩個 event 同個 host、同 `source_target`、不同 `orderIds[0]`、不同 `studentIds` → 產生 2 個 summary，學生各自正確。
7. **班別判別**：`metadata.scheduleType = 'personal' | 'semester' | 'group'` → courseType 對應 `Private` / `Term` / `Group`。Fallback：缺 scheduleType 時走既有邏輯。

## 6. 不在範圍內

- 不修改 admin 端寫入規則（已是權威來源）。
- 不重構 `event/batch/get` REST API。
- 不擴充 `CalendarEvent` 之外的 type 層次。
- 不處理 `useMemberClassEvents` 改用 GraphQL 或 React Query 等更大重構，維持現有 axios 流程。
- 不調整既有 CalendarView 著色 / icon 設計。

## 7. 風險與緩解

| 風險 | 緩解 |
|---|---|
| 舊資料 event 沒 `scheduleType` | 保留既有 `determineCourseType` 作 fallback，行為退化到目前狀態，不更糟。 |
| 個人班 event 沒 `orderIds` | 分組鍵 fallback 成 `personal:unknown:${e.id}`，每筆獨立成卡（保守路徑），避免誤聚。 |
| 額外 `member_public` query 對學生視角是冗餘（學生只需 teacher 名字） | 在 `useMemberClassEvents` 內：只在 `studentIds` 有值時才 query；學生視角 event 本就少有 studentIds，呼叫量低。可接受。 |
| `useTeacherCourseSummaries` 內部 memberMap 與外部新增的 memberMap 衝突 | 移除內部 memberMap，單一資料源。測試覆蓋 #6。 |

## 8. 實作步驟（高階）

1. `hooks.ts`：加 `scheduleTypeToCourseType`、`getSummaryGroupKey` helper；改 `transformToCalendarEvent` 使用 `scheduleTypeToCourseType`；於 `useMemberClassEvents` 收集 studentIds、加 `member_public` query、把 `students` 回灌 event。
2. `hooks.ts`：改 `useStudentCourseSummaries` / `useTeacherCourseSummaries` 的分組鍵；移除 `useTeacherCourseSummaries` 內部的 `member_public` query。
3. `NextUpCard.tsx`：改 `rolePerson` 邏輯，依 `courseType` 分流；新增/重用 i18n 字串。
4. `ClassDashboard.tsx`：簡化 modal 的 `roleValue`。
5. 補測試（清單見 §5）。
6. 手動 verify：student 視角看見正確語言分組、teacher 視角看見不同學生各自分卡、下一堂課顯示正確學生與班別。
