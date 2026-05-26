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
