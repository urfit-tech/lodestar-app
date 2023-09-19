import { gql, useMutation } from '@apollo/client'
import hasura from '../hasura'

export const GetMeetByAppointmentPlanAndPeriod = gql`
  query GetMeetByAppointmentPlanAndPeriod(
    $appId: String!
    $target: uuid!
    $startedAt: timestamptz!
    $memberId: String!
  ) {
    meet(
      where: {
        app_id: { _eq: $appId }
        target: { _eq: $target }
        started_at: { _eq: $startedAt }
        meet_members: { member_id: { _eq: $memberId } }
      }
    ) {
      id
      options
    }
  }
`

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
