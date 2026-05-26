import { CalendarEvent, CalendarEventStatus, CourseType } from './types'
import { getSummaryGroupKey, scheduleTypeToCourseType } from './hooks.helpers'

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
