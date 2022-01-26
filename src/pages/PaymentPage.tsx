import { message } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import GatewayForm from '../components/payment/GatewayForm'
import { handleError } from '../helpers'
import { codeMessages } from '../helpers/translation'
import { useOrderId } from '../hooks/data'

const PaymentPage: React.VFC = () => {
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
  const { authToken, currentMemberId } = useAuth()
  const [loadingForm, setLoadingForm] = useState(false)
  const [PayForm, setPayForm] = useState<React.ReactElement | null>(null)
  const { orderId } = useOrderId(Number(paymentNo))

  useEffect(() => {
    const clientBackUrl = window.location.origin
    if (authToken && orderId) {
      setLoadingForm(true)
      const apiBaseRoot = process.env.REACT_APP_API_BASE_ROOT?.startsWith('http')
        ? process.env.REACT_APP_API_BASE_ROOT
        : window.location.origin + process.env.REACT_APP_API_BASE_ROOT
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_ROOT}/payment/pay-form`,
          {
            paymentNo,
            options: {
              notifyUrl: `${apiBaseRoot}/payment/order-notification`,
              clientBackUrl,
              returnUrl: `${apiBaseRoot}/payment/payment-proxy`,
            },
          },
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        .then(({ data: { code, result } }) => {
          if (code === 'SUCCESS') {
            const gateway = result.gateway?.split('_')[0]
            switch (gateway) {
              case 'paypal':
                if (result.url) {
                  window.location.href = result.url
                } else {
                  history.push(`/orders/${orderId}?tracking=1`)
                }
                break
              case 'spgateway':
              case 'cw':
                if (result.html) {
                  setPayForm(<GatewayForm formHtml={result.html} clientBackUrl={clientBackUrl} />)
                } else {
                  history.push(`/orders/${orderId}?tracking=1`)
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
  }, [authToken, currentMemberId, formatMessage, history, paymentNo, orderId])
  return { loadingForm, PayForm }
}
export default PaymentPage
