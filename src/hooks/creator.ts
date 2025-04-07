import { gql, useQuery } from '@apollo/client'
import hasura from '../hasura'

export const useGetAggregateByMemberIdAndRoleName = (memberId: string, roleName: string) => {
  const { loading: programAggregateLoading, data: programAggregateData } = useQuery<
    hasura.GetProgramAggregateByProgramRole,
    hasura.GetProgramAggregateByProgramRoleVariables
  >(
    gql`
      query GetProgramAggregateByProgramRole($memberId: String!, $roleName: String!) {
        program_aggregate(
          where: {
            published_at: { _is_null: false }
            program_roles: { member_id: { _eq: $memberId }, name: { _eq: $roleName } }
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        memberId,
        roleName,
      },
    },
  )

  const { loading: podcastProgramAggregateLoading, data: podcastProgramAggregateData } = useQuery<
    hasura.GetPodcastProgramAggregateByPodcastProgramRole,
    hasura.GetPodcastProgramAggregateByPodcastProgramRoleVariables
  >(
    gql`
      query GetPodcastProgramAggregateByPodcastProgramRole($memberId: String!, $roleName: String!) {
        podcast_program_aggregate(
          where: {
            published_at: { _is_null: false }
            podcast_program_roles: { member_id: { _eq: $memberId }, name: { _eq: $roleName } }
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        memberId,
        roleName,
      },
    },
  )
  const programCount = programAggregateData?.program_aggregate.aggregate?.count
  const podcastProgramCount = podcastProgramAggregateData?.podcast_program_aggregate.aggregate?.count
  const isLoading = programAggregateLoading || podcastProgramAggregateLoading
  return {
    isLoading,
    programCount,
    podcastProgramCount,
  }
}

export const useGetAggregateByCreatorId = (creatorId: string) => {
  const { loading, data: appointmentPlanAggregateData } = useQuery<
    hasura.GetAppointmentPlanAggregateByCreatorId,
    hasura.GetAppointmentPlanAggregateByCreatorIdVariables
  >(
    gql`
      query GetAppointmentPlanAggregateByCreatorId($creatorId: String!) {
        appointment_plan_aggregate(where: { published_at: { _is_null: false }, creator_id: { _eq: $creatorId } }) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        creatorId,
      },
    },
  )

  const appointmentPlanCount = appointmentPlanAggregateData?.appointment_plan_aggregate.aggregate?.count

  return {
    isLoading: loading,
    appointmentPlanCount,
  }
}

export const useGetPostAggregateByMemberIdAndRoleName = (memberId: string, roleName: string) => {
  const { loading, data: postAggregateData } = useQuery<
    hasura.GetPostAggregateByPostRole,
    hasura.GetPostAggregateByPostRoleVariables
  >(
    gql`
      query GetPostAggregateByPostRole($memberId: String!, $roleName: String!) {
        post_aggregate(
          where: {
            published_at: { _is_null: false }
            post_roles: { member_id: { _eq: $memberId }, name: { _eq: $roleName } }
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        memberId,
        roleName,
      },
    },
  )

  const postCount = postAggregateData?.post_aggregate.aggregate?.count

  return {
    isLoading: loading,
    postCount,
  }
}
