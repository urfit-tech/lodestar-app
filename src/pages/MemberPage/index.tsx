import { SkeletonText, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { renderMemberAbstract } from '../../components/common/CustomRender'
import MemberAvatar from '../../components/common/MemberAvatar'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MerchandiseOrderCollectionBlock from '../../components/merchandise/MerchandiseOrderCollectionBlock'
import ProgramPackageCollectionBlock from '../../components/package/ProgramPackageCollectionBlock'
import EnrolledProgramCollectionBlock from '../../containers/program/EnrolledProgramCollectionBlock'
import ProjectPlanCollectionBlock from '../../containers/project/ProjectPlanCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledActivityTickets } from '../../hooks/activity'
import { useEnrolledAppointmentCollection } from '../../hooks/appointment'
import { useExpiredOwnedProducts } from '../../hooks/data'
import { usePublicMember } from '../../hooks/member'
import { useOrderLogsWithMerchandiseSpec } from '../../hooks/merchandise'
import { useEnrolledPodcastPrograms } from '../../hooks/podcast'
import { useEnrolledProgramPackagePlanIds } from '../../hooks/programPackage'
import { useEnrolledProjectPlanIds } from '../../hooks/project'
import { MemberPublicProps } from '../../types/member'
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
const MemberPage: React.VFC<{ renderText?: (member: MemberPublicProps) => React.ReactNode }> = ({ renderText }) => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { isAuthenticated, currentMemberId, permissions } = useAuth()
  const { id: appId, settings } = useApp()
  const { member } = usePublicMember(memberId)
  const { loadingProgramPackageIds, enrolledProgramPackagePlanIds } = useEnrolledProgramPackagePlanIds(memberId)
  const { loadingExpiredOwnedProducts, expiredOwnedProducts: expiredOwnedProgramPackagePlanIds } =
    useExpiredOwnedProducts(memberId, 'ProgramPackagePlan')
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
    loadingOrderLogs ||
    loadingExpiredOwnedProducts
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
      isVisible: currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_PROGRAM_INFO || false,
      content: (
        <>
          <EnrolledProgramCollectionBlock memberId={memberId} />
          {(enrolledProgramPackagePlanIds.length > 0 ||
            (settings['feature.expired_program_package_plan.enable'] === '1' &&
              expiredOwnedProgramPackagePlanIds.length > 0)) && (
            <ProgramPackageCollectionBlock
              memberId={memberId}
              expiredOwnedProgramPackagePlanIds={expiredOwnedProgramPackagePlanIds}
            />
          )}
        </>
      ),
    },
    {
      key: 'project-plan',
      name: formatMessage(commonMessages.tab.project),
      isVisible:
        (currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_PROJECT_INFO || false) &&
        enrolledProjectPlanIds.length > 0,
      content: <ProjectPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'activity-ticket',
      name: formatMessage(commonMessages.tab.activity),
      isVisible:
        (currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_ACTIVITY_INFO || false) &&
        enrolledActivityTickets.length > 0,
      content: <ActivityTicketCollectionBlock memberId={memberId} />,
    },
    {
      key: 'podcast',
      name: formatMessage(commonMessages.tab.podcast),
      isVisible:
        (currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_PODCAST_INFO || false) &&
        enrolledPodcastPrograms.length > 0,
      content: <PodcastProgramCollectionBlock memberId={memberId} />,
    },
    {
      key: 'appointment',
      name: formatMessage(commonMessages.tab.appointment),
      isVisible:
        (currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_APPOINTMENT_INFO || false) &&
        enrolledAppointments.length > 0,
      content: <AppointmentPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'merchandise-order',
      name: formatMessage(messages.merchandiseOrderLog),
      isVisible:
        (currentMemberId === memberId || permissions.CHECK_MEMBER_PAGE_MERCHANDISE_INFO || false) && orderLogs.length > 0,
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
        <div className="container d-flex flex-column flex-sm-row align-items-center">
          {!member ? (
            <SkeletonText mt="1" noOfLines={4} spacing="4" w="100%" />
          ) : (
            <>
              <MemberAvatar memberId={member.id} withName={false} size={128} />

              <div className="d-flex flex-column align-items-center align-items-sm-start flex-sm-grow-1 ml-sm-4">
                {renderText?.(member) || (
                  <>
                    <Typography.Title level={4}>{member.name}</Typography.Title>
                    {settings['feature.custom_member_abstract.enable'] ? (
                      <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                        {renderMemberAbstract(appId)}
                      </Typography.Paragraph>
                    ) : (
                      <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                        <p>{member.abstract}</p>
                      </Typography.Paragraph>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {content}
    </DefaultLayout>
  )
}

export default MemberPage
