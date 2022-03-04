import { Icon } from '@chakra-ui/icons'
import { Divider, Tag } from '@chakra-ui/react'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateRangeFormatter } from '../../helpers'
import { activityMessages, commonMessages, productMessages } from '../../helpers/translation'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { ActivitySession } from '../../types/activity'
import PriceLabel from '../common/PriceLabel'
import { BraftContent } from '../common/StyledBraftEditor'

const StyledWrapper = styled.div`
  padding: 1.5rem;
  background-color: white;
  color: var(--gray-darker);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
`
const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledLabel = styled.div<{ active?: boolean }>`
  position: relative;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;

  &::before {
    display: block;
    position: absolute;
    top: 5px;
    left: -18px;
    width: 10px;
    height: 10px;
    background-color: ${props => (props.active ? 'var(--success)' : 'var(--gray)')};
    content: '';
    border-radius: 50%;
  }
`
const StyledPrice = styled.div`
  ${CommonLargeTitleMixin}
`
const StyledSubTitle = styled.div`
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--gray-darker);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.4px;
`
const StyledTag = styled(Tag)`
  && {
    background-color: var(--gray-darker);
    padding: 0.25rem 0.75rem;
  }
`
const StyledDescription = styled.div`
  font-size: 14px;
`
const StyledMeta = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  letter-spacing: 0px;
`
const StyledExtraAdmin = styled.div`
  margin-top: 1.25rem;
  color: var(--gray-darker);
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
`

type ActivityTicketProps = {
  title: string
  price: number
  currencyId: string
  count: number
  startedAt: Date
  endedAt: Date
  participants: number
  sessions: { id: string; title: string; type: ActivitySession['type'] }[]
  isPublished?: boolean
  description?: string
  variant?: 'admin'
  extra?: React.ReactNode
}
const ActivityTicketCard: React.VFC<ActivityTicketProps> = ({
  title,
  description,
  price,
  currencyId,
  count,
  startedAt,
  endedAt,
  isPublished,
  sessions,
  participants,
  variant,
  extra,
}) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const status =
    !isPublished || Date.now() < startedAt.getTime()
      ? formatMessage(commonMessages.button.unreleased)
      : participants >= count
      ? formatMessage(commonMessages.button.soldOut)
      : Date.now() > endedAt.getTime()
      ? formatMessage(commonMessages.button.cutoff)
      : formatMessage(commonMessages.button.onSale)

  return (
    <StyledWrapper>
      <StyledTitle className="d-flex align-items-start justify-content-between mb-3">
        <span>{title}</span>
        {variant === 'admin' && <StyledLabel active={status === '販售中'}>{status}</StyledLabel>}
      </StyledTitle>
      <StyledPrice>
        <PriceLabel listPrice={price} currencyId={currencyId} />
      </StyledPrice>
      <Divider className="mb-4" />
      <StyledSubTitle>{formatMessage(productMessages.activity.title.sessions)}</StyledSubTitle>
      {sessions.map(session => (
        <StyledTag key={session.id} variant="solid" className="mb-2 mr-1">
          {enabledModules.activity_online
            ? `${session.title} - ${
                {
                  online: formatMessage(activityMessages.label.online),
                  offline: formatMessage(activityMessages.label.offline),
                }[session.type]
              }`
            : session.title}
        </StyledTag>
      ))}
      {!!description && (
        <StyledDescription>
          <StyledSubTitle>{formatMessage(productMessages.activity.title.remark)}</StyledSubTitle>
          <BraftContent>{description}</BraftContent>
        </StyledDescription>
      )}
      <StyledSubTitle>{formatMessage(productMessages.activity.title.release)}</StyledSubTitle>
      <StyledMeta>{dateRangeFormatter({ startedAt, endedAt })}</StyledMeta>
      {variant === 'admin' && (
        <StyledExtraAdmin className="d-flex align-items-center justify-content-between">
          <div>
            <Icon as={UserOIcon} className="mr-2" />
            <span>{`${participants} / ${count}`}</span>
          </div>
          {extra}
        </StyledExtraAdmin>
      )}
      {typeof variant === 'undefined' && extra && <div className="mt-3">{extra}</div>}
    </StyledWrapper>
  )
}

export default ActivityTicketCard
