import { Icon } from '@chakra-ui/icons'
import { Button, SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { dateRangeFormatter } from '../../helpers'
import { activityMessages, commonMessages, productMessages } from '../../helpers/translation'
import { useActivitySession } from '../../hooks/activity'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as MapOIcon } from '../../images/map-o.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { ReactComponent as VideoIcon } from '../../images/video.svg'
import { useAuth } from '../auth/AuthContext'

const StyledWrapper = styled.div`
  padding: 1.5rem 0;
  background: #f7f8f8;
  border-radius: 4px;
  color: #585858;
`
const StyledTitle = styled.h2`
  padding-left: 1.5rem;
  border-left: 2px solid ${props => props.theme['@primary-color']};
  font-size: 16px;
`
const StyledContent = styled.div`
  line-height: 1.5;
  padding: 0 1.5rem;

  > div + div {
    margin-top: 0.75rem;
  }
`

const ActivitySessionItem: React.VFC<{
  activitySessionId: string
  renderAttend?: React.ReactNode
}> = ({ activitySessionId, renderAttend }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { loadingSession, errorSession, session } = useActivitySession({
    sessionId: activitySessionId,
    memberId: currentMemberId || '',
  })

  if (loadingSession) {
    return (
      <StyledWrapper>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </StyledWrapper>
    )
  }

  if (errorSession || !session) {
    return <StyledWrapper>{formatMessage(commonMessages.status.loadingError)}</StyledWrapper>
  }

  const sessionType =
    session.location && session.onlineLink ? 'both' : session.location ? 'offline' : session.onlineLink ? 'online' : ''

  return (
    <StyledWrapper>
      <StyledTitle className="mb-3">{session.title}</StyledTitle>
      <StyledContent>
        <div>
          <Icon as={CalendarOIcon} className="mr-2" />
          <span>{dateRangeFormatter({ startedAt: session.startedAt, endedAt: session.endedAt })}</span>
        </div>

        {sessionType === 'offline' && (
          <div>
            <Icon as={MapOIcon} className="mr-2" />
            <span>{session.location}</span>
          </div>
        )}

        {enabledModules.activity_online && session.onlineLink && (
          <div className="d-flex align-items-center">
            <Icon as={VideoIcon} className="mr-2" />
            {session.isEnrolled ? (
              <span>
                <span className="mr-1">{formatMessage(activityMessages.text.liveLink)}</span>
                <a href={session.onlineLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="link">{session.onlineLink}</Button>
                </a>
              </span>
            ) : (
              formatMessage(activityMessages.text.live)
            )}
          </div>
        )}

        <div>
          {session.isParticipantsVisible && (
            <>
              <Icon as={UserOIcon} className="mr-2" />
              {sessionType === 'offline' && (
                <span className="mr-3">
                  {session.enrollmentAmount['offline']} / {session.maxAmount['offline']}
                </span>
              )}
              {enabledModules.activity_online && sessionType === 'online' && (
                <span className="mr-3">
                  {session.enrollmentAmount['online']} / {session.maxAmount['online']}
                </span>
              )}
              {enabledModules.activity_online && sessionType === 'both' && (
                <>
                  <span className="mr-2">
                    {`${formatMessage(activityMessages.label['offline'])} `}
                    {session.enrollmentAmount['offline']} / {session.maxAmount['offline']}
                  </span>
                  <span className="mr-2">
                    {`${formatMessage(activityMessages.label['online'])} `}
                    {session.enrollmentAmount['online']} / {session.maxAmount['online']}
                  </span>
                </>
              )}
            </>
          )}
          {session.threshold && (
            <span>
              {formatMessage(productMessages.activity.content.least)}
              {session.threshold}
            </span>
          )}
        </div>

        {renderAttend && <div className="pt-2">{renderAttend}</div>}
      </StyledContent>
    </StyledWrapper>
  )
}

export default ActivitySessionItem
