import { message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import SpGatewayForm from '../components/payment/SpGatewayForm'
import { handleError } from '../helpers'
import { codeMessages } from '../helpers/translation'

const PaymentPage: React.FC = () => {
  const { paymentNo } = useParams<{ paymentNo: string }>()
  const { loadingForm, PayForm } = usePayForm(parseInt(paymentNo))

  return (
    <DefaultLayout noFooter noHeader centeredBox>
      <StyledContainer>{loadingForm ? <div>請求付款資訊中...</div> : PayForm}</StyledContainer>
    </DefaultLayout>
  )
}

const usePayForm = (paymentNo: number) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { authToken, currentMemberId, apiHost } = useAuth()
  const [loadingForm, setLoadingForm] = useState(false)
  const [PayForm, setPayForm] = useState<JSX.Element | null>(null)

  useEffect(() => {
    const clientBackUrl = window.location.origin
    if (authToken) {
      setLoadingForm(true)
      axios
        .post(
          `https://${apiHost}/payment/pay-form`,
          {
            paymentNo,
            options: {
              notifyUrl: `https://${apiHost}/payment/order-notification`,
              clientBackUrl,
              returnUrl: `https://${apiHost}/payment/payment-proxy`,
            },
          },
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        .then(({ data: { code, result } }) => {
          if (code === 'SUCCESS') {
            switch (result.gateway) {
              case 'spgateway':
                if (result.html) {
                  setPayForm(<SpGatewayForm formHtml={result.html} clientBackUrl={clientBackUrl} />)
                } else {
                  // window.location.assign(`/members/${currentMemberId}`)
                  history.push(`/members/${currentMemberId}`)
                }
                break
              case 'tappay':
                // window.location.assign(`/payments/${paymentNo}/tappay`)
                history.push(`/payments/${paymentNo}/tappay`)
                break
              default:
                message.error('invalid gateway')
                break
            }
          } else {
            message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
          }
        })
        .catch(handleError)
        .finally(() => setLoadingForm(false))
    }
  }, [authToken, apiHost, currentMemberId, formatMessage, history, paymentNo])
  return { loadingForm, PayForm }
}
export default PaymentPage
