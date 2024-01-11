import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import hasura from '../hasura'
import { Meet } from '../types/meet'

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

export const useMeetByTargetAndPeriod = (target: string, startedAt: Date, endedAt: Date) => {
  const { id: appId } = useApp()
  const { loading, data } = useQuery<hasura.GetMeetByTargetAndPeriod, hasura.GetMeetByTargetAndPeriodVariables>(
    GetMeetByTargetAndPeriod,
    {
      variables: {
        target,
        startedAt,
        endedAt,
        appId,
      },
    },
  )
  const meet: Pick<
    Meet,
    'id' | 'target' | 'startedAt' | 'endedAt' | 'hostMemberId' | 'options' | 'meetMembers'
  > | null = data?.meet[0]
    ? {
        id: data.meet[0].id,
        target: data.meet[0].target,
        startedAt: dayjs(data.meet[0].started_at).toDate(),
        endedAt: dayjs(data.meet[0].ended_at).toDate(),
        hostMemberId: data.meet[0].host_member_id,
        options: data.meet[0].options,
        meetMembers: data.meet[0].meet_members.map(v => ({
          id: v.id,
          memberId: v.member_id,
        })),
      }
    : null

  return {
    loading,
    meet,
  }
}

export const GetMeetByTargetAndPeriod = gql`
  query GetMeetByTargetAndPeriod($appId: String!, $target: uuid!, $startedAt: timestamptz!, $endedAt: timestamptz!) {
    meet(
      where: {
        app_id: { _eq: $appId }
        target: { _eq: $target }
        started_at: { _eq: $startedAt }
        ended_at: { _eq: $endedAt }
        deleted_at: { _is_null: true }
        meet_members: { deleted_at: { _is_null: true } }
      }
    ) {
      id
      target
      started_at
      ended_at
      options
      host_member_id
      meet_members {
        id
        member_id
      }
    }
  }
`

export const GetMeetByTargetAndPeriodAndSpecifyMember = gql`
  query GetMeetByTargetAndPeriodAndSpecifyMember(
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
        deleted_at: { _is_null: true }
        meet_members: { member_id: { _eq: $memberId }, deleted_at: { _is_null: true } }
      }
    ) {
      id
      recording_url
      recording_type
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
        meet_members: { deleted_at: { _is_null: true } }
      }
    ) {
      id
      host_member_id
      target
      service_id
      meet_members {
        id
        member_id
      }
    }
  }
`
