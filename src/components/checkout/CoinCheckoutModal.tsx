import { Button, Divider, Skeleton, useDisclosure } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import React, { useContext } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useCoinStatus } from '../../hooks/data'
import { useCurrency } from '../../hooks/util'
import { AuthModalContext } from '../auth/AuthModal'
import CommonModal from '../common/CommonModal'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  text-align:center;
  font-size: 20px;
  padding: 0.5rem 2.5rem 0 2.5rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledOwnedCoinText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
  text-align: center;
  margin-bottom: 4px;
`
const StyledUseCoinText = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => props.theme['@primary-color']};
`

const messages = defineMessages({
  use: { id: 'common.text.use', defaultMessage: '使用' },
  currentOwnedCoins: { id: 'payment.label.currentOwnedCoins', defaultMessage: '目前擁有' },
})

const CoinCheckoutModal: React.VFC<{
  productId: string
  amount: number
  currencyId: string
  renderTrigger?: React.VFC<{
    setVisible: () => void
  }>
}> = ({ productId, amount, currencyId, renderTrigger }) => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentMemberId, currentMember, isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { ownedCoins } = useCoinStatus(currentMemberId || '')
  const { formatCurrency } = useCurrency(currencyId)

  const { placeOrder, check, orderChecking, orderPlacing } = useCheck({
    productIds: [productId],
    discountId: 'Coin',
    shipping: null,
    options: {
      [productId]: {
        from: window.location.pathname,
      },
    },
  })

  const isPaymentAvailable =
    !orderChecking &&
    sum(check.orderProducts.map(orderProduct => orderProduct.price)) ===
      sum(check.orderDiscounts.map(orderDiscount => orderDiscount.price))

  const handlePay = () => {
    placeOrder('perpetual', {
      name: currentMember?.name || currentMember?.username || '',
      phone: '',
      email: currentMember?.email || '',
    })
      .then(taskId => history.push(`/tasks/order/${taskId}`))
      .catch(handleError)
  }
  const handleOpen = () => {
    if (!isAuthenticated) {
      setAuthModalVisible?.(true)
    } else {
      onOpen()
    }
  }

  return (
    <>
      {renderTrigger?.({ setVisible: handleOpen }) || (
        <Button className="mr-2" colorScheme="primary" isFullWidth onClick={handleOpen}>
          {formatMessage(commonMessages.ui.purchase)}
        </Button>
      )}
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          orderChecking ? (
            <Skeleton height="20px" width="80%" />
          ) : (
            <StyledTitle>{check.orderProducts[0]?.name}</StyledTitle>
          )
        }
        renderFooter={() => (
          <Button
            isFullWidth
            colorScheme="primary"
            className="mt-n3"
            isDisabled={orderChecking || !isPaymentAvailable}
            isLoading={orderChecking || orderPlacing}
            onClick={handlePay}
          >
            {formatMessage(messages.use)}
          </Button>
        )}
        closeOnOverlayClick={false}
      >
        <Divider className="mt-3 mb-4" />
        <StyledOwnedCoinText>
          {formatMessage(messages.currentOwnedCoins)} {formatCurrency(ownedCoins)}
        </StyledOwnedCoinText>
        <StyledUseCoinText>
          {formatMessage(messages.use)} <PriceLabel listPrice={amount} currencyId={currencyId} />
        </StyledUseCoinText>
      </CommonModal>
    </>
  )
}

export default CoinCheckoutModal
