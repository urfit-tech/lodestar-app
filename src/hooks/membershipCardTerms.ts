import { gql, useApolloClient, useQuery } from '@apollo/client'
import { first } from 'lodash'
import { useEffect, useState } from 'react'
import hasura from '../hasura'

type strategyDiscount = {
  productId: string
  queryClient: any
}

type MembershipCardPlanDetails = {
  productName: string
  productPlanName?: string
} | null

type CardDiscount = {
  discountId: string
  discountType: string
  discountAmount: number
  discountProduct: {
    type: string
    details?: MembershipCardPlanDetails
  }
}

type Card = {
  id: string
  title: string
  description: string
  card_discounts: CardDiscount[]
}

const GET_CARD_QUERY = gql`
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
`
const Get_Activity_Ticket_Title = gql`
  query GetActivityTicketTitle($id: uuid!) {
    activity_ticket(where: { id: { _eq: $id } }) {
      title
    }
  }
`

const Get_Program_And_Program_Plan_Info = gql`
  query GetProgramPlanInfo($id: uuid!) {
    program_plan(where: { id: { _eq: $id } }) {
      title
      program {
        title
      }
    }
  }
`

// Strategy functions map
const strategyMap: { [key: string]: (discount: strategyDiscount) => Promise<MembershipCardPlanDetails> } = {
  ActivityTicket: async discount => {
    const { productId, queryClient } = discount
    let response

    try {
      response = await queryClient.query({
        query: Get_Activity_Ticket_Title,
        variables: {
          id: productId,
        },
      })
    } catch (error) {
      return null
    }

    const activityTicket = first(response.data.activity_ticket) as { title: string }

    return {
      productName: activityTicket?.title,
    }
  },
  ProgramPlan: async discount => {
    const { productId, queryClient } = discount
    let response

    try {
      response = await queryClient.query({
        query: Get_Program_And_Program_Plan_Info,
        variables: {
          id: productId,
        },
      })
    } catch (error) {
      return null
    }

    const programPlan = first(response.data.program_plan) as {
      title: string
      program: {
        title: string
      }
    }

    return {
      productName: programPlan?.title,
      productPlanName: programPlan?.program?.title,
    }
  },

  default: async discount => {
    // Default product strategy
    return {
      productName: 'Default Product',
      productPlanName: 'Default Plan',
    }
  },
}

export const useMembershipCardTerms = (id: string) => {
  const [cards, setCards] = useState<Card[]>([])
  const { loading, error, data, refetch } = useQuery<hasura.GetCard, hasura.GetCardVariables>(GET_CARD_QUERY, {
    variables: { id },
  })

  const queryClient = useApolloClient()

  useEffect(() => {
    if (data && data.card) {
      console.log({ data })
      processCardDiscounts(data.card)
    }
  }, [data])

  const processCardDiscounts = async (cards: hasura.GetCard['card']) => {
    const processedCards = await Promise.all(
      cards.map(async card => ({
        id: card.id,
        title: card.title,
        description: card.description,
        card_discounts: await Promise.all(
          card.card_discounts.map(async discount => {
            const details = await (strategyMap[discount.product.type] || strategyMap['default'])({
              productId: discount.product.target,
              queryClient,
            })

            return {
              discountId: discount.id,
              discountType: discount.type,
              discountAmount: discount.amount,
              discountProduct: {
                type: discount.product.type,
                ...(details ? { details } : {}),
              },
            }
          }),
        ),
      })),
    )

    setCards(processedCards)
  }

  return {
    loading,
    cards,
    error,
    refetch,
  }
}
