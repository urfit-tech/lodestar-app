import jwt from 'jsonwebtoken'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React from 'react'
import { useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout/DefaultLayout.styled'

const PaymentPage: React.VFC = () => {
  const tracking = useTracking()
  const { paymentNo } = useParams<{ paymentNo: string }>()
  const [payToken] = useQueryParam('token', StringParam)

  const decodedToken = payToken && jwt.decode(payToken)

  if (decodedToken) {
    const payload = decodedToken as { gateway: string; method: string; payForm: { html?: string; url?: string } }
    tracking.addPaymentInfo({ gateway: payload.gateway, method: payload.method })
    if (payload.payForm.url) {
      window.location.assign(payload.payForm.url)
    } else if (payload.payForm.html) {
      document.write(payload.payForm.html)
    }
  }

  return (
    <DefaultLayout noFooter noHeader centeredBox>
      {!decodedToken && (
        <StyledContainer>
          <h5>無法請求付款資訊，請與平台聯繫</h5>
          <p>交易編號：{paymentNo}</p>
        </StyledContainer>
      )}
    </DefaultLayout>
  )
}

export default PaymentPage
