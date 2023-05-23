import { Flex, SkeletonText, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
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
import PageHelmet from '../../components/common/PageHelmet'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MerchandiseOrderCollectionBlock from '../../components/merchandise/MerchandiseOrderCollectionBlock'
import ProgramPackageCollectionBlock from '../../components/package/ProgramPackageCollectionBlock'
import EnrolledProgramCollectionBlock from '../../containers/program/EnrolledProgramCollectionBlock'
import ProjectPlanCollectionBlock from '../../containers/project/ProjectPlanCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { useMemberPageEnrollmentsCounts } from '../../hooks/common'
import { usePublicMember } from '../../hooks/member'
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
  const { id: appId, settings, loading: loadingApp } = useApp()
  const { member } = usePublicMember(memberId)
  const {
    loadingProgramPackageEnrollments,
    loadingProjectPlanEnrollments,
    loadingActivityTicketEnrollments,
    loadingPodcastProgramEnrollments,
    loadingAppointmentEnrollments,
    loadingMerchandiseOrderEnrollments,
    programPackageEnrollments,
    projectPlanEnrollments,
    activityTicketEnrollments,
    podcastProgramEnrollments,
    appointmentEnrollments,
    merchandiseOrderEnrollments,
  } = useMemberPageEnrollmentsCounts(memberId)
  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)

  let content = null

  if (memberId === 'currentMemberId' && isAuthenticated) {
    return <Redirect to={`/members/${currentMemberId}`} />
  }
  if (!currentMemberId) {
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
      isVisible: currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_PROGRAM_INFO),
      content: (
        <>
          <EnrolledProgramCollectionBlock memberId={memberId} />
          {programPackageEnrollments > 0 ? (
            settings['feature.expired_program_package_plan.enable'] === '0' ? null : (
              <ProgramPackageCollectionBlock memberId={memberId} />
            )
          ) : null}
        </>
      ),
    },
    {
      key: 'project-plan',
      name: formatMessage(commonMessages.tab.project),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_PROJECT_INFO)) &&
        projectPlanEnrollments > 0,
      content: <ProjectPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'activity-ticket',
      name: formatMessage(commonMessages.tab.activity),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_ACTIVITY_INFO)) &&
        activityTicketEnrollments > 0,
      content: <ActivityTicketCollectionBlock memberId={memberId} />,
    },
    {
      key: 'podcast',
      name: formatMessage(commonMessages.tab.podcast),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_PODCAST_INFO)) &&
        podcastProgramEnrollments > 0,
      content: <PodcastProgramCollectionBlock memberId={memberId} />,
    },
    {
      key: 'appointment',
      name: formatMessage(commonMessages.tab.appointment),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_APPOINTMENT_INFO)) &&
        appointmentEnrollments > 0,
      content: <AppointmentPlanCollectionBlock memberId={memberId} />,
    },
    {
      key: 'merchandise-order',
      name: formatMessage(messages.merchandiseOrderLog),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_MERCHANDISE_INFO)) &&
        merchandiseOrderEnrollments > 0,
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
            <>
              {tabContents.map(v => (
                <Tab key={v.key} onClick={() => setActiveKey(v.key)}>
                  {v.name}
                </Tab>
              ))}
              {loadingProgramPackageEnrollments ||
              loadingProjectPlanEnrollments ||
              loadingActivityTicketEnrollments ||
              loadingPodcastProgramEnrollments ||
              loadingAppointmentEnrollments ||
              loadingMerchandiseOrderEnrollments ? (
                <Flex ml="0.5rem" alignItems="center">
                  <Spinner />
                </Flex>
              ) : null}
            </>
          </StyledTabList>
        </div>
      </div>
      <TabPanels>
        {tabContents.map(v => (
          <StyledTabPanel key={v.key}>{v.content}</StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
  return (
    <DefaultLayout>
      {/* // TODO: need to extend page helmet */}
      {!loadingApp && <PageHelmet title={formatMessage(commonMessages.content.myPage)} />}
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
