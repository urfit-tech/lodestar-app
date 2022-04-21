import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { PeriodType } from '../../types/program'
import { ProjectPlanProps } from '../../types/project'
import PaymentButton from '../common/PaymentButton'
import PriceLabel from '../common/PriceLabel'
import ShortenPeriodTypeLabel from '../common/ShortenPeriodTypeLabel'
import { BraftContent } from '../common/StyledBraftEditor'

const messages = defineMessages({
  limited: { id: 'product.project.text.limited', defaultMessage: '限量' },
  participants: { id: 'product.project.text.participants', defaultMessage: '參與者' },
  availableForLimitTime: {
    id: 'common.label.availableForLimitTime',
    defaultMessage: '可觀看 {amount} {unit}',
  },
})

const StyledWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease-in-out;
`
const CoverImage = styled.div<{ src: string }>`
  padding-top: calc(100% / 3);
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`
const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledPeriod = styled.div`
  color: ${props => props.theme['@primary-color']};
`
const StyledDescription = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.18px;
`
const StyledProjectPlanInfoBlock = styled.div<{ active?: boolean }>`
  display: inline-block;
  padding: 10px;
  background: ${props => (props.active ? `${props.theme['@primary-color']}19` : 'var(--gray-lighter)')};
  color: ${props => (props.active ? `${props.theme['@primary-color']}` : 'var(--gray-dark)')};
  font-size: 12px;
  letter-spacing: 0.15px;
  line-height: 12px;
  line-height: 1;
  border-radius: 4px;

  &:last-child:not(:first-child) {
    border-left: 1px solid ${props => (props.active ? `${props.theme['@primary-color']}` : 'var(--gray-dark)')};
  }
`

const ProjectPlanCard: React.VFC<ProjectPlanProps> = ({
  id,
  projectTitle,
  coverUrl,
  title,
  description,
  listPrice,
  salePrice,
  soldAt,
  discountDownPrice,
  isSubscription,
  periodAmount,
  periodType,
  isEnrolled,
  isExpired,
  isParticipantsVisible,
  isPhysical,
  isLimited,
  buyableQuantity,
  projectPlanEnrollmentCount,
}) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()

  const isOnSale = (soldAt?.getTime() || 0) > Date.now()

  return (
    <StyledWrapper>
      <CoverImage src={coverUrl || EmptyCover} />
      <div className="p-4">
        <StyledTitle className="mb-3">{title}</StyledTitle>

        {settings['custom.project.plan_price_style'] !== 'hidden' && (
          <div className="mb-3">
            <PriceLabel
              variant="full-detail"
              listPrice={listPrice}
              salePrice={isOnSale ? salePrice : undefined}
              downPrice={isSubscription && discountDownPrice > 0 ? discountDownPrice : undefined}
              periodAmount={periodAmount}
              periodType={periodType ? (periodType as PeriodType) : undefined}
            />
          </div>
        )}

        {!isSubscription && periodType && (
          <StyledPeriod className="mb-3">
            {formatMessage(messages.availableForLimitTime, {
              amount: periodAmount || 1,
              unit: <ShortenPeriodTypeLabel periodType={periodType as PeriodType} withQuantifier />,
            })}
          </StyledPeriod>
        )}

        {isParticipantsVisible && (
          <StyledProjectPlanInfoBlock
            className="mb-4"
            active={!isExpired && (!isLimited || Boolean(buyableQuantity && buyableQuantity > 0))}
          >{`${formatMessage(messages.participants)} ${projectPlanEnrollmentCount}`}</StyledProjectPlanInfoBlock>
        )}

        <StyledDescription className="mb-4">
          <BraftContent>{description}</BraftContent>
        </StyledDescription>

        <div>
          {isExpired ? (
            <span>{formatMessage(commonMessages.status.finished)}</span>
          ) : isLimited && !buyableQuantity ? (
            <span>{formatMessage(commonMessages.button.soldOut)}</span>
          ) : isEnrolled === false ? (
            <PaymentButton
              type="ProjectPlan"
              target={id}
              price={isOnSale && salePrice ? salePrice : listPrice}
              isSubscription={isSubscription}
            />
          ) : null}
        </div>
      </div>
    </StyledWrapper>
  )
}

export default ProjectPlanCard
