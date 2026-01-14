import { EventClickArg, EventContentArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useEffect, useMemo, useRef } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { CalendarEvent, CalendarViewType, CourseType, ViewAs } from './types'

const messages = defineMessages({
  teacher: { id: 'memberClass.card.teacher', defaultMessage: '老師' },
  students: { id: 'memberClass.card.students', defaultMessage: '學生' },
})

const getCourseColor = (type: CourseType) => {
  switch (type) {
    case CourseType.Private:
      return { bg: '#fff7e6', border: '#fa8c16', text: '#ad4e00' }
    case CourseType.Group:
      return { bg: '#fffbe6', border: '#faad14', text: '#ad6800' }
    case CourseType.Term:
      return { bg: '#e6fffb', border: '#13c2c2', text: '#006d75' }
    default:
      return { bg: '#f5f5f5', border: '#d9d9d9', text: '#595959' }
  }
}

const StyledCalendarWrapper = styled.div`
  .fc {
    font-family: inherit;
  }

  .fc .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .fc .fc-button {
    background-color: ${props => props.theme['@primary-color']};
    border-color: ${props => props.theme['@primary-color']};
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;

    &:hover {
      background-color: ${props => props.theme['@primary-color']};
      border-color: ${props => props.theme['@primary-color']};
      opacity: 0.85;
    }

    &:disabled {
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      color: #bfbfbf;
    }
  }

  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: ${props => props.theme['@primary-color']};
    border-color: ${props => props.theme['@primary-color']};
    opacity: 0.85;
  }

  .fc .fc-col-header-cell {
    padding: 0.5rem 0;
    font-weight: 600;
  }

  .fc .fc-timegrid-slot {
    height: 3rem;
  }

  .fc .fc-timegrid-slot-label {
    font-size: 0.75rem;
    color: #8c8c8c;
  }

  .fc .fc-daygrid-day-number {
    padding: 0.5rem;
    font-weight: 500;
  }

  .fc .fc-day-today {
    background-color: rgba(24, 144, 255, 0.05) !important;
  }

  .fc .fc-timegrid-now-indicator-line {
    border-color: #ff4d4f;
    border-width: 2px;
  }

  .fc .fc-timegrid-now-indicator-arrow {
    border-color: #ff4d4f;
    border-width: 6px;
  }

  .fc .fc-list-event:hover td {
    background-color: #fafafa;
  }

  .fc .fc-list-day-cushion {
    background-color: #f5f5f5;
  }

  .fc-event {
    cursor: pointer;
    border-radius: 4px;
  }
`

const StyledEventContent = styled.div<{ $bg: string; $border: string; $text: string }>`
  background: ${props => props.$bg};
  border-left: 3px solid ${props => props.$border};
  color: ${props => props.$text};
  padding: 0.25rem 0.5rem;
  height: 100%;
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1.3;
`

const StyledEventTitle = styled.p`
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledEventInfo = styled.p`
  margin: 0;
  font-size: 0.6875rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledListEventContent = styled.div<{ $text: string }>`
  color: ${props => props.$text};
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

interface CalendarViewProps {
  events: CalendarEvent[]
  currentDate: Date
  activeView: CalendarViewType
  viewAs: ViewAs
  onEventClick?: (event: CalendarEvent) => void
  onDateChange?: (date: Date) => void
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  currentDate,
  activeView,
  viewAs,
  onEventClick,
  onDateChange,
}) => {
  const { formatMessage } = useIntl()
  const calendarRef = useRef<FullCalendar>(null)

  const studentDisplayForCalendar = (students?: string[]): string => {
    if (!students || students.length === 0) return '團體班'
    if (students.length === 1) return students[0]
    return `團體班 (${students.length}人)`
  }

  // Convert CalendarEvent to FullCalendar event format
  const fullCalendarEvents = useMemo(() => {
    return events.map(event => {
      const colors = getCourseColor(event.courseType)
      return {
        id: event.id,
        title: event.title,
        start: `${event.date}T${event.startTime}`,
        end: `${event.date}T${event.endTime}`,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          ...event,
          colors,
        },
      }
    })
  }, [events])

  // Map activeView to FullCalendar view name
  const fcViewName = useMemo(() => {
    switch (activeView) {
      case 'day':
        return 'timeGridDay'
      case 'week':
        return 'timeGridWeek'
      case 'month':
        return 'dayGridMonth'
      case 'list':
        return 'listWeek'
      default:
        return 'timeGridWeek'
    }
  }, [activeView])

  // Sync external date changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.gotoDate(currentDate)
    }
  }, [currentDate])

  // Sync view changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(fcViewName)
    }
  }, [fcViewName])

  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick) {
      onEventClick(info.event.extendedProps as CalendarEvent)
    }
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { colors, teacher, students, location } = eventInfo.event.extendedProps
    const rolePerson = viewAs === 'teacher' ? studentDisplayForCalendar(students) : teacher

    // Different rendering for list view vs grid views
    if (eventInfo.view.type === 'listWeek') {
      return (
        <StyledListEventContent $text={colors.text}>
          <StyledEventTitle>{eventInfo.event.title}</StyledEventTitle>
          <StyledEventInfo>
            {viewAs === 'teacher' ? formatMessage(messages.students) : formatMessage(messages.teacher)}: {rolePerson}
          </StyledEventInfo>
          <StyledEventInfo>@{location}</StyledEventInfo>
        </StyledListEventContent>
      )
    }

    return (
      <StyledEventContent $bg={colors.bg} $border={colors.border} $text={colors.text}>
        <StyledEventTitle>{eventInfo.event.title}</StyledEventTitle>
        <StyledEventInfo>{eventInfo.timeText}</StyledEventInfo>
        <StyledEventInfo>{rolePerson}</StyledEventInfo>
        <StyledEventInfo>@{location}</StyledEventInfo>
      </StyledEventContent>
    )
  }

  return (
    <StyledCalendarWrapper>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={fcViewName}
        initialDate={currentDate}
        headerToolbar={false}
        events={fullCalendarEvents}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        locale="zh-tw"
        firstDay={1}
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        nowIndicator={true}
        height="auto"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        dayHeaderFormat={{
          weekday: 'short',
          day: 'numeric',
        }}
        listDayFormat={{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }}
        noEventsContent=" "
        datesSet={dateInfo => {
          if (onDateChange) {
            onDateChange(dateInfo.start)
          }
        }}
      />
    </StyledCalendarWrapper>
  )
}

export default CalendarView
