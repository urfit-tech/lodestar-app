import { gql, QueryHookOptions, useMutation, useQuery } from '@apollo/client'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum, uniq } from 'ramda'
import { useMemo } from 'react'
import hasura from '../hasura'
import { Category } from '../types/general'
import {
  DisplayMode,
  PeriodType,
  Program,
  ProgramBriefProps,
  ProgramContent,
  ProgramContentAttachmentProps,
  ProgramContentBodyProps,
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
      query GET_PUBLISHED_PROGRAM_COLLECTION($condition: program_bool_exp!, $limit: Int) {
        program(where: $condition, order_by: [{ position: asc }, { published_at: desc }], limit: $limit) {
          id
          cover_url
          cover_mobile_url
          cover_thumbnail_url
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
        condition: {
          published_at: { _lte: 'now()' },
          is_deleted: { _eq: false },
          program_roles: {
            name: { _eq: 'instructor' },
            member_id: { _eq: options?.instructorId },
          },
          is_private: { _eq: options?.isPrivate },
          _or: [
            { _not: { program_categories: {} } },
            { program_categories: { category_id: { _eq: options?.categoryId } } },
          ],
        },
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
            coverUrl: program.cover_url || null,
            coverMobileUrl: program.cover_mobile_url || null,
            coverThumbnailUrl: program.cover_thumbnail_url || null,
            title: program.title,
            abstract: program.abstract || '',
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
  const { loading, data, error, refetch } = useQuery<hasura.GetProgram, hasura.GetProgramVariables>(
    gql`
      query GetProgram($programId: uuid!) {
        program_by_pk(id: $programId) {
          id
          cover_url
          cover_mobile_url
          cover_thumbnail_url
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
          meta_tag
          is_issues_open
          is_private
          is_countdown_timer_visible
          is_introduction_section_visible
          is_enrolled_count_visible
          editors {
            member_id
          }
          program_plans {
            id
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
          program_roles(order_by: [{ created_at: asc }, { id: desc }]) {
            id
            name
            member_id
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
            program_contents(order_by: { position: asc }) {
              id
              title
              abstract
              metadata
              duration
              published_at
              display_mode
              list_price
              sale_price
              sold_at
              content_body_id
              program_content_type {
                id
                type
              }
              program_content_videos {
                attachment {
                  id
                  size
                  options
                  data
                }
              }
              program_content_audios {
                data
              }
              program_content_ebook {
                id
                data
                program_content_ebook_tocs(where: { parent: { _is_null: true } }, order_by: { position: asc }) {
                  id
                  label
                  href
                  position
                  subitems(order_by: { position: asc }) {
                    id
                    label
                    href
                    position
                  }
                }
              }
            }
          }
        }
      }
    `,
    { variables: { programId } },
  )
  const { loading: loadingProgramPlans, data: programPlans } = useQuery<
    hasura.GetProgramPlans,
    hasura.GetProgramPlansVariables
  >(
    gql`
      query GetProgramPlans($programId: uuid!) {
        program_plan(where: { program_id: { _eq: $programId } }, order_by: { created_at: asc }) {
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
      }
    `,
    { variables: { programId } },
  )

  const program: (Program & { duration: number | null; score: number | null }) | null = useMemo(() => {
    return {
      id: data?.program_by_pk?.id,
      coverUrl: data?.program_by_pk?.cover_url || null,
      coverMobileUrl: data?.program_by_pk?.cover_mobile_url || null,
      coverThumbnailUrl: data?.program_by_pk?.cover_thumbnail_url || null,
      title: data?.program_by_pk?.title || '',
      abstract: data?.program_by_pk?.abstract || '',
      publishedAt: data?.program_by_pk?.published_at ? new Date(data?.program_by_pk?.published_at) : null,
      isSoldOut: data?.program_by_pk?.is_sold_out || false,
      description: data?.program_by_pk?.description || '',
      coverVideoUrl: data?.program_by_pk?.cover_video_url || null,
      metaTag: data?.program_by_pk?.meta_tag,
      isIssuesOpen: data?.program_by_pk?.is_issues_open === false ? false : true,
      isEnrolledCountVisible: data?.program_by_pk?.is_enrolled_count_visible,
      isPrivate: data?.program_by_pk?.is_private || false,
      isCountdownTimerVisible: data?.program_by_pk?.is_countdown_timer_visible,
      isIntroductionSectionVisible: data?.program_by_pk?.is_introduction_section_visible,
      tags: data?.program_by_pk?.program_tags.map(programTag => programTag.tag.name) || [],
      editors: data?.program_by_pk?.editors.map(v => v?.member_id || ''),
      categories:
        data?.program_by_pk?.program_categories.map(programCategory => ({
          id: programCategory.category.id,
          name: programCategory.category.name,
        })) || [],
      roles:
        data?.program_by_pk?.program_roles.map(programRole => ({
          id: programRole.id,
          name: programRole.name as ProgramRoleName,
          memberId: programRole.member_id,
          memberName: programRole.member_id,
        })) || [],
      plans:
        programPlans?.program_plan.map(programPlan => ({
          id: programPlan.id,
          type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
          title: programPlan.title || '',
          description: programPlan.description || '',
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
          // enrollmentCount:
          //   programPlanEnrollmentsAggregateData?.program_plan.find(v => v.id === programPlan.id)
          //     ?.program_plan_enrollments_aggregate.aggregate?.count || 0,
        })) || [],
      duration: data?.program_by_pk?.program_duration?.duration,
      score: data?.program_by_pk?.program_review_score?.score,
      contentSections:
        data?.program_by_pk?.program_content_sections.map(programContentSection => ({
          id: programContentSection.id,
          title: programContentSection.title,
          description: programContentSection.description || '',
          contents: programContentSection.program_contents.map(programContent => ({
            id: programContent.id,
            title: programContent.title,
            programId: data?.program_by_pk?.id,
            contentSectionTitle: programContentSection.title,
            abstract: programContent.abstract || '',
            metadata: programContent.metadata,
            duration: programContent.duration,
            contentType:
              programContent.program_content_videos.length > 0
                ? 'video'
                : programContent.program_content_type?.type || '',
            publishedAt: new Date(programContent.published_at),
            displayMode: programContent.display_mode as DisplayMode,
            listPrice: programContent.list_price,
            salePrice: programContent.sale_price,
            soldAt: programContent.sold_at && new Date(programContent.sold_at),
            contentBodyId: programContent.content_body_id,
            videos: programContent.program_content_videos.map(v => ({
              id: v.attachment.id,
              size: v.attachment.size,
              options: v.attachment.options,
              data: v.attachment.data,
            })),
            audios: programContent.program_content_audios.map(v => ({
              data: v.data,
            })),
            ebook: {
              id: (programContent.program_content_ebook?.id as string) || '',
              data: programContent.program_content_ebook?.data || {},
              programContentEbookTocs:
                programContent.program_content_ebook?.program_content_ebook_tocs.map(v => ({
                  id: v.id as string,
                  label: v.label,
                  href: v.href,
                  position: v.position || 0,
                  subitems: v.subitems.map(u => ({
                    id: u.id as string,
                    label: u.label,
                    href: u.href,
                    position: u.position || 0,
                  })),
                })) || [],
            },
          })),
        })) || [],
    }
  }, [data, programPlans])

  const [addProgramViewsHandler] = useMutation<hasura.ADD_PROGRAM_VIEWS, hasura.ADD_PROGRAM_VIEWSVariables>(gql`
    mutation ADD_PROGRAM_VIEWS($programId: uuid!) {
      update_program(where: { id: { _eq: $programId } }, _inc: { views: 1 }) {
        affected_rows
      }
    }
  `)

  const addProgramView = () => {
    return addProgramViewsHandler({ variables: { programId } })
  }

  return {
    loadingProgram: loading,
    errorProgram: error,
    program,
    refetchProgram: refetch,
    addProgramView,
    loadingProgramPlans,
  }
}

export const useProgramPlansEnrollmentsAggregateList = (programPlanIds: string[]) => {
  const { loading, data } = useQuery<
    hasura.GetProgramPlansEnrollmentsAggregate,
    hasura.GetProgramPlansEnrollmentsAggregateVariables
  >(
    gql`
      query GetProgramPlansEnrollmentsAggregate($programPlanIds: [uuid!]!) {
        program_plan(where: { id: { _in: $programPlanIds } }) {
          id
          program_plan_enrollments_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    `,
    { variables: { programPlanIds } },
  )
  const programPlansEnrollmentsAggregateList: {
    id: string
    enrollmentCount: number
  }[] =
    data?.program_plan.map(v => ({
      id: v.id,
      enrollmentCount: v.program_plan_enrollments_aggregate.aggregate?.count || 0,
    })) || []

  return {
    loading,
    programPlansEnrollmentsAggregateList,
  }
}

export const GetProgramContent = gql`
  query GetProgramContent($programContentId: uuid!) {
    program_content_by_pk(id: $programContentId) {
      id
      title
      abstract
      created_at
      published_at
      display_mode
      list_price
      sale_price
      sold_at
      metadata
      duration
      program_content_section {
        title
      }
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
      program_content_videos {
        attachment {
          id
          size
          options
          data
        }
      }
      program_content_audios {
        data
      }
      program_content_attachments(where: { data: { _is_null: false } }) {
        attachment_id
        data
        options
        created_at
      }
      program_content_progress(order_by: { updated_at: desc }, limit: 1) {
        last_progress
      }
    }
  }
`
export const useProgramContent = (programContentId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GetProgramContent, hasura.GetProgramContentVariables>(
    GetProgramContent,
    {
      variables: { programContentId },
      notifyOnNetworkStatusChange: true,
    },
  )

  const programContent:
    | (Omit<ProgramContent, 'ebook'> & {
        programContentBody: ProgramContentBodyProps | null
        attachments: ProgramContentAttachmentProps[]
        contentSectionTitle: string
      })
    | null = useMemo(
    () =>
      !data?.program_content_by_pk
        ? null
        : {
            id: data.program_content_by_pk.id,
            title: data.program_content_by_pk.title,
            contentSectionTitle: data.program_content_by_pk.program_content_section.title,
            abstract: data.program_content_by_pk.abstract || '',
            metadata: data.program_content_by_pk.metadata,
            duration: data.program_content_by_pk.duration,
            contentType: data.program_content_by_pk.program_content_body?.type || null,
            publishedAt: data.program_content_by_pk.published_at
              ? new Date(data.program_content_by_pk.published_at)
              : null,
            displayMode: data.program_content_by_pk.display_mode as DisplayMode,
            listPrice: data.program_content_by_pk.list_price,
            salePrice: data.program_content_by_pk.sale_price,
            soldAt: data.program_content_by_pk.sold_at && new Date(data.program_content_by_pk.sold_at),
            contentBodyId: data.program_content_by_pk.program_content_body?.id,
            programContentBody: data.program_content_by_pk.program_content_body
              ? {
                  id: data.program_content_by_pk.program_content_body.id,
                  type: data.program_content_by_pk.program_content_body.type || null,
                  description: data.program_content_by_pk.program_content_body.description || '',
                  data: data.program_content_by_pk.program_content_body.data,
                }
              : null,
            videos: data.program_content_by_pk.program_content_videos.map(v => ({
              id: v.attachment.id,
              size: v.attachment.size,
              options: v.attachment.options,
              data: v.attachment.data,
            })),
            audios: data.program_content_by_pk.program_content_audios.map(v => ({
              data: v.data,
            })),
            attachments: data.program_content_by_pk.program_content_attachments.map(u => ({
              id: u.attachment_id,
              data: u.data,
              options: u.options,
              createdAt: u.created_at,
            })),
            lastProgress: data.program_content_by_pk.program_content_progress[0]?.last_progress || 0,
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

  const enrolledProgramIds = data
    ? uniq([
        ...data.program_enrollment.map(enrollment => enrollment.program_id),
        ...data.program_plan_enrollment.map(enrollment => enrollment.program_plan?.program_id || ''),
        ...data.program_content_enrollment.map(enrollment => enrollment.program_id),
      ])
    : []

  return {
    enrolledProgramIds,
    error,
    loading,
    refetch,
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

  const programContentMaterials = data?.program_content_material.map(material => {
    return {
      id: material.id,
      data: material.data,
      createdAt: new Date(material.created_at),
    }
  })
  return {
    loading,
    error,
    data: programContentMaterials,
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
        type: data.program_content_body_by_pk.type || null,
        description: data.program_content_body_by_pk.description || '',
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
  const [updateExercise] = useMutation<hasura.UPDATE_EXERCISE, hasura.UPDATE_EXERCISEVariables>(gql`
    mutation UPDATE_EXERCISE($exerciseId: uuid!, $answer: jsonb, $endedAt: timestamptz) {
      update_exercise_by_pk(pk_columns: { id: $exerciseId }, _set: { answer: $answer, ended_at: $endedAt }) {
        id
      }
    }
  `)

  return {
    insertExercise,
    updateExercise,
  }
}

export const useProgramEnrollmentAggregate = (programId: string, options?: Pick<QueryHookOptions, 'skip'>) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATE,
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATEVariables
  >(
    gql`
      query GET_PROGRAM_ENROLLMENT_AGGREGATE($programId: uuid!) {
        program_statistics(where: { program_id: { _eq: $programId } }) {
          program_id
          program_plan_enrolled_count
          program_package_plan_enrolled_count
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
  const enrolledCount =
    sum(
      data?.program_statistics.map(v => v.program_plan_enrolled_count + v.program_package_plan_enrolled_count) || [],
    ) || 0

  return {
    loading,
    error,
    data: enrolledCount,
    refetch,
  }
}

export const useProgramContentExamId = (programContentId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_PROGRAM_CONTENT_EXAM_ID,
    hasura.GET_PROGRAM_CONTENT_EXAM_IDVariables
  >(
    gql`
      query GET_PROGRAM_CONTENT_EXAM_ID($programContentId: uuid!) {
        program_content_body(where: { program_contents: { id: { _eq: $programContentId } } }) {
          target
        }
      }
    `,
    { variables: { programContentId } },
  )
  const examId: string | null = data?.program_content_body[0].target

  return {
    loading,
    error,
    examId,
  }
}

export const useMutateMaterialAuditLog = () => {
  const [insertMaterialAuditLog] = useMutation<
    hasura.InsertMaterialAuditLog,
    hasura.InsertMaterialAuditLogVariables
  >(gql`
    mutation InsertMaterialAuditLog($data: material_audit_log_insert_input!) {
      insert_material_audit_log_one(object: $data) {
        id
      }
    }
  `)
  return {
    insertMaterialAuditLog,
  }
}

export const useInsertProgress = ({
  memberId,
  programContentId,
  progress,
  lastProgress,
}: {
  memberId: string
  programContentId: string
  progress: number
  lastProgress: number
}) => {
  const [insertProgramContentProgress] = useMutation<
    hasura.INSERT_PROGRAM_CONTENT_PROGRESS,
    hasura.INSERT_PROGRAM_CONTENT_PROGRESSVariables
  >(
    gql`
      mutation INSERT_PROGRAM_CONTENT_PROGRESS(
        $memberId: String!
        $programContentId: uuid!
        $progress: numeric!
        $lastProgress: numeric!
      ) {
        insert_program_content_progress(
          objects: {
            member_id: $memberId
            program_content_id: $programContentId
            progress: $progress
            last_progress: $lastProgress
          }
          on_conflict: {
            constraint: program_content_progress_member_id_program_content_id_key
            update_columns: [progress, last_progress]
          }
        ) {
          affected_rows
        }
      }
    `,
    {
      variables: {
        memberId,
        programContentId,
        progress,
        lastProgress,
      },
    },
  )
  return insertProgramContentProgress
}

export const useRecentProgramContent = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetRecentProgramContent,
    hasura.GetRecentProgramContentVariables
  >(
    gql`
      query GetRecentProgramContent($memberId: String!) {
        program_content_progress(where: { member_id: { _eq: $memberId } }, order_by: { updated_at: desc }, limit: 1) {
          updated_at
          program_content_id
          last_progress
          program_content {
            program_content_body {
              type
            }
            program_content_audios {
              id
            }
            program_content_videos {
              id
              attachment {
                data
                options
              }
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const recentProgramContent =
    loading || error || !data
      ? undefined
      : data?.program_content_progress.map(progress => {
          const contentType = progress.program_content.program_content_body.type
          const audiosLength = progress.program_content.program_content_audios.length
          const videosLength = progress.program_content.program_content_videos.length
          const contentVideo = progress.program_content.program_content_videos[0]
          const videoSource = contentVideo?.attachment?.options?.cloudflare
            ? 'cloudflare'
            : progress.program_content.program_content_videos[0]?.attachment?.data?.source
          if (
            (contentType === 'audio' && audiosLength !== 0) ||
            (contentType === 'video' && videoSource !== 'youtube' && videosLength !== 0)
          ) {
            return {
              contentType: progress.program_content.program_content_body.type,
              contentId: progress.program_content_id,
              lastProgress: progress.last_progress,
              source: videoSource,
              videoId: contentVideo?.id,
            }
          }
          return undefined
        })[0]

  return {
    recentProgramContent,
    loadingRecentProgramContent: loading,
    RefetchRecentProgramContent: refetch,
  }
}

export const useProgramContentEnrollment = (programId: string) => {
  const { currentMemberId } = useAuth()
  const { data: programContentEnrollmentData } = useQuery<
    hasura.GetProgramContentEnrollmentIds,
    hasura.GetProgramContentEnrollmentIdsVariables
  >(
    gql`
      query GetProgramContentEnrollmentIds($programId: uuid!, $currentMemberId: String!) {
        program_content_enrollment(where: { program_id: { _eq: $programId }, member_id: { _eq: $currentMemberId } }) {
          program_content_id
        }
      }
    `,
    {
      variables: {
        programId,
        currentMemberId: currentMemberId || '',
      },
    },
  )
  const contentIds = programContentEnrollmentData?.program_content_enrollment.map(content => content.program_content_id)

  const { data: programContentData } = useQuery<
    hasura.GetProgramContentDisplayMode,
    hasura.GetProgramContentDisplayModeVariables
  >(
    gql`
      query GetProgramContentDisplayMode($contentIds: [uuid!]) {
        program_content(where: { id: { _in: $contentIds } }) {
          id
          display_mode
        }
      }
    `,
    {
      variables: {
        contentIds,
      },
    },
  )

  const programContentEnrollment = programContentEnrollmentData?.program_content_enrollment.map(enrollment => {
    const displayMode = programContentData?.program_content.find(
      content => enrollment.program_content_id === content.id,
    )?.display_mode

    return {
      contentId: enrollment.program_content_id,
      displayMode,
    }
  })

  return {
    programContentEnrollment,
  }
}

export const useProgramProgress = (programContentIds: string[]) => {
  const { data } = useQuery<hasura.GetProgramProgress, hasura.GetProgramProgressVariables>(
    gql`
      query GetProgramProgress($programContentIds: [uuid!]) {
        program_content_progress(
          where: { program_content_id: { _in: $programContentIds } }
          order_by: { updated_at: desc }
        ) {
          program_content_id
          last_progress
        }
      }
    `,
    { variables: { programContentIds } },
  )
  const programContentProgress = data?.program_content_progress.map(progress => ({
    contentId: progress.program_content_id,
    lastProgress: progress.last_progress,
  }))
  return { programContentProgress }
}
