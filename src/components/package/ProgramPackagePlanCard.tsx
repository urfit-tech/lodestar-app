import { Button, Divider } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CheckoutProductModal from '../../components/checkout/CheckoutProductModal'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProgramPackagePlanProps } from '../../types/programPackage'
import { AuthModalContext } from '../auth/AuthModal'
import PriceLabel from '../common/PriceLabel'
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
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
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
      {!isSubscription && (
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
            <Button block>{formatMessage(commonMessages.button.enter)}</Button>
          </Link>
        ) : (
          <CheckoutProductModal
            defaultProductId={`ProgramPackagePlan_${id}`}
            renderTrigger={({ isLoading, onOpen }) => (
              <Button
                variant="primary"
                isFullWidth
                isDisabled={isLoading}
                onClick={() => (isAuthenticated ? onOpen?.() : setAuthModalVisible?.(true))}
              >
                {isSubscription
                  ? formatMessage(commonMessages.button.subscribeNow)
                  : formatMessage(commonMessages.ui.purchase)}
              </Button>
            )}
          />
        )}
      </div>
    </StyledCard>
  )
}

export default ProgramPackagePlanCard
