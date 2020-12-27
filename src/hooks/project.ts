import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { useAuth } from '../components/auth/AuthContext'
import types from '../types'
import { ProjectIntroProps, ProjectProps } from '../types/project'

export const usePhysicalEnrolledProjectPlanIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS,
    types.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDSVariables
  >(
    gql`
      query GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {
        project_plan_enrollment(
          where: { member_id: { _eq: $memberId }, project_plan: { is_physical: { _eq: false } } }
        ) {
          member_id
          project_plan_id
        }
      }
    `,
    {
      variables: { memberId },
      fetchPolicy: 'no-cache',
    },
  )

  const enrolledProjectPlanIds: string[] =
    loading || error || !data ? [] : data.project_plan_enrollment.map(enrollment => enrollment.project_plan_id)

  return {
    loadingEnrolledProjectPlanIds: loading,
    errorEnrolledProjectPlanIds: error,
    enrolledProjectPlanIds,
    refetchEnrolledProjectPlanIds: refetch,
  }
}

export const useEnrolledProjectPlanIds = (memberId: string) => {
  const GET_ENROLLED_PROJECT_PLAN_IDS = gql`
    query GET_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {
      product_enrollment(
        where: { _and: [{ product_id: { _like: "ProjectPlan%" } }, { member_id: { _eq: $memberId } }] }
      ) {
        product_id
        is_physical
      }
    }
  `

  const { loading, error, data, refetch } = useQuery<
    types.GET_ENROLLED_PROJECT_PLAN_IDS,
    types.GET_ENROLLED_PROJECT_PLAN_IDSVariables
  >(GET_ENROLLED_PROJECT_PLAN_IDS, {
    variables: { memberId },
    fetchPolicy: 'no-cache',
  })

  return {
    loadingEnrolledProjectPlanIds: loading,
    errorEnrolledProjectPlanIds: error,
    enrolledProjectPlanIds:
      data && data.product_enrollment
        ? data.product_enrollment.map(projectPlan => projectPlan.product_id && projectPlan.product_id.split('_')[1])
        : [],
    refetchEnrolledProjectPlanIds: refetch,
  }
}

export const useProject = (projectId: string) => {
  const { currentMemberId } = useAuth()
  const { enrolledProjectPlanIds } = usePhysicalEnrolledProjectPlanIds(currentMemberId || '')
  const { loading, error, data, refetch } = useQuery<types.GET_PROJECT, types.GET_PROJECTVariables>(
    gql`
      query GET_PROJECT($projectId: uuid!) {
        project_by_pk(id: $projectId) {
          id
          type
          title
          cover_type
          cover_url
          preview_url
          abstract
          description
          target_amount
          target_unit
          template
          introduction
          updates
          comments
          contents
          created_at
          published_at
          expired_at
          is_participants_visible
          is_countdown_timer_visible
          project_sales {
            total_sales
          }

          project_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          project_sections(order_by: { position: asc }) {
            id
            type
            options
          }
          project_plans(where: { published_at: { _is_null: false } }, order_by: { position: asc }) {
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

            project_plan_inventory_status {
              buyable_quantity
            }
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
      variables: { projectId },
    },
  )

  const project: ProjectProps | null =
    loading || error || !data || !data.project_by_pk
      ? null
      : {
          id: data.project_by_pk.id,
          type: data.project_by_pk.type,
          title: data.project_by_pk.title,
          coverType: data.project_by_pk.cover_type,
          coverUrl: data.project_by_pk.cover_url,
          previewUrl: data.project_by_pk.preview_url,
          abstract: data.project_by_pk.abstract,
          description: data.project_by_pk.description,
          targetAmount: data.project_by_pk.target_amount,
          targetUnit: data.project_by_pk.target_unit as ProjectIntroProps['targetUnit'],
          template: data.project_by_pk.template,
          introduction: data.project_by_pk.introduction,
          updates: data.project_by_pk.updates || [],
          comments: data.project_by_pk.comments || [],
          contents: data.project_by_pk.contents || [],
          createdAt: new Date(data.project_by_pk.created_at),
          publishedAt: data.project_by_pk.published_at ? new Date(data.project_by_pk.published_at) : null,
          expiredAt: data.project_by_pk.expired_at ? new Date(data.project_by_pk.expired_at) : null,
          isParticipantsVisible: data.project_by_pk.is_participants_visible,
          isCountdownTimerVisible: data.project_by_pk.is_countdown_timer_visible,
          totalSales: data.project_by_pk.project_sales?.total_sales || 0,
          enrollmentCount: sum(
            data.project_by_pk.project_plans.map(
              projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),

          categories: data.project_by_pk.project_categories.map(projectCategory => ({
            id: projectCategory.category.id,
            name: projectCategory.category.name,
          })),
          projectSections: data.project_by_pk.project_sections,
          projectPlans: data.project_by_pk.project_plans.map(projectPlan => ({
            id: projectPlan.id,
            projectTitle: data.project_by_pk?.title as string,
            coverUrl: projectPlan.cover_url,
            title: projectPlan.title,
            description: projectPlan.description,
            isSubscription: projectPlan.is_subscription,
            periodAmount: projectPlan.period_amount,
            periodType: projectPlan.period_type,
            listPrice: projectPlan.list_price,
            salePrice: projectPlan.sale_price,
            soldAt: projectPlan.sold_at ? new Date(projectPlan.sold_at) : null,
            discountDownPrice: projectPlan.discount_down_price,
            createdAt: new Date(projectPlan.created_at),
            isParticipantsVisible: projectPlan.is_participants_visible,
            isPhysical: projectPlan.is_physical,
            isLimited: projectPlan.is_limited,
            createAt: new Date(projectPlan.created_at),
            isExpired:
              data.project_by_pk && data.project_by_pk.expired_at
                ? new Date(data.project_by_pk.expired_at).getTime() < Date.now()
                : false,
            isEnrolled: enrolledProjectPlanIds.includes(projectPlan.id),
            buyableQuantity: projectPlan.project_plan_inventory_status?.buyable_quantity ?? null,
            projectPlanEnrollmentCount: projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0,
          })),
        }

  return {
    loadingProject: loading,
    errorProject: error,
    project,
    refetchProject: refetch,
  }
}

export const useProjectIntroCollection = (filter?: { categoryId?: string }) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_PROJECT_INTRO_COLLECTION,
    types.GET_PROJECT_INTRO_COLLECTIONVariables
  >(
    gql`
      query GET_PROJECT_INTRO_COLLECTION($categoryId: String) {
        project(
          where: {
            type: { _in: ["on-sale", "pre-order", "funding"] }
            published_at: { _is_null: false }
            _or: [{ _not: { project_categories: {} } }, { project_categories: { category_id: { _eq: $categoryId } } }]
          }
          order_by: { position: asc }
        ) {
          id
          type
          title
          cover_type
          cover_url
          preview_url
          abstract
          description
          target_amount
          target_unit
          expired_at
          is_participants_visible
          is_countdown_timer_visible
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
          project_categories {
            id
            category {
              id
              name
            }
          }
        }
      }
    `,
    { variables: { categoryId: filter?.categoryId } },
  )

  const projects: ProjectIntroProps[] =
    loading || error || !data
      ? []
      : data.project
          .filter(
            project => !filter?.categoryId || project.project_categories.some(v => v.category.id === filter.categoryId),
          )
          .map(project => ({
            id: project.id,
            type: project.type,
            title: project.title,
            coverType: project.cover_type,
            coverUrl: project.cover_url,
            previewUrl: project.preview_url,
            abstract: project.abstract,
            description: project.description,
            targetAmount: project.target_amount,
            targetUnit: project.target_unit as ProjectIntroProps['targetUnit'],
            expiredAt: project.expired_at ? new Date(project.expired_at) : null,
            isParticipantsVisible: project.is_participants_visible,
            isCountdownTimerVisible: project.is_countdown_timer_visible,
            totalSales: project.project_sales?.total_sales,
            enrollmentCount: sum(
              project.project_plans.map(
                projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0,
              ),
            ),
            categories: project.project_categories.map(projectCategory => ({
              id: projectCategory.category.id,
              name: projectCategory.category.name,
            })),
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
          }))

  return {
    loadingProjects: loading,
    errorProjects: error,
    projects,
    refetchProjects: refetch,
  }
}
