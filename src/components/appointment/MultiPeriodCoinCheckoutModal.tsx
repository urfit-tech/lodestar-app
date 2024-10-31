import { Box, Button, Divider, Input, Skeleton } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { validationRegExp } from 'lodestar-app-element/src/helpers'
import { useCurrency } from 'lodestar-app-element/src/hooks/util'
import { map, pipe, prop, sum } from 'ramda'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import checkoutMessages from '../../components/checkout/translation'
import { handleError } from '../../helpers'
import { useCheck } from '../../hooks/checkout'
import { useCoinStatus } from '../../hooks/data'
import { useMember } from '../../hooks/member'
import { AppointmentPlan } from '../../types/appointment'
import { AuthModalContext } from '../auth/AuthModal'
import CommonModal from '../common/CommonModal'
import { MultiPeriodProductDetail } from './MultiPeriod.type'

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

const MultiPeriodCoinCheckoutModal: React.VFC<{
  selectedAppointmentPlan: AppointmentPlan
  defaultProductDetails: MultiPeriodProductDetail[]
  phoneInputEnabled?: boolean
  isCheckOutModalOpen: boolean
  onCheckOutModalOpen: () => void
  onCheckOutModalClose: () => void
}> = ({
  selectedAppointmentPlan,
  defaultProductDetails,
  phoneInputEnabled,
  isCheckOutModalOpen,
  onCheckOutModalOpen,
  onCheckOutModalClose,
}) => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { ownedCoins } = useCoinStatus(currentMemberId || '')
  const { formatCurrency } = useCurrency(selectedAppointmentPlan.currency.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
    },
  })

  const productId = `AppointmentPlan_${selectedAppointmentPlan.id}`

  const useCheckForPeriod = (productDetail: MultiPeriodProductDetail) =>
    useCheck({
      productIds: [productId],
      discountId: 'Coin',
      shipping: null,
      options: {
        [productId]: {
          from: window.location.pathname,
          startedAt: productDetail.startedAt,
        },
      },
    })

  const checkResults = map(useCheckForPeriod)(defaultProductDetails)

  const handlePay = handleSubmit(({ phone }) => {
    checkResults.forEach(checkResult =>
      checkResult
        .placeOrder('perpetual', {
          name: currentMember?.name || currentMember?.username || '',
          phone: phone ? phone : currentMember?.phone || '',
          email: currentMember?.email || '',
        })
        .then(({ orderId, paymentNo, payToken }) =>
          history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`),
        )
        .catch(handleError),
    )
  })

  const allChecked = checkResults.every(prop('orderChecking'))

  const isPaymentAvailable =
    !allChecked &&
    checkResults.every(
      checkResult =>
        sum(checkResult.check.orderProducts.map(orderProduct => orderProduct.price)) ===
        sum(checkResult.check.orderDiscounts.map(orderDiscount => orderDiscount.price)),
    )

  if (!isAuthenticated) setAuthModalVisible?.(true)

  return (
    <form>
      <CommonModal
        isOpen={isCheckOutModalOpen}
        onClose={onCheckOutModalClose}
        title={
          allChecked ? (
            <Skeleton height="20px" width="80%" />
          ) : (
            <StyledTitle>{selectedAppointmentPlan.title}</StyledTitle>
          )
        }
        renderFooter={() => (
          <Button
            isFullWidth
            colorScheme="primary"
            className="mt-n3"
            isDisabled={allChecked || !isPaymentAvailable}
            isLoading={allChecked || checkResults.some(prop('orderPlacing'))}
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
          {
            <PriceLabel
              listPrice={pipe<[any[]], number[], number>(map(prop('totalPrice')), sum)(checkResults)}
              currencyId={selectedAppointmentPlan.currency.id}
            />
          }
        </StyledUseCoinText>
        {phoneInputEnabled ? (
          <Box mt="1.5rem">
            <Box mb="4px">{formatMessage(checkoutMessages.CoinCheckoutModal.inputLabel)}</Box>
            <Input
              name="phone"
              ref={register({
                required: formatMessage(checkoutMessages.CoinCheckoutModal.pleaseEnterPhoneNumber),
                pattern: {
                  value: validationRegExp.phone,
                  message: formatMessage(checkoutMessages.CoinCheckoutModal.checkPhoneNumberFormat),
                },
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
  )
}

export default MultiPeriodCoinCheckoutModal
