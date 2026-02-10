import { gql, useQuery } from '@apollo/client'
import { max, min } from 'lodash'
import { flatten, sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import hasura from '../hasura'
import { hasJsonStructure, notEmpty } from '../helpers'
import { Activity } from '../types/activity'
import { PostPreviewProps } from '../types/blog'
import { MerchandiseBasicProps, MerchandiseSpecBasicProps } from '../types/merchandise'
import { PodcastProgramBriefProps } from '../types/podcast'
import {
  PeriodType,
  ProgramBriefProps,
  ProgramPlan,
  ProgramPlanType,
  ProgramRole,
  ProgramRoleName,
} from '../types/program'
import { ProgramPackageProps } from '../types/programPackage'
import { ProjectIntroProps } from '../types/project'

export const SEARCH_PRODUCT_COLLECTION = gql`
  query SEARCH_PRODUCT_COLLECTION(
    $memberId: String
    $title: String
    $tag: String
    $description: String
    $memberRoles: [String!]!
  ) {
    program(
      where: {
        published_at: { _is_null: false }
        is_private: { _eq: false }
        is_deleted: { _eq: false }
        _or: [
          { title: { _ilike: $title } }
          { description: { _ilike: $description } }
          { program_tags: { tag_name: { _eq: $tag } } }
          { program_roles: { name: { _eq: "instructor" }, member: { name: { _ilike: $title } } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      cover_url
      cover_mobile_url
      cover_thumbnail_url
      title
      abstract
      description
      published_at
      is_subscription
      list_price
      sale_price
      sold_at
      is_enrolled_count_visible
      label
      label_color_type
      program_categories(order_by: { position: asc }) {
        id
        category {
          id
          name
        }
      }
      program_tags {
        tag_name
      }
      program_review_score {
        score
      }
      program_content_sections {
        id
        program_contents {
          id
          duration
        }
      }
      program_plans(
        where: { published_at: { _lte: "now()" } }
        order_by: [{ position: asc }, { created_at: asc }]
        limit: 1
      ) {
        id
        position
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
    program_package(
      where: {
        published_at: { _is_null: false }
        is_private: { _eq: false }
        _or: [
          { title: { _ilike: $title } }
          { description: { _ilike: $description } }
          {
            program_package_programs: {
              program: { program_roles: { name: { _eq: "instructor" }, member: { name: { _ilike: $title } } } }
            }
          }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      cover_url
      title
      description
      program_package_programs {
        id
        program {
          id
          program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member {
              id
              name
            }
          }
        }
      }
      program_package_plans(
        where: { published_at: { _is_null: false } }
        order_by: { position: asc, created_at: asc }
        limit: 1
      ) {
        id
        list_price
        sale_price
        sold_at
      }
    }
    activity(
      where: {
        published_at: { _is_null: false }
        is_private: { _eq: false }
        _or: [
          { title: { _ilike: $title } }
          { description: { _ilike: $description } }
          { organizer: { name: { _ilike: $title } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      cover_url
      title
      description
      published_at
      is_participants_visible
      organizer_id
      support_locales
      organizer {
        id
        name
      }
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
    project(
      where: {
        type: { _in: ["on-sale", "pre-order", "funding", "portfolio"] }
        published_at: { _is_null: false }
        _or: [
          { title: { _ilike: $title } }
          { description: { _ilike: $description } }
          { introduction: { _ilike: $description } }
          { introduction_desktop: { _ilike: $description } }
          { project_roles: { member: { name: { _ilike: $title } } } }
          { project_roles: { identity: { name: { _ilike: $title } } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      type
      title
      cover_type
      cover_url
      preview_url
      abstract
      introduction
      introduction_desktop
      description
      target_unit
      target_amount
      expired_at
      is_participants_visible
      is_countdown_timer_visible
      project_roles(where: { identity: { name: { _eq: "author" } } }) {
        id
        member {
          id
          name
        }
      }
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
      author: project_roles(where: { identity: { name: { _eq: "author" } } }) {
        id
        member_id
      }
    }
    post(
      where: {
        is_deleted: { _eq: false }
        published_at: { _is_null: false }
        _or: [
          { title: { _ilike: $title } }
          { description: { _ilike: $description } }
          { post_roles: { name: { _eq: "author" }, member: { name: { _ilike: $title } } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      code_name
      title
      description
      cover_url
      video_url
      published_at
      post_roles(where: { name: { _eq: "author" } }) {
        id
        member_id
        member {
          id
          name
        }
      }
    }
    podcast_program(
      where: {
        published_at: { _is_null: false }
        _or: [
          { title: { _ilike: $title } }
          { podcast_program_body: { description: { _ilike: $description } } }
          { podcast_program_tags: { tag_name: { _eq: $tag } } }
          { podcast_program_roles: { name: { _eq: "instructor" }, member: { name: { _ilike: $title } } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
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
      podcast_program_body {
        id
        description
      }
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
      order_by: [{ podcast_plan: { published_at: desc } }]
    ) {
      podcast_plan_id
      podcast_plan {
        id
        creator_id
      }
    }
    member_public(
      where: {
        _or: [
          {
            role: { _in: $memberRoles }
            _or: [{ name: { _ilike: $title } }, { username: { _ilike: $title } }, { tag_names: { _has_key: $tag } }]
          }
          {
            has_backstage_enter_permission: { _eq: 1 }
            _or: [{ name: { _ilike: $title } }, { username: { _ilike: $title } }, { tag_names: { _has_key: $tag } }]
          }
        ]
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
        _or: [
          { title: { _ilike: $title } }
          { merchandise_tags: { tag_name: { _eq: $tag } } }
          { member: { name: { _ilike: $title } } }
        ]
      }
      order_by: [{ published_at: desc }, { created_at: desc }]
    ) {
      id
      title
      abstract
      sold_at
      currency_id
      published_at
      member {
        id
        name
      }
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
  }
`

export const useSearchProductCollection = (
  memberId: string | null,
  memberRoles: string[],
  filter?: {
    title?: string | null
    tag?: string | null
    advancedFilters?: {
      categoryIds?: string[][]
      tagNames?: string[][]
      durationRange?: [number, number]
      score?: number
      onlyPrograms?: boolean
    }
  },
) => {
  const calcSortWeights = (data: any, columns: string[], searchText: string) => {
    let weight = 0
    if (searchText)
      columns.forEach((column, index) =>
        data[column] &&
        typeof data[column] === 'string' &&
        data[column].toLowerCase().includes(searchText.toLowerCase())
          ? (weight = weight + Math.pow(index + 2, 3))
          : null,
      )
    return weight
  }

  const sorting = (dataA: any, dataB: any, sorter: string[], search: string) => {
    const compareA = calcSortWeights(dataA, sorter, search)
    const compareB = calcSortWeights(dataB, sorter, search)
    if (compareA > compareB) return -1
    else if (compareA < compareB) return 1
    else return 0
  }

  const hasSearchKeyword = !!(filter?.title && filter.title.length > 1) || !!filter?.tag

  const { loading, error, data, refetch } = useQuery<
    hasura.SEARCH_PRODUCT_COLLECTION,
    hasura.SEARCH_PRODUCT_COLLECTIONVariables
  >(SEARCH_PRODUCT_COLLECTION, {
    variables: {
      memberId: memberId || '',
      title:
        filter?.title && filter.title.length > 1
          ? `%${filter.title.replace(/_/g, '\\_').split('').join('%')}%`
          : !hasSearchKeyword && filter?.advancedFilters
          ? '%'
          : '',
      description:
        filter?.title && filter.title.length > 1
          ? `%${filter.title}%`
          : !hasSearchKeyword && filter?.advancedFilters
          ? '%'
          : '',
      tag: filter?.tag || '',
      memberRoles: memberRoles,
    },
  })

  const projects: (ProjectIntroProps & { authorSearchString: string })[] =
    data?.project.map(project => ({
      id: project.id,
      type: project.type,
      title: project.title,
      coverType: project.cover_type,
      coverUrl: project.cover_url || null,
      previewUrl: project.preview_url || null,
      abstract: project.abstract || '',
      introduction: project.introduction || '',
      introductionDesktop: project.introduction_desktop || '',
      description: project.description || '',
      targetAmount: project.target_amount,
      targetUnit: project.target_unit as ProjectIntroProps['targetUnit'],
      expiredAt: project.expired_at ? new Date(project.expired_at) : null,
      isParticipantsVisible: project.is_participants_visible,
      isCountdownTimerVisible: project.is_countdown_timer_visible,
      totalSales: project.project_sales?.total_sales,
      authorId: project.author[0]?.member_id,
      categories: project.project_categories.map(projectCategory => ({
        id: projectCategory.category.id,
        name: projectCategory.category.name,
      })),
      enrollmentCount: sum(
        project.project_plans.map(projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0),
      ),
      projectPlans: project.project_plans.map(project_plan => ({
        id: project_plan.id,
        coverUrl: project_plan.cover_url || null,
        title: project_plan.title,
        description: project_plan.description || '',
        isSubscription: project_plan.is_subscription,
        periodAmount: project_plan.period_amount,
        periodType: project_plan.period_type || null,
        listPrice: project_plan.list_price,
        salePrice: project_plan.sale_price,
        soldAt: project_plan.sold_at ? new Date(project_plan.sold_at) : null,
        discountDownPrice: project_plan.discount_down_price,
        createdAt: new Date(project_plan.created_at),
        createAt: new Date(project_plan.created_at),
      })),
      authorSearchString: project.project_roles.map(v => v.member?.name).toString(),
    })) || []

  const searchResults: {
    [key: string]: any
    programs: (ProgramBriefProps & {
      roles: ProgramRole[]
      plans: ProgramPlan[]
      isEnrolled: boolean
      instructorsSearchString: string
      categories: { id: string; name: string }[]
      categoryIds: string[]
      tags: string[]
      score: number | null
    })[]
    programPackages: Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title' | 'description'>[]
    activities: (DeepPick<
      Activity,
      | 'id'
      | 'coverUrl'
      | 'title'
      | 'description'
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
    > & { ticketTitleSearchString: string; ticketDescriptionSearchString: string })[]
    podcastPrograms: (PodcastProgramBriefProps & { instructorsSearchString: string; bodyDescription: string })[]
    creators: {
      id: string
      avatarUrl: string | null
      name: string
      abstract: string | null
    }[]
    merchandises: (MerchandiseBasicProps & {
      specs: MerchandiseSpecBasicProps[]
    } & { shopkeeper: string; abstract: string })[]
    fundingProjects: (ProjectIntroProps & { authorSearchString: string })[]
    preOrderProjects: (ProjectIntroProps & { authorSearchString: string })[]
    portfolioProjects: (ProjectIntroProps & { authorSearchString: string })[]
    projects: (ProjectIntroProps & { authorSearchString: string })[]
    posts: (Pick<
      PostPreviewProps,
      'id' | 'codeName' | 'coverUrl' | 'videoUrl' | 'title' | 'authorId' | 'publishedAt'
    > & { authorSearchString: string; description: string })[]
  } = {
    programs: [...(data?.program || [])]
      .map(program => ({
        id: program.id,
        coverUrl: program.cover_url || null,
        coverMobileUrl: program.cover_mobile_url || null,
        coverThumbnailUrl: program.cover_thumbnail_url || null,
        title: program.title,
        abstract: program.abstract || '',
        description:
          program?.description && hasJsonStructure(program.description || '')
            ? JSON.parse(program.description)
                ?.blocks.map((v: any) => v?.text)
                .toString()
            : program.description || '',
        label: program.label || '',
        labelColorType: program.label_color_type || '',
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
        categories:
          program.program_categories?.map(programCategory => ({
            id: programCategory.category.id,
            name: programCategory.category.name,
          })) || [],
        categoryIds: program.program_categories?.map(pc => pc.category.id) || [],
        tags: program.program_tags?.map(tag => tag.tag_name) || [],
        score: program.program_review_score?.score || null,
        roles: program.program_roles.map(programRole => ({
          id: programRole.id,
          name: 'instructor' as ProgramRoleName,
          memberId: programRole.member?.id || '',
          memberName: programRole.member?.name || '',
        })),
        instructorsSearchString: program.program_roles.map(v => v.member?.name).toString(),
        plans: program.program_plans.map(programPlan => ({
          id: programPlan.id,
          position: (programPlan as any).position ?? 0,
          type: (programPlan.type === 1
            ? 'subscribeFromNow'
            : programPlan.type === 2
            ? 'subscribeAll'
            : 'unknown') as ProgramPlanType,
          title: programPlan.title,
          description: programPlan.description || '',
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
      }))
      .filter(program => {
        if (!filter?.advancedFilters) return true

        const { categoryIds, tagNames, durationRange, score } = filter.advancedFilters

        if (categoryIds?.length) {
          const hasMatchingCategory = categoryIds.some(categoryIdList => {
            if (categoryIdList.length === 0) return true
            return categoryIdList.some(categoryId => program.categoryIds.includes(categoryId))
          })
          if (!hasMatchingCategory) return false
        }

        if (tagNames?.length) {
          const hasMatchingTag = tagNames.some(tagNameList => {
            if (tagNameList.length === 0) return true
            return tagNameList.some(tagName => program.tags.includes(tagName))
          })
          if (!hasMatchingTag) return false
        }

        if (durationRange) {
          const [min, max] = durationRange
          const durationMinutes = program.totalDuration / 60

          if (min !== null && min !== undefined && durationMinutes < min) {
            return false
          }
          if (max !== null && max !== undefined && durationMinutes > max) {
            return false
          }
        }

        if (score !== null && score !== undefined) {
          if (!program.score || program.score <= score) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => sorting(a, b, ['description', 'title', 'instructorsSearchString'], filter?.title || '')),
    programPackages: [...(data?.program_package || [])]
      .map(programPackage => {
        const plan = (programPackage as any).program_package_plans?.[0]
        return {
          id: programPackage.id,
          coverUrl: programPackage.cover_url || null,
          title: programPackage.title,
          description:
            programPackage?.description && hasJsonStructure(programPackage.description || '')
              ? JSON.parse(programPackage.description)
                  ?.blocks.map((v: any) => v?.text)
                  .toString()
              : programPackage.description || '',
          instructorsSearchString: flatten(
            programPackage.program_package_programs.map(v => v.program.program_roles.map(w => w.member?.name)),
          ).toString(),
          listPrice: plan?.list_price ?? null,
          salePrice: plan?.sale_price ?? null,
          soldAt: plan?.sold_at ? new Date(plan.sold_at) : null,
        }
      })
      .sort((a, b) => sorting(a, b, ['description', 'title', 'instructorsSearchString'], filter?.title || '')),
    activities: [...(data?.activity || [])]
      .map(activity => ({
        id: activity.id,
        coverUrl: activity.cover_url || null,
        title: activity.title,
        description:
          activity?.description && hasJsonStructure(activity.description || '')
            ? JSON.parse(activity.description)
                ?.blocks.map((v: any) => v?.text)
                .toString()
            : activity.description || '',
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
          description: ticket.description || '',
          isPublished: ticket.is_published,
        })),
        organizerSearchString: activity.organizer?.name,
        ticketTitleSearchString: activity.activity_tickets_aggregate.nodes.map(v => v.title).toString(),
        ticketDescriptionSearchString: activity.activity_tickets_aggregate.nodes
          .map(v =>
            v?.description && hasJsonStructure(v?.description || '')
              ? JSON.parse(v.description)
                  ?.blocks.map((v: any) => v?.text)
                  .toString()
              : v?.description || '',
          )
          .toString(),
      }))
      .sort((a, b) =>
        sorting(
          a,
          b,
          ['ticketDescriptionSearchString', 'ticketTitleSearchString', 'description', 'title', 'organizerSearchString'],
          filter?.title || '',
        ),
      ),
    projects: [...projects]
      .filter(project => project.type !== 'funding' && project.type !== 'pre-order' && project.type !== 'portfolio')
      .sort((a, b) =>
        sorting(
          a,
          b,
          ['introductionDesktop', 'introduction', 'description', 'title', 'authorSearchString'],
          filter?.title || '',
        ),
      ),
    fundingProjects: [...projects]
      .filter(project => project.type === 'funding')
      .sort((a, b) =>
        sorting(
          a,
          b,
          ['introductionDesktop', 'introduction', 'description', 'title', 'authorSearchString'],
          filter?.title || '',
        ),
      ),
    preOrderProjects: [...projects]
      .filter(project => project.type === 'pre-order')
      .sort((a, b) =>
        sorting(
          a,
          b,
          ['introductionDesktop', 'introduction', 'description', 'title', 'authorSearchString'],
          filter?.title || '',
        ),
      ),
    portfolioProjects: [...projects]
      .filter(project => project.type === 'portfolio')
      .sort((a, b) =>
        sorting(
          a,
          b,
          ['introductionDesktop', 'introduction', 'description', 'title', 'authorSearchString'],
          filter?.title || '',
        ),
      ),
    posts: [...(data?.post || [])]
      .map(post => ({
        id: post.id,
        codeName: post.code_name || null,
        title: post.title,
        coverUrl: post.cover_url || null,
        videoUrl: post.video_url || null,
        authorId: post.post_roles[0]?.member_id || '',
        publishedAt: post.published_at ? new Date(post.published_at) : null,
        authorSearchString: post.post_roles.map(v => v.member?.name).toString(),
        description:
          post?.description && hasJsonStructure(post.description || '')
            ? JSON.parse(post.description)
                ?.blocks.map((v: any) => v?.text)
                .toString()
            : '',
      }))
      .sort((a, b) => sorting(a, b, ['description', 'title', 'authorSearchString'], filter?.title || '')),
    podcastPrograms: [...(data?.podcast_program || [])]
      .map(podcastProgram => ({
        id: podcastProgram.id,
        coverUrl: podcastProgram.cover_url || null,
        title: podcastProgram.title,
        listPrice: podcastProgram.list_price,
        salePrice: podcastProgram.sale_price,
        soldAt: podcastProgram.sold_at && new Date(podcastProgram.sold_at),
        duration: podcastProgram.duration,
        durationSecond: podcastProgram.duration_second,
        description: podcastProgram.abstract || '',
        bodyDescription: podcastProgram.podcast_program_body?.description || '',
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
        instructorsSearchString: podcastProgram.podcast_program_roles.map(v => v.member?.name).toString(),
        isEnrolled: podcastProgram.podcast_program_enrollments.length > 0,
        isSubscribed: (data?.podcast_plan_enrollment || [])
          .map(podcastPlanEnrollment => podcastPlanEnrollment.podcast_plan?.creator_id)
          .filter(notEmpty)
          .includes(podcastProgram.podcast_program_roles[0]?.member?.id || ''),
      }))
      .sort((a, b) =>
        sorting(a, b, ['bodyDescription', 'description', 'title', 'instructorsSearchString'], filter?.title || ''),
      ),
    creators:
      data?.member_public.map(member => ({
        id: member.id || '',
        avatarUrl: member.picture_url || null,
        name: member.name || member.username || '',
        abstract: member.abstract || '',
      })) || [],
    merchandises: [...(data?.merchandise || [])]
      .map(merchandise => ({
        id: merchandise.id,
        shopkeeper: merchandise.member?.name || '',
        title: merchandise.title,
        abstract: merchandise.abstract || '',
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
        publishedAt: merchandise.published_at ? new Date(merchandise.published_at) : null,
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
      }))
      .sort((a, b) => sorting(a, b, ['shopkeeper', 'abstract', 'title'], filter?.title || '')),
  }

  if (filter?.advancedFilters?.onlyPrograms) {
    return {
      loadingSearchResults: loading,
      errorSearchResults: error,
      searchResults: {
        ...searchResults,
        programPackages: [],
        activities: [],
        projects: [],
        fundingProjects: [],
        preOrderProjects: [],
        portfolioProjects: [],
        posts: [],
        podcastPrograms: [],
        creators: [],
        merchandises: [],
      },
      refetchSearchResults: refetch,
    }
  }

  return {
    loadingSearchResults: loading,
    errorSearchResults: error,
    searchResults,
    refetchSearchResults: refetch,
  }
}
