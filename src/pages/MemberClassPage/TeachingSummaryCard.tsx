import React, { useEffect, useMemo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { TeachingCourseSummary } from './types'

const messages = defineMessages({
  teachingOverview: { id: 'memberClass.card.teachingOverview', defaultMessage: '教學總覽' },
  students: { id: 'memberClass.card.students', defaultMessage: '學生' },
  remainingLessons: { id: 'memberClass.card.remainingLessons', defaultMessage: '剩餘堂數' },
  lessons: { id: 'memberClass.card.lessons', defaultMessage: '堂' },
  primaryMaterial: { id: 'memberClass.card.primaryMaterial', defaultMessage: '主要教材' },
})

const StyledCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

const StyledSection = styled.div`
  margin-bottom: 1rem;
`

const StyledSectionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: #595959;
  text-align: left;
`

const StyledSectionContent = styled.div`
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  border-left: 2px solid #e8e8e8;
`

const StyledCourseItem = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const StyledCourseName = styled.h4`
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.75rem 0;
`

const StyledCourseInfo = styled.p`
  font-size: 0.875rem;
  color: #595959;
  margin: 0 0 0.5rem 0;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    font-weight: 500;
  }
`

interface TeachingSummaryCardProps {
  summaries: TeachingCourseSummary[]
}

const TeachingSummaryCard: React.FC<TeachingSummaryCardProps> = ({ summaries }) => {
  const { formatMessage } = useIntl()
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const groupedSummaries = useMemo(() => {
    return summaries.reduce<Record<string, TeachingCourseSummary[]>>((acc, summary) => {
      const lang = summary.language
      if (!acc[lang]) {
        acc[lang] = []
      }
      acc[lang].push(summary)
      return acc
    }, {})
  }, [summaries])

  useEffect(() => {
    const initialCollapsedState = Object.keys(groupedSummaries).reduce<Record<string, boolean>>((acc, lang) => {
      acc[lang] = false
      return acc
    }, {})
    setCollapsedSections(initialCollapsedState)
  }, [groupedSummaries])

  const toggleSection = (language: string) => {
    setCollapsedSections(prev => ({ ...prev, [language]: !prev[language] }))
  }

  return (
    <StyledCard>
      <StyledTitle>{formatMessage(messages.teachingOverview)}</StyledTitle>
      {Object.keys(groupedSummaries).map(language => (
        <StyledSection key={language}>
          <StyledSectionHeader onClick={() => toggleSection(language)}>
            <span>{language}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: collapsedSections[language] ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </StyledSectionHeader>
          {!collapsedSections[language] && (
            <StyledSectionContent>
              {groupedSummaries[language].map(summary => {
                const remaining = summary.totalScheduledLessons - summary.completedLessons
                return (
                  <StyledCourseItem key={summary.id}>
                    <StyledCourseName>{summary.name}</StyledCourseName>
                    <StyledCourseInfo>
                      <span>{formatMessage(messages.students)}：</span> {summary.students.join(', ')}
                    </StyledCourseInfo>
                    <StyledCourseInfo>
                      <span>{formatMessage(messages.remainingLessons)}：</span> {remaining}{' '}
                      {formatMessage(messages.lessons)}
                    </StyledCourseInfo>
                    <StyledCourseInfo>
                      <span>{formatMessage(messages.primaryMaterial)}：</span> {summary.primaryMaterial}
                    </StyledCourseInfo>
                  </StyledCourseItem>
                )
              })}
            </StyledSectionContent>
          )}
        </StyledSection>
      ))}
    </StyledCard>
  )
}

export default TeachingSummaryCard
