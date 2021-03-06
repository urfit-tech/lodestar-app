import { SkeletonText, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Typography } from 'antd'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
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

const StyledTabList = styled(TabList)`
  && {
    padding-bottom: 1px;
    border-bottom: 1px solid var(--gray);
  }
`

const StyledTabPanel = styled(TabPanel)`
  && {
    padding: 24px 0;
  }
`
const MemberPage: React.VFC = () => {
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

  let content = null

  if (memberId === 'currentMemberId' && isAuthenticated) {
    return <Redirect to={`/members/${currentMemberId}`} />
  }
  if (
    !currentMemberId ||
    loadingProgramPackageIds ||
    loadingEnrolledProjectPlanIds ||
    loadingTickets ||
    loadingPodcastProgramIds ||
    loadingEnrolledAppointments ||
    loadingOrderLogs
  ) {
    content = <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  const tabContents: {
    key: string
    name: string
    isVisible: boolean
    content?: React.ReactElement
  }[] = [
    {
      key: 'program',
      name: formatMessage(commonMessages.tab.course),
      isVisible: currentMemberId === memberId || currentUserRole === 'app-owner',
      content: (
        <>
          <EnrolledProgramCollectionBlock memberId={memberId} />
          {enrolledProgramPackagePlanIds.length > 0 && <ProgramPackageCollectionBlock memberId={memberId} />}
        </>
      ),
    },
    {
      key: 'project-plan',
      name: formatMessage(commonMessages.tab.project),
      isVisible: (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledProjectPlanIds.length > 0,
      content: <ProjectPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'activity-ticket',
      name: formatMessage(commonMessages.tab.activity),
      isVisible:
        (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledActivityTickets.length > 0,
      content: <ActivityTicketCollectionBlock memberId={memberId} />,
    },
    {
      key: 'podcast',
      name: formatMessage(commonMessages.tab.podcast),
      isVisible:
        (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledPodcastPrograms.length > 0,
      content: <PodcastProgramCollectionBlock memberId={memberId} />,
    },
    {
      key: 'appointment',
      name: formatMessage(commonMessages.tab.appointment),
      isVisible: (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledAppointments.length > 0,
      content: <AppointmentPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'merchandise-order',
      name: formatMessage(messages.merchandiseOrderLog),
      isVisible: (currentMemberId === memberId || currentUserRole === 'app-owner') && orderLogs.length > 0,
      content: <MerchandiseOrderCollectionBlock memberId={memberId} />,
    },
  ].filter(v => v.isVisible)

  content = (
    <Tabs
      colorScheme="primary"
      index={tabContents.findIndex(v => (activeKey ? v.key === activeKey : v.key === 'program'))}
    >
      <div style={{ background: 'white' }}>
        <div className="container">
          <StyledTabList>
            {tabContents.map(v => (
              <Tab key={v.key} onClick={() => setActiveKey(v.key)}>
                {v.name}
              </Tab>
            ))}
          </StyledTabList>
        </div>
      </div>
      <TabPanels>
        {tabContents.map(v => (
          <StyledTabPanel>{v.content}</StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
  return (
    <DefaultLayout>
      <div className=" py-4 py-sm-5" style={{ background: 'white' }}>
        {!member ? (
          <SkeletonText mt="1" noOfLines={4} spacing="4" />
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
      {content}
    </DefaultLayout>
  )
}

export default MemberPage
