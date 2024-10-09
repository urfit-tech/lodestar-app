import { gql, useQuery } from '@apollo/client'
import { Button, Icon, Input, message, Typography } from 'antd'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import AdminCard from '../components/common/AdminCard'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { commonMessages } from '../helpers/translation'

const PaymentPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const tracking = useTracking()
  const { paymentNo } = useParams<{ paymentNo: string }>()
  const [payToken] = useQueryParam('token', StringParam)
  const [method] = useQueryParam('method', StringParam)
  const { data: payment, loading } = useQuery<hasura.GetPaymentInfo, hasura.GetPaymentInfoVariables>(
    gql`
      query GetPaymentInfo($paymentNo: String!) {
        payment_log(where: { no: { _eq: $paymentNo } }) {
          no
          options
        }
      }
    `,
    { variables: { paymentNo }, skip: !paymentNo },
  )
  const [bankCode, setBankCode] = useState('')

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
    <DefaultLayout noFooter>
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <AdminCard style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          <div className="d-flex flex-column align-items-center justify-content-center px-sm-5">
            {method === 'bankTransfer' ? (
              <>
                <Icon
                  className="mb-5"
                  type="clock-circle"
                  theme="twoTone"
                  twoToneColor="#6299ff"
                  style={{ fontSize: '4rem' }}
                />
                <Typography.Title level={4} className="mb-3">
                  銀行匯款
                </Typography.Title>
                <Typography.Title level={4} className="mb-3">
                  {payment?.payment_log[0]?.options?.bankCode
                    ? `您的後五碼：${payment?.payment_log[0]?.options?.bankCode}`
                    : '若已匯款成功，請填入您的銀行帳號後五碼。'}
                </Typography.Title>
                {!payment?.payment_log[0]?.options?.bankCode && (
                  <>
                    <div style={{ width: 120 }}>
                      <Input
                        value={bankCode || payment?.payment_log[0]?.options?.bankCode}
                        onChange={e => {
                          setBankCode(e.target.value)
                        }}
                      />
                    </div>
                    <Button
                      className="mt-3"
                      disabled={bankCode.length !== 5}
                      onClick={() => {
                        axios
                          .put(
                            `${process.env.REACT_APP_API_BASE_ROOT}/payment/bank-code/${paymentNo}`,
                            { bankCode },
                            {
                              headers: {
                                Authorization: `Bearer ${authToken}`,
                              },
                            },
                          )
                          .then(r => {
                            if (r.data.code === 'SUCCESS') {
                              message.success('已更新，請通知客服')
                            }
                          })
                          .catch(handleError)
                      }}
                    >
                      {formatMessage(commonMessages.ui.submit)}
                    </Button>
                  </>
                )}
              </>
            ) : method === 'cash' || method === 'physicalCredit' || method === 'physicalRemoteCredit' ? (
              <>
                <Icon
                  className="mb-5"
                  type="clock-circle"
                  theme="twoTone"
                  twoToneColor="#6299ff"
                  style={{ fontSize: '4rem' }}
                />
                <Typography.Title level={4} className="mb-3">
                  訂單已建立成功，請透過{method === 'cash' ? '現金' : '實體刷卡'}來完成付款
                </Typography.Title>
                <Typography.Title level={4} className="mb-3">
                  若已付款完成，稍後重整頁面確認訂單狀態。
                </Typography.Title>
              </>
            ) : (
              !decodedToken && (
                <>
                  <Icon
                    className="mb-5"
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#ff7d62"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4} className="mb-3">
                    無法請求付款資訊，請與平台聯繫{' '}
                  </Typography.Title>
                  <Typography.Title level={4} className="mb-3">
                    交易編號：{paymentNo}
                  </Typography.Title>
                </>
              )
            )}
          </div>
        </AdminCard>
      </div>
    </DefaultLayout>
  )
}

export default PaymentPage
