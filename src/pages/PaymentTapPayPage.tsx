import { Button, message } from 'antd'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import CreditCardSelector, { CardHolder } from '../components/payment/CreditCardSelector'
import TapPayForm, { TPCreditCard } from '../components/payment/TapPayForm'
import { codeMessages } from '../helpers/translation'
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
    defaultMessage: '訂閱金額為 NT$ 0 時，系統需紀錄您的信用卡卡號，並於下期進行扣款',
  },
})

/* choose the credit card from the member to subscribe
1. get the credit cards from the member 
2. allow member to add a new credit card
3. member choose the credit card and pay the payment
*/

const PaymentTapPayPage: React.FC = () => {
  return (
    <DefaultLayout noFooter noHeader centeredBox>
      {(window as any)['TPDirect'] && <PaymentTapPayBlock />}
    </DefaultLayout>
  )
}

const PaymentTapPayBlock: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { paymentNo } = useParams<{ paymentNo: string }>()

  const [tpCreditCard, setTpCreditCard] = useState<TPCreditCard | null>(null)
  const [memberCreditCardId, setMemberCreditCardId] = useState<string | null>(null)
  const { currentMemberId } = useAuth()
  const { paying, payPayment, addCreditCard } = usePayment(parseInt(paymentNo))

  const isCreditCardReady = Boolean(memberCreditCardId || (tpCreditCard && tpCreditCard.canGetPrime))

  const handlePaymentPay: React.MouseEventHandler<HTMLElement> = () => {
    ;(async () => {
      let _memberCreditCardId = memberCreditCardId
      if (!_memberCreditCardId) {
        _memberCreditCardId = await addCreditCard({
          phoneNumber: '0987654321',
          name: 'test',
          email: 'test@gmail.com',
        })
      }
      try {
        await payPayment(parseInt(paymentNo), _memberCreditCardId)
        history.push(`/members/${currentMemberId}`)
      } catch (err) {
        message.error(err)
      }
    })()
  }
  return (
    <StyledContainer>
      {currentMemberId ? (
        <div>
          <CreditCardSelector memberId={currentMemberId} value={memberCreditCardId} onChange={setMemberCreditCardId} />

          <div className={`${memberCreditCardId ? 'd-none' : ''} ml-4`}>
            <TapPayForm onUpdate={setTpCreditCard} />
          </div>
          <Button block type="primary" loading={paying} disabled={!isCreditCardReady} onClick={handlePaymentPay}>
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
  const { authToken, backendEndpoint } = useAuth()
  const [paying, setPaying] = useState(false)

  const payPayment = useCallback(
    (paymentNo: number, memberCreditCardId: string) =>
      new Promise((resolve, reject) => {
        if (!authToken) {
          reject('no auth')
        }
        setPaying(true)
        axios
          .post(
            `${backendEndpoint}/payment/pay/${paymentNo}`,
            {
              memberCreditCardId,
            },
            {
              headers: { authorization: `Bearer ${authToken}` },
            },
          )
          .then(({ data: { code, result } }) => {
            const codeMessage = codeMessages[code as keyof typeof codeMessages]
            if (code === 'SUCCESS') {
              resolve(result)
            } else if (codeMessage) {
              reject(formatMessage(codeMessage))
            } else {
              reject(code)
            }
          })
          .catch(reject)
          .finally(() => setPaying(false))
      }),
    [authToken, backendEndpoint, formatMessage],
  )

  const addCreditCard = async (cardHolder: CardHolder) => {
    const memberCreditCardId = await new Promise<string>((resolve, reject) => {
      TPDirect.card.getPrime((result: { status: number; card: { prime: string } }) => {
        if (result.status !== 0) {
          console.error('getPrime error')
        }
        axios({
          method: 'POST',
          url: `${backendEndpoint}/payment/credit-cards`,
          withCredentials: true,
          data: { prime: result.card.prime, cardHolder },
          headers: { authorization: `Bearer ${authToken}` },
        })
          .then(({ data: { code, result } }) => {
            if (code === 'SUCCESS') {
              resolve(result.memberCreditCardId)
            } else {
              reject(code)
            }
          })
          .catch(reject)
      })
    })
    return memberCreditCardId
  }

  return { paying, payPayment, addCreditCard }
}

export default PaymentTapPayPage
