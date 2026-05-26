import { CalendarEvent, CalendarEventStatus, CourseType } from './types'
import { buildStudentSummaries, getSummaryGroupKey, scheduleTypeToCourseType } from './hooks.helpers'

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
