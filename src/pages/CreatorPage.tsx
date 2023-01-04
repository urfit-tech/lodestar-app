import { SkeletonText } from '@chakra-ui/react'
import { Button, Tabs } from 'antd'
import BraftEditor from 'braft-editor'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import ActivityBlock from '../components/activity/ActivityBlock'
import AppointmentCollectionTabs from '../components/appointment/AppointmentCollectionTabs'
import { AuthModalContext } from '../components/auth/AuthModal'
import PostItemCollection from '../components/blog/PostItemCollection'
import CheckoutPodcastPlanModal from '../components/checkout/CheckoutPodcastPlanModal'
import CreatorIntroBlock from '../components/common/CreatorIntroBlock'
import OverviewBlock from '../components/common/OverviewBlock'
import PageHelmet from '../components/common/PageHelmet'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCollectionBlock from '../components/merchandise/MerchandiseCollectionBlock'
import PodcastProgramCard from '../components/podcast/PodcastProgramCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import ProgramCollection from '../components/program/ProgramCollection'
import ProjectIntroCard from '../components/project/ProjectIntroCard'
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline'
import { desktopViewMixin } from '../helpers'
import { commonMessages, usersMessages } from '../helpers/translation'
import { usePublishedActivityCollection } from '../hooks/activity'
import { useAppointmentPlanCollection } from '../hooks/appointment'
import { usePostPreviewCollection } from '../hooks/blog'
import { usePublicMember } from '../hooks/member'
import { useMerchandiseCollection } from '../hooks/merchandise'
import { useEnrolledPodcastPlansCreators, usePodcastPlanIds, usePodcastProgramCollection } from '../hooks/podcast'
import { usePublishedProgramCollection } from '../hooks/program'
import { useMemberProjectCollection } from '../hooks/project'
import { MemberPublicProps } from '../types/member'
import NotFoundPage from './NotFoundPage'
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledCallToSubscription = styled.div`
  padding: 1.5rem;
  background-color: var(--gray-lighter);

  .row > div:first-child {
    margin-bottom: 1.25rem;
  }

  ${desktopViewMixin(css`
    .row > div:first-child {
      margin-bottom: 0;
    }
    .row > div:last-child {
      text-align: right;
    }
  `)}
`
const ProjectTabStyl = styled.div`
  .ant-tabs-bar {
    border: none;
  }
  .ant-tabs-tab-active {
    padding: 10px 20px;
    border-radius: 22px;
    background-color: #4c5b8f;
    border: solid 1px #4c5b8f;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
  .ant-tabs-tab {
    padding: 10px 20px;
    border-radius: 22px;
    margin: 10px 0;
    border: solid 1px #cdcdcd;
    margin-right: 20px;
  }
  .ant-tabs-nav .ant-tabs-ink-bar {
    background-color: transparent;
  }
`
const CreatorPage: React.VFC = () => {
  const { creatorId } = useParams<{ creatorId: string }>()
  const { member: creator, loadingMember: loadingCreator } = usePublicMember(creatorId)
  const avatarUrl = creator?.pictureUrl
  const creatorName = creator?.name || creator?.username || ''
  const description = creator?.description || ''

  if (loadingCreator) {
    return (
      <DefaultLayout white>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!creator || !['content-creator', 'app-owner'].includes(creator.role)) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout white>
      <PageHelmet
        title={creatorName}
        description={description}
        keywords={[creatorName]}
        openGraph={[
          { property: 'og:title', content: creatorName },
          { property: 'og:image', content: avatarUrl! },
          { property: 'og:description', content: description },
        ]}
      />
      <CreatorIntroBlock
        avatarUrl={avatarUrl}
        title={creatorName}
        subTitle=""
        description={creator?.abstract || ''}
        tags={creator?.specialtyNames || null}
      />

      <CheckoutPodcastPlanModal
        creatorId={creatorId}
        renderTrigger={({ onOpen }) => (
          <CreatorTabs creatorId={creatorId} member={creator} onCheckoutModalOpen={onOpen} />
        )}
      />
    </DefaultLayout>
  )
}

const CreatorTabs: React.VFC<{
  creatorId: string
  member: MemberPublicProps | null
  onCheckoutModalOpen?: () => void
}> = ({ creatorId, member, onCheckoutModalOpen }) => {
  const { formatMessage } = useIntl()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enabledModules } = useApp()
  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)
  const [defaultActive] = useQueryParam('active', StringParam)
  const [isMerchandisesPhysical] = useQueryParam('isPhysical', BooleanParam)

  const { currentMemberId, isAuthenticated } = useAuth()
  const { projects } = useMemberProjectCollection(creatorId || '')

  const { programs } = usePublishedProgramCollection({
    instructorId: creatorId,
    isPrivate: false,
  })
  const { activities } = usePublishedActivityCollection({
    organizerId: creatorId,
  })

  const { posts } = usePostPreviewCollection({ authorId: creatorId })
  const { podcastPlanIds } = usePodcastPlanIds(creatorId)
  const { enrolledPodcastPlansCreators } = useEnrolledPodcastPlansCreators(currentMemberId || '')
  const { podcastPrograms } = usePodcastProgramCollection(creatorId)
  const { appointmentPlans } = useAppointmentPlanCollection(creatorId, moment().endOf('minute').toDate())
  const { merchandises } = useMerchandiseCollection({
    isPhysical: isMerchandisesPhysical !== undefined ? !!isMerchandisesPhysical : undefined,
    ownerId: creatorId,
  })
  const isEnrolledPodcastPlan = enrolledPodcastPlansCreators
    .map(enrolledPodcastPlansCreator => enrolledPodcastPlansCreator.id)
    .includes(creatorId)

  const projectsTab = [
    {
      key: 'myproject',
      name: formatMessage(usersMessages.tab.addProjectsTab1),
      content: projects.filter(v => v.authorId === creatorId),
    },
    {
      key: 'otherproject',
      name: formatMessage(usersMessages.tab.addProjectsTab2),
      content: projects.filter(v => v.authorId !== creatorId),
    },
  ]
  const tabContents: {
    key: string
    name: string
    isVisible: boolean
    content?: React.ReactElement
  }[] = [
    {
      key: 'introduction',
      name: formatMessage(usersMessages.tab.intro),
      isVisible: true,
      content: (
        <div className="row">
          <div className="col-lg-8 col-12 mb-4">
            {member?.description && !BraftEditor.createEditorState(member?.description).isEmpty() ? (
              <BraftContent>{member?.description}</BraftContent>
            ) : (
              <StyledDescription className="ml-3">
                {formatMessage(commonMessages.content.noIntroduction)}
              </StyledDescription>
            )}
          </div>
          <div className="col-lg-4 col-12">
            <OverviewBlock
              programs={programs}
              previousPage={`creators_${creatorId}`}
              podcastPrograms={podcastPrograms}
              onChangeTab={key => setActiveKey(key)}
              onSubscribe={() =>
                isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible && setAuthModalVisible(true)
              }
            />
          </div>
        </div>
      ),
    },
    {
      key: 'programs',
      name: formatMessage(usersMessages.tab.addPrograms),
      isVisible: programs.length > 0,
      content: (
        <>
          <ProgramCollection programs={programs} />
        </>
      ),
    },
    {
      key: 'projects',
      name: formatMessage(usersMessages.tab.addProjects),
      isVisible: projects.length > 0,
      content: (
        <Tabs
          defaultActiveKey="1"
          renderTabBar={(tabsProps, DefaultTabBar) => (
            <ProjectTabStyl className="container">
              <DefaultTabBar {...tabsProps} />
            </ProjectTabStyl>
          )}
        >
          {projectsTab.map(project => {
            return (
              <Tabs.TabPane tab={project.name} key={project.key}>
                <div className="row">
                  {project.content.length > 0 ? (
                    project.content.map(item => {
                      return (
                        <div key={item.id} className="col-12 col-lg-4 mb-5">
                          <Link to={`/projects/${item.id}`}>
                            <ProjectIntroCard {...item} />
                          </Link>
                        </div>
                      )
                    })
                  ) : (
                    <StyledDescription className="d-flex flex-grow-1 justify-content-center text-center container col-12 align-self-center">
                      {formatMessage(commonMessages.content.noProject)}
                    </StyledDescription>
                  )}
                </div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      ),
    },
    {
      key: 'activities',
      name: formatMessage(usersMessages.tab.addActivities),
      isVisible: activities.length > 0,
      content: (
        <div className="row">
          {activities.map(activity => (
            <div key={activity.id} className="col-12 col-lg-4 mb-4">
              <ActivityBlock
                id={activity.id}
                title={activity.title}
                coverUrl={activity.coverUrl || undefined}
                isParticipantsVisible={activity.isParticipantsVisible}
                participantCount={activity.participantCount}
                totalSeats={activity.totalSeats}
                startedAt={activity.startedAt || undefined}
                endedAt={activity.endedAt || undefined}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'posts',
      name: formatMessage(usersMessages.tab.mediaPost),
      isVisible: Boolean(enabledModules.blog) && posts.length > 0,
      content: (
        <>
          <PostItemCollection posts={posts} pageName="creatorPage" />
        </>
      ),
    },
    {
      key: 'podcasts',
      name: formatMessage(usersMessages.tab.podcasts),
      isVisible: Boolean(enabledModules.podcast) && podcastPrograms.length > 0 && !isEnrolledPodcastPlan,
      content: (
        <>
          <StyledCallToSubscription className="mb-5">
            <div className="row align-items-center">
              <div className="col-12 col-lg-6">{formatMessage(usersMessages.tab.podcasts)}</div>
              <div className="col-12 col-lg-6">
                <Button
                  icon="plus"
                  size="large"
                  onClick={() =>
                    isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible && setAuthModalVisible(true)
                  }
                >
                  {formatMessage(commonMessages.button.subscribe)}
                </Button>
              </div>
            </div>
          </StyledCallToSubscription>
          <div className="row">
            <div className="col-12 col-lg-8 mb-3">
              <PodcastProgramTimeline
                memberId={currentMemberId}
                podcastPrograms={podcastPrograms}
                renderItem={({ podcastProgram, isEnrolled, isSubscribed }) => {
                  const elem = (
                    <PodcastProgramCard
                      coverUrl={podcastProgram.coverUrl}
                      title={podcastProgram.title}
                      instructor={podcastProgram.instructor}
                      salePrice={podcastProgram.salePrice}
                      listPrice={podcastProgram.listPrice}
                      duration={podcastProgram.duration}
                      durationSecond={podcastProgram.durationSecond}
                      isEnrolled={isEnrolled}
                    />
                  )

                  if (isEnrolledPodcastPlan) {
                    return (
                      <Link to={`/podcasts/${podcastProgram.id}?instructorId=${podcastProgram?.instructor?.id}`}>
                        {elem}
                      </Link>
                    )
                  }

                  return (
                    <PodcastProgramPopover
                      key={podcastProgram.id}
                      isEnrolled={isEnrolled}
                      isSubscribed={isSubscribed}
                      podcastProgramId={podcastProgram.id}
                      title={podcastProgram.title}
                      listPrice={podcastProgram.listPrice}
                      salePrice={podcastProgram.salePrice}
                      duration={podcastProgram.duration}
                      durationSecond={podcastProgram.durationSecond}
                      description={podcastProgram.description}
                      categories={podcastProgram.categories}
                      instructor={podcastProgram.instructor}
                      onSubscribe={() =>
                        isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible && setAuthModalVisible(true)
                      }
                    >
                      {elem}
                    </PodcastProgramPopover>
                  )
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      key: 'appointments',
      name: formatMessage(usersMessages.tab.appointments),
      isVisible: Boolean(enabledModules.appointment) && appointmentPlans.length > 0,
      content: (
        <div className="row">
          <div className="col-lg-8 col-12 mb-3">
            <AppointmentCollectionTabs appointmentPlans={appointmentPlans} />
          </div>

          <div className="col-lg-4 col-12">
            <OverviewBlock
              programs={programs}
              previousPage={`creators_${creatorId}`}
              podcastPrograms={podcastPrograms}
              onChangeTab={key => setActiveKey(key)}
              onSubscribe={() => (isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible?.(true))}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'merchandises',
      name: formatMessage(usersMessages.tab.merchandises),
      isVisible: Boolean(enabledModules.merchandise) && merchandises?.length > 0,
      content: (
        <>
          <MerchandiseCollectionBlock merchandises={merchandises} />
        </>
      ),
    },
  ].filter(v => v.isVisible)
  return (
    <>
      <Tabs
        activeKey={
          activeKey || (enabledModules.appointment && appointmentPlans.length !== 0 ? 'appointments' : 'introduction')
        }
        onChange={key => setActiveKey(key)}
        renderTabBar={(tabsProps, DefaultTabBar) => (
          <div className="container">
            <DefaultTabBar {...tabsProps} />
          </div>
        )}
      >
        {tabContents.map(v => {
          return (
            <Tabs.TabPane tab={v.name} key={v.key}>
              <div className="container py-4">{v.content}</div>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </>
  )
}

export default CreatorPage
