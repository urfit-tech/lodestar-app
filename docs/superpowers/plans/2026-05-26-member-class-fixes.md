# Member Class Page Display Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 `/members/:memberId/class` 路由的三個顯示 bug：（1）學生端課程摘要沒依語言分開；（2）老師端「下一堂課」永遠顯示「團體班」、看不到學生名字；（3）老師端課程摘要把不同學生的個人班聚成一張卡。

**Architecture:** 從 `event.event_metadata.scheduleType`（admin 端唯一權威來源，值為 `'personal' | 'semester' | 'group'`）映射 `CourseType`；個人班分組鍵改為 `personal:${orderIds[0]}`，class_group 仍用 `classGroupId`；把學生名字解析從 `useTeacherCourseSummaries` 內部上提到 `useMemberClassEvents`，讓所有下游消費者（NextUpCard、ClassDashboard modal、TeachingSummaryCard）都直接讀 `event.students`。

**Tech Stack:** React 17 + TypeScript + Apollo Client（GraphQL）+ axios（REST）+ react-intl + Jest + react-dom/test-utils。專案以 `yarn test`（react-app-rewired 包的 Jest）跑測試。

**Spec:** [`docs/superpowers/specs/2026-05-26-member-class-fixes-design.md`](../specs/2026-05-26-member-class-fixes-design.md)

---

## File Structure

**Create:**
- `src/pages/MemberClassPage/hooks.helpers.ts` — 純函式（無 React / 無 Apollo）helper：`scheduleTypeToCourseType`、`getSummaryGroupKey`、`buildStudentSummaries`、`buildTeacherSummaries`。為何拆檔：純函式抽出後好做 unit test（不必 mock Apollo），現有 `hooks.ts` 已 486 行。
- `src/pages/MemberClassPage/hooks.helpers.test.ts` — 上述 helper 的 Jest 單元測試。

**Modify:**
- `src/pages/MemberClassPage/hooks.ts` — `transformToCalendarEvent` 改用 `scheduleTypeToCourseType`、`filterByRole` 注入 `students` 名字、`useMemberClassEvents` 新增 student `member_public` query、`useStudentCourseSummaries` / `useTeacherCourseSummaries` 改為呼叫 helper。
- `src/pages/MemberClassPage/NextUpCard.tsx` — `rolePerson` 改用 `courseType` 分流。新增 i18n 字串。
- `src/pages/MemberClassPage/NextUpCard.test.tsx` — 加 teacher 視角三種班別測試。
- `src/pages/MemberClassPage/ClassDashboard.tsx` — modal `roleValue` 簡化。

**Do not touch:** admin 端、CalendarView、theme、types.ts（已有 `students?: string[]`、`scheduleType?: string`，不必加欄位）。

---

## Task 1: 抽出 `scheduleTypeToCourseType` 純函式（TDD）

**Files:**
- Create: `src/pages/MemberClassPage/hooks.helpers.ts`
- Create: `src/pages/MemberClassPage/hooks.helpers.test.ts`

- [ ] **Step 1: 寫失敗測試**

建立 `src/pages/MemberClassPage/hooks.helpers.test.ts`：

```ts
import { CourseType } from './types'
import { scheduleTypeToCourseType } from './hooks.helpers'

describe('scheduleTypeToCourseType', () => {
  it('maps "personal" to CourseType.Private', () => {
    expect(scheduleTypeToCourseType('personal')).toBe(CourseType.Private)
  })

  it('maps "semester" to CourseType.Term', () => {
    expect(scheduleTypeToCourseType('semester')).toBe(CourseType.Term)
  })

  it('maps "group" to CourseType.Group', () => {
    expect(scheduleTypeToCourseType('group')).toBe(CourseType.Group)
  })

  it('returns null for undefined', () => {
    expect(scheduleTypeToCourseType(undefined)).toBeNull()
  })

  it('returns null for unknown values', () => {
    expect(scheduleTypeToCourseType('unknown')).toBeNull()
  })
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: FAIL — `Cannot find module './hooks.helpers'`

- [ ] **Step 3: 寫最小實作**

建立 `src/pages/MemberClassPage/hooks.helpers.ts`：

```ts
import { CourseType } from './types'

export const scheduleTypeToCourseType = (scheduleType?: string): CourseType | null => {
  switch (scheduleType) {
    case 'personal':
      return CourseType.Private
    case 'semester':
      return CourseType.Term
    case 'group':
      return CourseType.Group
    default:
      return null
  }
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: PASS（5 個測試）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.helpers.ts src/pages/MemberClassPage/hooks.helpers.test.ts
git commit -m "feat(MemberClassPage): add scheduleTypeToCourseType helper"
```

---

## Task 2: 把 `scheduleTypeToCourseType` 接到 `transformToCalendarEvent`

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.ts:129-160`（`transformToCalendarEvent` 函式）

- [ ] **Step 1: 改 `transformToCalendarEvent` 優先讀 scheduleType**

把 `hooks.ts` 中：

```ts
courseType: determineCourseType(event.event_metadata, event.title),
```

改成：

```ts
courseType:
  scheduleTypeToCourseType(metadata.scheduleType) ??
  determineCourseType(event.event_metadata, event.title),
```

並在檔案頂端的 import 區塊加入：

```ts
import { scheduleTypeToCourseType } from './hooks.helpers'
```

- [ ] **Step 2: 跑既有測試確認沒打破舊行為**

Run: `yarn test src/pages/MemberClassPage --watchAll=false`
Expected: PASS（既有測試全綠；hooks.helpers.test 與 NextUpCard.test / ClassDashboard.test 都通過）

- [ ] **Step 3: Commit**

```bash
git add src/pages/MemberClassPage/hooks.ts
git commit -m "fix(MemberClassPage): derive courseType from event.metadata.scheduleType"
```

---

## Task 3: 抽出 `getSummaryGroupKey` 純函式（TDD）

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.helpers.ts`
- Modify: `src/pages/MemberClassPage/hooks.helpers.test.ts`

- [ ] **Step 1: 加失敗測試**

先把 `hooks.helpers.test.ts` 頂端 import 換成：

```ts
import { CalendarEvent, CalendarEventStatus, CourseType } from './types'
import { getSummaryGroupKey, scheduleTypeToCourseType } from './hooks.helpers'
```

然後在 `describe('scheduleTypeToCourseType', ...)` 之後追加共用 `makeEvent` 與新 describe：

```ts
const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'e1',
  title: '課程',
  day: 'Mon',
  startTime: '10:00',
  endTime: '11:00',
  date: '2026-05-26',
  teacher: '',
  location: '',
  isExternal: false,
  status: CalendarEventStatus.Scheduled,
  courseType: CourseType.Group,
  ...overrides,
})

describe('getSummaryGroupKey', () => {
  it('groups personal events by first orderId', () => {
    const e = makeEvent({ scheduleType: 'personal', orderIds: ['ord-1'], classGroupId: 'should-be-ignored' })
    expect(getSummaryGroupKey(e)).toBe('personal:ord-1')
  })

  it('falls back to per-event key when personal event has no orderId', () => {
    const e = makeEvent({ id: 'e-fallback', scheduleType: 'personal', orderIds: [] })
    expect(getSummaryGroupKey(e)).toBe('personal:unknown:e-fallback')
  })

  it('groups semester events by classGroupId', () => {
    const e = makeEvent({ scheduleType: 'semester', classGroupId: 'cg-1', orderIds: ['ord-1'] })
    expect(getSummaryGroupKey(e)).toBe('cg-1')
  })

  it('groups group events by classGroupId', () => {
    const e = makeEvent({ scheduleType: 'group', classGroupId: 'cg-2' })
    expect(getSummaryGroupKey(e)).toBe('cg-2')
  })

  it('falls back to per-event key when non-personal event lacks classGroupId', () => {
    const e = makeEvent({ id: 'e-x', scheduleType: 'group' })
    expect(getSummaryGroupKey(e)).toBe('unknown:e-x')
  })
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: FAIL — `getSummaryGroupKey is not a function`

- [ ] **Step 3: 寫最小實作**

在 `hooks.helpers.ts` 末尾追加：

```ts
import { CalendarEvent } from './types'

export const getSummaryGroupKey = (e: CalendarEvent): string => {
  if (e.scheduleType === 'personal') {
    const orderId = e.orderIds?.[0]
    return orderId ? `personal:${orderId}` : `personal:unknown:${e.id}`
  }
  return e.classGroupId || `unknown:${e.id}`
}
```

> 注意：`CalendarEvent` 已有 import 嗎？此時還沒，補上 import。

- [ ] **Step 4: 跑測試確認通過**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: PASS（10 個測試）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.helpers.ts src/pages/MemberClassPage/hooks.helpers.test.ts
git commit -m "feat(MemberClassPage): add getSummaryGroupKey helper"
```

---

## Task 4: 抽出 `buildStudentSummaries` 純函式（TDD）

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.helpers.ts`
- Modify: `src/pages/MemberClassPage/hooks.helpers.test.ts`

- [ ] **Step 1: 加失敗測試**

先把 `hooks.helpers.test.ts` 頂端的 helper import 擴成：

```ts
import { buildStudentSummaries, getSummaryGroupKey, scheduleTypeToCourseType } from './hooks.helpers'
```

然後在檔案末尾追加：

```ts
describe('buildStudentSummaries', () => {
  const now = new Date('2026-05-26T12:00:00Z')

  it('keeps personal classes with different orderIds separated, with their own languages', () => {
    const events = [
      makeEvent({
        id: 'e-zh-1',
        scheduleType: 'personal',
        orderIds: ['ord-zh'],
        language: '中文',
        title: '中文個人班',
        startedAt: '2026-05-01T10:00:00Z',
      }),
      makeEvent({
        id: 'e-zh-2',
        scheduleType: 'personal',
        orderIds: ['ord-zh'],
        language: '中文',
        title: '中文個人班',
        startedAt: '2026-06-01T10:00:00Z',
      }),
      makeEvent({
        id: 'e-jp-1',
        scheduleType: 'personal',
        orderIds: ['ord-jp'],
        language: '日文',
        title: '日文個人班',
        startedAt: '2026-05-15T10:00:00Z',
      }),
    ]

    const summaries = buildStudentSummaries({ events, orderMap: new Map(), now })

    expect(summaries).toHaveLength(2)
    const zh = summaries.find(s => s.id === 'personal:ord-zh')
    const jp = summaries.find(s => s.id === 'personal:ord-jp')
    expect(zh).toMatchObject({ language: '中文', totalLessons: 2, completedLessons: 1 })
    expect(jp).toMatchObject({ language: '日文', totalLessons: 1, completedLessons: 1 })
  })

  it('keeps class_group events grouped by classGroupId', () => {
    const events = [
      makeEvent({ id: 'e-1', scheduleType: 'semester', classGroupId: 'cg-1', language: '英文', title: '春季團班' }),
      makeEvent({ id: 'e-2', scheduleType: 'semester', classGroupId: 'cg-1', language: '英文', title: '春季團班' }),
    ]

    const summaries = buildStudentSummaries({ events, orderMap: new Map(), now })

    expect(summaries).toHaveLength(1)
    expect(summaries[0]).toMatchObject({ id: 'cg-1', language: '英文', totalLessons: 2 })
  })

  it('maps order status to paymentStatus', () => {
    const orderMap = new Map([
      ['ord-1', { status: 'SUCCESS', expired_at: '2026-12-31' }],
      ['ord-2', { status: 'UNPAID', expired_at: null }],
    ])
    const events = [
      makeEvent({ id: 'a', scheduleType: 'personal', orderIds: ['ord-1'], language: '中文' }),
      makeEvent({ id: 'b', scheduleType: 'personal', orderIds: ['ord-2'], language: '中文' }),
    ]

    const summaries = buildStudentSummaries({ events, orderMap, now })

    const paid = summaries.find(s => s.id === 'personal:ord-1')
    const unpaid = summaries.find(s => s.id === 'personal:ord-2')
    expect(paid?.paymentStatus).toBe('Paid')
    expect(paid?.expiryDate).toBe('2026-12-31')
    expect(unpaid?.paymentStatus).toBe('Unpaid')
  })
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: FAIL — `buildStudentSummaries is not a function`

- [ ] **Step 3: 寫實作**

在 `hooks.helpers.ts` 末尾追加：

```ts
import { CoursePackageSummary } from './types'

export interface BuildStudentSummariesInput {
  events: CalendarEvent[]
  orderMap: Map<string, { status: string; expired_at: string | null }>
  now?: Date
}

export const buildStudentSummaries = ({
  events,
  orderMap,
  now = new Date(),
}: BuildStudentSummariesInput): CoursePackageSummary[] => {
  const groups = new Map<string, CalendarEvent[]>()
  events.forEach(e => {
    const key = getSummaryGroupKey(e)
    const arr = groups.get(key) || []
    arr.push(e)
    groups.set(key, arr)
  })

  const result: CoursePackageSummary[] = []
  groups.forEach((groupEvents, key) => {
    const first = groupEvents[0]
    const groupOrderIds = first.orderIds || []
    const order = groupOrderIds.map(id => orderMap.get(id)).find(Boolean)
    const completedLessons = groupEvents.filter(e => e.startedAt && new Date(e.startedAt) < now).length

    let paymentStatus: CoursePackageSummary['paymentStatus'] = 'Pending'
    if (order) {
      paymentStatus = order.status === 'SUCCESS' ? 'Paid' : order.status === 'UNPAID' ? 'Unpaid' : 'Pending'
    }

    result.push({
      id: key,
      name: first.title,
      language: first.language || '',
      totalLessons: groupEvents.length,
      completedLessons,
      expiryDate: order?.expired_at || '',
      paymentStatus,
    })
  })
  return result
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: PASS（13 個測試）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.helpers.ts src/pages/MemberClassPage/hooks.helpers.test.ts
git commit -m "feat(MemberClassPage): add buildStudentSummaries helper with per-order grouping"
```

---

## Task 5: 抽出 `buildTeacherSummaries` 純函式（TDD）

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.helpers.ts`
- Modify: `src/pages/MemberClassPage/hooks.helpers.test.ts`

- [ ] **Step 1: 加失敗測試**

先把 `hooks.helpers.test.ts` 頂端的 helper import 擴成：

```ts
import {
  buildStudentSummaries,
  buildTeacherSummaries,
  getSummaryGroupKey,
  scheduleTypeToCourseType,
} from './hooks.helpers'
```

然後在檔案末尾追加：

```ts
describe('buildTeacherSummaries', () => {
  const now = new Date('2026-05-26T12:00:00Z')

  it('keeps different students personal classes separated', () => {
    const events = [
      makeEvent({
        id: 'a',
        scheduleType: 'personal',
        orderIds: ['ord-A'],
        students: ['小明'],
        language: '中文',
        title: '小明的中文課',
        material: 'BookZ',
      }),
      makeEvent({
        id: 'b',
        scheduleType: 'personal',
        orderIds: ['ord-B'],
        students: ['小華'],
        language: '日文',
        title: '小華的日文課',
        material: 'BookY',
      }),
    ]

    const summaries = buildTeacherSummaries({ events, now })

    expect(summaries).toHaveLength(2)
    const a = summaries.find(s => s.id === 'personal:ord-A')
    const b = summaries.find(s => s.id === 'personal:ord-B')
    expect(a).toMatchObject({ students: ['小明'], language: '中文', primaryMaterial: 'BookZ' })
    expect(b).toMatchObject({ students: ['小華'], language: '日文', primaryMaterial: 'BookY' })
  })

  it('deduplicates student names across multiple events in same group', () => {
    const events = [
      makeEvent({ id: 'a', scheduleType: 'semester', classGroupId: 'cg-1', students: ['A', 'B'] }),
      makeEvent({ id: 'b', scheduleType: 'semester', classGroupId: 'cg-1', students: ['B', 'C'] }),
    ]

    const summaries = buildTeacherSummaries({ events, now })

    expect(summaries).toHaveLength(1)
    expect(summaries[0].students.sort()).toEqual(['A', 'B', 'C'])
  })

  it('picks most-common material as primaryMaterial', () => {
    const events = [
      makeEvent({ id: 'a', scheduleType: 'group', classGroupId: 'cg-2', material: 'X' }),
      makeEvent({ id: 'b', scheduleType: 'group', classGroupId: 'cg-2', material: 'Y' }),
      makeEvent({ id: 'c', scheduleType: 'group', classGroupId: 'cg-2', material: 'Y' }),
    ]

    const summaries = buildTeacherSummaries({ events, now })

    expect(summaries[0].primaryMaterial).toBe('Y')
  })
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: FAIL — `buildTeacherSummaries is not a function`

- [ ] **Step 3: 寫實作**

在 `hooks.helpers.ts` 末尾追加：

```ts
import { TeachingCourseSummary } from './types'

export interface BuildTeacherSummariesInput {
  events: CalendarEvent[]
  now?: Date
}

export const buildTeacherSummaries = ({
  events,
  now = new Date(),
}: BuildTeacherSummariesInput): TeachingCourseSummary[] => {
  const groups = new Map<string, CalendarEvent[]>()
  events.forEach(e => {
    const key = getSummaryGroupKey(e)
    const arr = groups.get(key) || []
    arr.push(e)
    groups.set(key, arr)
  })

  const result: TeachingCourseSummary[] = []
  groups.forEach((groupEvents, key) => {
    const first = groupEvents[0]
    const completedLessons = groupEvents.filter(e => e.startedAt && new Date(e.startedAt) < now).length

    const studentNames = new Set<string>()
    groupEvents.forEach(e => (e.students || []).forEach(name => studentNames.add(name)))
    const students = Array.from(studentNames)

    const materialCounts = new Map<string, number>()
    groupEvents.forEach(e => {
      if (e.material) {
        materialCounts.set(e.material, (materialCounts.get(e.material) || 0) + 1)
      }
    })
    let primaryMaterial = ''
    let maxCount = 0
    materialCounts.forEach((count, mat) => {
      if (count > maxCount) {
        maxCount = count
        primaryMaterial = mat
      }
    })

    result.push({
      id: key,
      name: first.title,
      language: first.language || '',
      students,
      completedLessons,
      totalScheduledLessons: groupEvents.length,
      primaryMaterial,
    })
  })
  return result
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `yarn test src/pages/MemberClassPage/hooks.helpers.test.ts --watchAll=false`
Expected: PASS（16 個測試）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.helpers.ts src/pages/MemberClassPage/hooks.helpers.test.ts
git commit -m "feat(MemberClassPage): add buildTeacherSummaries helper reading event.students"
```

---

## Task 6: `useMemberClassEvents` 解析學生名字並回灌 event

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.ts`（`transformToCalendarEvent` 簽名 + `useMemberClassEvents` 主體）

- [ ] **Step 1: 改 `transformToCalendarEvent` 接受 memberMap，填 students**

把 `hooks.ts:129-160` 的整個 `transformToCalendarEvent` 換成以下版本（簽名多一個 `memberMap` 參數，`students` 改成從 memberMap 解析）：

```ts
const transformToCalendarEvent = (
  event: any,
  classroomMap: Map<string, string>,
  memberMap: Map<string, string>,
): CalendarEvent => {
  const metadata = parseEventMetadata(event.event_metadata)
  const resolvedStudents = (metadata.studentIds || [])
    .map(id => memberMap.get(id))
    .filter((name): name is string => Boolean(name))
  return {
    id: event.event_id,
    title: event.title || metadata.title || '課程',
    day: getDayOfWeek(event.started_at),
    startTime: formatTime(event.started_at),
    endTime: formatTime(event.ended_at),
    date: formatDate(event.started_at),
    teacher: '',
    students: resolvedStudents.length > 0 ? resolvedStudents : undefined,
    location: resolveEventLocation(metadata, classroomMap),
    isExternal: metadata.isExternal,
    status: event.source_target ? CalendarEventStatus.Published : CalendarEventStatus.Scheduled,
    courseType:
      scheduleTypeToCourseType(metadata.scheduleType) ??
      determineCourseType(event.event_metadata, event.title),
    needOnlineRoom: metadata.needOnlineRoom,
    hostMemberId: event.host_member_id,
    materialName: metadata.material || metadata.materialName,
    materialLink: metadata.materialLink,
    classGroupId: metadata.classId || event.source_target,
    language: metadata.language,
    orderIds: metadata.orderIds,
    studentIds: metadata.studentIds,
    teacherId: metadata.teacherId,
    material: metadata.material,
    scheduleType: metadata.scheduleType,
    startedAt: event.started_at,
    classroomId: metadata.classroomId,
    classroomIds: metadata.classroomIds,
    classMode: metadata.classMode,
  }
}
```

> 與原版差異：簽名多了 `memberMap`、新增 `resolvedStudents` 區塊、`students` 從 undefined 改為依 memberMap 解析、`courseType` 改用 Task 2 已加入的 `scheduleTypeToCourseType` fallback 鏈（若 Task 2 已正確套用，這行已是此模樣，原樣保留即可）。

- [ ] **Step 2: 在 `useMemberClassEvents` 內收集 studentIds、查 member_public**

在 `useMemberClassEvents` 內 `teacherMap` 之後、`allClassroomIds` 之前，加入：

```ts
const allStudentIds = useMemo(() => {
  const ids = new Set<string>()
  rawEvents.forEach((e: any) => {
    const meta = parseEventMetadata(e.event_metadata)
    meta.studentIds?.forEach(id => ids.add(id))
  })
  return Array.from(ids)
}, [rawEvents])

const { data: studentData } = useQuery<{
  member_public: Array<{ id: string; name: string; username: string }>
}>(
  gql`
    query GetStudentNamesByIds($memberIds: [String!]!) {
      member_public(where: { id: { _in: $memberIds } }) {
        id
        name
        username
      }
    }
  `,
  {
    variables: { memberIds: allStudentIds },
    skip: allStudentIds.length === 0,
  },
)

const studentMap = useMemo(() => {
  const map = new Map<string, string>()
  studentData?.member_public.forEach(m => map.set(m.id, m.name || m.username || m.id))
  return map
}, [studentData])
```

- [ ] **Step 3: 把 studentMap 傳進 `transformToCalendarEvent`**

把 `filterByRole`：

```ts
const filterByRole = useCallback(
  (role: 'participant' | 'host') =>
    rawEvents
      .filter(...)
      .map((event: any) => {
        const calendarEvent = transformToCalendarEvent(event, classroomMap)
        ...
      }),
  [rawEvents, teacherMap, classroomMap],
)
```

改成：

```ts
const filterByRole = useCallback(
  (role: 'participant' | 'host') =>
    rawEvents
      .filter((event: any) => event.role === role && !event.event_deleted_at && !event.event_resource_deleted_at)
      .map((event: any) => {
        const calendarEvent = transformToCalendarEvent(event, classroomMap, studentMap)
        if (calendarEvent.teacherId) {
          calendarEvent.teacher = teacherMap.get(calendarEvent.teacherId) || ''
        }
        return calendarEvent
      }),
  [rawEvents, teacherMap, classroomMap, studentMap],
)
```

- [ ] **Step 4: 跑既有測試**

Run: `yarn test src/pages/MemberClassPage --watchAll=false`
Expected: PASS（hooks.helpers.test 16 個；NextUpCard.test / ClassDashboard.test 既有測試不變）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.ts
git commit -m "fix(MemberClassPage): resolve student names in useMemberClassEvents"
```

---

## Task 7: `useStudentCourseSummaries` / `useTeacherCourseSummaries` 改用新 helper

**Files:**
- Modify: `src/pages/MemberClassPage/hooks.ts:321-485`

- [ ] **Step 1: 改 `useStudentCourseSummaries` 委派給 `buildStudentSummaries`**

把 `useStudentCourseSummaries` 整段（行 321-395）改成：

```ts
export const useStudentCourseSummaries = (events: CalendarEvent[]) => {
  const allOrderIds = useMemo(() => {
    const ids = new Set<string>()
    events.forEach(e => e.orderIds?.forEach(id => ids.add(id)))
    return Array.from(ids)
  }, [events])

  const { data: orderData, loading } = useQuery<{
    order_log: Array<{ id: string; status: string; expired_at: string | null }>
  }>(
    gql`
      query GetOrderLogsByIds($orderIds: [String!]!) {
        order_log(where: { id: { _in: $orderIds } }) {
          id
          status
          expired_at
        }
      }
    `,
    {
      variables: { orderIds: allOrderIds },
      skip: allOrderIds.length === 0,
    },
  )

  const summaries = useMemo<CoursePackageSummary[]>(() => {
    const orderMap = new Map<string, { status: string; expired_at: string | null }>()
    orderData?.order_log.forEach(o => orderMap.set(o.id, { status: o.status, expired_at: o.expired_at }))
    return buildStudentSummaries({ events, orderMap })
  }, [events, orderData])

  return { summaries, loading }
}
```

並在檔案頂端 import 區追加：

```ts
import { buildStudentSummaries, buildTeacherSummaries, scheduleTypeToCourseType } from './hooks.helpers'
```

（如果 Task 2 已加 `scheduleTypeToCourseType`，確認此處改成涵蓋全部三個 helper。）

- [ ] **Step 2: 改 `useTeacherCourseSummaries` 委派給 `buildTeacherSummaries`，移除內部 member_public query**

把 `useTeacherCourseSummaries` 整段（行 398-485）改成：

```ts
export const useTeacherCourseSummaries = (events: CalendarEvent[]) => {
  const summaries = useMemo<TeachingCourseSummary[]>(
    () => buildTeacherSummaries({ events }),
    [events],
  )
  return { summaries, loading: false }
}
```

> `loading: false` 因為這個 hook 不再自己查 GraphQL；學生名字解析已上提到 `useMemberClassEvents`。

- [ ] **Step 3: 移除不再使用的 import**

`hooks.ts` 開頭的 `import { gql, useQuery } from '@apollo/client'` 仍要保留（`useMemberClassEvents` 與 `useStudentCourseSummaries` 都還在用）。但若有任何 `TeachingCourseSummary` 之外的舊 import 已 unused，清掉。可用 TypeScript 編譯確認：

Run: `yarn tsc --noEmit 2>&1 | grep -E "(hooks\.ts|hooks\.helpers\.ts)" | head -20`
Expected: 無 unused import / 無 type error。

- [ ] **Step 4: 跑全部 MemberClassPage 測試**

Run: `yarn test src/pages/MemberClassPage --watchAll=false`
Expected: PASS（16 + NextUpCard 既有 2 + ClassDashboard 既有 1 = 19）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/hooks.ts
git commit -m "refactor(MemberClassPage): delegate summary aggregation to pure helpers"
```

---

## Task 8: NextUpCard 改依 `courseType` 分流並顯示學生名字（TDD）

**Files:**
- Modify: `src/pages/MemberClassPage/NextUpCard.tsx`
- Modify: `src/pages/MemberClassPage/NextUpCard.test.tsx`

- [ ] **Step 1: 寫失敗測試**

在 `NextUpCard.test.tsx` 既有的 `describe('NextUpCard', ...)` 內，於 `it('keeps the Zoom button...')` 之前追加：

```ts
const renderCardAs = (event: CalendarEvent, viewAs: 'student' | 'teacher') => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  act(() => {
    ReactDOM.render(<NextUpCard event={event} viewAs={viewAs} />, root)
  })
  return root
}

const findStudentRow = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('span')).find(s => s.textContent?.startsWith('學生：'))

it('shows the student name for a personal class in teacher view', () => {
  const event: CalendarEvent = {
    ...makeUpcomingOnlineEvent(),
    courseType: CourseType.Private,
    students: ['小明'],
  }
  const root = renderCardAs(event, 'teacher')
  expect(findStudentRow(root)?.textContent).toBe('學生：小明')
})

it('shows comma-separated names for a semester class in teacher view', () => {
  const event: CalendarEvent = {
    ...makeUpcomingOnlineEvent(),
    courseType: CourseType.Term,
    students: ['A', 'B'],
  }
  const root = renderCardAs(event, 'teacher')
  expect(findStudentRow(root)?.textContent).toBe('學生：A, B')
})

it('falls back to "團體班" when a group class has no student names', () => {
  const event: CalendarEvent = {
    ...makeUpcomingOnlineEvent(),
    courseType: CourseType.Group,
    students: undefined,
  }
  const root = renderCardAs(event, 'teacher')
  expect(findStudentRow(root)?.textContent).toBe('學生：團體班')
})

it('falls back to "學期班" when a term class has no student names', () => {
  const event: CalendarEvent = {
    ...makeUpcomingOnlineEvent(),
    courseType: CourseType.Term,
    students: undefined,
  }
  const root = renderCardAs(event, 'teacher')
  expect(findStudentRow(root)?.textContent).toBe('學生：學期班')
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `yarn test src/pages/MemberClassPage/NextUpCard.test.tsx --watchAll=false`
Expected: FAIL — 個人班測試會顯示「團體班」、學期班 fallback 也錯。

- [ ] **Step 3: 改 NextUpCard.tsx**

在 `NextUpCard.tsx` 的 `messages` 物件中追加：

```ts
groupClass: { id: 'memberClass.courseType.group', defaultMessage: '團體班' },
termClass: { id: 'memberClass.courseType.term', defaultMessage: '學期班' },
notSpecified: { id: 'memberClass.card.notSpecified', defaultMessage: '未指定' },
```

把 `NextUpCard.tsx:218-223`：

```ts
const rolePerson =
  viewAs === 'teacher'
    ? event.students && event.students.length > 0
      ? event.students.join(', ')
      : '團體班'
    : event.teacher
```

改成：

```ts
const rolePerson = (() => {
  if (viewAs !== 'teacher') return event.teacher
  const names = event.students ?? []
  if (event.courseType === CourseType.Private) {
    return names[0] || formatMessage(messages.notSpecified)
  }
  if (names.length > 0) return names.join(', ')
  return event.courseType === CourseType.Term
    ? formatMessage(messages.termClass)
    : formatMessage(messages.groupClass)
})()
```

> `CourseType` 已在 `NextUpCard.tsx:7` import；不需新增 import。

- [ ] **Step 4: 跑測試確認通過**

Run: `yarn test src/pages/MemberClassPage/NextUpCard.test.tsx --watchAll=false`
Expected: PASS（既有 2 + 新增 4 = 6）

- [ ] **Step 5: Commit**

```bash
git add src/pages/MemberClassPage/NextUpCard.tsx src/pages/MemberClassPage/NextUpCard.test.tsx
git commit -m "fix(MemberClassPage): NextUpCard shows student name and class type by courseType"
```

---

## Task 9: ClassDashboard modal `roleValue` 簡化

**Files:**
- Modify: `src/pages/MemberClassPage/ClassDashboard.tsx:265-275`

- [ ] **Step 1: 簡化 `roleValue`**

把 `ClassDashboard.tsx:265-275`：

```ts
const roleValue = useMemo(() => {
  if (!selectedEvent) return ''

  if (viewAs === 'teacher') {
    if (selectedEvent.students?.length) return selectedEvent.students.join('、')
    if (selectedEvent.studentIds?.length) return `${selectedEvent.studentIds.length} 位`
    return formatMessage(messages.notSpecified)
  }

  return selectedEvent.teacher || formatMessage(messages.notSpecified)
}, [selectedEvent, viewAs, formatMessage])
```

改成：

```ts
const roleValue = useMemo(() => {
  if (!selectedEvent) return ''
  if (viewAs === 'teacher') {
    if (selectedEvent.students?.length) return selectedEvent.students.join('、')
    return formatMessage(messages.notSpecified)
  }
  return selectedEvent.teacher || formatMessage(messages.notSpecified)
}, [selectedEvent, viewAs, formatMessage])
```

> 移除 `studentIds.length` fallback：學生名字現由 `useMemberClassEvents` 統一注入，若 query 結果還沒回來，顯示「未指定」比顯示「3 位」更不誤導。

- [ ] **Step 2: 跑既有 ClassDashboard 測試**

Run: `yarn test src/pages/MemberClassPage/ClassDashboard.test.tsx --watchAll=false`
Expected: PASS（既有 1 個測試）

- [ ] **Step 3: Commit**

```bash
git add src/pages/MemberClassPage/ClassDashboard.tsx
git commit -m "refactor(MemberClassPage): drop studentIds-count fallback in event modal"
```

---

## Task 10: 全項目 type-check 與手動 verify

**Files:**（無檔案變更，只是收尾驗證）

- [ ] **Step 1: TypeScript 編譯通過**

Run: `yarn tsc --noEmit`
Expected: 無錯誤輸出。若有，回到對應 task 修正。

- [ ] **Step 2: 全部 MemberClassPage 測試通過**

Run: `yarn test src/pages/MemberClassPage --watchAll=false`
Expected: 共 23 個測試全綠（hooks.helpers 16 + NextUpCard 6 + ClassDashboard 1，數量為新增 + 既有）。

- [ ] **Step 3: 手動驗證（必要）**

啟動 dev server：

```bash
yarn start
```

以瀏覽器開 `/members/<some-member-id>/class`，分別用「同時是學生且老師」的測試帳號核對：

1. **參與課程 tab**：課程摘要的語言區塊應為「中文 / 日文 / 英文 …」分開列，**日文 event 出現在日文段**、中文 event 在中文段。
2. **教學課程 tab**：
   - 「下一堂課」卡片：個人班顯示**單一學生名字**、學期班顯示**學生名單**、團體班無名字時顯示「團體班」字樣（不顯示「學生：團體班」這種笨重組合，看起來合理即可）。
   - 課程摘要：同一位老師、**不同學生的個人班各自一張卡**；不同語言不會混在一張卡。
3. **點 calendar 上的 event 開啟 modal**：學生欄顯示真實姓名，不再顯示「N 位」。

若有任一項仍異常，記錄症狀 + screenshot，回到對應 task 修正。

- [ ] **Step 4: 沒有額外 commit**

本 task 不產生新檔案變更；如果手動驗證發現問題並修正了，那次 commit 屬於回去執行的 task，而非本 task。

---

## 完成後

跑 `git log --oneline -10` 確認 10 個 commits 在 `develop` 上：

```
refactor(MemberClassPage): drop studentIds-count fallback in event modal
fix(MemberClassPage): NextUpCard shows student name and class type by courseType
refactor(MemberClassPage): delegate summary aggregation to pure helpers
fix(MemberClassPage): resolve student names in useMemberClassEvents
feat(MemberClassPage): add buildTeacherSummaries helper reading event.students
feat(MemberClassPage): add buildStudentSummaries helper with per-order grouping
feat(MemberClassPage): add getSummaryGroupKey helper
fix(MemberClassPage): derive courseType from event.metadata.scheduleType
feat(MemberClassPage): add scheduleTypeToCourseType helper
docs: spec for member-class page display fixes
```

接下來可發 PR（不在本 plan scope）。
