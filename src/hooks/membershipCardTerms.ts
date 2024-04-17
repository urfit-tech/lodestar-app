import { gql, useQuery } from '@apollo/client'
import hasura from '../hasura'

type resCardDiscount = {
  id: string
  type: string
  amount: number
  product: {
    type: string
  }
}

type resCard = {
  id: string
  title: string
  description: string
  card_discounts: resCardDiscount[]
}

type CardDiscountItem = {
  id: string
  type: string
  amount: number
  productType: string
}

type CardInfoWithDiscountList = {
  id: string
  title: string
  description: string
  cardDiscounts: CardDiscountItem[]
}

export const useMembershipCardTerms = (id: string) => {
  // const [cardInfoWithDiscountList, setCardInfoWithDiscountList] = useState<CardInfoWithDiscountList | null>(null);
  let cardInfoWithDiscountList

  const transformCard = (card: resCard): CardInfoWithDiscountList => {
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      cardDiscounts: card.card_discounts.map(discount => ({
        id: discount.id,
        type: discount.type,
        amount: discount.amount,
        productType: discount.product?.type || 'Unknown',
      })),
    }
  }

  const { loading, error, data, refetch } = useQuery<hasura.GetCard, hasura.GetCardVariables>(
    gql`
      query GetCard($id: uuid!) {
        card(where: { id: { _eq: $id } }) {
          id
          title
          description
          card_discounts {
            id
            type
            amount
            product {
              type
              target
            }
          }
        }
      }
    `,
    { variables: { id } },
  )

  if (error) {
    throw new Error(`Cannot get card info, error: ${error.message}`)
  }

  if (data && data.card) {
    const transformedCards: CardInfoWithDiscountList[] = data.card.map(transformCard)

    transformedCards.map(c => {
      const d = c.cardDiscounts.map(d => {
        switch (d.productType) {
          case 'ActivityTicket':
            console.log(`ActivityTicket`)
          case 'ProgramPlan':
            console.log(`ProgramPlan`)
          default:
            console.log(`default`)
        }
        return {
          ...d,
        }
      })
      return {
        ...c,
      }
    })
  }

  return {
    loadingAppointmentPlans: loading,
    errorAppointmentPlans: error,
    data,
    refetchAppointmentPlans: refetch,
  }
}
