import { Icon } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { productMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ActivityProps } from '../../types/activity'
import { CommonTitleMixin } from '../common'

const StyledWrapper = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
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

const Activity: React.VFC<ActivityProps> = ({
  id,
  title,
  coverUrl,
  isParticipantsVisible,
  participantCount,
  totalSeats,
  startedAt,
  endedAt,
}) => {
  const { formatMessage } = useIntl()
  const startDate = startedAt ? moment(startedAt).format('YYYY-MM-DD(dd)') : ''
  const endDate = endedAt ? moment(endedAt).format('YYYY-MM-DD(dd)') : ''

  return (
    <StyledWrapper>
      <Link to={`/activities/${id}`}>
        <StyledCover src={coverUrl || EmptyCover} />

        <StyledDescription>
          <StyledTitle className="mb-4">{title}</StyledTitle>

          <StyledMeta className="mb-2">
            {isParticipantsVisible && (
              <>
                <Icon as={AiOutlineUser} />
                <span className="ml-2">
                  {formatMessage(productMessages.activity.content.remaining)}
                  {participantCount && totalSeats ? totalSeats - participantCount : totalSeats}
                </span>
              </>
            )}
          </StyledMeta>

          <StyledMeta>
            <Icon as={AiOutlineCalendar} />
            {startDate && endDate ? (
              <span className="ml-2">
                {startDate}
                {startDate !== endDate ? ` ~ ${endDate}` : ''}
              </span>
            ) : null}
          </StyledMeta>
        </StyledDescription>
      </Link>
    </StyledWrapper>
  )
}

export default Activity
