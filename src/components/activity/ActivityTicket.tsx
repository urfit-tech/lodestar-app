import { Icon } from '@chakra-ui/icons'
import { Divider, Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateRangeFormatter } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { CommonLargeTitleMixin } from '../common'
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

const ActivityTicket: React.FC<{
  id: string
  title: string
  description: string | null
  price: number
  count: number
  startedAt: Date
  endedAt: Date
  isPublished: boolean
  activitySessionTickets: {
    id: string
    activitySession: {
      id: string
      title: string
    }
  }[]
  participants: number
  variant?: 'admin'
  extra?: React.ReactNode
}> = ({
  title,
  description,
  price,
  count,
  startedAt,
  endedAt,
  isPublished,
  activitySessionTickets,
  participants,
  variant,
  extra,
}) => {
  const { formatMessage } = useIntl()
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
        <PriceLabel listPrice={price} />
      </StyledPrice>
      <Divider />
      <StyledSubTitle>{formatMessage(productMessages.activity.title.sessions)}</StyledSubTitle>
      {activitySessionTickets.map(sessionTicket => (
        <StyledTag key={sessionTicket.id} color="#585858" className="mb-2">
          {sessionTicket.activitySession.title}
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

export default ActivityTicket
