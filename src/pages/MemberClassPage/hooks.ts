import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarEvent, CalendarEventStatus, CoursePackageSummary, CourseType, TeachingCourseSummary } from './types'

// Helper to parse metadata and extract class details
const parseEventMetadata = (metadata: any) => {
  if (!metadata) return {}
  try {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata
    const studentIds = parsed.studentIds || (parsed.studentId ? [parsed.studentId] : undefined)
    const orderIds = parsed.orderIds || (parsed.orderId ? [parsed.orderId] : undefined)
    return {
      location: parsed.location || parsed.room || '線上',
      needOnlineRoom: parsed.needOnlineRoom || false,
      materialName: parsed.materialName || parsed.textbook || null,
      materialLink: parsed.materialLink || null,
      language: parsed.language || undefined,
      orderIds,
      studentIds,
      teacherId: parsed.teacherId || undefined,
      material: parsed.material || undefined,
      scheduleType: parsed.scheduleType || undefined,
      classId: parsed.classId || undefined,
    }
  } catch {
    return {}
  }
}

// Helper to determine course type from metadata or title
const determineCourseType = (metadata: any, title?: string): CourseType => {
  if (!metadata && !title) return CourseType.Group
  const parsed = typeof metadata === 'string' ? JSON.parse(metadata || '{}') : metadata || {}

  if (parsed.courseType) {
    if (parsed.courseType.toLowerCase().includes('private') || parsed.courseType.includes('個人')) {
      return CourseType.Private
    }
    if (parsed.courseType.toLowerCase().includes('term') || parsed.courseType.includes('學期')) {
      return CourseType.Term
    }
  }

  // Fallback to checking title
  if (title) {
    if (title.includes('1對1') || title.includes('個人')) return CourseType.Private
    if (title.includes('學期') || title.includes('定期')) return CourseType.Term
  }

  return CourseType.Group
}

// Get day of week from date
const getDayOfWeek = (dateStr: string): CalendarEvent['day'] => {
  const days: CalendarEvent['day'][] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date(dateStr)
  return days[date.getDay()]
}

// Format time from ISO string
const formatTime = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

// Format date from ISO string
const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toISOString().split('T')[0]
}

interface UseClassEventsOptions {
  memberId: string
  role: 'participant' | 'host'
}

export const useClassEvents = ({ memberId, role }: UseClassEventsOptions) => {
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const fetchEvents = useCallback(async () => {
    if (!authToken || !memberId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const baseEndpoint = process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT

      // Step 1: Ensure member is registered as a resource and get resource ID
      const resourceResponse = await axios.post(
        `${baseEndpoint}/v2/temporally-exclusive-resource/batch/get/member`,
        [memberId],
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )

      const resourceData = resourceResponse.data
      if (!resourceData || resourceData.length === 0) {
        // Member is not registered as a resource, no events
        setEvents([])
        setLoading(false)
        return
      }

      const resourceId = resourceData[0].temporally_exclusive_resource_id

      // Step 2: Get events for this resource
      // Use a wide date range to get all events
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 6) // 6 months ago
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1) // 1 year from now

      const eventsResponse = await axios.post(`${baseEndpoint}/v2/event/batch/get`, [resourceId], {
        params: {
          started_at: startDate.toISOString(),
          until: endDate.toISOString(),
        },
        headers: { authorization: `Bearer ${authToken}` },
      })

      const eventsData = eventsResponse.data || []

      // Filter events by role and source_type
      const filteredEvents = eventsData.filter((event: any) => {
        // Only include class_group events
        if (event.source_type !== 'class_group') return false
        // Only include events matching the requested role
        if (event.role !== role) return false
        // Exclude deleted events
        if (event.event_deleted_at || event.event_resource_deleted_at) return false
        return true
      })

      // Transform events to CalendarEvent format
      const calendarEvents: CalendarEvent[] = filteredEvents.map((event: any) => {
        const metadata = parseEventMetadata(event.event_metadata)
        return {
          id: event.event_id,
          title: event.title || '課程',
          day: getDayOfWeek(event.started_at),
          startTime: formatTime(event.started_at),
          endTime: formatTime(event.ended_at),
          date: formatDate(event.started_at),
          teacher: '', // TODO: Need to fetch teacher info separately
          students: undefined, // TODO: Need to fetch student info separately
          location: metadata.location || '線上',
          isExternal: false,
          status: event.source_target ? CalendarEventStatus.Published : CalendarEventStatus.Scheduled,
          courseType: determineCourseType(event.event_metadata, event.title),
          needOnlineRoom: metadata.needOnlineRoom,
          hostMemberId: event.host_member_id,
          materialName: metadata.materialName,
          materialLink: metadata.materialLink,
          classGroupId: metadata.classId || event.source_target,
          language: metadata.language,
          orderIds: metadata.orderIds,
          studentIds: metadata.studentIds,
          teacherId: metadata.teacherId,
          material: metadata.material,
          scheduleType: metadata.scheduleType,
          startedAt: event.started_at,
        }
      })

      setEvents(calendarEvents)
    } catch (err) {
      console.error('Failed to fetch class events:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [authToken, memberId, role])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  }
}

// Hook to get course package summaries for students
export const useStudentCourseSummaries = (events: CalendarEvent[]) => {
  // Group events by classGroupId
  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach(e => {
      const key = e.classGroupId || 'unknown'
      const arr = map.get(key) || []
      arr.push(e)
      map.set(key, arr)
    })
    return map
  }, [events])

  // Collect all unique orderIds
  const allOrderIds = useMemo(() => {
    const ids = new Set<string>()
    events.forEach(e => e.orderIds?.forEach(id => ids.add(id)))
    return Array.from(ids)
  }, [events])

  // Query order_log for expiry and status
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

    const now = new Date()
    const result: CoursePackageSummary[] = []

    grouped.forEach((groupEvents, classGroupId) => {
      const first = groupEvents[0]
      // Find the order info for this group
      const groupOrderIds = first.orderIds || []
      const order = groupOrderIds.map(id => orderMap.get(id)).find(Boolean)

      const completedLessons = groupEvents.filter(e => e.startedAt && new Date(e.startedAt) < now).length

      let paymentStatus: CoursePackageSummary['paymentStatus'] = 'Pending'
      if (order) {
        paymentStatus = order.status === 'SUCCESS' ? 'Paid' : order.status === 'UNPAID' ? 'Unpaid' : 'Pending'
      }

      result.push({
        id: classGroupId,
        name: first.title,
        language: first.language || '',
        totalLessons: groupEvents.length,
        completedLessons,
        expiryDate: order?.expired_at || '',
        paymentStatus,
      })
    })

    return result
  }, [grouped, orderData])

  return { summaries, loading }
}

// Hook to get teaching course summaries for teachers
export const useTeacherCourseSummaries = (events: CalendarEvent[]) => {
  // Group events by classGroupId
  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach(e => {
      const key = e.classGroupId || 'unknown'
      const arr = map.get(key) || []
      arr.push(e)
      map.set(key, arr)
    })
    return map
  }, [events])

  // Collect all unique studentIds
  const allStudentIds = useMemo(() => {
    const ids = new Set<string>()
    events.forEach(e => e.studentIds?.forEach(id => ids.add(id)))
    return Array.from(ids)
  }, [events])

  // Query member_public for student names
  const { data: memberData, loading } = useQuery<{
    member_public: Array<{ id: string; name: string; username: string }>
  }>(
    gql`
      query GetMemberNamesByIds($memberIds: [String!]!) {
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

  const summaries = useMemo<TeachingCourseSummary[]>(() => {
    const memberMap = new Map<string, string>()
    memberData?.member_public.forEach(m => memberMap.set(m.id, m.name || m.username || m.id))

    const now = new Date()
    const result: TeachingCourseSummary[] = []

    grouped.forEach((groupEvents, classGroupId) => {
      const first = groupEvents[0]

      const completedLessons = groupEvents.filter(e => e.startedAt && new Date(e.startedAt) < now).length

      // Resolve student names
      const studentIdSet = new Set<string>()
      groupEvents.forEach(e => e.studentIds?.forEach(id => studentIdSet.add(id)))
      const students = Array.from(studentIdSet).map(id => memberMap.get(id) || id)

      // Find most common material
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
        id: classGroupId,
        name: first.title,
        language: first.language || '',
        students,
        completedLessons,
        totalScheduledLessons: groupEvents.length,
        primaryMaterial,
      })
    })

    return result
  }, [grouped, memberData])

  return { summaries, loading }
}
