import { Button, Divider } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProgramPackagePlanProps } from '../../types/programPackage'
import PaymentButton from '../common/PaymentButton'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { BraftContent } from '../common/StyledBraftEditor'

const StyledCard = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
`
const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledHighlight = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  letter-spacing: 0.18px;
`
const StyledEnrollment = styled.div`
  color: var(--black-45);
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.18px;
`

const ProgramPackagePlanCard: React.VFC<
  ProgramPackagePlanProps & {
    programPackageId: string
    loading?: boolean
    isEnrolled?: boolean
  }
> = ({
  id,
  title,
  description,
  isSubscription,
  isParticipantsVisible,
  periodAmount,
  periodType,
  listPrice,
  salePrice,
  soldAt,
  discountDownPrice,
  enrollmentCount,
  programPackageId,
  isEnrolled,
}) => {
  const { formatMessage } = useIntl()
  const isOnSale = soldAt ? Date.now() < soldAt.getTime() : false

  return (
    <StyledCard>
      <StyledTitle className="mb-3">{title}</StyledTitle>
      <PriceLabel
        variant="full-detail"
        listPrice={listPrice}
        salePrice={isOnSale ? salePrice : undefined}
        downPrice={discountDownPrice}
        periodType={isSubscription ? periodType : undefined}
        periodAmount={isSubscription ? periodAmount : undefined}
      />
      <Divider className="my-3" />
      {!isSubscription && periodAmount && periodType && (
        <StyledHighlight className="mb-3">
          {formatMessage(productMessages.programPackage.label.availableForLimitTime, {
            amount: periodAmount,
            unit:
              periodType === 'D'
                ? formatMessage(commonMessages.unit.day)
                : periodType === 'W'
                ? formatMessage(commonMessages.unit.week)
                : periodType === 'M'
                ? formatMessage(commonMessages.unit.monthWithQuantifier)
                : periodType === 'Y'
                ? formatMessage(commonMessages.unit.year)
                : formatMessage(commonMessages.unknown.period),
          })}
        </StyledHighlight>
      )}
      <div className="mb-3">
        <BraftContent>{description}</BraftContent>
      </div>
      {isParticipantsVisible && (
        <StyledEnrollment className="mb-3">
          <span className="mr-2">{enrollmentCount || 0}</span>
          <span>{formatMessage(commonMessages.unit.people)}</span>
        </StyledEnrollment>
      )}
      <div>
        {isEnrolled ? (
          <Link to={`/program-packages/${programPackageId}/contents`}>
            <Button variant="outline" colorScheme="primary" isFullWidth>
              {formatMessage(commonMessages.button.enter)}
            </Button>
          </Link>
        ) : (
          <PaymentButton
            type="ProgramPackagePlan"
            target={id}
            price={isOnSale && salePrice ? salePrice : listPrice}
            isSubscription={isSubscription}
          />
        )}
      </div>
    </StyledCard>
  )
}

export default ProgramPackagePlanCard
