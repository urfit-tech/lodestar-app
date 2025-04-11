import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button } from '@chakra-ui/react'
import { Divider, Icon as AntdIcon, List, Skeleton, Typography } from 'antd'
import axios from 'axios'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { checkoutMessages } from 'lodestar-app-element/src/helpers/translation'
import { PaymentGatewayType, PaymentMethodType } from 'lodestar-app-element/src/types/checkout'
import { evolve, map, pick, pipe, props, split, transpose, zipObj } from 'ramda'
import { Fragment, useContext, useEffect, useState } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { AuthModalContext } from '../components/auth/AuthModal'
import CheckoutCard from '../components/checkout/CheckoutCard'
import AdminCard from '../components/common/AdminCard'
import ContractBlock from '../components/contract/ContractBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import { desktopViewMixin, handleError } from '../helpers'
import { useMemberContract, useMemberPropertyMemberType } from '../hooks/data'
import pageMessages from './translation'

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
  gateway: string
  method: string | null
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
    memberContractId?: string
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

const exemptMember = (memberType: string) => ['B', 'G'].some(v => v === memberType?.trim().match(/^[A-Z]+/)?.[0])

const OrderPaymentPage = () => {
  const { id: appId } = useApp()
  const { orderId } = useParams<{ orderId: string }>()
  const [token] = useQueryParam('token', StringParam)
  const [order, setOrder] = useState<Order>()
  const [loading, setLoading] = useState(false)
  const { formatMessage } = useIntl()

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
  }, [appId, orderId, token])
  return <DefaultLayout>{loading ? <Skeleton active /> : <OrderPaymentBlock order={order} />}</DefaultLayout>
}

const OrderPaymentBlock: React.VFC<{ order?: Order }> = ({ order }) => {
  const { formatMessage } = useIntl()
  const [selectedPayment, setSelectedPayment] = useState<Payment>()

  if (!order) {
    return <>{formatMessage(pageMessages.OrderPaymentPage.noOrderInformation)}</>
  }

  const unpaidPayments = (order.paymentLogs || [])
    .filter(p => p.status === 'UNPAID')
    .sort((a, b) => Number(a.no[a.no.length - 1]) - Number(b.no[b.no.length - 1]))

  const invoice = order.invoiceOptions?.invoices?.[0]
  const orderProducts = order.orderProducts || []
  const invalidPaymentStatuses = ['SUCCESS', 'REFUND', 'EXPIRED', 'DELETED']
  const hasInvalidOrderStatus = invalidPaymentStatuses.includes(order.status)

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
        {formatMessage(pageMessages.OrderPaymentPage.paymentMethod)}
      </Typography.Title>
      {!unpaidPayments || hasInvalidOrderStatus || unpaidPayments.length === 0 ? (
        <AdminCard>{formatMessage(pageMessages.OrderPaymentPage.noPaymentInformation)}</AdminCard>
      ) : unpaidPayments.length === 1 || selectedPayment ? (
        <PaymentBlock
          order={order}
          payment={selectedPayment || unpaidPayments[0]}
          invoice={invoice}
          orderProducts={orderProducts}
          memberId={order.memberId}
          memberContractId={order.options?.memberContractId || ''}
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
                            {formatMessage(pageMessages.OrderPaymentPage.goToCheckout)}
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

const PaymentBlock: React.FC<{
  order: Order
  payment: Payment
  invoice?: Invoice
  orderProducts: OrderProduct[]
  memberId: string
  memberContractId: string
}> = ({ order, payment, invoice, orderProducts, memberId, memberContractId }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const [token] = useQueryParam('token', StringParam)
  const { loading: memberTypeLoading, memberType } = useMemberPropertyMemberType(memberId)
  const { memberContract, setMemberContractData, loading: memberContractLoading } = useMemberContract(memberContractId)

  const getObjectFromStupidSymbolSeparateString: <T extends Record<string, string>, K extends keyof T>(
    separateSymbol: string,
  ) => (keys: Array<K>) => (obj: T) => Array<Record<K, string>> = separateSymbol => keys =>
    (pipe as any)(props(keys as string[]), map(split(separateSymbol)), transpose, map(zipObj(keys) as any))

  const details = invoice
    ? (getObjectFromStupidSymbolSeparateString('|')(['itemName', 'itemAmt', 'itemCount'])(
        pick(['itemName', 'itemAmt', 'itemCount'], invoice) as Pick<Invoice, 'itemName' | 'itemAmt' | 'itemCount'>,
      ).map((evolve as any)({ itemAmt: Number, itemCount: Number })) as {
        itemName: string
        itemAmt: number
        itemCount: number
      }[])
    : undefined

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
          <StyledTitle>{formatMessage(pageMessages.OrderPaymentPage.paymentInformation)}</StyledTitle>
          {payment.method
            ? formatMessage(checkoutMessages.label[payment.method as PaymentMethodType])
            : formatMessage(
                checkoutMessages.label[
                  payment.gateway.includes('spgateway') ? 'spgateway' : (payment.gateway as PaymentGatewayType)
                ],
              )}
        </AdminCard>
      </div>
      {!memberTypeLoading && memberType && !exemptMember(memberType) ? (
        <AdminCard className="mb-3 d-flex">
          <Accordion allowToggle>
            <AccordionItem w="100%">
              <h2>
                <AccordionButton
                  onClick={() => {
                    !isAuthenticated && setAuthModalVisible?.(true)
                  }}
                >
                  <Box as="span" flex="1" textAlign="left">
                    {formatMessage(pageMessages.OrderPaymentPage.contractBlock)}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {memberContractLoading ? (
                  <Skeleton />
                ) : memberContract ? (
                  <ContractBlock memberContract={memberContract} onMemberContractDataChange={setMemberContractData} />
                ) : null}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </AdminCard>
      ) : null}
      <div className="mb-3">
        {!memberTypeLoading && memberType ? (
          <CheckoutCard
            isDisabled={exemptMember(memberType) ? false : !memberContract?.agreedAt}
            check={{
              orderProducts: orderProducts.map(product => ({
                productId: product.productId,
                name: product.name,
                description: '',
                price: product.price,
                endedAt: null,
                startedAt: null,
                autoRenewed: false,
                options: product.options,
              })),
              payments: details,
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
              if (exemptMember(memberType) ? false : !memberContract?.agreedAt) return
              axios
                .post(
                  `${process.env.REACT_APP_API_BASE_ROOT}/order/${order.id}/pay`,
                  {
                    appId,
                    paymentNo: payment.no,
                    memberContractId,
                  },
                  { headers: { authorization: `Bearer ${token}` } },
                )
                .then(({ data: { code, result } }) => {
                  if (code === 'SUCCESS') {
                    if (result.payForm?.url) {
                      window.location.assign(result.payForm.url)
                    } else if (result.payForm?.html) {
                      document.write(result.payForm.html)
                    } else {
                      window.location.href = `/payments/${payment.no}?method=${payment.method}`
                    }
                  }
                })
                .catch(handleError)
            }}
          />
        ) : null}
      </div>
    </>
  )
}

export default OrderPaymentPage
