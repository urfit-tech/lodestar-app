import { gql, useQuery } from '@apollo/client'
import { Icon, Spinner } from '@chakra-ui/react'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import moment from 'moment'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import hasura from '../../hasura'
import ActivityParticipantMeta from './ActivityParticipantMeta'

const StyledWrapper = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
`
const StyledCover = styled.div<{ src: string }>`
  padding-top: ${900 / 16}%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`
const StyledDescription = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledMeta = styled.div`
  min-height: 1rem;
  color: var(--black-45);
  font-size: 14px;
  letter-spacing: 0.18px;
`

type ActivityBlockProps = {
  id: string
  title: string
  coverUrl?: string
  isParticipantsVisible?: boolean
  options?: { organizerId?: string }
  onClick?: () => void
}
const ActivityBlock: React.VFC<ActivityBlockProps> = ({
  id,
  title,
  coverUrl,
  isParticipantsVisible,
  options,
  onClick,
}) => {
  const history = useHistory()
  const { loading: loadingGetActivitySessionAggregate, data: activitySessionAggregate } = useQuery<
    hasura.GetActivitySessionAggregate,
    hasura.GetActivitySessionAggregateVariables
  >(GetActivitySessionAggregate, {
    variables: {
      condition: {
        organizer_id: { _eq: options?.organizerId },
        published_at: { _is_null: false, _lte: 'now()' },
        is_private: { _eq: false },
      },
    },
  })

  const startDate = activitySessionAggregate?.activity_session_aggregate.aggregate?.min?.started_at
    ? moment(new Date(activitySessionAggregate?.activity_session_aggregate.aggregate?.min?.started_at)).format(
        'YYYY-MM-DD(dd)',
      )
    : ''

  const endDate = activitySessionAggregate?.activity_session_aggregate.aggregate?.max?.ended_at
    ? moment(new Date(activitySessionAggregate.activity_session_aggregate.aggregate.max.ended_at)).format(
        'YYYY-MM-DD(dd)',
      )
    : ''

  return (
    <StyledWrapper
      onClick={() => {
        onClick && onClick()
        history.push(`/activities/${id}`)
      }}
    >
      <StyledCover src={coverUrl || EmptyCover} />

      <StyledDescription>
        <StyledTitle className="mb-4">
          <Link to={`/activities/${id}`}>{title}</Link>
        </StyledTitle>

        {isParticipantsVisible ? (
          <div className="mb-2">
            <ActivityParticipantMeta activityId={id} options={{ organizerId: options?.organizerId }} />
          </div>
        ) : null}

        <StyledMeta>
          <Icon as={AiOutlineCalendar} />
          {loadingGetActivitySessionAggregate ? (
            <Spinner />
          ) : startDate && endDate ? (
            <span className="ml-2">
              {startDate}
              {startDate !== endDate ? ` ~ ${endDate}` : ''}
            </span>
          ) : null}
        </StyledMeta>
      </StyledDescription>
    </StyledWrapper>
  )
}

export default ActivityBlock

const GetActivitySessionAggregate = gql`
  query GetActivitySessionAggregate($condition: activity_bool_exp!) {
    activity_session_aggregate(where: { activity: $condition }) {
      aggregate {
        min {
          started_at
        }
        max {
          ended_at
        }
      }
    }
  }
`
