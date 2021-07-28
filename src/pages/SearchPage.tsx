import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { SkeletonText } from '@chakra-ui/react'
import { Tabs } from 'antd'
import gql from 'graphql-tag'
import { max, min } from 'lodash'
import { sum } from 'ramda'
import React, { useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import Activity from '../components/activity/Activity'
import CreatorBriefCard from '../components/appointment/CreatorBriefCard'
import { useAuth } from '../components/auth/AuthContext'
import { AuthModalContext } from '../components/auth/AuthModal'
import CheckoutPodcastPlanModal from '../components/checkout/CheckoutPodcastPlanModal'
import { BREAK_POINT } from '../components/common/Responsive'
import { StyledBanner } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCard from '../components/merchandise/MerchandiseCard'
import PodcastProgramBriefCard from '../components/podcast/PodcastProgramBriefCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import ProgramCard from '../components/program/ProgramCard'
import ProjectIntroCard from '../components/project/ProjectIntroCard'
import { useApp } from '../containers/common/AppContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { useMember } from '../hooks/member'
import { ReactComponent as SearchIcon } from '../images/search.svg'
import { ActivityProps, ActivityTicketProps } from '../types/activity'
import { CategoryProps } from '../types/general'
import { MerchandiseBriefProps } from '../types/merchandise'
import { PodcastProgramBriefProps } from '../types/podcast'
import { PeriodType, ProgramBriefProps, ProgramPlanProps, ProgramRoleProps } from '../types/program'
import { ProjectIntroProps } from '../types/project'

const messages = defineMessages({
  noTagContent: { id: 'common.text.noTagContent', defaultMessage: '找不到關於這個標籤的內容' },
  noSearchResult: { id: 'common.text.noSearchResult', defaultMessage: '找不到相關內容' },
  program: { id: 'common.product.program', defaultMessage: '線上課程' },
  activity: { id: 'common.product.activity', defaultMessage: '線下實體' },
  podcast: { id: 'common.product.podcast', defaultMessage: '廣播' },
  creator: { id: 'common.product.creator', defaultMessage: '大師' },
  merchandise: { id: 'common.product.merchandise', defaultMessage: '商品' },
  project: { id: 'common.product.project', defaultMessage: '專案' },
})

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
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
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
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const [tab, setTab] = useQueryParam('tab', StringParam)
  const { loadingMember, member } = useMember(memberId || '')

  const { loadingSearchResults, errorSearchResults, searchResults } = useSearchProductCollection(memberId, {
    title,
    tag,
  })

  useEffect(() => {
    if (searchResults) {
      let index = 1
      for (let program of searchResults.programs) {
        const listPrice =
          program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0
        const salePrice =
          program.isSubscription && program.plans.length > 0 && (program.plans[0].soldAt?.getTime() || 0) > Date.now()
            ? program.plans[0].salePrice
            : (program.soldAt?.getTime() || 0) > Date.now()
            ? program.salePrice
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

  if (loadingMember || loadingSearchResults) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (errorSearchResults || sum(Object.values(searchResults).map(value => value.length)) === 0) {
    return (
      <StyledContent className="d-flex align-items-center justify-content-center">
        {formatMessage(messages.noSearchResult)}
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
        <Tabs.TabPane key="programs" tab={`${formatMessage(messages.program)} (${searchResults.programs.length})`}>
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
      {searchResults.activities.length > 0 && (
        <Tabs.TabPane key="activities" tab={`${formatMessage(messages.activity)} (${searchResults.activities.length})`}>
          <div className="container py-5">
            <div className="row">
              {searchResults.activities.map(activity => (
                <div key={activity.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <Activity {...activity} />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.podcastPrograms.length > 0 && (
        <Tabs.TabPane
          key="podcastPrograms"
          tab={`${formatMessage(messages.podcast)} (${searchResults.podcastPrograms.length})`}
        >
          <div className="container py-5">
            <div className="row">
              {searchResults.podcastPrograms.map(podcastProgram => (
                <div key={podcastProgram.id} className="col-6 col-md-3 mb-4">
                  <CheckoutPodcastPlanModal
                    renderTrigger={onOpen => (
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
                    paymentType="subscription"
                    creatorId={podcastProgram.instructor?.id || ''}
                    member={member}
                  />
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      )}
      {searchResults.creators.length > 0 && (
        <Tabs.TabPane key="creators" tab={`${formatMessage(messages.creator)} (${searchResults.creators.length})`}>
          <div className="container py-5">
            <div className="row">
              {searchResults.creators.map(creator => (
                <div key={creator.id} className="col-6 col-lg-3">
                  <Link to={`/creators/${creator.id}?tabkey=appointments`}>
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
          tab={`${formatMessage(messages.merchandise)} (${searchResults.merchandises.length})`}
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
      {searchResults.projects.length > 0 && (
        <Tabs.TabPane key="projects" tab={`${formatMessage(messages.project)} (${searchResults.projects.length})`}>
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
            _or: [{ title: { _ilike: $title } }, { program_tags: { tag_name: { _eq: $tag } } }]
          }
        ) {
          id
          cover_url
          title
          abstract
          published_at
          is_subscription
          list_price
          sale_price
          sold_at
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
          program_roles(where: { name: { _eq: "instructor" } }, limit: 1) {
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
        activity(where: { published_at: { _is_null: false }, _or: [{ title: { _ilike: $title } }] }) {
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
            _or: [{ title: { _ilike: $title } }, { podcast_program_tags: { tag_name: { _eq: $tag } } }]
          }
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
        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
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
        ) {
          id
          title
          sold_at
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
            type: { _in: ["on-sale", "pre-order", "funding"] }
            published_at: { _is_null: false }
            _or: [{ title: { _ilike: $title } }]
          }
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
      }
    `,
    {
      variables: {
        memberId: memberId || '',
        title: filter?.title && filter.title.length > 1 ? `%${filter.title.replace(/_/g, '\\_')}%` : '',
        tag: filter?.tag || '',
      },
    },
  )

  const searchResults: {
    [key: string]: any
    programs: (ProgramBriefProps & {
      roles: ProgramRoleProps[]
      plans: ProgramPlanProps[]
      isEnrolled: boolean
    })[]
    activities: (ActivityProps & {
      participantCount: number
      totalSeats: number
      categories: CategoryProps[]
      tickets: ActivityTicketProps[]
    })[]
    podcastPrograms: PodcastProgramBriefProps[]
    creators: {
      id: string
      avatarUrl: string | null
      name: string
      abstract: string | null
    }[]
    merchandises: MerchandiseBriefProps[]
    projects: ProjectIntroProps[]
  } = {
    programs:
      data?.program.map(program => ({
        id: program.id,
        coverUrl: program.cover_url,
        title: program.title,
        abstract: program.abstract,
        publishedAt: new Date(program.published_at),
        isSubscription: program.is_subscription,
        listPrice: program.list_price,
        salePrice: program.sale_price,
        soldAt: program.sold_at && new Date(program.sold_at),
        isPrivate: false,
        totalDuration: sum(
          program.program_content_sections.map(section =>
            sum(section.program_contents.map(content => content.duration)),
          ),
        ),
        roles: program.program_roles.map(programRole => ({
          id: programRole.id,
          name: 'instructor',
          memberId: programRole.member?.id || '',
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
    projects:
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
          project.project_plans.map(
            projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0,
          ),
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
      })) || [],
  }

  return {
    loadingSearchResults: loading,
    errorSearchResults: error,
    searchResults,
    refetchSearchResults: refetch,
  }
}

export default SearchPage
