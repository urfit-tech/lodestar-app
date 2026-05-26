import { CalendarEvent, CoursePackageSummary, CourseType, TeachingCourseSummary } from './types'

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
