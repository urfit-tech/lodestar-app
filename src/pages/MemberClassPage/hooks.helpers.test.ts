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
