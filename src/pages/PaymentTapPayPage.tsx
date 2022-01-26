import { Button } from '@chakra-ui/react'
import { message } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useCallback, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import CreditCardSelector, { CardHolder } from '../components/payment/CreditCardSelector'
import TapPayForm, { TPCreditCard } from '../components/payment/TapPayForm'
import { codeMessages } from '../helpers/translation'
import { useOrderId } from '../hooks/data'
import { useMember } from '../hooks/member'
import { useTappay } from '../hooks/util'

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
    <DefaultLayout noFooter noHeader centeredBox>
      {(window as any)['TPDirect'] && <PaymentTapPayBlock />}
    </DefaultLayout>
  )
}

const PaymentTapPayBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { paymentNo } = useParams<{ paymentNo: string }>()
  const { orderId } = useOrderId(Number(paymentNo))

  const [tpCreditCard, setTpCreditCard] = useState<TPCreditCard | null>(null)
  const [memberCreditCardId, setMemberCreditCardId] = useState<string | null>(null)
  const { currentMemberId } = useAuth()
  const { payPayment, addCreditCard } = usePayment(parseInt(paymentNo))
  const { member } = useMember(currentMemberId || '')
  const [isPaying, setIsPaying] = useState(false)

  const isCreditCardReady = Boolean(memberCreditCardId || tpCreditCard?.canGetPrime)

  const handlePaymentPayAsync = async () => {
    setIsPaying(true)
    try {
      if (memberCreditCardId) {
        await payPayment(memberCreditCardId)
      } else {
        await addCreditCard({
          phoneNumber: member?.phone || '0987654321',
          name: member?.name || 'test',
          email: member?.email || 'test@gmail.com',
        })
      }
      history.push(`/orders/${orderId}?tracking=1`)
    } catch (err) {
      if (err instanceof Error) {
        message.error(err)
      }
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
      ) : (
        <div>無法取得會員資料</div>
      )}
    </StyledContainer>
  )
}

const usePayment = (paymentNo: number) => {
  const { TPDirect } = useTappay()
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()

  const payPayment = useCallback(
    (memberCreditCardId: string) =>
      new Promise((resolve, reject) => {
        if (!authToken) {
          reject('no auth')
        }
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/payment/pay/${paymentNo}`,
            {
              memberCreditCardId,
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
      }),
    [authToken, paymentNo, formatMessage],
  )

  const addCreditCard = async (cardHolder: CardHolder) => {
    const memberCreditCardId = await new Promise<string>((resolve, reject) => {
      TPDirect.card.getPrime(({ status, card: { prime } }: { status: number; card: { prime: string } }) => {
        if (status !== 0) {
          console.error('getPrime error')
        }
        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API_BASE_ROOT}/payment/credit-cards`,
          withCredentials: true,
          data: {
            prime,
            cardHolder,
            paymentNo,
          },
          headers: { authorization: `Bearer ${authToken}` },
        })
          .then(({ data: { code, result } }) => {
            if (code === 'SUCCESS') {
              resolve(result.memberCreditCardId)
            }

            reject(code)
          })
          .catch(reject)
      })
    })
    return memberCreditCardId
  }

  return { payPayment, addCreditCard }
}

export default PaymentTapPayPage
