import { Box, Button, Divider, Input, Skeleton, useDisclosure, useToast } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { validationRegExp } from 'lodestar-app-element/src/helpers'
import { sum } from 'ramda'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useCoinStatus } from '../../hooks/data'
import { useMember } from '../../hooks/member'
import { useCurrency } from '../../hooks/util'
import { AuthModalContext } from '../auth/AuthModal'
import CommonModal from '../common/CommonModal'
import checkoutMessages from './translation'

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

const CoinCheckoutModal: React.VFC<{
  productId: string
  amount: number
  currencyId: string
  phoneInputEnabled?: boolean
  renderTrigger?: React.VFC<{
    setVisible: () => void
  }>
}> = ({ productId, amount, currencyId, phoneInputEnabled, renderTrigger }) => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { ownedCoins } = useCoinStatus(currentMemberId || '')
  const { formatCurrency } = useCurrency(currencyId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
    },
  })

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

  const handlePay = handleSubmit(({ phone }) => {
    placeOrder('perpetual', {
      name: currentMember?.name || currentMember?.username || '',
      phone: phone ? phone : currentMember?.phone || '',
      email: currentMember?.email || '',
    })
      .then(({ orderId, paymentNo, payToken }) =>
        history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`),
      )
      .catch(handleError)
  })

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
      <form>
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
              {formatMessage(checkoutMessages['*'].use)}
            </Button>
          )}
          closeOnOverlayClick={false}
        >
          <Divider className="mt-3 mb-4" />
          <StyledOwnedCoinText>
            {formatMessage(checkoutMessages.CoinCheckoutModal.currentOwnedCoins)} {formatCurrency(ownedCoins)}
          </StyledOwnedCoinText>
          <StyledUseCoinText>
            {formatMessage(checkoutMessages['*'].use)}
            <PriceLabel listPrice={amount} currencyId={currencyId} />
          </StyledUseCoinText>
          {phoneInputEnabled ? (
            <Box mt="1.5rem">
              <Box mb="4px">{formatMessage(checkoutMessages.CoinCheckoutModal.inputLabel)}</Box>
              <Input
                name="phone"
                ref={register({
                  required: '請填入電話',
                  pattern: { value: validationRegExp.phone, message: '請確認電話格式' },
                })}
                placeholder={formatMessage(checkoutMessages.CoinCheckoutModal.pleaseEnterPhone)}
              />
              {errors.phone?.type === 'required' ? (
                <Box mt="0.5rem" color="red.500" fontSize="12px">
                  {formatMessage(checkoutMessages.CoinCheckoutModal.pleaseEnterPhone)}
                </Box>
              ) : errors.phone?.type === 'pattern' ? (
                <Box mt="0.5rem" color="red.500" fontSize="12px">
                  {formatMessage(checkoutMessages.CoinCheckoutModal.checkPhoneFormat)}
                </Box>
              ) : null}
            </Box>
          ) : null}
        </CommonModal>
      </form>
    </>
  )
}

export default CoinCheckoutModal
