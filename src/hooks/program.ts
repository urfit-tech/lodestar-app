import { QueryHookOptions, useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum, uniq } from 'ramda'
import { useMemo } from 'react'
import hasura from '../hasura'
import { Category } from '../types/general'
import {
  PeriodType,
  Program,
  ProgramBriefProps,
  ProgramContent,
  ProgramContentAttachmentProps,
  ProgramContentBodyProps,
  ProgramContentMaterialProps,
  ProgramPlan,
  ProgramRole,
  ProgramRoleName,
} from '../types/program'

export const usePublishedProgramCollection = (options?: {
  instructorId?: string
  isPrivate?: boolean
  categoryId?: string
  limit?: number
}) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_PROGRAM_COLLECTION,
    hasura.GET_PUBLISHED_PROGRAM_COLLECTIONVariables
  >(
    gql`
      query GET_PUBLISHED_PROGRAM_COLLECTION(
        $instructorId: String
        $isPrivate: Boolean
        $categoryId: String
        $limit: Int
      ) {
        program(
          where: {
            published_at: { _lte: "now()" }
            program_roles: { name: { _eq: "instructor" }, member_id: { _eq: $instructorId } }
            is_private: { _eq: $isPrivate }
            is_deleted: { _eq: false }
            _or: [{ _not: { program_categories: {} } }, { program_categories: { category_id: { _eq: $categoryId } } }]
          }
          order_by: [{ position: asc }, { published_at: desc }]
          limit: $limit
        ) {
          id
          cover_url
          title
          abstract
          support_locales
          published_at
          is_subscription
          is_sold_out
          is_private
          is_enrolled_count_visible
          list_price
          sale_price
          sold_at

          program_categories {
            id
            category {
              id
              name
              position
            }
          }
          program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc, id: desc }) {
            id
            name
            member_id
          }
          program_plans(where: { published_at: { _lte: "now()" } }, order_by: { created_at: asc }) {
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
          program_content_sections {
            id
            program_contents_aggregate {
              aggregate {
                sum {
                  duration
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        instructorId: options?.instructorId,
        isPrivate: options?.isPrivate,
        categoryId: options?.categoryId,
        limit: options?.limit,
      },
    },
  )

  const programs: (ProgramBriefProps & {
    supportLocales: string[] | null
    categories: Category[]
    roles: ProgramRole[]
    plans: ProgramPlan[]
  })[] =
    loading || error || !data
      ? []
      : data.program
          .filter(
            program =>
              !options?.categoryId || program.program_categories.some(v => v.category.id === options.categoryId),
          )
          .map(program => ({
            id: program.id,
            coverUrl: program.cover_url,
            title: program.title,
            abstract: program.abstract,
            supportLocales: program.support_locales,
            publishedAt: program.published_at && new Date(program.published_at),
            isSubscription: program.is_subscription,
            isSoldOut: program.is_sold_out,
            isPrivate: program.is_private,

            listPrice: program.list_price,
            salePrice: program.sale_price,
            soldAt: program.sold_at && new Date(program.sold_at),
            isEnrolledCountVisible: program.is_enrolled_count_visible,
            categories: program.program_categories.map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
              position: programCategory.category.position,
            })),
            roles: program.program_roles.map(programRole => ({
              id: programRole.id,
              name: programRole.name as ProgramRoleName,
              memberId: programRole.member_id,
              memberName: programRole.member_id,
            })),
            plans: program.program_plans.map(programPlan => ({
              id: programPlan.id,
              type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
              title: programPlan.title || '',
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
              publishedAt: programPlan.published_at && new Date(programPlan.published_at),
              isCountdownTimerVisible: false,
            })),
            totalDuration: sum(
              program.program_content_sections.map(
                section => section.program_contents_aggregate.aggregate?.sum?.duration || 0,
              ),
            ),
          }))

  return {
    loadingPrograms: loading,
    errorPrograms: error,
    programs,
    refetchPrograms: refetch,
  }
}

export const useLatestProgramIds = ({ limit, language }: { limit?: number; language?: string }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_LATEST_PROGRAM_IDS,
    hasura.GET_LATEST_PROGRAM_IDSVariables
  >(
    gql`
      query GET_LATEST_PROGRAM_IDS($limit: Int) {
        program(
          where: { published_at: { _is_null: false }, is_private: { _eq: false }, is_deleted: { _eq: false } }
          order_by: [{ published_at: desc }]
          limit: $limit
        ) {
          id
          support_locales
        }
      }
    `,
    { variables: { limit } },
  )

  const programIds: string[] =
    loading || error || !data
      ? []
      : data.program
          .filter(program => !program.support_locales || program.support_locales.includes(language))
          .map(program => program.id)

  return {
    loadingProgramIds: loading,
    errorProgramIds: error,
    programIds,
    refetchProgramIds: refetch,
  }
}

export const useProgram = (programId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_PROGRAM, hasura.GET_PROGRAMVariables>(
    gql`
      query GET_PROGRAM($programId: uuid!) {
        program_by_pk(id: $programId) {
          id
          cover_url
          title
          abstract
          published_at
          is_subscription
          is_sold_out
          list_price
          sale_price
          sold_at
          description
          cover_video_url
          is_issues_open
          is_private
          is_countdown_timer_visible
          is_introduction_section_visible
          is_enrolled_count_visible
          editors {
            member_id
          }
          program_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          program_tags(order_by: { position: asc }) {
            tag {
              name
            }
          }
          program_roles(order_by: { created_at: asc, id: desc }) {
            id
            name
            member_id
          }
          program_plans(order_by: { created_at: asc }) {
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
            auto_renewed
            is_countdown_timer_visible
            group_buying_people
          }
          program_review_score {
            score
          }
          program_duration {
            duration
          }
          program_content_sections(
            where: { program_contents: { published_at: { _is_null: false } } }
            order_by: { position: asc }
          ) {
            id
            title
            description
            program_contents(where: { published_at: { _lte: "now()" } }, order_by: { position: asc }) {
              id
              title
              abstract
              metadata
              duration
              published_at
              list_price
              sale_price
              sold_at
              content_body_id
              program_content_type {
                id
                type
              }
              program_content_materials {
                id
                data
                created_at
              }
              program_content_videos {
                attachment {
                  id
                  size
                  options
                  data
                }
              }
            }
            program_contents_aggregate(where: { published_at: { _is_null: false } }) {
              aggregate {
                count
              }
            }
          }
        }
      }
    `,
    { variables: { programId } },
  )
  const program: (Program & { duration: number | null; score: number | null }) | null = useMemo(
    () =>
      loading || error || !data || !data.program_by_pk
        ? null
        : {
            id: data.program_by_pk.id,
            coverUrl: data.program_by_pk.cover_url,
            title: data.program_by_pk.title,
            abstract: data.program_by_pk.abstract,
            publishedAt: new Date(data.program_by_pk.published_at),
            isSoldOut: data.program_by_pk.is_sold_out,
            description: data.program_by_pk.description,
            coverVideoUrl: data.program_by_pk.cover_video_url,
            isIssuesOpen: data.program_by_pk.is_issues_open,
            isEnrolledCountVisible: data.program_by_pk.is_enrolled_count_visible,
            isPrivate: data.program_by_pk.is_private,
            isCountdownTimerVisible: data.program_by_pk.is_countdown_timer_visible,
            isIntroductionSectionVisible: data.program_by_pk.is_introduction_section_visible,
            tags: data.program_by_pk.program_tags.map(programTag => programTag.tag.name),
            editors: data.program_by_pk.editors.map(v => v?.member_id || ''),
            categories: data.program_by_pk.program_categories.map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
            })),
            roles: data.program_by_pk.program_roles.map(programRole => ({
              id: programRole.id,
              name: programRole.name as ProgramRoleName,
              memberId: programRole.member_id,
              memberName: programRole.member_id,
            })),
            plans: data.program_by_pk.program_plans.map(programPlan => ({
              id: programPlan.id,
              type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
              title: programPlan.title || '',
              description: programPlan.description,
              gains: programPlan.gains,
              currency: {
                id: programPlan.currency.id,
                label: programPlan.currency.label,
                unit: programPlan.currency.unit,
                name: programPlan.currency.name,
              },
              isSubscription: programPlan.auto_renewed,
              listPrice: programPlan.list_price,
              salePrice: programPlan.sale_price,
              soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
              discountDownPrice: programPlan.discount_down_price,
              periodAmount: programPlan.period_amount,
              periodType: programPlan.period_type as PeriodType,
              startedAt: programPlan.started_at,
              endedAt: programPlan.ended_at,
              isParticipantsVisible: programPlan.is_participants_visible,
              publishedAt: programPlan.published_at,
              isCountdownTimerVisible: programPlan.is_countdown_timer_visible,
              groupBuyingPeople: programPlan.group_buying_people || 1,
            })),
            duration: data.program_by_pk.program_duration?.duration,
            score: data.program_by_pk.program_review_score?.score,
            contentSections: data.program_by_pk.program_content_sections.map(programContentSection => ({
              id: programContentSection.id,
              title: programContentSection.title,
              description: programContentSection.description,
              contents: programContentSection.program_contents.map(programContent => ({
                id: programContent.id,
                title: programContent.title,
                abstract: programContent.abstract,
                metadata: programContent.metadata,
                duration: programContent.duration,
                contentType:
                  programContent.program_content_videos.length > 0
                    ? 'video'
                    : programContent.program_content_type?.type || '',
                publishedAt: new Date(programContent.published_at),
                listPrice: programContent.list_price,
                salePrice: programContent.sale_price,
                soldAt: programContent.sold_at && new Date(programContent.sold_at),
                contentBodyId: programContent.content_body_id,
                materials: programContent.program_content_materials.map(v => ({
                  id: v.id,
                  data: v.data,
                  createdAt: v.created_at,
                })),
                videos: programContent.program_content_videos.map(v => ({
                  id: v.attachment.id,
                  size: v.attachment.size,
                  options: v.attachment.options,
                  data: v.attachment.data,
                })),
              })),
            })),
          },
    [data, error, loading],
  )

  return {
    loadingProgram: loading,
    errorProgram: error,
    program,
    refetchProgram: refetch,
  }
}

export const useProgramContent = (programContentId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PROGRAM_CONTENT, hasura.GET_PROGRAM_CONTENTVariables>(
    gql`
      query GET_PROGRAM_CONTENT($programContentId: uuid!) {
        program_content_by_pk(id: $programContentId) {
          id
          title
          abstract
          created_at
          published_at
          list_price
          sale_price
          sold_at
          metadata
          duration
          program_content_plans {
            id
            program_plan {
              id
              title
            }
          }
          program_content_body {
            id
            description
            data
            type
          }
          program_content_materials {
            id
            data
            created_at
          }
          program_content_videos {
            attachment {
              id
              size
              options
              data
            }
          }
          program_content_attachments {
            attachment_id
            data
            options
            created_at
          }
        }
      }
    `,
    {
      variables: { programContentId },
      notifyOnNetworkStatusChange: true,
    },
  )

  const programContent:
    | (ProgramContent & {
        programContentBody: ProgramContentBodyProps | null
        materials: ProgramContentMaterialProps[]
        attachments: ProgramContentAttachmentProps[]
      })
    | null = useMemo(
    () =>
      !data?.program_content_by_pk
        ? null
        : {
            id: data.program_content_by_pk.id,
            title: data.program_content_by_pk.title,
            abstract: data.program_content_by_pk.abstract,
            metadata: data.program_content_by_pk.metadata,
            duration: data.program_content_by_pk.duration,
            contentType:
              data.program_content_by_pk.program_content_videos.length > 0
                ? 'video'
                : data.program_content_by_pk.program_content_body?.type,
            publishedAt: new Date(data.program_content_by_pk.published_at),
            listPrice: data.program_content_by_pk.list_price,
            salePrice: data.program_content_by_pk.sale_price,
            soldAt: data.program_content_by_pk.sold_at && new Date(data.program_content_by_pk.sold_at),
            contentBodyId: data.program_content_by_pk.program_content_body?.id,
            programContentBody: data.program_content_by_pk.program_content_body
              ? {
                  id: data.program_content_by_pk.program_content_body.id,
                  type: data.program_content_by_pk.program_content_body.type,
                  description: data.program_content_by_pk.program_content_body.description,
                  data: data.program_content_by_pk.program_content_body.data,
                }
              : null,
            materials: data.program_content_by_pk.program_content_materials.map(v => ({
              id: v.id,
              data: v.data,
              createdAt: v.created_at,
            })),
            videos: data.program_content_by_pk.program_content_videos.map(v => ({
              id: v.attachment.id,
              size: v.attachment.size,
              options: v.attachment.options,
              data: v.attachment.data,
            })),
            attachments: data.program_content_by_pk.program_content_attachments.map(u => ({
              id: u.attachment_id,
              data: u.data,
              options: u.options,
              createdAt: u.created_at,
            })),
          },
    [data],
  )

  return {
    loadingProgramContent: loading,
    errorProgramContent: error,
    programContent,
    refetchProgramContent: refetch,
  }
}

export const useEnrolledProgramIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAMS,
    hasura.GET_ENROLLED_PROGRAMSVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAMS($memberId: String!) {
        program_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {
          program_id
        }
        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
          program_plan {
            id
            program_id
          }
        }
        program_content_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {
          program_id
        }
      }
    `,
    {
      variables: { memberId },
      fetchPolicy: 'no-cache',
    },
  )

  const enrolledProgramIds =
    loading || error || !data
      ? []
      : uniq([
          ...data.program_enrollment.map(enrollment => enrollment.program_id),
          ...data.program_plan_enrollment.map(enrollment => enrollment.program_plan?.program_id || ''),
          ...data.program_content_enrollment.map(enrollment => enrollment.program_id),
        ])

  return {
    enrolledProgramIds: loading || error ? [] : enrolledProgramIds,
    errorProgramIds: error,
    loadingProgramIds: loading,
    refetchProgramIds: refetch,
  }
}

export const useEnrolledPlanIds = () => {
  const { currentMemberId } = useAuth()
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAM_PLANS,
    hasura.GET_ENROLLED_PROGRAM_PLANSVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAM_PLANS($memberId: String!) {
        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
          program_plan_id
        }
      }
    `,
    { variables: { memberId: currentMemberId || '' } },
  )

  const programPlanIds: string[] =
    loading || error || !data ? [] : data.program_plan_enrollment.map((value: any) => value.program_plan_id)

  return {
    programPlanIds,
    loadingProgramPlanIds: loading,
    refetchProgramPlanIds: refetch,
  }
}

export const useProgramPlanEnrollment = (programPlanId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_PLAN_ENROLLMENT,
    hasura.GET_PROGRAM_PLAN_ENROLLMENTVariables
  >(
    gql`
      query GET_PROGRAM_PLAN_ENROLLMENT($programPlanId: uuid!) {
        program_plan_enrollment_aggregate(where: { program_plan_id: { _eq: $programPlanId } }) {
          aggregate {
            count
          }
        }
      }
    `,
    { variables: { programPlanId } },
  )

  return {
    numProgramPlanEnrollments:
      loading || error || !data || !data.program_plan_enrollment_aggregate.aggregate
        ? 0
        : data.program_plan_enrollment_aggregate.aggregate.count || 0,
    loadingProgramPlanEnrollments: loading,
    refetchProgramPlanEnrollments: refetch,
  }
}

export const useProgramContentMaterial = (programContentId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_CONTENT_MATERIAL,
    hasura.GET_PROGRAM_CONTENT_MATERIALVariables
  >(
    gql`
      query GET_PROGRAM_CONTENT_MATERIAL($programContentId: uuid!) {
        program_content_material(where: { program_content_id: { _eq: $programContentId } }) {
          id
          data
          created_at
        }
      }
    `,
    { variables: { programContentId }, fetchPolicy: 'no-cache' },
  )

  const programContentMaterials = data?.program_content_material.map(
    (contentMaterial: { id: any; data: any; created_at: Date }) => {
      return {
        id: contentMaterial.id,
        data: contentMaterial.data,
        createdAt: new Date(contentMaterial.created_at),
      }
    },
  )
  return {
    loadingProgramContentMaterials: loading,
    errorProgramContentMaterials: error,
    programContentMaterials,
    refetch,
  }
}

export const useProgramContentBody = (programContentBodyId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_CONTENT_BODY,
    hasura.GET_PROGRAM_CONTENT_BODYVariables
  >(
    gql`
      query GET_PROGRAM_CONTENT_BODY($programContentBodyId: uuid!) {
        program_content_body_by_pk(id: $programContentBodyId) {
          id
          type
          description
          data
        }
      }
    `,
    { variables: { programContentBodyId }, fetchPolicy: 'no-cache' },
  )

  const programContentBody: ProgramContentBodyProps | null = data?.program_content_body_by_pk
    ? {
        id: data.program_content_body_by_pk.id,
        type: data.program_content_body_by_pk.type,
        description: data.program_content_body_by_pk.description,
        data: data.program_content_body_by_pk.data,
      }
    : null

  return {
    loading,
    error,
    data: programContentBody,
    refetch,
  }
}

export const useMutateExercise = () => {
  const [insertExercise] = useMutation<hasura.INSERT_EXERCISE, hasura.INSERT_EXERCISEVariables>(gql`
    mutation INSERT_EXERCISE($data: exercise_insert_input!) {
      insert_exercise_one(object: $data) {
        id
      }
    }
  `)

  return {
    insertExercise,
  }
}

export const useProgramEnrollmentAggregate = (programId: string, options?: Pick<QueryHookOptions, 'skip'>) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATE,
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATEVariables
  >(
    gql`
      query GET_PROGRAM_ENROLLMENT_AGGREGATE($programId: uuid!) {
        program_plan_enrollment_aggregate(where: { program_plan: { program_id: { _eq: $programId } } }) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      skip: options?.skip,
      variables: {
        programId,
      },
    },
  )
  const enrolledCount = data?.program_plan_enrollment_aggregate?.aggregate?.count || 0

  return {
    loading,
    error,
    data: enrolledCount,
    refetch,
  }
}
