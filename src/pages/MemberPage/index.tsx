import {
  Center,
  Divider,
  Flex,
  HStack,
  SkeletonText,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { FiGrid, FiList } from 'react-icons/fi'
import { defineMessages, useIntl } from 'react-intl'
import { Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import MemberAvatar from '../../components/common/MemberAvatar'
import PageHelmet from '../../components/common/PageHelmet'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MerchandiseOrderCollectionBlock from '../../components/merchandise/MerchandiseOrderCollectionBlock'
import ProgramPackageCollectionBlock from '../../components/package/ProgramPackageCollectionBlock'
import EnrolledProgramCollectionBlock from '../../containers/program/EnrolledProgramCollectionBlock'
import ProjectPlanCollectionBlock from '../../containers/project/ProjectPlanCollectionBlock'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useMemberPageEnrollmentsCounts, useProductEnrollment } from '../../hooks/common'
import { usePublicMember } from '../../hooks/member'
import ActivityTicketCollectionBlock from './ActivityTicketCollectionBlock'
import AppointmentPlanCollectionBlock from './AppointmentPlanCollectionBlock'
import PodcastProgramCollectionBlock from './PodcastProgramCollectionBlock'

const messages = defineMessages({
  merchandiseOrderLog: { id: 'product.merchandise.tab.orderLog', defaultMessage: '商品紀錄' },
})

const StyledTabContainer = styled.div`
  && {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  &&::-webkit-scrollbar {
    display: none;
  }
`

const StyledTabList = styled(TabList)`
  && {
    padding-bottom: 1px;
    border-bottom: 1px solid var(--gray);
    white-space: nowrap;
  }
`

const StyledTabPanel = styled(TabPanel)`
  && {
    padding: 24px 0;
  }
`

export const ProgramTab: React.FC<{
  onProgramTabClick: (tab: string) => void
  tab: string
  totalProgramPackageCounts: number
  totalProgramCounts: number
}> = ({ onProgramTabClick, tab, totalProgramPackageCounts, totalProgramCounts }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Flex cursor="pointer">
        <HStack spacing="10px">
          {totalProgramCounts > 0 && (
            <Text
              fontSize="2xl"
              as="b"
              onClick={() => onProgramTabClick('program')}
              color={tab === 'program' ? 'black' : '#cdcdcd'}
            >
              {formatMessage(productMessages.program.title.course)}
            </Text>
          )}
          {totalProgramCounts > 0 && totalProgramPackageCounts > 0 && (
            <Center height="20px">
              <Divider orientation="vertical" />
            </Center>
          )}
          {totalProgramPackageCounts > 0 && (
            <Text
              fontSize="2xl"
              as="b"
              onClick={() => onProgramTabClick('programPackage')}
              color={(totalProgramCounts === 0 && 'black') || (tab === 'programPackage' ? 'black' : '#cdcdcd')}
            >
              {formatMessage(commonMessages.ui.packages)}
            </Text>
          )}
        </HStack>
      </Flex>
    </>
  )
}

export const ViewSwitch: React.FC<{ view: string; onClick: () => void; className?: string }> = ({
  view,
  onClick,
  className,
}) => {
  const { formatMessage } = useIntl()
  return (
    <Flex marginRight="20px" cursor="pointer" className={className}>
      {
        <HStack spacing="5px" onClick={onClick}>
          {view === 'Grid' && (
            <>
              <FiList />
              <span>{formatMessage(commonMessages.term.list)}</span>
            </>
          )}
          {view === 'List' && (
            <>
              <FiGrid />
              <span>{formatMessage(commonMessages.term.grid)}</span>
            </>
          )}
        </HStack>
      }
    </Flex>
  )
}

const MemberPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { isAuthenticated, currentMemberId, permissions } = useAuth()
  const { settings, loading: loadingApp } = useApp()
  const { member } = usePublicMember(memberId)
  const {
    loadingProjectPlanEnrollments,
    loadingAppointmentEnrollments,
    loadingMerchandiseOrderEnrollments,
    projectPlanEnrollments,
    appointmentEnrollments,
    merchandiseOrderEnrollments,
  } = useMemberPageEnrollmentsCounts(memberId)
  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)
  const [programTab, setProgramTab] = useState('program')

  const {
    data: programEnrollment,
    error: programEnrollmentError,
    loading: programEnrollmentLoading,
  } = useProductEnrollment('program', memberId)
  const {
    data: expiredProgramEnrollment,
    error: expiredProgramEnrollmentError,
    loading: expiredProgramEnrollmentLoading,
  } = useProductEnrollment('expiredProgram', memberId)
  const {
    data: programPackageEnrollment,
    loading: programPackageEnrollmentLoading,
    error: programPackageEnrollmentError,
  } = useProductEnrollment('programPackage', memberId)
  const {
    data: expiredProgramPackageEnrollment,
    loading: expiredProgramPackageEnrollmentLoading,
    error: expiredProgramPackageEnrollmentError,
  } = useProductEnrollment('expiredProgramPackage', memberId)
  const {
    data: podcastEnrollment,
    loading: podcastEnrollmentLoading,
    error: podcastEnrollmentError,
  } = useProductEnrollment('podcast', memberId)
  const {
    data: activityEnrollment,
    loading: activityEnrollmentLoading,
    error: activityEnrollmentError,
  } = useProductEnrollment('activity', memberId)
  const totalProgramCounts = programEnrollment.length + expiredProgramEnrollment.length
  const totalProgramPackageCounts = programPackageEnrollment.length + expiredProgramPackageEnrollment.length
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
          {totalProgramCounts > 0 && programTab === 'program' && (
            <EnrolledProgramCollectionBlock
              memberId={memberId}
              onProgramTabClick={tab => setProgramTab(tab)}
              programTab={programTab}
              programEnrollment={programEnrollment}
              expiredProgramEnrollment={expiredProgramEnrollment}
              totalProgramPackageCounts={totalProgramPackageCounts}
              totalProgramCounts={totalProgramCounts}
              loading={programEnrollmentLoading || expiredProgramEnrollmentLoading}
              isError={Boolean(programEnrollmentError) || Boolean(expiredProgramEnrollmentError)}
            />
          )}
          {((totalProgramCounts === 0 && totalProgramPackageCounts > 0) ||
            (totalProgramCounts > 0 && programTab === 'programPackage')) && (
            <ProgramPackageCollectionBlock
              memberId={memberId}
              onProgramTabClick={tab => setProgramTab(tab)}
              programTab={programTab}
              programPackageEnrollment={programPackageEnrollment}
              expiredProgramPackageEnrollment={expiredProgramPackageEnrollment}
              totalProgramPackageCounts={totalProgramPackageCounts}
              totalProgramCounts={totalProgramCounts}
              loading={programPackageEnrollmentLoading || expiredProgramPackageEnrollmentLoading}
              isError={Boolean(programPackageEnrollmentError) || Boolean(expiredProgramPackageEnrollmentError)}
            />
          )}
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
        activityEnrollment.length > 0,
      content: (
        <ActivityTicketCollectionBlock activityEnrollment={activityEnrollment} isError={activityEnrollmentError} />
      ),
    },
    {
      key: 'podcast',
      name: formatMessage(commonMessages.tab.podcast),
      isVisible:
        (currentMemberId === memberId || Boolean(permissions.CHECK_MEMBER_PAGE_PODCAST_INFO)) &&
        podcastEnrollment.length > 0,
      content: (
        <PodcastProgramCollectionBlock
          memberId={memberId}
          podcastEnrollment={podcastEnrollment}
          loading={podcastEnrollmentLoading}
          isError={Boolean(podcastEnrollmentError)}
        />
      ),
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
        <StyledTabContainer className="container">
          <StyledTabList>
            <>
              {tabContents.map(v => (
                <Tab key={v.key} onClick={() => setActiveKey(v.key)}>
                  {v.name}
                </Tab>
              ))}
              {programEnrollmentLoading ||
              programPackageEnrollmentLoading ||
              loadingProjectPlanEnrollments ||
              activityEnrollmentLoading ||
              podcastEnrollmentLoading ||
              loadingAppointmentEnrollments ||
              loadingMerchandiseOrderEnrollments ? (
                <Flex ml="0.5rem" alignItems="center">
                  <Spinner />
                </Flex>
              ) : null}
            </>
          </StyledTabList>
        </StyledTabContainer>
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
      {settings['hubspot.portal_id'] ? (
        <Helmet>
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={`//js.hs-scripts.com/${settings['hubspot.portal_id']}.js`}
          />
        </Helmet>
      ) : null}
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
                <Typography.Title level={4}>{member.name}</Typography.Title>
                <Typography.Paragraph>
                  <p>{member.abstract}</p>
                </Typography.Paragraph>
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
