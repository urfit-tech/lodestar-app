import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useCallback, useEffect, useState } from 'react'
import { CalendarEvent, CalendarEventStatus, CoursePackageSummary, CourseType, TeachingCourseSummary } from './types'

// Helper to parse metadata and extract class details
const parseEventMetadata = (metadata: any) => {
  if (!metadata) return {}
  try {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata
    return {
      location: parsed.location || parsed.room || '線上',
      needOnlineRoom: parsed.needOnlineRoom || false,
      materialName: parsed.materialName || parsed.textbook || null,
      materialLink: parsed.materialLink || null,
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
export const useStudentCourseSummaries = (memberId: string) => {
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<CoursePackageSummary[]>([])

  useEffect(() => {
    // TODO: Implement actual API call when endpoint is available
    // For now, return empty array to indicate no data
    setLoading(false)
    setSummaries([])
  }, [memberId])

  return { summaries, loading }
}

// Hook to get teaching course summaries for teachers
export const useTeacherCourseSummaries = (memberId: string) => {
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<TeachingCourseSummary[]>([])

  useEffect(() => {
    // TODO: Implement actual API call when endpoint is available
    // For now, return empty array to indicate no data
    setLoading(false)
    setSummaries([])
  }, [memberId])

  return { summaries, loading }
}
