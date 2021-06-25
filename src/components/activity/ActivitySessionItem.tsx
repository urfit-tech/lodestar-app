import { SkeletonText } from '@chakra-ui/react'
import { Icon } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateRangeFormatter } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useActivitySession } from '../../hooks/activity'

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
  const { loadingSession, errorSession, session } = useActivitySession(activitySessionId)
  const { formatMessage } = useIntl()

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

  return (
    <StyledWrapper>
      <StyledTitle className="mb-3">{session.title}</StyledTitle>
      <StyledContent>
        <div>
          <Icon type="calendar" className="mr-2" />
          <span>{dateRangeFormatter({ startedAt: session.startedAt, endedAt: session.endedAt })}</span>
        </div>

        <div>
          <Icon type="pushpin" className="mr-2" />
          <span>{session.location}</span>
          {session.description && <span className="ml-2">({session.description})</span>}
        </div>

        {(session.isParticipantsVisible || !!session.threshold) && (
          <div>
            <Icon type="user" className="mr-2" />
            {session.isParticipantsVisible && (
              <span className="mr-3">
                {session.enrollments} / {session.maxAmount}
              </span>
            )}
            {session.threshold && (
              <span>
                {formatMessage(productMessages.activity.content.least)}
                {session.threshold}
              </span>
            )}
          </div>
        )}

        {renderAttend && <div className="pt-2">{renderAttend}</div>}
      </StyledContent>
    </StyledWrapper>
  )
}

export default ActivitySessionItem
