import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useCallback, useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { CalendarEvent, CourseType, ViewAs } from './types'

const messages = defineMessages({
  nextClass: { id: 'memberClass.card.nextClass', defaultMessage: '下一堂課' },
  noUpcomingClass: { id: 'memberClass.card.noUpcomingClass', defaultMessage: '沒有即將到來的課程。' },
  location: { id: 'memberClass.card.location', defaultMessage: '地點' },
  teacher: { id: 'memberClass.card.teacher', defaultMessage: '老師' },
  students: { id: 'memberClass.card.students', defaultMessage: '學生' },
  material: { id: 'memberClass.card.material', defaultMessage: '教材' },
  openZoom: { id: 'memberClass.card.openZoom', defaultMessage: '開啟 Zoom' },
  connecting: { id: 'memberClass.card.connecting', defaultMessage: '連線中...' },
  zoomWillOpenBefore15Min: { id: 'memberClass.card.zoomWillOpenBefore15Min', defaultMessage: '連結將於課前15分鐘開放' },
  classEnded: { id: 'memberClass.card.classEnded', defaultMessage: '課程已結束' },
})

const getCourseColor = (type: CourseType) => {
  switch (type) {
    case CourseType.Private:
      return { border: '#fa8c16' }
    case CourseType.Group:
      return { border: '#faad14' }
    case CourseType.Term:
      return { border: '#13c2c2' }
    default:
      return { border: '#d9d9d9' }
  }
}

const StyledCard = styled.div<{ $borderColor: string }>`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 8px solid ${props => props.$borderColor};
`

const StyledTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 1rem;
`

const StyledEmptyCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const StyledEmptyMessage = styled.p`
  color: #8c8c8c;
  text-align: center;
  padding: 1rem 0;
  margin: 0;
`

const StyledCourseTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`

const StyledInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #595959;
  margin-bottom: 0.75rem;

  svg {
    color: #bfbfbf;
    flex-shrink: 0;
  }
`

const StyledZoomButton = styled.button<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  background: ${props => (props.$disabled ? '#f5f5f5' : props.theme['@primary-color'])};
  color: ${props => (props.$disabled ? '#8c8c8c' : 'white')};
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.$disabled ? '#f5f5f5' : props.theme['@primary-color'])};
    color: ${props => (props.$disabled ? '#8c8c8c' : 'white')};
    opacity: ${props => (props.$disabled ? 1 : 0.85)};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

interface NextUpCardProps {
  event: CalendarEvent | null
  viewAs: ViewAs
}

const NextUpCard: React.FC<NextUpCardProps> = ({ event, viewAs }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const [isZoomActive, setIsZoomActive] = useState(false)
  const [zoomHint, setZoomHint] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!event || !event.needOnlineRoom) return

    const checkZoomTime = () => {
      const now = new Date().getTime()
      const eventStartTime = new Date(`${event.date}T${event.startTime}`).getTime()
      const eventEndTime = new Date(`${event.date}T${event.endTime}`).getTime()
      const fifteenMinutesBefore = eventStartTime - 15 * 60 * 1000

      if (now >= fifteenMinutesBefore && now <= eventEndTime) {
        setIsZoomActive(true)
        setZoomHint('')
      } else if (now < fifteenMinutesBefore) {
        setIsZoomActive(false)
        setZoomHint(formatMessage(messages.zoomWillOpenBefore15Min))
      } else {
        setIsZoomActive(false)
        setZoomHint(formatMessage(messages.classEnded))
      }
    }

    checkZoomTime()
    const timer = setInterval(checkZoomTime, 60000) // Check every minute
    return () => clearInterval(timer)
  }, [event, formatMessage])

  const handleOpenZoom = useCallback(async () => {
    if (!event || !isZoomActive || isLoading || !authToken) return

    try {
      setIsLoading(true)
      const kolableEndpoint = process.env.REACT_APP_KOLABLE_SERVER_ENDPOINT

      const startedAt = new Date(`${event.date}T${event.startTime}`).toISOString()
      const endedAt = new Date(`${event.date}T${event.endTime}`).toISOString()

      const response = await axios.post(
        `${kolableEndpoint}/e/kolable/meets/by-time`,
        {
          startedAt,
          endedAt,
          eventId: event.id,
          autoRecording: false,
          service: 'zoom',
          nbfAt: '',
          expAt: null,
          hostMemberId: event.hostMemberId || '',
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )

      if (response.data?.code === 'SUCCESS' && response.data?.data?.link) {
        window.open(response.data.data.link, '_blank', 'noopener,noreferrer')
      } else {
        console.error('Failed to get Zoom link:', response.data)
      }
    } catch (err) {
      console.error('Failed to create meeting:', err)
    } finally {
      setIsLoading(false)
    }
  }, [event, isZoomActive, isLoading, authToken])

  if (!event) {
    return (
      <StyledEmptyCard>
        <StyledTitle>{formatMessage(messages.nextClass)}</StyledTitle>
        <StyledEmptyMessage>{formatMessage(messages.noUpcomingClass)}</StyledEmptyMessage>
      </StyledEmptyCard>
    )
  }

  const courseColors = getCourseColor(event.courseType)
  const rolePerson =
    viewAs === 'teacher'
      ? event.students && event.students.length > 0
        ? event.students.join(', ')
        : '團體班'
      : event.teacher

  return (
    <StyledCard $borderColor={courseColors.border}>
      <StyledTitle>{formatMessage(messages.nextClass)}</StyledTitle>
      <StyledCourseTitle>{event.title}</StyledCourseTitle>

      <StyledInfoRow>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>
          {new Date(event.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })} {event.startTime} -{' '}
          {event.endTime}
        </span>
      </StyledInfoRow>

      <StyledInfoRow>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>
          {formatMessage(messages.location)}：{event.location}
        </span>
      </StyledInfoRow>

      <StyledInfoRow>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>
          {viewAs === 'teacher' ? formatMessage(messages.students) : formatMessage(messages.teacher)}：{rolePerson}
        </span>
      </StyledInfoRow>

      {event.materialName && (
        <StyledInfoRow>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>
            {formatMessage(messages.material)}：{event.materialName}
          </span>
        </StyledInfoRow>
      )}

      {event.needOnlineRoom && (
        <StyledZoomButton
          $disabled={!isZoomActive || isLoading}
          onClick={handleOpenZoom}
          disabled={!isZoomActive || isLoading}
          title={zoomHint}
        >
          {isLoading ? formatMessage(messages.connecting) : formatMessage(messages.openZoom)}
        </StyledZoomButton>
      )}
    </StyledCard>
  )
}

export default NextUpCard
