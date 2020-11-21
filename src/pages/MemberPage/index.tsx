import { Skeleton, Tabs, Typography } from 'antd'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../../components/auth/AuthContext'
import MemberAvatar from '../../components/common/MemberAvatar'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MerchandiseOrderCollectionBlock from '../../components/merchandise/MerchandiseOrderCollectionBlock'
import ProgramPackageCollectionBlock from '../../components/package/ProgramPackageCollectionBlock'
import EnrolledProgramCollectionBlock from '../../containers/program/EnrolledProgramCollectionBlock'
import ProjectPlanCollectionBlock from '../../containers/project/ProjectPlanCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledActivityTickets } from '../../hooks/activity'
import { useEnrolledAppointmentCollection } from '../../hooks/appointment'
import { usePublicMember } from '../../hooks/member'
import { useOrderLogsWithMerchandiseSpec } from '../../hooks/merchandise'
import { useEnrolledPodcastPrograms } from '../../hooks/podcast'
import { useEnrolledProgramPackagePlanIds } from '../../hooks/programPackage'
import { useEnrolledProjectPlanIds } from '../../hooks/project'
import ActivityTicketCollectionBlock from './ActivityTicketCollectionBlock'
import AppointmentPlanCollectionBlock from './AppointmentPlanCollectionBlock'
import PodcastProgramCollectionBlock from './PodcastProgramCollectionBlock'

const messages = defineMessages({
  merchandiseOrderLog: { id: 'product.merchandise.tab.orderLog', defaultMessage: '商品紀錄' },
})

const MemberPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { isAuthenticated, currentMemberId, currentUserRole } = useAuth()
  const { member } = usePublicMember(memberId)
  const { loadingProgramPackageIds, enrolledProgramPackagePlanIds } = useEnrolledProgramPackagePlanIds(memberId)
  const { loadingEnrolledProjectPlanIds, enrolledProjectPlanIds } = useEnrolledProjectPlanIds(memberId)
  const { loadingTickets, enrolledActivityTickets } = useEnrolledActivityTickets(memberId)
  const { loadingPodcastProgramIds, enrolledPodcastPrograms } = useEnrolledPodcastPrograms(memberId)
  const { loadingEnrolledAppointments, enrolledAppointments } = useEnrolledAppointmentCollection(memberId)
  const { loadingOrderLogs, orderLogs } = useOrderLogsWithMerchandiseSpec(memberId)

  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)

  if (memberId === 'currentMemberId' && isAuthenticated) {
    return <Redirect to={`/members/${currentMemberId}`} />
  }

  return (
    <DefaultLayout>
      <div className=" py-4 py-sm-5" style={{ background: 'white' }}>
        {!member ? (
          <Skeleton active />
        ) : (
          <div className="container d-flex flex-column flex-sm-row align-items-center">
            <MemberAvatar memberId={memberId || ''} withName={false} size={128} />
            <div className="d-flex flex-column align-items-center align-items-sm-start flex-sm-grow-1 ml-sm-4">
              <Typography.Title level={4}>{member && member.name}</Typography.Title>
              <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {member && <p>{member.abstract}</p>}
              </Typography.Paragraph>
            </div>
          </div>
        )}
      </div>

      {!currentMemberId ||
      loadingProgramPackageIds ||
      loadingEnrolledProjectPlanIds ||
      loadingTickets ||
      loadingPodcastProgramIds ||
      loadingEnrolledAppointments ||
      loadingOrderLogs ? (
        <Skeleton active />
      ) : (
        <Tabs
          activeKey={activeKey || 'program'}
          onChange={key => setActiveKey(key)}
          renderTabBar={(tabsProps, DefaultTabBar) => (
            <div style={{ background: 'white' }}>
              <div className="container">
                <DefaultTabBar {...tabsProps} />
              </div>
            </div>
          )}
        >
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && (
            <Tabs.TabPane key="program" tab={formatMessage(commonMessages.tab.course)}>
              <EnrolledProgramCollectionBlock memberId={memberId} />
              {enrolledProgramPackagePlanIds.length > 0 && <ProgramPackageCollectionBlock memberId={memberId} />}
            </Tabs.TabPane>
          )}
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledProjectPlanIds.length > 0 && (
            <Tabs.TabPane key="project-plan" tab={formatMessage(commonMessages.tab.project)}>
              <ProjectPlanCollectionBlock memberId={memberId} />
            </Tabs.TabPane>
          )}
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledActivityTickets.length > 0 && (
            <Tabs.TabPane key="activity-ticket" tab={formatMessage(commonMessages.tab.activity)}>
              <ActivityTicketCollectionBlock memberId={memberId} />
            </Tabs.TabPane>
          )}
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledPodcastPrograms.length > 0 && (
            <Tabs.TabPane key="podcast" tab={formatMessage(commonMessages.tab.podcast)}>
              <PodcastProgramCollectionBlock memberId={memberId} />
            </Tabs.TabPane>
          )}
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledAppointments.length > 0 && (
            <Tabs.TabPane key="appointment" tab={formatMessage(commonMessages.tab.appointment)}>
              <AppointmentPlanCollectionBlock memberId={memberId} />
            </Tabs.TabPane>
          )}
          {(currentMemberId === memberId || currentUserRole === 'app-owner') && orderLogs.length > 0 && (
            <Tabs.TabPane key="merchandise-order" tab={formatMessage(messages.merchandiseOrderLog)}>
              <MerchandiseOrderCollectionBlock memberId={memberId} />
            </Tabs.TabPane>
          )}
        </Tabs>
      )}
    </DefaultLayout>
  )
}

export default MemberPage
