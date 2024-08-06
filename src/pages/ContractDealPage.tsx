import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useCheck } from '../hooks/checkout'
import { useMemberContract } from '../hooks/data'
import NotFoundPage from './NotFoundPage'

const ContractDealPage: React.FC = () => {
  const { memberContractId } = useParams<{ memberId: string; memberContractId: string }>()

  const { memberContract, refetch: refetchMemberContract } = useMemberContract(memberContractId)

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
    console.log(p)

    options[p.product_id] = { ...p, isContract: true, quantity: p.options?.quantity }
  })
  const { check, orderChecking, placeOrder, orderPlacing, totalPrice } = useCheck({
    productIds: memberContract?.values?.orderProducts.map((p: any) => p.product_id),
    discountId: null,
    shipping: null,
    options,
  })

  useEffect(() => {
    placeOrder('perpetual', memberContract.values.invoice, {
      gateway: 'spgateway',
      method: 'credit',
    }).then(({ orderId, paymentNo, payToken }) => {
      memberContract.values.paymentOptions.paymentMethod.includes('藍新')
        ? history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`)
        : memberContract.values.paymentOptions.paymentMethod.includes('匯款')
        ? history.push(`/orders/${orderId}?method=bankTransfer`)
        : history.goBack()
    })
  }, [])

  return <div></div>
}

export default ContractDealPage
