import { gql, useApolloClient, useQuery } from '@apollo/client'
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
  id: string
  type: string
  amount: number
  product: {
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

const Get_Program_Package_And_Program_Package_Plan = gql`
  query GetProgramPackageAndProgramPackagePlan($id: uuid!) {
    program_package_plan(where: { id: { _eq: $id } }) {
      title
      program_package {
        title
      }
    }
  }
`

const Get_Podcast_Program_And_Plan = gql`
  query GetPodcastProgramAndPlan($id: uuid!) {
    podcast_program(where: { id: { _eq: $id } }) {
      title
    }
  }
`

const executeQuery = async (queryClient: any, query: any, variables: any) => {
  try {
    const response = await queryClient.query({
      query: query,
      variables: variables,
    })
    return response.data
  } catch (error) {
    console.error('Error executing query:', error)
    return null
  }
}

// Strategy functions map
const strategyMap: { [key: string]: (discount: strategyDiscount) => Promise<MembershipCardPlanDetails | null> } = {
  ActivityTicket: async discount => {
    const data = await executeQuery(discount.queryClient, Get_Activity_Ticket_Title, { id: discount.productId })
    if (!data) return null
    const activityTicket = data.activity_ticket && data.activity_ticket[0] ? data.activity_ticket[0] : null
    if (!activityTicket) return null
    return { productName: activityTicket.title }
  },

  ProgramPlan: async discount => {
    const data = await executeQuery(discount.queryClient, Get_Program_And_Program_Plan_Info, { id: discount.productId })
    if (!data) return null
    const programPlan = data.program_plan && data.program_plan[0] ? data.program_plan[0] : null
    if (!programPlan) return null
    return {
      productName: programPlan.program.title,
      productPlanName: programPlan.title,
    }
  },

  ProgramPackagePlan: async discount => {
    const data = await executeQuery(discount.queryClient, Get_Program_Package_And_Program_Package_Plan, {
      id: discount.productId,
    })
    if (!data) return null
    const programPackagePlan =
      data.program_package_plan && data.program_package_plan[0] ? data.program_package_plan[0] : null
    if (!programPackagePlan) return null
    return {
      productName: programPackagePlan.program_package.title,
      productPlanName: programPackagePlan.title,
    }
  },

  PodcastProgram: async discount => {
    const data = await executeQuery(discount.queryClient, Get_Podcast_Program_And_Plan, { id: discount.productId })
    if (!data) return null
    const podcast = data.podcast_program && data.podcast_program[0] ? data.podcast_program[0] : null
    if (!podcast) return null
    return {
      productName: podcast.title,
    }
  },

  default: async discount => {
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
              id: discount.id,
              type: discount.type,
              amount: discount.amount,
              product: {
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
