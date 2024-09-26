import { Button, Checkbox } from '@chakra-ui/react'
import { Divider, Icon as AntdIcon, List, Skeleton, Typography } from 'antd'
import axios from 'axios'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import Embedded from 'lodestar-app-element/src/components/common/Embedded'
import InvoiceInput from 'lodestar-app-element/src/components/inputs/InvoiceInput'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { render } from 'mustache'
import { Fragment, useEffect, useState } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CheckoutCard from '../components/checkout/CheckoutCard'
import AdminCard from '../components/common/AdminCard'
import DefaultLayout from '../components/layout/DefaultLayout'
import { desktopViewMixin, handleError } from '../helpers'

const StyledContentBlock = styled.div`
  ${desktopViewMixin(css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `)}
`

const StyledMeta = styled.span`
  margin-top: 0.5rem;
  min-width: 4.5rem;
  white-space: nowrap;

  ${desktopViewMixin(css`
    margin-top: 0;
    text-align: right;
  `)}
`
const StyledCheckbox = styled(Checkbox)`
  .chakra-checkbox__control {
    border: 1px solid #cdcece;
  }
`

const StyledLabel = styled.span`
  font-weight: bold;
`
const StyledApprovementBox = styled.div`
  padding-left: 46px;
  margin-top: 8px;
`

const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  line-height: 1.5;
  ${CommonTitleMixin}
`

type Invoice = {
  merchantOrderNo: string
  buyerName: string
  buyerUBN?: string
  buyerAddress?: string
  buyerPhone?: string
  buyerEmail?: string
  category: string
  taxType: string
  taxRate: number
  amt: number
  taxAmt: number
  totalAmt: number
  loveCode?: string
  printFlag: string
  itemName: string
  itemCount: string
  itemUnit: string
  itemPrice: string
  itemAmt: string
  itemTaxType?: string
  comment?: string
  amtFree?: number
  amtZero?: number
  customsClearance?: string
  amtSales?: number
}

type Payment = {
  no: string
  status: string
  price: number
  invoiceGatewayId: string
}

type OrderProduct = {
  id: string
  name: string
  productId: string
  price: number
  options?: {
    id?: string
    quantity?: number
    title?: string
  }
}

type Order = {
  id: string
  memberId: string
  status: string
  options?: {
    contractId?: string
  }
  invoiceOptions?: {
    name?: string
    email?: string
    invoices?: Invoice[]
    uniformTitle?: string
    invoiceNumber?: string
    uniformNumber?: string
    invoiceGateway?: string
    invoiceGatewayId?: string
  }
  paymentLogs: Payment[]
  orderProducts: OrderProduct[]
}

const OrderPaymentPage = () => {
  const { id: appId } = useApp()
  const { orderId } = useParams<{ orderId: string }>()
  const [token] = useQueryParam('token', StringParam)
  const [order, setOrder] = useState<Order>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${process.env.REACT_APP_API_BASE_ROOT}/order/${orderId}/payment`, {
        params: { appId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data.code === 'SUCCESS') {
          setOrder(data.result)
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId, token])
  return <DefaultLayout>{loading ? <Skeleton active /> : <OrderPaymentBlock order={order} />}</DefaultLayout>
}

const OrderPaymentBlock: React.VFC<{ order?: Order }> = ({ order }) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment>()
  const unpaidPayments = order?.paymentLogs
    .filter(p => p.status === 'UNPAID')
    .sort((a, b) => Number(a.no[a.no.length - 1]) - Number(b.no[b.no.length - 1]))

  const invoice = order?.invoiceOptions?.invoices?.[0]
  const orderProducts = order?.orderProducts || []
  console.log(order)

  return (
    <div className="container py-5">
      <Typography.Title level={3} className="mb-4 d-flex">
        {selectedPayment && (
          <div
            style={{ cursor: 'pointer', marginRight: 4 }}
            onClick={() => {
              setSelectedPayment(undefined)
            }}
          >
            <AiOutlineArrowLeft />
          </div>
        )}
        <AntdIcon type="shopping-cart" className="mr-2" />
        付款資訊
      </Typography.Title>
      {!order || !unpaidPayments || unpaidPayments.length === 0 ? (
        <AdminCard>無付款資訊</AdminCard>
      ) : unpaidPayments.length === 1 || selectedPayment ? (
        <PaymentBlock
          order={order}
          payment={selectedPayment || unpaidPayments[0]}
          invoice={invoice}
          orderProducts={orderProducts}
          memberId={order.memberId}
          contractId={order.options?.contractId || ''}
        />
      ) : (
        <>
          {unpaidPayments.map(p => {
            return (
              <div className="mb-3" key={p.no}>
                <AdminCard>
                  <List itemLayout="horizontal" className={unpaidPayments.length !== 0 ? 'mb-4' : ''}>
                    <Fragment>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="flex-grow-1 d-flex align-items-center justify-content-start">
                          <StyledContentBlock className="flex-grow-1 mr-2">
                            <Typography.Paragraph ellipsis={{ rows: 2 }} className="flex-grow-1 mb-0 mr-2">
                              {p.no}
                            </Typography.Paragraph>

                            <StyledMeta>{<PriceLabel variant="inline" listPrice={p.price} />}</StyledMeta>
                          </StyledContentBlock>
                        </div>
                      </div>

                      <Divider className="my-4" />
                      <div className="row">
                        <div className="col-12 offset-md-8 col-md-4 offset-lg-10 col-lg-2">
                          <Button
                            colorScheme="primary"
                            isFullWidth
                            onClick={() => {
                              setSelectedPayment(p)
                            }}
                          >
                            前往付款
                          </Button>
                        </div>
                      </div>
                    </Fragment>
                  </List>
                </AdminCard>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

const PaymentBlock: React.VFC<{
  order: Order
  payment: Payment
  invoice?: Invoice
  orderProducts: OrderProduct[]
  memberId: string
  contractId: string
}> = ({ order, payment, invoice, orderProducts, memberId, contractId }) => {
  const { settings, id: appId } = useApp()
  const [token] = useQueryParam('token', StringParam)
  const [isChecked, setIscChecked] = useState(false)
  console.log(payment, invoice, orderProducts)

  return (
    <>
      <div className="mb-3">
        <AdminCard>
          <List itemLayout="horizontal" className={orderProducts.length !== 0 ? 'mb-4' : ''}>
            {orderProducts.map(product => {
              return (
                <Fragment key={product.id}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex align-items-center justify-content-start">
                      <StyledContentBlock className="flex-grow-1 mr-2">
                        <Typography.Paragraph ellipsis={{ rows: 2 }} className="flex-grow-1 mb-0 mr-2">
                          {product.name}
                          {product.options?.quantity &&
                            product.options?.quantity > 0 &&
                            ` x${product.options?.quantity}`}
                        </Typography.Paragraph>

                        <StyledMeta>{<PriceLabel variant="inline" listPrice={product.price} />}</StyledMeta>
                      </StyledContentBlock>
                    </div>
                  </div>

                  <Divider className="my-4" />
                </Fragment>
              )
            })}
          </List>
        </AdminCard>
      </div>

      <div className="mb-3">
        <AdminCard>
          <StyledTitle>付款方式</StyledTitle>
          藍新金流
        </AdminCard>
      </div>

      <div className="mb-3">
        <AdminCard>
          <InvoiceInput
            value={{
              name: invoice?.buyerName || '',
              email: invoice?.buyerEmail || '',
              uniformNumber: invoice?.buyerUBN || '',
              uniformTitle: invoice?.buyerName || '',
              phone: '',
            }}
            onChange={value => {
              console.log(value)
            }}
            hidePhoneInput
          />
        </AdminCard>
      </div>

      {contractId && (
        <AdminCard className="mb-3">
          <StyledCheckbox
            className="mr-2"
            size="lg"
            colorScheme="primary"
            isChecked={isChecked}
            onChange={() => {
              setIscChecked(!isChecked)
            }}
          />
          <StyledLabel>我同意</StyledLabel>
          <StyledApprovementBox>
            <Embedded
              iframe={render(settings['checkout.approvement_content'], {
                contractUrl: `${window.location.origin}/members/${memberId}/contracts/${contractId}`,
              })}
            />
          </StyledApprovementBox>
        </AdminCard>
      )}

      <div className="mb-3">
        <CheckoutCard
          isDisabled={!isChecked}
          check={{
            orderProducts: orderProducts.map(product => ({
              productId: product.productId,
              name: product.name,
              description: '',
              price: payment.price,
              endedAt: null,
              startedAt: null,
              autoRenewed: false,
              options: product.options,
              customPrice: payment.price,
            })),
            orderDiscounts: [],
            shippingOption: null,
          }}
          cartProducts={[]}
          discountId={null}
          invoice={{
            name: '',
            email: '',
            phone: '',
          }}
          shipping={null}
          loading={false}
          onCheckout={() => {
            axios
              .post(
                `${process.env.REACT_APP_API_BASE_ROOT}/order/${order.id}/payment`,
                {
                  appId,
                  clientBackUrl: window.location.origin,
                  invoiceGatewayId: payment.invoiceGatewayId,
                  price: payment.price,
                  // gateway: payment.gateway,
                  // method: payment.method,
                },
                { headers: { authorization: `Bearer ${token}` } },
              )
              .then(({ data: { code, result } }) => {
                if (code === 'SUCCESS') {
                  if (result.payForm.url) {
                    window.location.assign(result.payForm.url)
                  } else if (result.payForm.html) {
                    document.write(result.payForm.html)
                  }
                }
              })
              .catch(handleError)
          }}
        />
      </div>
    </>
  )
}

export default OrderPaymentPage
