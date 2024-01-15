import { Icon } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateRangeFormatter } from '../../helpers'
import { activityMessages, commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { BREAK_POINT } from '../common/Responsive'

const StyledWrapper = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`
const StyledDescription = styled.div`
  overflow: hidden;
  white-space: nowrap;

  @media (min-width: ${BREAK_POINT}px) {
    margin-right: 1rem;
  }
`
const StyledTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${CommonTitleMixin}
`
const StyledMeta = styled.div<{ active?: boolean }>`
  margin-bottom: 0.75rem;
  color: ${props => (props.active ? 'var(--gray-darker)' : 'var(--gray)')};
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  white-space: normal;

  > div:last-child {
    margin-left: 1.5rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    > div:last-child {
      margin-left: 0;
    }
  }
`
const StyledCover = styled.div<{ src: string }>`
  padding-top: ${(68 * 100) / 120}%;
  width: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;

  @media (min-width: ${BREAK_POINT}px) {
    padding-top: 68px;
    width: 120px;
  }
`
const StyledBadge = styled.span`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
`

const ActivitySessionCard: React.VFC<{
  session: {
    id: string
    location: string
    onlineLink: string
    activityTitle: string
    endedAt: string | null
    startedAt: string | null
    title: string
    coverUrl: string | null
  }
}> = ({ session }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()

  if (!session) {
    return <StyledWrapper>{formatMessage(commonMessages.status.loadingError)}</StyledWrapper>
  }

  const sessionType =
    session.location && session.onlineLink
      ? 'both'
      : session.location
      ? 'offline'
      : session.onlineLink
      ? 'online'
      : null

  const now = moment()

  return (
    <StyledWrapper>
      <StyledDescription className="flex-grow-1">
        <StyledTitle className="mb-3">{session.activityTitle}</StyledTitle>
        <StyledMeta key={session.id} active={dayjs(session.endedAt).isAfter(dayjs())}>
          <div>
            <Icon as={AiOutlineCalendar} />
            <span className="ml-2 mr-2">
              {enabledModules.activity_online && sessionType
                ? `${session.title} - ${
                    {
                      online: formatMessage(activityMessages.label.online),
                      offline: formatMessage(activityMessages.label.offline),
                      both: `${formatMessage(activityMessages.label.online)}、${formatMessage(
                        activityMessages.label.offline,
                      )}`,
                    }[sessionType]
                  }`
                : session.title}
            </span>
          </div>
          <div>
            <span className="mr-2">
              {dateRangeFormatter({
                startedAt: dayjs(session.startedAt).toDate(),
                endedAt: dayjs(session.endedAt).toDate(),
              })}
            </span>

            {now.isBefore(session.startedAt) && now.diff(session.startedAt, 'days', true) > -7 && (
              <StyledBadge>{formatMessage(commonMessages.status.coming)}</StyledBadge>
            )}

            {now.isBetween(session.startedAt, session.endedAt) && (
              <StyledBadge>{formatMessage(commonMessages.status.activityStart)}</StyledBadge>
            )}
          </div>
        </StyledMeta>
      </StyledDescription>

      <StyledCover className="flex-shrink-0" src={session.coverUrl || EmptyCover} />
    </StyledWrapper>
  )
}

export default ActivitySessionCard
