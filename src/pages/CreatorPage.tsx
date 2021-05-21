import { Button, Skeleton, Tabs } from 'antd'
import BraftEditor from 'braft-editor'
import moment from 'moment'
import { render } from 'mustache'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import AppointmentCollectionTabs from '../components/appointment/AppointmentCollectionTabs'
import { useAuth } from '../components/auth/AuthContext'
import { AuthModalContext } from '../components/auth/AuthModal'
import PostItemCollection from '../components/blog/PostItemCollection'
import CheckoutPodcastPlanModal from '../components/checkout/CheckoutPodcastPlanModal'
import CreatorIntroBlock from '../components/common/CreatorIntroBlock'
import OverviewBlock from '../components/common/OverviewBlock'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import PodcastProgramCard from '../components/podcast/PodcastProgramCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import ProgramCard from '../components/program/ProgramCard'
import { useApp } from '../containers/common/AppContext'
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline'
import { desktopViewMixin } from '../helpers'
import { commonMessages, usersMessages } from '../helpers/translation'
import { useAppointmentPlanCollection } from '../hooks/appointment'
import { usePostPreviewCollection } from '../hooks/blog'
import { useMember, usePublicMember } from '../hooks/member'
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

const CreatorPage: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>()
  const { currentMemberId } = useAuth()
  const { loadingMember, member } = useMember(currentMemberId || '')
  const { member: creator, loadingMember: loadingCreator } = usePublicMember(creatorId)

  if (loadingMember || loadingCreator) {
    return (
      <DefaultLayout white>
        <Skeleton active />
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
        renderTrigger={({ setVisible }) => (
          <CreatorTabs creatorId={creatorId} member={creator} setCheckoutModalVisible={() => setVisible()} />
        )}
        paymentType="subscription"
        creatorId={creatorId}
        member={member}
      />
    </DefaultLayout>
  )
}

const CreatorTabs: React.FC<{
  creatorId: string
  member: MemberPublicProps | null
  setCheckoutModalVisible?: () => void
}> = ({ creatorId, member, setCheckoutModalVisible }) => {
  const { formatMessage } = useIntl()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enabledModules, settings } = useApp()

  const { currentMemberId, isAuthenticated } = useAuth()
  const { programs } = usePublishedProgramCollection({ instructorId: creatorId, isPrivate: false })
  const { posts } = usePostPreviewCollection({ authorId: creatorId })
  const { podcastPlanIds } = usePodcastPlanIds(creatorId)
  const { enrolledPodcastPlansCreators } = useEnrolledPodcastPlansCreators(currentMemberId || '')
  const { podcastPrograms } = usePodcastProgramCollection(creatorId)
  const { appointmentPlans } = useAppointmentPlanCollection(creatorId, moment().endOf('minute').toDate())

  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)

  const isEnrolledPodcastPlan = enrolledPodcastPlansCreators
    .map(enrolledPodcastPlansCreator => enrolledPodcastPlansCreator.id)
    .includes(creatorId)

  let seoMeta: { title?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta'])?.CreatorPage
  } catch (error) {}

  const siteTitle =
    seoMeta &&
    seoMeta.title &&
    render(seoMeta.title, {
      creatorName: member?.name || '',
      appointmentPlanTitles:
        enabledModules.appointment && appointmentPlans.length !== 0
          ? appointmentPlans
              .map(appointmentPlan => appointmentPlan.title)
              .slice(0, 3)
              .join('、')
          : '',
    })

  const siteDescription = member?.abstract || settings['open_graph.description']
  const siteImage = member?.pictureUrl || settings['open_graph.image']

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: siteImage,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: settings['seo.name'],
      description: settings['open_graph.description'],
    },
  })

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

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
                    podcastPrograms={podcastPrograms}
                    onChangeTab={key => setActiveKey(key)}
                    onSubscribe={() =>
                      isAuthenticated
                        ? setCheckoutModalVisible && setCheckoutModalVisible()
                        : setAuthModalVisible && setAuthModalVisible(true)
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
                          isAuthenticated
                            ? setCheckoutModalVisible && setCheckoutModalVisible()
                            : setAuthModalVisible && setAuthModalVisible(true)
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
                        return <Link to={`/podcasts/${podcastProgram.id}`}>{elem}</Link>
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
                            isAuthenticated
                              ? setCheckoutModalVisible && setCheckoutModalVisible()
                              : setAuthModalVisible && setAuthModalVisible(true)
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
                    podcastPrograms={podcastPrograms}
                    onChangeTab={key => setActiveKey(key)}
                    onSubscribe={() => {
                      isAuthenticated
                        ? setCheckoutModalVisible && setCheckoutModalVisible()
                        : setAuthModalVisible && setAuthModalVisible(true)
                    }}
                  />
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        )}
      </Tabs>
    </>
  )
}

export default CreatorPage
