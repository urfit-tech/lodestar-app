import { Button } from '@chakra-ui/react'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { PeriodType } from '../../types/program'
import { ProjectPlanProps } from '../../types/project'
import { AuthModalContext } from '../auth/AuthModal'
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

const StyledButton = styled(Button)`
  && {
    margin-top: 20px;
    width: 100%;
  }
`
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
            isSubscription ? (
              <SubscriptionPlanBlock
                projectPlanId={id}
                projectTitle={projectTitle}
                title={title}
                isPhysical={isPhysical}
                listPrice={listPrice}
                salePrice={isOnSale ? salePrice : null}
              />
            ) : (
              <PerpetualPlanBlock
                projectPlanId={id}
                projectTitle={projectTitle}
                title={title}
                isPhysical={isPhysical}
                listPrice={listPrice}
                salePrice={isOnSale ? salePrice : null}
              />
            )
          ) : null}
        </div>
      </div>
    </StyledWrapper>
  )
}

const PerpetualPlanBlock: React.VFC<{
  projectPlanId: string
  projectTitle: string
  title: string
  listPrice: number
  salePrice: number | null
  isPhysical: boolean
}> = ({ projectPlanId, projectTitle, title, listPrice, salePrice, isPhysical }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)

  const sessionStorageKey = `lodestar.sharing_code.ProjectPlan_${projectPlanId}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)

  const handleClick = async () => {
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: `${projectTitle} - ${title}`,
        value: salePrice ?? listPrice,
        currency: 'TWD',
      })
    }

    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: projectPlanId,
        name: `${projectTitle} - ${title}`,
        category: 'ProjectPlan',
        price: `${salePrice ?? listPrice}`,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    addCartProduct?.('ProjectPlan', projectPlanId, {
      quantity: 1,
      sharingCode,
      from: window.location.pathname,
    })
      .then(() => history.push(`/cart?type=funding`))
      .catch(() => {})
  }

  return isProductInCart?.('ProjectPlan', projectPlanId) ? (
    <StyledButton colorScheme="primary" size="lg" onClick={() => history.push(`/cart`)}>
      <span>{formatMessage(commonMessages.button.cart)}</span>
    </StyledButton>
  ) : (
    <StyledButton colorScheme="primary" size="lg" onClick={handleClick}>
      <span>{formatMessage(commonMessages.button.join)}</span>
    </StyledButton>
  )
}

const SubscriptionPlanBlock: React.VFC<{
  projectPlanId: string
  projectTitle: string
  title: string
  listPrice: number
  salePrice: number | null
  isPhysical: boolean
}> = ({ projectPlanId, projectTitle, title, listPrice, salePrice, isPhysical }) => {
  const { formatMessage } = useIntl()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

  if (!isAuthenticated) {
    return (
      <StyledButton colorScheme="primary" size="lg" onClick={() => setAuthModalVisible?.(true)}>
        <span>{formatMessage(commonMessages.button.join)}</span>
      </StyledButton>
    )
  }

  return (
    <CheckoutProductModal
      defaultProductId={`ProjectPlan_${projectPlanId}`}
      renderTrigger={({ isLoading, onOpen }) => (
        <StyledButton colorScheme="primary" size="lg" isDisabled={isLoading} onClick={onOpen}>
          <span>{formatMessage(commonMessages.button.join)}</span>
        </StyledButton>
      )}
    />
  )
}

export default ProjectPlanCard
