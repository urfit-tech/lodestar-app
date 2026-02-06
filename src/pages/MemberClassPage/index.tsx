import { SkeletonText, Spinner } from '@chakra-ui/react'
import { Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
import MemberAvatar from '../../components/common/MemberAvatar'
import PageHelmet from '../../components/common/PageHelmet'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { usePublicMember } from '../../hooks/member'
import ClassDashboard from './ClassDashboard'
import { useClassEvents, useStudentCourseSummaries, useTeacherCourseSummaries } from './hooks'

const messages = defineMessages({
  myClasses: { id: 'memberClass.title.myClasses', defaultMessage: '我的課程' },
  participatingCourses: { id: 'memberClass.tab.participatingCourses', defaultMessage: '參與課程' },
  teachingCourses: { id: 'memberClass.tab.teachingCourses', defaultMessage: '教學課程' },
  loading: { id: 'memberClass.loading', defaultMessage: '載入中...' },
})

const StyledTabContainer = styled.div`
  background: white;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0;
  }
`

const StyledTabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  gap: 2rem;
`

const StyledTab = styled.button<{ $active: boolean }>`
  padding: 1rem 0.5rem;
  border: none;
  border-bottom: 2px solid ${props => (props.$active ? props.theme['@primary-color'] : 'transparent')};
  background: transparent;
  color: ${props => (props.$active ? props.theme['@primary-color'] : '#8c8c8c')};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`

const StyledProfileSection = styled.div`
  background: white;
  padding: 3rem 1rem 2rem;

  @media (min-width: 768px) {
    padding: 3rem 0 2rem;
  }
`

const StyledAvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const StyledLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #8c8c8c;
`

const MemberClassPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { isAuthenticated, currentMemberId } = useAuth()
  const { loading: loadingApp } = useApp()
  const { member } = usePublicMember(memberId)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teachingCourses'>('dashboard')

  // Fetch real data using hooks
  const { events: studentEvents, loading: studentEventsLoading } = useClassEvents({ memberId, role: 'participant' })

  const { events: teachingEvents, loading: teachingEventsLoading } = useClassEvents({ memberId, role: 'host' })

  const { summaries: studentSummaries, loading: studentSummariesLoading } = useStudentCourseSummaries(studentEvents)
  const { summaries: teachingSummaries, loading: teachingSummariesLoading } = useTeacherCourseSummaries(teachingEvents)

  const isLoading =
    activeTab === 'dashboard'
      ? studentEventsLoading || studentSummariesLoading
      : teachingEventsLoading || teachingSummariesLoading

  if (memberId === 'currentMemberId' && isAuthenticated) {
    return <Redirect to={`/members/${currentMemberId}/class`} />
  }

  const tabs = [
    { id: 'dashboard' as const, label: formatMessage(messages.participatingCourses) },
    { id: 'teachingCourses' as const, label: formatMessage(messages.teachingCourses) },
  ]

  return (
    <DefaultLayout>
      {!loadingApp && <PageHelmet title={formatMessage(messages.myClasses)} />}

      <StyledProfileSection>
        <div className="container">
          <StyledAvatarWrapper>
            {!member ? (
              <SkeletonText mt="1" noOfLines={4} spacing="4" w="100%" />
            ) : (
              <>
                <MemberAvatar memberId={member.id} withName={false} size={128} />
                <Typography.Title level={1} style={{ margin: 0 }}>
                  {member.name}
                </Typography.Title>
              </>
            )}
          </StyledAvatarWrapper>
        </div>
      </StyledProfileSection>

      <StyledTabContainer>
        <div className="container">
          <StyledTabList>
            {tabs.map(tab => (
              <StyledTab key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </StyledTab>
            ))}
          </StyledTabList>
        </div>
      </StyledTabContainer>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {isLoading ? (
          <StyledLoadingContainer>
            <Spinner size="xl" />
            <span>{formatMessage(messages.loading)}</span>
          </StyledLoadingContainer>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <ClassDashboard summaries={studentSummaries} events={studentEvents} viewAs="student" />
            )}
            {activeTab === 'teachingCourses' && (
              <ClassDashboard summaries={teachingSummaries} events={teachingEvents} viewAs="teacher" />
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  )
}

export default MemberClassPage
