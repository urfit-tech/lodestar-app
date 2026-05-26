import { CalendarEvent, CourseType } from './types'

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

export const getSummaryGroupKey = (e: CalendarEvent): string => {
  if (e.scheduleType === 'personal') {
    const orderId = e.orderIds?.[0]
    return orderId ? `personal:${orderId}` : `personal:unknown:${e.id}`
  }
  return e.classGroupId || `unknown:${e.id}`
}
