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
  const { check, orderChecking, placeOrder, orderPlacing, totalPrice } = useCheck({
    productIds: memberContract?.values?.orderProducts.map((p: any) => p.product_id),
    discountId: null,
    shipping: null,
    options: {},
  })
  useEffect(() => {
    placeOrder(
      'perpetual',
      {
        name: 'logan本尊',
        email: 'logan@urfit.com.tw',
        phone: '091231231',
      },
      {
        gateway: 'spgateway',
        method: 'credit',
      },
    ).then(({ orderId, paymentNo, payToken }) => {
      history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`)
    })
  }, [])

  return <div></div>
}

export default ContractDealPage
