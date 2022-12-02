import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import hasura from '../hasura'
import { ProjectIntroProps, ProjectProps } from '../types/project'

export const usePhysicalEnrolledProjectPlanIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS,
    hasura.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDSVariables
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
    hasura.GET_ENROLLED_PROJECT_PLAN_IDS,
    hasura.GET_ENROLLED_PROJECT_PLAN_IDSVariables
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
  const { loading, error, data, refetch } = useQuery<hasura.GET_PROJECT, hasura.GET_PROJECTVariables>(
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
          introduction_desktop
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
          introductionDesktop: data.project_by_pk.introduction_desktop,
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
  const condition = {
    published_at: { _is_null: false },
    type: { _in: ['on-sale', 'pre-order', 'funding'] },
    ...(filter?.categoryId && { project_categories: { category_id: { _eq: filter.categoryId } } }),
  }
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROJECT_INTRO_COLLECTION,
    hasura.GET_PROJECT_INTRO_COLLECTIONVariables
  >(
    gql`
      query GET_PROJECT_INTRO_COLLECTION($condition: project_bool_exp!) {
        project(where: $condition, order_by: { position: asc }) {
          id
          type
          title
          cover_type
          cover_url
          preview_url
          abstract
          introduction
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
              position
            }
          }
        }
      }
    `,
    { variables: { condition } },
  )

  const projects: ProjectIntroProps[] =
    loading || error || !data
      ? []
      : data.project.map(project => ({
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
          totalSales: project.project_sales?.total_sales || 0,
          enrollmentCount: sum(
            project.project_plans.map(
              projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
          categories: project.project_categories.map(projectCategory => ({
            id: projectCategory.category.id,
            name: projectCategory.category.name,
            position: projectCategory.category.position,
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

export const useMutateProject = (projectId: string) => {
  const { currentMemberId } = useAuth()
  const [insertProjectReactionHandler] = useMutation<
    hasura.INSERT_PROJECT_REACTION,
    hasura.INSERT_PROJECT_REACTIONVariables
  >(
    gql`
      mutation INSERT_PROJECT_REACTION($projectId: uuid!, $memberId: String!) {
        insert_project_reaction(objects: { project_id: $projectId, member_id: $memberId }) {
          affected_rows
        }
      }
    `,
  )
  const [deleteProjectReactionHandler] = useMutation<
    hasura.DELETE_PROJECT_REACTION,
    hasura.DELETE_PROJECT_REACTIONVariables
  >(gql`
    mutation DELETE_PROJECT_REACTION($projectId: uuid!, $memberId: String!) {
      delete_project_reaction(where: { project_id: { _eq: $projectId }, member_id: { _eq: $memberId } }) {
        affected_rows
      }
    }
  `)

  const [addProjectViewsHandler] = useMutation<hasura.ADD_PROJECT_VIEWS, hasura.ADD_PROJECT_VIEWSVariables>(gql`
    mutation ADD_PROJECT_VIEWS($projectId: uuid!) {
      update_project(where: { id: { _eq: $projectId } }, _inc: { views: 1 }) {
        affected_rows
      }
    }
  `)

  const insertProjectReaction = () => {
    return insertProjectReactionHandler({ variables: { projectId, memberId: currentMemberId || '' } })
  }
  const deleteProjectReaction = () => {
    return deleteProjectReactionHandler({ variables: { projectId, memberId: currentMemberId || '' } })
  }
  const addProjectView = () => {
    return addProjectViewsHandler({ variables: { projectId } })
  }

  return {
    insertProjectReaction,
    deleteProjectReaction,
    addProjectView,
  }
}

export const useMutateProjectRole = (projectId: string, identityId: string) => {
  const { currentMemberId } = useAuth()
  const [insertProjectRoleHandler] = useMutation(
    gql`
      mutation INSERT_PROJECT_ROLE($projectId: uuid!, $memberId: String!, $identityId: uuid!) {
        insert_project_role(objects: { project_id: $projectId, member_id: $memberId, identity_id: $identityId }) {
          affected_rows
        }
      }
    `,
  )
  const insertProjectRole = () => {
    return insertProjectRoleHandler({ variables: { projectId, memberId: currentMemberId, identityId } })
  }
  return { insertProjectRole }
}
