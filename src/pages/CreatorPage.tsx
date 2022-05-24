import { SkeletonText } from '@chakra-ui/react'
import { Button, Tabs } from 'antd'
import BraftEditor from 'braft-editor'
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
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCollectionBlock from '../components/merchandise/MerchandiseCollectionBlock'
import PodcastProgramCard from '../components/podcast/PodcastProgramCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import ProgramCard from '../components/program/ProgramCard'
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

const CreatorPage: React.VFC = () => {
  const { creatorId } = useParams<{ creatorId: string }>()
  const { member: creator, loadingMember: loadingCreator } = usePublicMember(creatorId)

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
      <CreatorIntroBlock
        avatarUrl={creator?.pictureUrl}
        title={creator?.name || creator?.username || ''}
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
  const [isMerchandisesPhysical] = useQueryParam('isPhysical', BooleanParam)

  const { currentMemberId, isAuthenticated } = useAuth()
  const { programs } = usePublishedProgramCollection({ instructorId: creatorId, isPrivate: false })
  const { activities } = usePublishedActivityCollection({ organizerId: creatorId })
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
        {!!member && (
          <Tabs.TabPane tab={formatMessage(usersMessages.tab.intro)} key="introduction">
            <div className="container py-4">
              <div className="row">
                <div className="col-lg-8 col-12 mb-4">
                  {member.description && !BraftEditor.createEditorState(member.description).isEmpty() ? (
                    <BraftContent>{member.description}</BraftContent>
                  ) : (
                    <StyledDescription className="ml-3">
                      {formatMessage(commonMessages.content.noIntroduction)}
                    </StyledDescription>
                  )}
                </div>
                <div className="col-lg-4 col-12">
                  <OverviewBlock
                    programs={programs}
                    previousPage={`creator_${creatorId}`}
                    podcastPrograms={podcastPrograms}
                    onChangeTab={key => setActiveKey(key)}
                    onSubscribe={() =>
                      isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible && setAuthModalVisible(true)
                    }
                  />
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        )}

        <Tabs.TabPane tab={formatMessage(usersMessages.tab.addPrograms)} key="programs">
          <div className="container py-4">
            <div className="row">
              {programs.length === 0 ? (
                <StyledDescription className="ml-3">
                  {formatMessage(commonMessages.content.noProgram)}
                </StyledDescription>
              ) : (
                programs.map(program => (
                  <div key={program.id} className="col-12 col-lg-4 mb-4">
                    <ProgramCard program={program} />
                  </div>
                ))
              )}
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab={formatMessage(usersMessages.tab.addActivities)} key="activities">
          <div className="container py-4">
            <div className="row">
              {activities.length === 0 ? (
                <StyledDescription className="ml-3">
                  {formatMessage(commonMessages.content.noActivity)}
                </StyledDescription>
              ) : (
                activities
                  .filter(activity => activity.endedAt && activity.endedAt.getTime() > Date.now())
                  .map(activity => (
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
                  ))
              )}
            </div>
          </div>
        </Tabs.TabPane>

        {enabledModules.blog && (
          <Tabs.TabPane tab={formatMessage(usersMessages.tab.mediaPost)} key="posts">
            <div className="container py-4">
              {posts.length === 0 ? (
                <StyledDescription className="ml-3">{formatMessage(commonMessages.content.noPost)}</StyledDescription>
              ) : (
                <PostItemCollection posts={posts} />
              )}
            </div>
          </Tabs.TabPane>
        )}

        {enabledModules.podcast && (
          <Tabs.TabPane tab={formatMessage(usersMessages.tab.podcasts)} key="podcasts">
            <div className="container py-4">
              {podcastPrograms.length === 0 && (
                <StyledDescription className="ml-3">
                  {formatMessage(commonMessages.content.noPodcast)}
                </StyledDescription>
              )}
              {podcastPlanIds.length > 0 && !isEnrolledPodcastPlan && (
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
              )}
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
            </div>
          </Tabs.TabPane>
        )}

        {enabledModules.appointment && (
          <Tabs.TabPane tab={formatMessage(usersMessages.tab.appointments)} key="appointments">
            <div className="container py-4">
              <div className="row">
                <div className="col-lg-8 col-12 mb-3">
                  {appointmentPlans.length === 0 ? (
                    <StyledDescription className="ml-3">
                      {formatMessage(commonMessages.content.noAppointment)}
                    </StyledDescription>
                  ) : (
                    <AppointmentCollectionTabs appointmentPlans={appointmentPlans} />
                  )}
                </div>

                <div className="col-lg-4 col-12">
                  <OverviewBlock
                    programs={programs}
                    previousPage={`creator_${creatorId}`}
                    podcastPrograms={podcastPrograms}
                    onChangeTab={key => setActiveKey(key)}
                    onSubscribe={() => (isAuthenticated ? onCheckoutModalOpen?.() : setAuthModalVisible?.(true))}
                  />
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        )}
        {enabledModules.merchandise && (
          <Tabs.TabPane tab={formatMessage(usersMessages.tab.merchandises)} key="merchandises">
            <div className="container py-4">
              <MerchandiseCollectionBlock merchandises={merchandises} />
            </div>
          </Tabs.TabPane>
        )}
      </Tabs>
    </>
  )
}

export default CreatorPage
