import React from 'react'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'

const PaymentPage: React.VFC = () => {
  const { paymentNo } = useParams<{ paymentNo: string }>()
  return (
    <DefaultLayout noFooter noHeader centeredBox>
      <StyledContainer>
        <h5>無法請求付款資訊，請與平台聯繫</h5>
        <p>交易編號：{paymentNo}</p>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default PaymentPage
