import { Skeleton } from 'antd'
import { omit } from 'ramda'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useCheck } from '../hooks/checkout'
import { useMemberContract } from '../hooks/data'
import NotFoundPage from './NotFoundPage'

const ContractDealPage: React.FC = () => {
  const { memberContractId } = useParams<{ memberId: string; memberContractId: string }>()

  const { memberContract, loading } = useMemberContract(memberContractId)

  if (loading) {
    return <Skeleton />
  }
  if (!memberContract) {
    return <NotFoundPage />
  }

  return <DealComponent memberContract={memberContract} />
}

const DealComponent: React.FC<{
  memberContract: {
    id: string
    startedAt: any
    endedAt: any
    values: any
    agreedAt: any
    agreedIp: string | null
    agreedOptions: any
    memberName: string | null
    memberEmail: string | null
    revokedAt: any
    contract: any
  }
}> = ({ memberContract }) => {
  const history = useHistory()

  // 後端 /order/create 只讓 app-owner／MEMBER_CONTRACT_INSERT／APPOINTMENT_PLAN_ADMIN 帶 isContract、totalPrice、
  // installmentPlans（一般會員會收到 403 E_ORDER_FIELD_FORBIDDEN）。會員本人成交自己的合約時，只送 memberContractId，
  // 這三個欄位由後端讀 member_contract 列補上。
  let options: { [key: string]: any } = {}

  memberContract?.values?.orderProducts.forEach((p: any) => {
    options[p.product_id] = { ...omit(['totalPrice', 'isContract'], p), quantity: p.options?.quantity }
  })
  const { placeOrder } = useCheck({
    productIds: memberContract?.values?.orderProducts.map((p: any) => p.product_id),
    discountId: null,
    shipping: null,
    options: {
      ...options,
      ...memberContract?.values.options,
      paymentMode: memberContract?.values.paymentOptions.paymentMode,
      memberContractId: memberContract.id,
    },
  })

  useEffect(() => {
    placeOrder('perpetual', memberContract.values.invoice, {
      gateway: memberContract?.values.paymentOptions.paymentGateway,
      method: memberContract?.values.paymentOptions.paymentMethod,
    }).then(({ orderId, paymentNo, payToken }) => {
      memberContract.values.paymentOptions.paymentGateway.includes('spgateway')
        ? history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`)
        : history.push(
            paymentNo
              ? `/payments/${paymentNo}?method=${memberContract?.values.paymentOptions.paymentMethod}`
              : `/orders/${orderId}?tracking=1`,
          )
    })
  }, [])

  return <div></div>
}

export default ContractDealPage
