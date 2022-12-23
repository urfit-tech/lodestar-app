import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { Skeleton, Stack } from '@chakra-ui/react'
import { Tabs } from 'antd'
import gql from 'graphql-tag'
import { max, min } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import React, { useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeepPick } from 'ts-deep-pick/lib'
import { StringParam, useQueryParam } from 'use-query-params'
import ActivityBlock from '../components/activity/ActivityBlock'
import CreatorBriefCard from '../components/appointment/CreatorBriefCard'
import { AuthModalContext } from '../components/auth/AuthModal'
import PostCard from '../components/blog/PostCard'
import CheckoutPodcastPlanModal from '../components/checkout/CheckoutPodcastPlanModal'
import { BREAK_POINT } from '../components/common/Responsive'
import { StyledBanner } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCard from '../components/merchandise/MerchandiseCard'
import ProgramPackageCard from '../components/package/PackageCard'
import PodcastProgramBriefCard from '../components/podcast/PodcastProgramBriefCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import ProgramCard from '../components/program/ProgramCard'
import ProjectIntroCard from '../components/project/ProjectIntroCard'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { ReactComponent as SearchIcon } from '../images/search.svg'
import { Activity } from '../types/activity'
import { PostPreviewProps } from '../types/blog'
import { MerchandiseBriefProps } from '../types/merchandise'
import { PodcastProgramBriefProps } from '../types/podcast'
import { PeriodType, ProgramBriefProps, ProgramPlan, ProgramRole } from '../types/program'
import { ProgramPackageProps } from '../types/programPackage'
import { ProjectIntroProps } from '../types/project'
import pageMessages from './translation'

const StyledTitle = styled.div`
  color: var(--gray-darker);
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 0.8px;

  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
    font-size: 24px;
    letter-spacing: 0.2px;
  }
`
const StyledContent = styled.div`
  height: calc(60vh);
`
const StyledTabBarWrapper = styled.div`
  background-color: var(--gray-lighter);

  .ant-tabs-nav-wrap {
    justify-content: center;
  }
`

const SearchPage: React.VFC = () => {
  const [title] = useQueryParam('q', StringParam)
  const [tag] = useQueryParam('tag', StringParam)
  const { isAuthenticating, currentMemberId } = useAuth()
  const { loading, enabledModules } = useApp()

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledTitle>
            {title && (
              <>
                <Icon as={SearchIcon} className="mr-2" />
                <span>{title}</span>
              </>
            )}
            {tag && <span>#{tag}</span>}
          </StyledTitle>
        </div>
      </StyledBanner>

      {isAuthenticating || loading ? (
        <Stack spacing="20px" className="container mt-5">
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <SearchResultBlock memberId={currentMemberId} title={enabledModules.search ? title : undefined} tag={tag} />
      )}
    </DefaultLayout>
  )
}

const SearchResultBlock: React.VFC<{
  memberId: string | null
  title?: string | null
  tag?: string | null
}> = ({ memberId, title, tag }) => {
  const { formatMessage } = useIntl()
  const { isAuthenticated } = useAuth()
  const { enabledModules } = useApp()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const [tab, setTab] = useQueryParam('tab', StringParam)

  const { loadingSearchResults, errorSearchResults, searchResults } = useSearchProductCollection(memberId, {
    title,
    tag,
  })

  useEffect(() => {
    if (searchResults) {
      let index = 1
      for (let program of searchResults.programs) {
        const listPrice = program.plans[0]?.listPrice || 0
        const salePrice =
          (program.plans[0]?.soldAt?.getTime() || 0) > Date.now()
            ? program.plans[0]?.salePrice
            : (program.plans[0]?.soldAt?.getTime() || 0) > Date.now()
            ? program.plans[0]?.salePrice
            : undefined
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: program.id,
          name: program.title,
          category: 'Program',
          price: `${salePrice || listPrice}`,
          position: index,
        })
        index += 1
        if (index % 20 === 0) ReactGA.ga('send', 'pageview')
      }
      for (let activity of searchResults.activities) {
        if (activity.tickets) {
          for (let activityTicket of activity.tickets) {
            ReactGA.plugin.execute('ec', 'addImpression', {
              id: activityTicket.id,
              name: `${activity.title} - ${activityTicket.title}`,
              category: 'ActivityTicket',
              price: `${activityTicket.price}`,
              position: index,
            })
            index += 1
            if (index % 20 === 0) ReactGA.ga('send', 'pageview')
          }
        }
      }
      for (let podcastProgram of searchResults.podcastPrograms) {
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: podcastProgram.id,
          name: podcastProgram.title,
          category: 'PodcastProgram',
          price: `${podcastProgram.listPrice}`,
          position: index,
        })
        index += 1
        if (index % 20 === 0) ReactGA.ga('send', 'pageview')
      }
      for (let merchandise of searchResults.merchandises) {
        for (let merchandiseSpec of merchandise.specs) {
          ReactGA.plugin.execute('ec', 'addImpression', {
            id: merchandiseSpec.id,
            name: `${merchandise.title} - ${merchandiseSpec.title}`,
            category: 'MerchandiseSpec',
            price: `${merchandiseSpec.listPrice}`,
            position: index,
          })
          index += 1
          if (index % 20 === 0) ReactGA.ga('send', 'pageview')
        }
      }
      for (let project of searchResults.projects) {
        if (project.projectPlans) {
          for (let projectPlan of project.projectPlans) {
            ReactGA.plugin.execute('ec', 'addImpression', {
              id: projectPlan.id,
              name: `${project.title} - ${projectPlan.title}`,
              category: 'ProjectPlan',
              price: `${projectPlan.listPrice}`,
              position: index,
            })
            index += 1
            if (index % 20 === 0) ReactGA.ga('send', 'pageview')
          }
        }
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [searchResults])

  if (loadingSearchResults) {
    return (
      <Stack spacing="20px" className="container mt-5">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }

  if (errorSearchResults || sum(Object.values(searchResults).map(value => value.length)) === 0) {
    return (
      <StyledContent className="d-flex align-items-center justify-content-center">
        {formatMessage(pageMessages.SearchPage.noSearchResult)}
      </StyledContent>
    )
  }

  const defaultActiveKey = Object.keys(searchResults).find(key => searchResults[key]?.length > 0)

  return (
    <Tabs
      activeKey={tab || defaultActiveKey}
      onChange={key => setTab(key)}
      renderTabBar={(props, DefaultTabBar) => (
        <StyledTabBarWrapper>
          <div className="container">
            <DefaultTabBar {...props} className="mb-0" />
          </div>
        </StyledTabBarWrapper>
      )}
    >
      {searchResults.programs.length > 0 && (
        <Tabs.TabPane
          key="programs"
          tab={`${formatMessage(pageMessages.SearchPage.program)} (${searchResults.programs.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.programs.map(program => (
                <div key={program.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <ProgramCard program={program} withMeta />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.programPackages.length > 0 && (
        <Tabs.TabPane
          key="programPackages"
          tab={`${formatMessage(pageMessages.SearchPage.programPackage)} (${searchResults.programPackages.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.programPackages.map(programPackage => (
                <div key={programPackage.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <ProgramPackageCard
                    id={programPackage.id}
                    coverUrl={programPackage.coverUrl}
                    title={programPackage.title}
                  />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.activities.length > 0 && (
        <Tabs.TabPane
          key="activities"
          tab={`${formatMessage(pageMessages.SearchPage.activity)} (${searchResults.activities.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.activities.map(activity => (
                <div key={activity.id} className="col-12 col-md-6 col-lg-4 mb-4">
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
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.projects.length > 0 && (
        <Tabs.TabPane
          key="projects"
          tab={`${formatMessage(pageMessages.SearchPage.project)} (${searchResults.projects.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.projects.map(project => (
                <div key={project.id} className="col-12 col-lg-4 mb-5">
                  <Link to={`/projects/${project.id}`}>
                    <ProjectIntroCard {...project} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.fundingProjects.length > 0 && (
        <Tabs.TabPane
          key="fundingProjects"
          tab={`${formatMessage(pageMessages.SearchPage.fundingProject)} (${searchResults.fundingProjects.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.fundingProjects.map(project => (
                <div key={project.id} className="col-12 col-lg-4 mb-5">
                  <Link to={`/projects/${project.id}`}>
                    <ProjectIntroCard {...project} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.preOrderProjects.length > 0 && (
        <Tabs.TabPane
          key="preOrderProjects"
          tab={`${formatMessage(pageMessages.SearchPage.preOrderProject)} (${searchResults.preOrderProjects.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.preOrderProjects.map(project => (
                <div key={project.id} className="col-12 col-lg-4 mb-5">
                  <Link to={`/projects/${project.id}`}>
                    <ProjectIntroCard {...project} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.posts.length > 0 && (
        <Tabs.TabPane
          key="posts"
          tab={`${formatMessage(pageMessages.SearchPage.post)} (${searchResults.posts.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.posts.map(post => (
                <div key={post.id} className="col-6 col-md-3 mb-4">
                  <PostCard
                    id={post.id}
                    codeName={post.codeName}
                    coverUrl={post.coverUrl}
                    videoUrl={post.videoUrl}
                    title={post.title}
                    authorId={post.authorId}
                    publishedAt={post.publishedAt}
                  />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.podcastPrograms.length > 0 && (
        <Tabs.TabPane
          key="podcastPrograms"
          tab={`${formatMessage(pageMessages.SearchPage.podcast)} (${searchResults.podcastPrograms.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.podcastPrograms.map(podcastProgram => (
                <div key={podcastProgram.id} className="col-6 col-md-3 mb-4">
                  <CheckoutPodcastPlanModal
                    creatorId={podcastProgram.instructor?.id || ''}
                    renderTrigger={({ onOpen }) => (
                      <PodcastProgramPopover
                        key={podcastProgram.id}
                        podcastProgramId={podcastProgram.id}
                        title={podcastProgram.title}
                        listPrice={podcastProgram.listPrice}
                        salePrice={podcastProgram.salePrice}
                        duration={podcastProgram.duration}
                        durationSecond={podcastProgram.durationSecond}
                        description={podcastProgram.description}
                        categories={podcastProgram.categories}
                        instructor={podcastProgram.instructor}
                        isEnrolled={podcastProgram.isEnrolled}
                        isSubscribed={podcastProgram.isSubscribed}
                        onSubscribe={() => (isAuthenticated ? onOpen?.() : setAuthModalVisible?.(true))}
                      >
                        <PodcastProgramBriefCard
                          coverUrl={podcastProgram.coverUrl}
                          title={podcastProgram.title}
                          listPrice={podcastProgram.listPrice}
                          salePrice={podcastProgram.salePrice}
                          soldAt={podcastProgram.soldAt}
                        />
                      </PodcastProgramPopover>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.creators.length > 0 && (
        <Tabs.TabPane
          key="creators"
          tab={`${formatMessage(pageMessages.SearchPage.creator)} (${searchResults.creators.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.creators.map(creator => (
                <div key={creator.id} className="col-6 col-lg-3">
                  <Link to={`/creators/${creator.id}${enabledModules.appointment ? '?tabkey=appointments' : ''}`}>
                    <CreatorBriefCard imageUrl={creator.avatarUrl} title={creator.name} meta={creator.abstract} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.merchandises.length > 0 && (
        <Tabs.TabPane
          key="merchandises"
          tab={`${formatMessage(pageMessages.SearchPage.merchandise)} (${searchResults.merchandises.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.merchandises.map(merchandise => (
                <div key={merchandise.id} className="col-12 col-lg-3 mb-4">
                  <Link to={`/merchandises/${merchandise.id}`}>
                    <MerchandiseCard {...merchandise} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.portfolioProjects.length > 0 && (
        <Tabs.TabPane
          key="portfolioProjects"
          tab={`${formatMessage(pageMessages.SearchPage.portfolioProject)} (${searchResults.portfolioProjects.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.portfolioProjects.map(project => (
                <div key={project.id} className="col-12 col-lg-4 mb-5">
                  <Link to={`/projects/${project.id}`}>
                    <ProjectIntroCard {...project} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
    </Tabs>
  )
}

const useSearchProductCollection = (
  memberId: string | null,
  filter?: {
    title?: string | null
    tag?: string | null
  },
) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.SEARCH_PRODUCT_COLLECTION,
    hasura.SEARCH_PRODUCT_COLLECTIONVariables
  >(
    gql`
      query SEARCH_PRODUCT_COLLECTION($memberId: String, $title: String, $tag: String) {
        program(
          where: {
            published_at: { _is_null: false }
            is_private: { _eq: false }
            is_deleted: { _eq: false }
            _or: [
              { title: { _ilike: $title } }
              { abstract: { _ilike: $title } }
              { program_tags: { tag_name: { _eq: $tag } } }
            ]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          cover_url
          cover_mobile_url
          cover_thumbnail_url
          title
          abstract
          published_at
          is_subscription
          list_price
          sale_price
          sold_at
          is_enrolled_count_visible
          program_content_sections {
            id
            program_contents {
              id
              duration
            }
          }
          program_plans(where: { published_at: { _is_null: false } }, limit: 1) {
            id
            type
            title
            description
            gains
            currency {
              id
              label
              unit
              name
            }
            list_price
            sale_price
            sold_at
            discount_down_price
            period_amount
            period_type
            started_at
            ended_at
            is_participants_visible
            published_at
          }
          program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc }, limit: 1) {
            id
            member {
              id
              picture_url
              username
              name
            }
          }
          program_enrollments(where: { member_id: { _eq: $memberId } }) {
            member_id
          }
        }
        activity(
          where: {
            published_at: { _is_null: false }
            is_private: { _eq: false }
            _or: [{ title: { _ilike: $title } }, { description: { _ilike: $title } }]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          cover_url
          title
          published_at
          is_participants_visible
          organizer_id
          support_locales
          activity_categories {
            id
            category {
              id
              name
            }
          }
          activity_enrollments_aggregate {
            aggregate {
              count
            }
          }
          activity_sessions_aggregate {
            aggregate {
              min {
                started_at
              }
              max {
                ended_at
              }
            }
          }
          activity_tickets_aggregate {
            nodes {
              id
              count
              description
              started_at
              is_published
              ended_at
              price
              title
              currency_id
            }
            aggregate {
              sum {
                count
              }
            }
          }
        }
        podcast_program(
          where: {
            published_at: { _is_null: false }
            _or: [
              { title: { _ilike: $title } }
              { podcast_program_body: { description: { _ilike: $title } } }
              { podcast_program_tags: { tag_name: { _eq: $tag } } }
            ]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          cover_url
          title
          abstract
          duration
          duration_second
          published_at
          list_price
          sale_price
          sold_at
          podcast_program_roles(where: { name: { _eq: "instructor" } }, limit: 1) {
            id
            member {
              id
              picture_url
              username
              name
            }
          }
          podcast_program_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          podcast_program_enrollments(where: { member_id: { _eq: $memberId } }) {
            member_id
          }
        }
        podcast_plan_enrollment(
          where: { member_id: { _eq: $memberId } }
          order_by: [{ podcast_plan: { created_at: desc } }]
        ) {
          podcast_plan_id
          podcast_plan {
            id
            creator_id
          }
        }
        member_public(
          where: {
            role: { _eq: "content-creator" }
            _or: [{ name: { _ilike: $title } }, { username: { _ilike: $title } }, { tag_names: { _has_key: $tag } }]
          }
          order_by: [{ created_at: desc }]
        ) {
          id
          picture_url
          name
          username
          abstract
        }
        merchandise(
          where: {
            published_at: { _is_null: false }
            is_deleted: { _eq: false }
            _or: [{ title: { _ilike: $title } }, { merchandise_tags: { tag_name: { _eq: $tag } } }]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          title
          sold_at
          currency_id
          merchandise_tags(order_by: { position: asc }) {
            tag_name
          }
          merchandise_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          merchandise_imgs(where: { type: { _eq: "cover" } }, limit: 1) {
            id
            url
          }
          merchandise_specs {
            id
            title
            list_price
            sale_price
          }
        }
        project(
          where: {
            type: { _in: ["on-sale", "pre-order", "funding", "portfolio"] }
            published_at: { _is_null: false }
            _or: [
              { title: { _ilike: $title } }
              { description: { _ilike: $title } }
              { introduction: { _ilike: $title } }
              { introduction_desktop: { _ilike: $title } }
              { creator: { name: { _ilike: $title } } }
              { project_roles: { member: { name: { _ilike: $title } } } }
              { project_roles: { identity: { name: { _ilike: $title } } } }
            ]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          type
          title
          cover_type
          cover_url
          preview_url
          abstract
          introduction
          description
          target_unit
          target_amount
          expired_at
          is_participants_visible
          is_countdown_timer_visible

          project_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          project_sales {
            total_sales
          }
          project_plans {
            id
            cover_url
            title
            description
            is_subscription
            period_amount
            period_type
            list_price
            sale_price
            sold_at
            discount_down_price
            created_at
            is_participants_visible
            is_physical
            is_limited
            project_plan_enrollments_aggregate {
              aggregate {
                count
              }
            }
          }
        }
        post(
          where: {
            is_deleted: { _eq: false }
            published_at: { _is_null: false }
            _or: [
              { title: { _ilike: $title } }
              { description: { _ilike: $title } }
              {
                _and: [
                  { post_roles: { name: { _eq: "author" } } }
                  { post_roles: { member: { name: { _ilike: $title } } } }
                ]
              }
            ]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          code_name
          title
          cover_url
          video_url
          published_at
          post_roles(where: { name: { _eq: "author" } }) {
            id
            member_id
          }
        }
        program_package(
          where: {
            published_at: { _is_null: false }
            _or: [{ title: { _ilike: $title } }, { description: { _ilike: $title } }]
          }
          order_by: [{ created_at: desc }, { published_at: desc }]
        ) {
          id
          cover_url
          title
        }
      }
    `,
    {
      variables: {
        memberId: memberId || '',
        title:
          filter?.title && filter.title.length > 1 ? `%${filter.title.replace(/_/g, '\\_').split('').join('%')}%` : '',
        tag: filter?.tag || '',
      },
    },
  )

  const projects: ProjectIntroProps[] =
    data?.project.map(project => ({
      id: project.id,
      type: project.type,
      title: project.title,
      coverType: project.cover_type,
      coverUrl: project.cover_url,
      previewUrl: project.preview_url,
      abstract: project.abstract,
      introduction: project.introduction,
      description: project.description,
      targetAmount: project.target_amount,
      targetUnit: project.target_unit as ProjectIntroProps['targetUnit'],
      expiredAt: project.expired_at ? new Date(project.expired_at) : null,
      isParticipantsVisible: project.is_participants_visible,
      isCountdownTimerVisible: project.is_countdown_timer_visible,
      totalSales: project.project_sales?.total_sales,
      categories: project.project_categories.map(projectCategory => ({
        id: projectCategory.category.id,
        name: projectCategory.category.name,
      })),
      enrollmentCount: sum(
        project.project_plans.map(projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0),
      ),
      projectPlans: project.project_plans.map(project_plan => ({
        id: project_plan.id,
        coverUrl: project_plan.cover_url,
        title: project_plan.title,
        description: project_plan.description,
        isSubscription: project_plan.is_subscription,
        periodAmount: project_plan.period_amount,
        periodType: project_plan.period_type,
        listPrice: project_plan.list_price,
        salePrice: project_plan.sale_price,
        soldAt: project_plan.sold_at ? new Date(project_plan.sold_at) : null,
        discountDownPrice: project_plan.discount_down_price,
        createdAt: new Date(project_plan.created_at),
        createAt: new Date(project_plan.created_at),
      })),
    })) || []

  const searchResults: {
    [key: string]: any
    programs: (ProgramBriefProps & {
      roles: ProgramRole[]
      plans: ProgramPlan[]
      isEnrolled: boolean
    })[]
    programPackages: Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title'>[]
    activities: DeepPick<
      Activity,
      | 'id'
      | 'coverUrl'
      | 'title'
      | 'isParticipantsVisible'
      | 'startedAt'
      | 'endedAt'
      | 'organizerId'
      | 'supportLocales'
      | 'categories'
      | 'participantCount'
      | 'totalSeats'
      | 'tickets.[].id'
      | 'tickets.[].title'
      | 'tickets.[].startedAt'
      | 'tickets.[].endedAt'
      | 'tickets.[].price'
      | 'tickets.[].count'
      | 'tickets.[].currencyId'
      | 'tickets.[].description'
      | 'tickets.[].isPublished'
    >[]
    podcastPrograms: PodcastProgramBriefProps[]
    creators: {
      id: string
      avatarUrl: string | null
      name: string
      abstract: string | null
    }[]
    merchandises: MerchandiseBriefProps[]
    fundingProjects: ProjectIntroProps[]
    preOrderProjects: ProjectIntroProps[]
    portfolioProjects: ProjectIntroProps[]
    projects: ProjectIntroProps[]
    posts: Pick<PostPreviewProps, 'id' | 'codeName' | 'coverUrl' | 'videoUrl' | 'title' | 'authorId' | 'publishedAt'>[]
  } = {
    programs:
      data?.program.map(program => ({
        id: program.id,
        coverUrl: program.cover_url,
        coverMobileUrl: program.cover_mobile_url,
        coverThumbnailUrl: program.cover_thumbnail_url,
        title: program.title,
        abstract: program.abstract,
        publishedAt: new Date(program.published_at),
        isSubscription: program.is_subscription,
        listPrice: program.list_price,
        salePrice: program.sale_price,
        soldAt: program.sold_at && new Date(program.sold_at),
        isPrivate: false,
        isEnrolledCountVisible: program.is_enrolled_count_visible,
        totalDuration: sum(
          program.program_content_sections.map(section =>
            sum(section.program_contents.map(content => content.duration)),
          ),
        ),
        roles: program.program_roles.map(programRole => ({
          id: programRole.id,
          name: 'instructor',
          memberId: programRole.member?.id || '',
          memberName: programRole.member?.name || '',
        })),
        plans: program.program_plans.map(programPlan => ({
          id: programPlan.id,
          type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
          title: programPlan.title,
          description: programPlan.description,
          gains: programPlan.gains,
          currency: {
            id: programPlan.currency.id,
            label: programPlan.currency.label,
            unit: programPlan.currency.unit,
            name: programPlan.currency.name,
          },
          listPrice: programPlan.list_price,
          salePrice: programPlan.sale_price,
          soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
          discountDownPrice: programPlan.discount_down_price,
          periodAmount: programPlan.period_amount,
          periodType: programPlan.period_type as PeriodType,
          startedAt: programPlan.started_at && new Date(programPlan.started_at),
          endedAt: programPlan.ended_at && new Date(programPlan.ended_at),
          isParticipantsVisible: programPlan.is_participants_visible,
          publishedAt: new Date(programPlan.published_at),
        })),
        isEnrolled: program.program_enrollments.length > 0,
      })) || [],
    programPackages:
      data?.program_package.map(programPackage => ({
        id: programPackage.id,
        coverUrl: programPackage.cover_url,
        title: programPackage.title,
      })) || [],
    activities:
      data?.activity
        .filter(
          activity =>
            activity.activity_sessions_aggregate.aggregate?.max?.ended_at &&
            new Date(activity.activity_sessions_aggregate.aggregate.max?.ended_at).getTime() < Date.now(),
        )
        .map(activity => ({
          id: activity.id,
          coverUrl: activity.cover_url,
          title: activity.title,
          isParticipantsVisible: activity.is_participants_visible,
          publishedAt: new Date(activity.published_at),
          startedAt: activity.activity_sessions_aggregate.aggregate?.min?.started_at
            ? new Date(activity.activity_sessions_aggregate.aggregate.min.started_at)
            : null,
          endedAt: activity.activity_sessions_aggregate.aggregate?.max?.ended_at
            ? new Date(activity.activity_sessions_aggregate.aggregate.max.ended_at)
            : null,
          organizerId: activity.organizer_id,
          supportLocales: activity.support_locales,
          categories: activity.activity_categories.map(activityCategory => ({
            id: activityCategory.category.id,
            name: activityCategory.category.name,
          })),
          participantCount: activity.activity_enrollments_aggregate.aggregate?.count || 0,
          totalSeats: activity.activity_tickets_aggregate.aggregate?.sum?.count || 0,
          tickets: activity.activity_tickets_aggregate?.nodes?.map(ticket => ({
            id: ticket.id,
            title: ticket.title,
            startedAt: new Date(ticket.started_at),
            endedAt: new Date(ticket.ended_at),
            price: ticket.price,
            count: ticket.count,
            currencyId: ticket.currency_id,
            description: ticket.description,
            isPublished: ticket.is_published,
          })),
        })) || [],
    podcastPrograms:
      data?.podcast_program.map(podcastProgram => ({
        id: podcastProgram.id,
        coverUrl: podcastProgram.cover_url,
        title: podcastProgram.title,
        listPrice: podcastProgram.list_price,
        salePrice: podcastProgram.sale_price,
        soldAt: podcastProgram.sold_at && new Date(podcastProgram.sold_at),
        duration: podcastProgram.duration,
        durationSecond: podcastProgram.duration_second,
        description: podcastProgram.abstract,
        categories: podcastProgram.podcast_program_categories.map(podcastProgramCategory => ({
          id: podcastProgramCategory.category.id,
          name: podcastProgramCategory.category.name,
        })),
        instructor: podcastProgram.podcast_program_roles[0]
          ? {
              id: podcastProgram.podcast_program_roles[0].member?.id || '',
              avatarUrl: podcastProgram.podcast_program_roles[0].member?.picture_url || null,
              name:
                podcastProgram.podcast_program_roles[0].member?.name ||
                podcastProgram.podcast_program_roles[0].member?.username ||
                '',
            }
          : null,
        isEnrolled: podcastProgram.podcast_program_enrollments.length > 0,
        isSubscribed: data.podcast_plan_enrollment
          .map(podcastPlanEnrollment => podcastPlanEnrollment.podcast_plan?.creator_id)
          .filter(notEmpty)
          .includes(podcastProgram.podcast_program_roles[0].member?.id || ''),
      })) || [],
    creators:
      data?.member_public.map(member => ({
        id: member.id || '',
        avatarUrl: member.picture_url,
        name: member.name || member.username || '',
        abstract: member.abstract,
      })) || [],
    merchandises:
      data?.merchandise.map(merchandise => ({
        id: merchandise.id,
        title: merchandise.title,
        soldAt: merchandise.sold_at ? new Date(merchandise.sold_at) : null,
        minPrice: min(
          merchandise.merchandise_specs.map(spec =>
            merchandise.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0,
          ),
        ),
        maxPrice: max(
          merchandise.merchandise_specs.map(spec =>
            merchandise.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0,
          ),
        ),
        currencyId: merchandise.currency_id,
        tags: merchandise.merchandise_tags.map(v => v.tag_name),
        categories: merchandise.merchandise_categories.map(v => ({
          id: v.category.id,
          name: v.category.name,
        })),
        images: merchandise.merchandise_imgs.map(v => ({
          id: v.id,
          url: v.url,
          isCover: true,
        })),
        specs: merchandise.merchandise_specs.map(spec => ({
          id: spec.id,
          title: spec.title,
          listPrice: spec.list_price,
          salePrice: spec.sale_price,
        })),
      })) || [],
    fundingProjects: projects.filter(project => project.type === 'funding'),
    preOrderProjects: projects.filter(project => project.type === 'pre-order'),
    portfolioProjects: projects.filter(project => project.type === 'portfolio'),
    projects: projects.filter(
      project => project.type !== 'funding' && project.type !== 'pre-order' && project.type !== 'portfolio',
    ),
    posts:
      data?.post.map(post => ({
        id: post.id,
        codeName: post.code_name,
        title: post.title,
        coverUrl: post.cover_url,
        videoUrl: post.video_url,
        authorId: post.post_roles[0]?.member_id || '',
        publishedAt: post.published_at ? new Date(post.published_at) : null,
      })) ?? [],
  }

  return {
    loadingSearchResults: loading,
    errorSearchResults: error,
    searchResults,
    refetchSearchResults: refetch,
  }
}

export default SearchPage
