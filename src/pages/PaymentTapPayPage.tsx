import { Button } from '@chakra-ui/react'
import { message } from 'antd'
import axios from 'axios'
import TapPayForm, { TPCreditCard } from 'lodestar-app-element/src/components/forms/TapPayForm'
import CreditCardSelector from 'lodestar-app-element/src/components/selectors/CreditCardSelector'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTappay } from 'lodestar-app-element/src/hooks/util'
import React, { useCallback, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import { codeMessages } from '../helpers/translation'
import { useOrderId } from '../hooks/data'
import { useMember } from '../hooks/member'

const StyledFreeSubscriptionNotice = styled.p`
  color: var(--gray-dark);
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  margin-top: 24px;
`

const messages = defineMessages({
  freeSubscriptionNotice: {
    id: 'common.label.freeSubscriptionNotice',
    defaultMessage: '訂閱金額為 NT$ 0 時，系統需刷取 NT$ 1 以紀錄您的信用卡卡號，並於下期進行扣款',
  },
})

/* choose the credit card from the member to subscribe
1. get the credit cards from the member 
2. allow member to add a new credit card
3. member choose the credit card and pay the payment
*/

const PaymentTapPayPage: React.VFC = () => {
  return (
    <DefaultLayout noFooter centeredBox>
      {(window as any)['TPDirect'] && <PaymentTapPayBlock />}
    </DefaultLayout>
  )
}

const PaymentTapPayBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { paymentNo } = useParams<{ paymentNo: string }>()
  const { orderId } = useOrderId(paymentNo)

  const [tpCreditCard, setTpCreditCard] = useState<TPCreditCard | null>(null)
  const [memberCreditCardId, setMemberCreditCardId] = useState<string | null>(null)
  const { currentMemberId, isAuthenticating } = useAuth()
  const { payPayment } = usePayment(paymentNo)
  const [isPaying, setIsPaying] = useState(false)

  const isCreditCardReady = Boolean(memberCreditCardId || tpCreditCard?.canGetPrime)

  const handlePaymentPayAsync = async () => {
    setIsPaying(true)
    try {
      await payPayment(memberCreditCardId)
      history.push(`/orders/${orderId}?tracking=1`)
    } catch (err) {
      message.error((err as any).toString())
    }
    setIsPaying(false)
  }

  return (
    <StyledContainer>
      {currentMemberId ? (
        <div>
          <CreditCardSelector memberId={currentMemberId} value={memberCreditCardId} onChange={setMemberCreditCardId} />

          <div className={`${memberCreditCardId ? 'd-none' : ''} ml-4`}>
            <TapPayForm onUpdate={setTpCreditCard} />
          </div>
          <Button
            colorScheme="primary"
            isFullWidth
            isLoading={isPaying}
            isDisabled={!isCreditCardReady || orderId === null}
            onClick={handlePaymentPayAsync}
          >
            付款
          </Button>

          <StyledFreeSubscriptionNotice>{formatMessage(messages.freeSubscriptionNotice)}</StyledFreeSubscriptionNotice>
        </div>
      ) : isAuthenticating ? (
        <div>Authenticating...</div>
      ) : (
        <div>無法取得會員資料</div>
      )}
    </StyledContainer>
  )
}

const usePayment = (paymentNo: string) => {
  const { TPDirect } = useTappay()
  const { formatMessage } = useIntl()
  const { authToken, currentMemberId } = useAuth()
  const { member } = useMember(currentMemberId || '')

  const payPayment = useCallback(
    (memberCreditCardId: string | null) =>
      new Promise((resolve, reject) => {
        if (!authToken) {
          reject('no auth')
        }
        // pay by card token
        if (memberCreditCardId) {
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_ROOT}/payment/pay/${paymentNo}`,
              {
                memberCreditCardId,
                cardHolder: {
                  phoneNumber: member?.phone || '0987654321',
                  name: member?.name || 'test',
                  email: member?.email || 'test@gmail.com',
                },
              },
              { headers: { authorization: `Bearer ${authToken}` } },
            )
            .then(({ data: { code, result } }) => {
              if (code === 'SUCCESS') {
                resolve(result)
              }
              const codeMessage = codeMessages[code as keyof typeof codeMessages]
              reject(codeMessage ? formatMessage(codeMessage) : code)
            })
            .catch(reject)
        }
        // pay by prime
        else {
          TPDirect.card.getPrime(({ status, card, msg }: { status: number; card: { prime: string }; msg: string }) => {
            axios
              .post(
                `${process.env.REACT_APP_API_BASE_ROOT}/payment/pay/${paymentNo}`,
                {
                  prime: card.prime,
                  cardHolder: {
                    phoneNumber: member?.phone || '0987654321',
                    name: member?.name || 'test',
                    email: member?.email || 'test@gmail.com',
                  },
                },
                {
                  headers: { authorization: `Bearer ${authToken}` },
                },
              )
              .then(({ data: { code, result } }) => {
                if (code === 'SUCCESS') {
                  resolve(result)
                }
                const codeMessage = codeMessages[code as keyof typeof codeMessages]
                reject(codeMessage ? formatMessage(codeMessage) : code)
              })
              .catch(reject)
          })
        }
      }),
    [authToken, TPDirect.card, paymentNo, member?.phone, member?.name, member?.email, formatMessage],
  )

  return { payPayment }
}

export default PaymentTapPayPage
