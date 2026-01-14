import React, { useMemo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import CalendarView from './CalendarView'
import CourseSummaryCard from './CourseSummaryCard'
import NextUpCard from './NextUpCard'
import TeachingSummaryCard from './TeachingSummaryCard'
import { CalendarEvent, CalendarViewType, CoursePackageSummary, TeachingCourseSummary, ViewAs } from './types'

const messages = defineMessages({
  today: { id: 'memberClass.calendar.today', defaultMessage: '今天' },
  day: { id: 'memberClass.calendar.day', defaultMessage: '日' },
  week: { id: 'memberClass.calendar.week', defaultMessage: '週' },
  month: { id: 'memberClass.calendar.month', defaultMessage: '月' },
  list: { id: 'memberClass.calendar.list', defaultMessage: '列表' },
  privateClass: { id: 'memberClass.courseType.private', defaultMessage: '個人班' },
  groupClass: { id: 'memberClass.courseType.group', defaultMessage: '團體班' },
  termClass: { id: 'memberClass.courseType.term', defaultMessage: '學期班' },
})

const StyledDashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 2fr;
  }
`

const StyledSidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const StyledCalendarContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const StyledCalendarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e8e8e8;
`

const StyledHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const StyledNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StyledNavButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: #f5f5f5;
  }
`

const StyledArrowButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`

const StyledMonthYear = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #262626;
  margin-left: 0.5rem;
`

const StyledLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`

const StyledLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #595959;
`

const StyledLegendDot = styled.span<{ $color: string; $borderColor: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  border: 1px solid ${props => props.$borderColor};
`

const StyledViewButtons = styled.div`
  display: flex;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-left: auto;
`

const StyledViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d9d9d9;
  border-left-width: 0;
  background: ${props => (props.$active ? props.theme['@primary-color'] : 'white')};
  color: ${props => (props.$active ? 'white' : '#595959')};
  cursor: pointer;
  font-size: 0.875rem;

  &:first-child {
    border-left-width: 1px;
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${props => (props.$active ? props.theme['@primary-color'] : '#f5f5f5')};
  }
`

interface ClassDashboardProps {
  summaries: CoursePackageSummary[] | TeachingCourseSummary[]
  events: CalendarEvent[]
  viewAs?: ViewAs
}

const ClassDashboard: React.FC<ClassDashboardProps> = ({ summaries, events, viewAs = 'student' }) => {
  const { formatMessage } = useIntl()
  const [activeView, setActiveView] = useState<CalendarViewType>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter(event => new Date(`${event.date}T${event.endTime}`) > now)
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
  }, [events])

  const nextEvent = upcomingEvents[0] || null

  const calendarViews: { id: CalendarViewType; label: string }[] = [
    { id: 'day', label: formatMessage(messages.day) },
    { id: 'week', label: formatMessage(messages.week) },
    { id: 'month', label: formatMessage(messages.month) },
    { id: 'list', label: formatMessage(messages.list) },
  ]

  const handleNav = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    const increment = direction === 'prev' ? -1 : 1
    const viewForNav = activeView === 'list' ? 'day' : activeView
    if (viewForNav === 'day') newDate.setDate(newDate.getDate() + increment)
    if (viewForNav === 'week') newDate.setDate(newDate.getDate() + 7 * increment)
    if (viewForNav === 'month') newDate.setMonth(newDate.getMonth() + increment)
    setCurrentDate(newDate)
  }

  const currentMonthYear = new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'long' }).format(currentDate)

  return (
    <StyledDashboardGrid>
      <StyledSidebarColumn>
        <NextUpCard event={nextEvent} viewAs={viewAs} />
        {viewAs === 'student' ? (
          <CourseSummaryCard summaries={summaries as CoursePackageSummary[]} />
        ) : (
          <TeachingSummaryCard summaries={summaries as TeachingCourseSummary[]} />
        )}
      </StyledSidebarColumn>

      <StyledCalendarContainer>
        <StyledCalendarHeader>
          <StyledHeaderRow>
            <StyledNavGroup>
              <StyledNavButton onClick={() => setCurrentDate(new Date())}>
                {formatMessage(messages.today)}
              </StyledNavButton>
              <StyledArrowButton onClick={() => handleNav('prev')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </StyledArrowButton>
              <StyledArrowButton onClick={() => handleNav('next')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </StyledArrowButton>
              <StyledMonthYear>{currentMonthYear}</StyledMonthYear>
            </StyledNavGroup>

            <StyledViewButtons>
              {calendarViews.map(v => (
                <StyledViewButton key={v.id} $active={activeView === v.id} onClick={() => setActiveView(v.id)}>
                  {v.label}
                </StyledViewButton>
              ))}
            </StyledViewButtons>
          </StyledHeaderRow>

          <StyledLegend>
            <StyledLegendItem>
              <StyledLegendDot $color="#fff7e6" $borderColor="#fa8c16" />
              {formatMessage(messages.privateClass)}
            </StyledLegendItem>
            <StyledLegendItem>
              <StyledLegendDot $color="#fffbe6" $borderColor="#faad14" />
              {formatMessage(messages.groupClass)}
            </StyledLegendItem>
            <StyledLegendItem>
              <StyledLegendDot $color="#e6fffb" $borderColor="#13c2c2" />
              {formatMessage(messages.termClass)}
            </StyledLegendItem>
          </StyledLegend>
        </StyledCalendarHeader>

        <CalendarView events={events} currentDate={currentDate} activeView={activeView} viewAs={viewAs} />
      </StyledCalendarContainer>
    </StyledDashboardGrid>
  )
}

export default ClassDashboard
