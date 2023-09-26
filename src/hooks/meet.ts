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

export const useOverLapCreatorMeets = (target: string, startedAt: Date, endedAt: Date, hostMemberId?: string) => {
  const { id: appId } = useApp()
  const { loading, data } = useQuery<hasura.GetOverlapCreatorMeets, hasura.GetOverlapCreatorMeetsVariables>(
    GetOverlapCreatorMeets,
    {
      variables: { appId, target, startedAt, endedAt, hostMemberId },
    },
  )
  const overLapCreatorMeets: {
    id: string
    hostMemberId: string
    serviceId: string
  }[] =
    data?.meet.map(v => ({
      id: v.id,
      hostMemberId: v.host_member_id,
      serviceId: v.service_id,
    })) || []
  return { loading, overLapCreatorMeets }
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

export const GetOverlapCreatorMeets = gql`
  query GetOverlapCreatorMeets(
    $appId: String!
    $target: uuid!
    $startedAt: timestamptz!
    $endedAt: timestamptz!
    $hostMemberId: String
  ) {
    meet(
      where: {
        app_id: { _eq: $appId }
        target: { _neq: $target }
        started_at: { _lte: $endedAt }
        ended_at: { _gte: $startedAt }
        deleted_at: { _is_null: false }
        host_member_id: { _eq: $hostMemberId }
      }
    ) {
      id
      host_member_id
      service_id
    }
  }
`
