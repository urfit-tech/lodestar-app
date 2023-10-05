import { gql, useMutation, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import hasura from '../hasura'

export const useMutateMeet = () => {
  const [updateMeet] = useMutation<hasura.UpdateMeet, hasura.UpdateMeetVariables>(gql`
    mutation UpdateMeet($meetId: uuid!, $data: jsonb) {
      update_meet_by_pk(pk_columns: { id: $meetId }, _set: { options: $data }) {
        id
      }
    }
  `)
  return {
    updateMeet,
  }
}

export const useOverlapMeets = (startedAt: Date, endedAt: Date) => {
  const { id: appId } = useApp()
  const { loading, data } = useQuery<hasura.GetOverlapMeets, hasura.GetOverlapMeetsVariables>(GetOverlapMeets, {
    variables: { appId, startedAt: startedAt.toISOString(), endedAt: endedAt.toISOString() },
  })
  const overlapMeets: {
    id: string
    target: string
    hostMemberId: string
    serviceId: string
  }[] =
    data?.meet.map(v => ({
      id: v.id,
      target: v.target,
      hostMemberId: v.host_member_id,
      serviceId: v.service_id,
    })) || []
  return { loading, overlapMeets }
}

export const GetMeetByTargetAndPeriod = gql`
  query GetMeetByTargetAndPeriod(
    $appId: String!
    $target: uuid!
    $startedAt: timestamptz!
    $endedAt: timestamptz!
    $memberId: String!
  ) {
    meet(
      where: {
        app_id: { _eq: $appId }
        target: { _eq: $target }
        started_at: { _eq: $startedAt }
        ended_at: { _eq: $endedAt }
        meet_members: { member_id: { _eq: $memberId } }
      }
    ) {
      id
      options
    }
  }
`

export const GetOverlapMeets = gql`
  query GetOverlapMeets($appId: String!, $startedAt: timestamptz!, $endedAt: timestamptz!) {
    meet(
      where: {
        app_id: { _eq: $appId }
        started_at: { _lte: $endedAt }
        ended_at: { _gte: $startedAt }
        deleted_at: { _is_null: true }
      }
    ) {
      id
      host_member_id
      target
      service_id
    }
  }
`
