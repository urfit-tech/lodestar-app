import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import hasura from '../hasura'
import { PeriodType } from '../types/program'
import { ProgramPackagePlanProps, ProgramPackageProgram, ProgramPackageProps } from '../types/programPackage'

export const useProgramPackageIntroduction = (programPackageId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_INTRODUCTION,
    hasura.GET_PROGRAM_PACKAGE_INTRODUCTIONVariables
  >(
    gql`
      query GET_PROGRAM_PACKAGE_INTRODUCTION($programPackageId: uuid!) {
        program_package_by_pk(id: $programPackageId) {
          id
          title
          cover_url
          description
          program_package_programs(order_by: { position: asc, program: { position: asc, published_at: desc } }) {
            id
            program {
              id
              title
              cover_url
              program_categories {
                id
                category {
                  id
                  name
                }
              }
            }
          }
          program_package_plans(
            where: { published_at: { _is_null: false } }
            order_by: { position: asc, created_at: desc }
          ) {
            id
            title
            description
            is_subscription
            is_participants_visible
            period_amount
            period_type
            list_price
            sale_price
            sold_at
            discount_down_price
            program_package_plan_enrollments_aggregate {
              aggregate {
                count
              }
            }
          }
        }
      }
    `,
    { variables: { programPackageId } },
  )

  const programPackageIntroduction: ProgramPackageProps & {
    programPackagePlans: ProgramPackagePlanProps[]
    includedPrograms: ProgramPackageProgram[]
  } =
    loading || error || !data || !data.program_package_by_pk
      ? {
          id: '',
          title: '',
          coverUrl: '',
          description: null,
          programPackagePlans: [],
          includedPrograms: [],
        }
      : {
          id: programPackageId,
          title: data.program_package_by_pk.title,
          coverUrl: data.program_package_by_pk.cover_url,
          description: data.program_package_by_pk.description,
          programPackagePlans: data.program_package_by_pk.program_package_plans.map(programPackagePlan => ({
            id: programPackagePlan.id,
            title: programPackagePlan.title,
            description: programPackagePlan.description,
            isSubscription: programPackagePlan.is_subscription,
            isParticipantsVisible: programPackagePlan.is_participants_visible,
            periodAmount: programPackagePlan.period_amount,
            periodType: programPackagePlan.period_type as PeriodType,
            listPrice: programPackagePlan.list_price,
            salePrice: programPackagePlan.sale_price,
            soldAt: programPackagePlan.sold_at ? new Date(programPackagePlan.sold_at) : null,
            discountDownPrice: programPackagePlan.discount_down_price,
            enrollmentCount: programPackagePlan.program_package_plan_enrollments_aggregate.aggregate?.count || 0,
          })),
          includedPrograms: data.program_package_by_pk.program_package_programs.map(packageProgram => ({
            id: packageProgram.program.id,
            title: packageProgram.program.title,
            coverUrl: packageProgram.program.cover_url,
            categories: packageProgram.program.program_categories.map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
            })),
          })),
        }

  return {
    loadingProgramPackage: loading,
    errorProgramPackage: error,
    programPackageIntroduction,
    refetchProgramPackage: refetch,
  }
}

export const useEnrolledProgramPackagePlanIds = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS,
    hasura.GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDSVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS($memberId: String!) {
        program_package_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
          program_package_plan_id
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )

  const enrolledProgramPackagePlanIds =
    loading || !!error || !data
      ? []
      : data.program_package_plan_enrollment.map(
          programPackagePlanEnrollment => programPackagePlanEnrollment.program_package_plan_id,
        )

  return {
    loadingProgramPackageIds: loading,
    enrolledProgramPackagePlanIds,
    errorProgramPackageIds: error,
    refetchProgramPackageIds: refetch,
  }
}

export const useEnrolledProgramPackageIds = (memberId: string, programPackageId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAM_PACKAGE,
    hasura.GET_ENROLLED_PROGRAM_PACKAGEVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAM_PACKAGE($memberId: String!, $programPackageId: uuid!) {
        program_package_plan_enrollment(
          where: {
            member_id: { _eq: $memberId }
            program_package_plan: { program_package_id: { _eq: $programPackageId } }
          }
        ) {
          program_package_plan_id
          program_package_plan {
            program_package_id
          }
        }
      }
    `,
    { variables: { memberId, programPackageId } },
  )

  const enrolledProgramPackageIds =
    loading || !!error || !data
      ? []
      : data.program_package_plan_enrollment.map(
          programPackagePlanEnrollment => programPackagePlanEnrollment.program_package_plan?.program_package_id,
        )

  return {
    loadingProgramPackageIds: loading,
    enrolledProgramPackageIds,
    errorProgramPackageIds: error,
    refetchProgramPackageIds: refetch,
  }
}

export const useProgramPackage = (programPackageId: string, memberId: string | null) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_CONTENT,
    hasura.GET_PROGRAM_PACKAGE_CONTENTVariables
  >(
    gql`
      query GET_PROGRAM_PACKAGE_CONTENT($programPackageId: uuid!, $memberId: String) {
        program_package_by_pk(id: $programPackageId) {
          id
          cover_url
          title
          published_at
          program_package_programs(
            where: { program: { published_at: { _is_null: false } } }
            order_by: { position: asc }
          ) {
            id
            program {
              id
              cover_url
              title
              program_categories {
                id
                category {
                  id
                  name
                }
              }
            }
          }
        }
        program_package_plan_enrollment(
          where: {
            program_package_plan: { program_package_id: { _eq: $programPackageId } }
            member_id: { _eq: $memberId }
          }
        ) {
          program_package_plan {
            is_tempo_delivery
          }
        }
        program_tempo_delivery(
          where: {
            program_package_program: { program_package_id: { _eq: $programPackageId } }
            member_id: { _eq: $memberId }
          }
        ) {
          delivered_at
          program_package_program_id
        }
      }
    `,
    { variables: { programPackageId, memberId } },
  )

  const programPackage: ProgramPackageProps & {
    isEnrolled: boolean
  } = {
    id: programPackageId,
    title: data?.program_package_by_pk?.title || '',
    coverUrl: data?.program_package_by_pk?.cover_url || null,
    description: null,
    isEnrolled: !!data?.program_package_plan_enrollment.length,
  }

  const isTempoDelivery =
    data?.program_package_plan_enrollment.some(
      planEnrollment => planEnrollment.program_package_plan?.is_tempo_delivery,
    ) || false
  const programs: ProgramPackageProgram[] =
    loading || error || !data || !data.program_package_by_pk
      ? []
      : data.program_package_by_pk.program_package_programs
          .filter(
            programPackageProgram =>
              !isTempoDelivery ||
              data.program_tempo_delivery.some(
                programTempoDelivery =>
                  programTempoDelivery.program_package_program_id === programPackageProgram.id &&
                  new Date(programTempoDelivery.delivered_at).getTime() < Date.now(),
              ),
          )
          .map(programPackageProgram => ({
            id: programPackageProgram.program.id,
            title: programPackageProgram.program.title,
            coverUrl: programPackageProgram.program.cover_url || undefined,
            categories: programPackageProgram.program.program_categories.map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
            })),
          }))

  return {
    loading,
    error,
    programPackage,
    programs,
    refetch,
  }
}
