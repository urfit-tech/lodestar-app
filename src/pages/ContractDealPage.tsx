import { Skeleton } from 'antd'
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

  let options: { [key: string]: any } = {}

  memberContract?.values?.orderProducts.forEach((p: any) => {
    options[p.product_id] = { ...p, isContract: true, quantity: p.options?.quantity }
  })
  const { check, orderChecking, placeOrder, orderPlacing, totalPrice } = useCheck({
    productIds: memberContract?.values?.orderProducts.map((p: any) => p.product_id),
    discountId: null,
    shipping: null,
    options: {
      ...options,
      installmentPlans: memberContract?.values.paymentOptions.installmentPlans,
      paymentMode: memberContract?.values.paymentOptions.paymentMode,
    },
  })

  useEffect(() => {
    placeOrder('perpetual', memberContract.values.invoice, {
      gateway: memberContract?.values.paymentOptions.paymentGateway,
      method: memberContract?.values.paymentOptions.paymentMethod,
    }).then(({ orderId, paymentNo, payToken }) => {
      memberContract.values.paymentOptions.paymentGateway === 'spgateway'
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
