import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum, uniqBy } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import hasura from '../hasura'
import { PeriodType } from '../types/program'
import { ProgramPackage, ProgramPackageProgram, ProgramPackageProps } from '../types/programPackage'

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
          meta_tag
          published_at
          program_package_programs(order_by: { position: asc }) {
            id
            program {
              id
              title
              cover_url
              cover_thumbnail_url
              program_categories {
                id
                category {
                  id
                  name
                  position
                }
              }
            }
          }
          program_package_plans(
            where: { published_at: { _is_null: false } }
            order_by: { position: asc, created_at: asc }
          ) {
            id
            title
            description
            is_subscription
            is_participants_visible
            is_countdown_timer_visible
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

  const programPackageIntroduction: ProgramPackage =
    loading || error || !data || !data.program_package_by_pk
      ? {
          id: '',
          title: '',
          coverUrl: null,
          description: null,
          plans: [],
          programs: [],
          publishedAt: null,
        }
      : {
          id: programPackageId,
          title: data.program_package_by_pk.title,
          coverUrl: data.program_package_by_pk.cover_url || null,
          description: data.program_package_by_pk.description || '',
          metaTag: data.program_package_by_pk.meta_tag,
          publishedAt: data.program_package_by_pk.published_at,
          plans: data.program_package_by_pk.program_package_plans.map(programPackagePlan => ({
            id: programPackagePlan.id,
            title: programPackagePlan.title,
            description: programPackagePlan.description || '',
            isSubscription: programPackagePlan.is_subscription,
            isParticipantsVisible: programPackagePlan.is_participants_visible,
            isCountdownTimerVisible: programPackagePlan.is_countdown_timer_visible,
            periodAmount: programPackagePlan.period_amount,
            periodType: programPackagePlan.period_type as PeriodType,
            listPrice: programPackagePlan.list_price,
            salePrice: programPackagePlan.sale_price,
            soldAt: programPackagePlan.sold_at ? new Date(programPackagePlan.sold_at) : null,
            discountDownPrice: programPackagePlan.discount_down_price,
            enrollmentCount: programPackagePlan.program_package_plan_enrollments_aggregate.aggregate?.count || 0,
          })),
          programs: data.program_package_by_pk.program_package_programs.map(packageProgram => ({
            id: packageProgram.program.id,
            title: packageProgram.program.title,
            coverUrl: packageProgram.program.cover_url || null,
            coverThumbnailUrl: packageProgram.program.cover_thumbnail_url || null,
            categories: packageProgram.program.program_categories.map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
              position: programCategory.category.position,
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

export const useEnrolledProgramPackage = (
  memberId: string,
  options?: { programPackageId?: string; programPackagePlanId?: string; programId?: string },
) => {
  const { loading, error, data } = useQuery<
    hasura.GET_ENROLLED_PROGRAM_PACKAGES,
    hasura.GET_ENROLLED_PROGRAM_PACKAGESVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAM_PACKAGES(
        $memberId: String!
        $programPackageId: uuid
        $programPackagePlanId: uuid
        $programId: uuid
      ) {
        program_package(
          where: {
            id: { _eq: $programPackageId }
            program_package_plans: {
              id: { _eq: $programPackagePlanId }
              program_package_plan_enrollments: { member_id: { _eq: $memberId } }
            }
            program_package_programs: { program_id: { _eq: $programId } }
          }
          distinct_on: id
        ) {
          id
          cover_url
          title
          published_at
          program_package_plans {
            id
            is_tempo_delivery
            program_package_plan_enrollments_aggregate {
              aggregate {
                count
              }
            }
          }
          program_package_programs(where: { program: { published_at: { _lt: "now()" } } }) {
            id
            program {
              id
              program_content_sections {
                id
                program_contents {
                  id
                  duration
                }
              }
            }
            program_tempo_deliveries {
              id
            }
          }
        }
      }
    `,
    {
      variables: {
        memberId,
        programPackageId: options?.programPackageId,
        programPackagePlanId: options?.programPackagePlanId,
        programId: options?.programId,
      },
    },
  )

  const programPackages = data
    ? uniqBy(pp => pp.id, data.program_package).map(pp => ({
        id: pp.id,
        coverUrl: pp.cover_url || undefined,
        title: pp.title,
        enrolledPlans: pp.program_package_plans
          .filter(plan => plan.program_package_plan_enrollments_aggregate.aggregate?.count)
          .map(plan => ({
            id: plan.id,
            isTempoDelivery: plan.is_tempo_delivery,
          })),
        programs: pp.program_package_programs.map(p => ({
          id: p.program.id,
          isDelivered: !!p.program_tempo_deliveries.length,
        })),
        totalDuration: sum(
          pp.program_package_programs
            .map(p =>
              p.program.program_content_sections
                .map(programContentSection =>
                  programContentSection.program_contents.map(programContent => programContent.duration),
                )
                .flat(),
            )
            .flat(),
        ),
      }))
    : []
  return {
    loading,
    error,
    data: programPackages,
  }
}

export const useProgramPackage = (programPackageId: string, memberId: string | null) => {
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()
  const [data, setData] = useState<
    Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title'> & {
      programs: ProgramPackageProgram[]
    }
  >()

  const fetch = useCallback(async () => {
    // if (authToken) {
    try {
      const route = `/program-packages/${programPackageId}`
      setLoading(true)
      const { data } = await axios.get(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}${route}`, {
        params: { memberId },
        headers: { authorization: `Bearer ${authToken}` },
      })
      setData(data)
    } catch (err) {
      console.log(err)
      setError(err)
      setLoading(false)
    } finally {
      setLoading(false)
    }
    // }
  }, [authToken])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { fetch, data, error, loading }
}
