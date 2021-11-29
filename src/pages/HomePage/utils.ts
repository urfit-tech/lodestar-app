import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import hasura from '../../hasura'
import { PeriodType, ProgramBriefProps, ProgramPlan, ProgramRole, ProgramRoleName } from '../../types/program'

type SunkProgramProps = ProgramBriefProps & {
  enrollmentCount: number
  roles: ProgramRole[]
  plans: ProgramPlan[]
}

const programFieldsFragment = gql`
  fragment programFields on program {
    id
    cover_url
    title
    abstract
    support_locales
    published_at
    is_subscription
    is_sold_out
    is_private

    list_price
    sale_price
    sold_at
    program_roles(where: { name: { _eq: "instructor" } }) {
      id
      name
      member_id
    }
    program_plans(order_by: { created_at: asc }, limit: 1) {
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
      program_plan_enrollments_aggregate {
        aggregate {
          count
        }
      }
    }
    program_enrollments_aggregate {
      aggregate {
        count
      }
    }
    program_content_sections {
      program_contents {
        duration
      }
      program_contents_aggregate {
        aggregate {
          sum {
            duration
          }
        }
      }
    }
  }
`

const useLastWatchedProgramContents = () => {
  const { loading, data } = useQuery<hasura.GET_LAST_WATCHED_PROGRAM_CONTENTS>(
    gql`
      query GET_LAST_WATCHED_PROGRAM_CONTENTS {
        program_content_progress(order_by: { updated_at: desc }, limit: 2) {
          id
          progress
          program_content {
            id
            title
            duration
            program_content_section {
              id
              program {
                id
                cover_url
                program_roles {
                  member {
                    name
                    picture_url
                  }
                }
              }
            }
            program_content_type {
              id
              type
            }
          }
        }
      }
    `,
  )

  return {
    loading,
    lastWatchedProgramContents:
      data?.program_content_progress.map(programContentProgress => ({
        programId: programContentProgress.program_content.program_content_section.program.id,
        id: programContentProgress.program_content.id,
        title: programContentProgress.program_content.title,
        coverUrl: programContentProgress.program_content.program_content_section.program.cover_url,
        type: programContentProgress.program_content.program_content_type?.type as 'video' | 'text' | null,
        duration: programContentProgress.program_content.duration || 0,
        progress: programContentProgress.progress * 100,
        role: {
          name:
            programContentProgress.program_content.program_content_section.program.program_roles[0].member?.name || '',
          pictureUrl:
            programContentProgress.program_content.program_content_section.program.program_roles[0].member
              ?.picture_url || '',
        },
      })) || [],
  }
}
const useLatestPrograms: () => {
  loading: boolean
  latestPrograms: SunkProgramProps[]
} = () => {
  const { loading, data } = useQuery<hasura.GET_LAST_PROGRAMS>(
    gql`
      ${programFieldsFragment}
      query GET_LAST_PROGRAMS {
        latestUpdatedProgram: program(
          where: { is_deleted: { _eq: false }, is_private: { _eq: false }, published_at: { _is_null: false } }
          order_by: { published_at: desc }
          limit: 6
        ) {
          ...programFields
        }
      }
    `,
  )
  return {
    loading,
    latestPrograms:
      data?.latestUpdatedProgram.map(program => ({
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
        totalDuration: sum(
          program.program_content_sections.map(
            programContentSection => programContentSection.program_contents_aggregate.aggregate?.sum?.duration || 0,
          ),
        ),
        enrollmentCount:
          (program.program_enrollments_aggregate.aggregate?.count || 0) +
          sum(
            program.program_plans.map(
              programPlan => programPlan.program_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
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
          publishedAt: programPlan.published_at,
        })),
      })) || [],
  }
}
const currentTime = new Date()
const useAffordablePrograms: () => {
  loading: boolean
  affordablePrograms: SunkProgramProps[]
} = () => {
  const { loading, data } = useQuery<hasura.GET_AFFORDABLE_PROGRAMS>(
    gql`
      ${programFieldsFragment}
      query GET_AFFORDABLE_PROGRAMS($currentTime: timestamptz!) {
        affordableProgram: program(
          where: {
            is_deleted: { _eq: false }
            is_private: { _eq: false }
            published_at: { _is_null: false }
            _or: [
              {
                _and: [
                  { _or: [{ sold_at: { _lte: $currentTime } }, { sold_at: { _is_null: true } }] }
                  { list_price: { _lte: 200 } }
                ]
              }
              { _and: [{ sold_at: { _gt: $currentTime } }, { sale_price: { _lte: 200 } }] }
            ]
          }
          order_by: { published_at: desc }
          limit: 10
        ) {
          ...programFields
        }
      }
    `,
    {
      variables: {
        currentTime,
      },
    },
  )

  return {
    loading,
    affordablePrograms:
      data?.affordableProgram.map(program => ({
        id: program.id,
        coverUrl: program.cover_url,
        title: program.title,
        abstract: null,
        supportLocales: program.support_locales,
        publishedAt: program.published_at && new Date(program.published_at),
        isSubscription: program.is_subscription,
        isSoldOut: program.is_sold_out,
        isPrivate: program.is_private,

        listPrice: program.list_price,
        salePrice: program.sale_price,
        soldAt: program.sold_at && new Date(program.sold_at),
        totalDuration: sum(
          program.program_content_sections.map(
            programContentSection => programContentSection.program_contents_aggregate.aggregate?.sum?.duration || 0,
          ),
        ),
        enrollmentCount:
          (program.program_enrollments_aggregate.aggregate?.count || 0) +
          sum(
            program.program_plans.map(
              programPlan => programPlan.program_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
        roles: [],
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
          publishedAt: programPlan.published_at,
        })),
      })) || [],
  }
}
const useHottestTagPrograms: () => {
  loading: boolean
  hottestTagPrograms: SunkProgramProps[]
} = () => {
  const { loading, data } = useQuery<hasura.GET_HOTTEST_TAG_PROGRAMS>(
    gql`
      ${programFieldsFragment}
      query GET_HOTTEST_TAG_PROGRAMS {
        hottestTagProgram: program(
          where: {
            is_deleted: { _eq: false }
            is_private: { _eq: false }
            published_at: { _is_null: false }
            program_tags: { tag_name: { _eq: "熱門推薦" } }
          }
          order_by: { published_at: desc }
          limit: 6
        ) {
          ...programFields
        }
      }
    `,
  )

  return {
    loading,
    hottestTagPrograms:
      data?.hottestTagProgram.map(program => ({
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
        totalDuration: sum(
          program.program_content_sections.map(
            programContentSection => programContentSection.program_contents_aggregate.aggregate?.sum?.duration || 0,
          ),
        ),
        enrollmentCount:
          (program.program_enrollments_aggregate.aggregate?.count || 0) +
          sum(
            program.program_plans.map(
              programPlan => programPlan.program_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
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
          publishedAt: programPlan.published_at,
        })),
      })) || [],
  }
}
const useUnitCategoryPrograms: () => {
  loading: boolean
  unitCategoryPrograms: SunkProgramProps[]
} = () => {
  const { loading, data } = useQuery<hasura.GET_UNIT_CATEGORY_PROGRAMS>(
    gql`
      ${programFieldsFragment}
      query GET_UNIT_CATEGORY_PROGRAMS {
        unitCategoryProgram: program(
          where: {
            is_deleted: { _eq: false }
            is_private: { _eq: false }
            published_at: { _is_null: false }
            program_categories: { category: { name: { _eq: "單元課程" } } }
          }
          order_by: { published_at: desc }
          limit: 6
        ) {
          ...programFields
        }
      }
    `,
  )

  return {
    loading,
    unitCategoryPrograms:
      data?.unitCategoryProgram.map(program => ({
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
        totalDuration: sum(
          program.program_content_sections.map(
            programContentSection => programContentSection.program_contents_aggregate.aggregate?.sum?.duration || 0,
          ),
        ),
        enrollmentCount:
          (program.program_enrollments_aggregate.aggregate?.count || 0) +
          sum(
            program.program_plans.map(
              programPlan => programPlan.program_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
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
          publishedAt: programPlan.published_at,
        })),
      })) || [],
  }
}
const useSystematicCategoryPrograms: () => {
  loading: boolean
  systematicCategoryPrograms: SunkProgramProps[]
} = () => {
  const { loading, data } = useQuery<hasura.GET_SYSTEMATIC_CATEGORY_PROGRAMS>(
    gql`
      ${programFieldsFragment}
      query GET_SYSTEMATIC_CATEGORY_PROGRAMS($currentTime: timestamptz!) {
        systematicCategoryProgram: program(
          where: {
            is_deleted: { _eq: false }
            is_private: { _eq: false }
            published_at: { _is_null: false }
            program_categories: { category: { name: { _eq: "系統套課" } } }
          }
          order_by: { published_at: desc }
          limit: 6
        ) {
          ...programFields
        }
      }
    `,
  )

  return {
    loading,
    systematicCategoryPrograms:
      data?.systematicCategoryProgram.map(program => ({
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
        totalDuration: sum(
          program.program_content_sections.map(
            programContentSection => programContentSection.program_contents_aggregate.aggregate?.sum?.duration || 0,
          ),
        ),
        enrollmentCount:
          (program.program_enrollments_aggregate.aggregate?.count || 0) +
          sum(
            program.program_plans.map(
              programPlan => programPlan.program_plan_enrollments_aggregate.aggregate?.count || 0,
            ),
          ),
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
          publishedAt: programPlan.published_at,
        })),
      })) || [],
  }
}

const useSunkHomePageProducts: () => {
  loading: boolean
  lastWatchedProgramContents: {
    programId: string
    id: string
    title: string
    coverUrl: string | null
    type: 'video' | 'text' | null
    duration: number
    progress: number
    role: {
      name: string
      pictureUrl: string
    }
  }[]
  latestPrograms: SunkProgramProps[]
  affordablePrograms: SunkProgramProps[]
  hottestTagPrograms: SunkProgramProps[]
  unitCategoryPrograms: SunkProgramProps[]
  systematicCategoryPrograms: SunkProgramProps[]
} = () => {
  const { loading, lastWatchedProgramContents } = useLastWatchedProgramContents()
  const { loading: loadingLatestPrograms, latestPrograms } = useLatestPrograms()
  const { loading: loadingAffordablePrograms, affordablePrograms } = useAffordablePrograms()
  const { loading: loadingHottestTagPrograms, hottestTagPrograms } = useHottestTagPrograms()
  const { loading: loadingUnitCategoryPrograms, unitCategoryPrograms } = useUnitCategoryPrograms()
  const { loading: loadingSystematicCategoryPrograms, systematicCategoryPrograms } = useSystematicCategoryPrograms()
  return {
    loading:
      loading ||
      loadingLatestPrograms ||
      loadingAffordablePrograms ||
      loadingHottestTagPrograms ||
      loadingUnitCategoryPrograms ||
      loadingSystematicCategoryPrograms,
    lastWatchedProgramContents,
    latestPrograms,
    affordablePrograms,
    hottestTagPrograms,
    unitCategoryPrograms,
    systematicCategoryPrograms,
  }
}

export type { SunkProgramProps }
export { useSunkHomePageProducts }
