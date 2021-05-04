import { Button } from 'antd'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal'
import { useApp } from '../../containers/common/AppContext'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { useMember } from '../../hooks/member'
import EmptyCover from '../../images/empty-cover.png'
import { PeriodType } from '../../types/program'
import { ProjectPlanProps } from '../../types/project'
import { useAuth } from '../auth/AuthContext'
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
const StyledProjectPlanInfo = styled.div<{ active?: boolean }>`
  display: inline-block;
  border-radius: 4px;
  background: ${props => (props.active ? `${props.theme['@primary-color']}19` : 'var(--gray-lighter)')};

  .wrapper {
    padding: 10px 0;
    line-height: 12px;

    div {
    }
  }
`
const StyledProjectPlanInfoWrapper = styled.div`
  padding: 10px 0;
  line-height: 12px;
`
const StyledProjectPlanInfoBlock = styled.div<{ active?: boolean }>`
  display: inline-block;
  line-height: 1;
  font-size: 12px;
  letter-spacing: 0.15px;
  color: ${props => (props.active ? `${props.theme['@primary-color']}` : 'var(--gray-dark)')};
  padding: 0 10px;

  &:last-child:not(:first-child) {
    border-left: 1px solid ${props => (props.active ? `${props.theme['@primary-color']}` : 'var(--gray-dark)')};
  }
`

const ProjectPlanCard: React.FC<ProjectPlanProps> = ({
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

  const isOnSale = (soldAt?.getTime() || 0) > Date.now()

  return (
    <StyledWrapper>
      <CoverImage src={coverUrl || EmptyCover} />
      <div className="p-4">
        <StyledTitle className="mb-3">{title}</StyledTitle>

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

        {!isSubscription && periodType && (
          <StyledPeriod className="mb-3">
            {formatMessage(messages.availableForLimitTime, {
              amount: periodAmount || 1,
              unit: <ShortenPeriodTypeLabel periodType={periodType as PeriodType} withQuantifier />,
            })}
          </StyledPeriod>
        )}

        {(isLimited || isParticipantsVisible) && (
          <StyledProjectPlanInfo
            className="mb-4"
            active={!isExpired && (!isLimited || Boolean(buyableQuantity && buyableQuantity > 0))}
          >
            <StyledProjectPlanInfoWrapper>
              {isParticipantsVisible && (
                <StyledProjectPlanInfoBlock
                  active={!isExpired && (!isLimited || Boolean(buyableQuantity && buyableQuantity > 0))}
                >{`${formatMessage(messages.participants)} ${projectPlanEnrollmentCount}`}</StyledProjectPlanInfoBlock>
              )}
            </StyledProjectPlanInfoWrapper>
          </StyledProjectPlanInfo>
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

const PerpetualPlanBlock: React.FC<{
  projectPlanId: string
  projectTitle: string
  title: string
  listPrice: number
  salePrice: number | null
  isPhysical: boolean
}> = ({ projectPlanId, projectTitle, title, listPrice, salePrice, isPhysical }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [sharingCode] = useQueryParam('sharing', StringParam)
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)

  const handleClick = async () => {
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
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
    <StyledButton type="primary" size="large" onClick={() => history.push(`/cart`)}>
      <span>{formatMessage(commonMessages.button.cart)}</span>
    </StyledButton>
  ) : (
    <StyledButton type="primary" size="large" onClick={handleClick}>
      <span>{formatMessage(commonMessages.button.join)}</span>
    </StyledButton>
  )
}

const SubscriptionPlanBlock: React.FC<{
  projectPlanId: string
  projectTitle: string
  title: string
  listPrice: number
  salePrice: number | null
  isPhysical: boolean
}> = ({ projectPlanId, projectTitle, title, listPrice, salePrice, isPhysical }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { member } = useMember(currentMemberId || '')

  if (!isAuthenticated) {
    return (
      <StyledButton type="primary" size="large" onClick={() => setAuthModalVisible?.(true)}>
        <span>{formatMessage(commonMessages.button.join)}</span>
      </StyledButton>
    )
  }

  return (
    <CheckoutProductModal
      renderTrigger={({ setVisible }) => (
        <StyledButton type="primary" size="large" onClick={() => setVisible()}>
          <span>{formatMessage(commonMessages.button.join)}</span>
        </StyledButton>
      )}
      paymentType="subscription"
      defaultProductId={`ProjectPlan_${projectPlanId}`}
      isProductPhysical={isPhysical}
      member={member}
    />
  )
}

export default ProjectPlanCard
