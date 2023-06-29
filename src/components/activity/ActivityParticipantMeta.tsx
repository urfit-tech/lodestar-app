import { gql, useQuery } from '@apollo/client'
import { Icon, Spinner } from '@chakra-ui/react'
import { AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import activityMessages from './translation'
const StyledMeta = styled.div`
  min-height: 1rem;
  color: var(--black-45);
  font-size: 14px;
  letter-spacing: 0.18px;
`

const ActivityParticipantMeta: React.VFC<{ activityId: string; options?: { organizerId?: string } }> = ({
  activityId,
  options,
}) => {
  const { formatMessage } = useIntl()

  const { loading: loadingActivitiesEnrollmentAggregate, data: activitiesEnrollmentAggregate } = useQuery<
    hasura.GetActivitiesEnrollmentAggregate,
    hasura.GetActivitiesEnrollmentAggregateVariables
  >(GetActivitiesEnrollmentAggregate, {
    variables: {
      condition: {
        id: { _eq: activityId },
        organizer_id: { _eq: options?.organizerId },
        published_at: { _is_null: false, _lte: 'now()' },
        is_private: { _eq: false },
      },
    },
  })

  const { loading: loadingActivityTicketsAggregate, data: activityTicketsAggregate } = useQuery<
    hasura.GetActivityTicketsAggregate,
    hasura.GetActivityTicketsAggregateVariables
  >(GetActivityTicketsAggregate, {
    variables: {
      condition: {
        id: { _eq: activityId },
        organizer_id: { _eq: options?.organizerId },
        published_at: { _is_null: false, _lte: 'now()' },
        is_private: { _eq: false },
      },
    },
  })

  const participantCount = activitiesEnrollmentAggregate?.activity_enrollment_aggregate.aggregate?.count || 0
  const totalSeats = activityTicketsAggregate?.activity_ticket_aggregate.aggregate?.sum?.count || 0

  return (
    <StyledMeta>
      <>
        <Icon as={AiOutlineUser} />
        <span className="ml-2">
          {formatMessage(activityMessages.ActivityParticipantMeta.remaining)}
          {loadingActivitiesEnrollmentAggregate || loadingActivityTicketsAggregate ? (
            <Spinner />
          ) : participantCount && totalSeats ? (
            totalSeats - participantCount
          ) : (
            totalSeats
          )}
        </span>
      </>
    </StyledMeta>
  )
}

export default ActivityParticipantMeta
const GetActivitiesEnrollmentAggregate = gql`
  query GetActivitiesEnrollmentAggregate($condition: activity_bool_exp!) {
    activity_enrollment_aggregate(where: { activity: $condition }, distinct_on: order_log_id) {
      aggregate {
        count
      }
    }
  }
`

const GetActivityTicketsAggregate = gql`
  query GetActivityTicketsAggregate($condition: activity_bool_exp!) {
    activity_ticket_aggregate(where: { activity: $condition }) {
      aggregate {
        sum {
          count
        }
      }
    }
  }
`
