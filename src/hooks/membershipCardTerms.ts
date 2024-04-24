import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import hasura from '../hasura'
import { executeQuery } from './util'

type strategyDiscount = {
  productId: string
  queryClient: any
  type?: string
}

type MembershipCardPlanDetails = {
  productName: string
  productPlanName?: string
  productId: string
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

const GetCardQuery = gql`
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
const GetActivityTicketTitle = gql`
  query GetActivityTicketTitle($id: uuid!) {
    activity_ticket(where: { id: { _eq: $id } }) {
      title
      activity {
        id
      }
    }
  }
`

const GetProgramAndProgramPlanInfo = gql`
  query GetProgramPlanInfo($id: uuid!) {
    program_plan(where: { id: { _eq: $id } }) {
      title
      program {
        title
        id
      }
    }
  }
`

const GetProgramPackageAndProgramPackagePlan = gql`
  query GetProgramPackageAndProgramPackagePlan($id: uuid!) {
    program_package_plan(where: { id: { _eq: $id } }) {
      title
      program_package {
        title
        id
      }
    }
  }
`

const GetPodcastProgramAndPlan = gql`
  query GetPodcastProgramAndPlan($id: uuid!) {
    podcast_program(where: { id: { _eq: $id } }) {
      title
      id
    }
  }
`

const GetProgramPlanByMembershipCardId = gql`
  query GetProgramPlanByMembershipCard($card_id: uuid!) {
    program_plan(where: { card_id: { _eq: $card_id } }) {
      id
      title
      program {
        id
        title
      }
    }
  }
`

const fetchMembershipCardEquityProgramPlanProduct = async (queryClient: any, membershipCardId: string) => {
  const data = await executeQuery(queryClient, {
    query: GetProgramPlanByMembershipCardId,
    variables: { card_id: membershipCardId },
  })
  if (!data) return null
  return data.program_plan.map((item: any) => {
    return {
      id: item.id,
      type: 'equity',
      amount: 1,
      product: {
        type: 'ProgramPlan',
        details: {
          productName: item.program.title,
          productPlanName: item.title,
          productId: item.program.id,
        },
      },
    }
  })
}

// Strategy functions map
const strategyMap: { [key: string]: (discount: strategyDiscount) => Promise<MembershipCardPlanDetails | null> } = {
  ActivityTicket: async discount => {
    const data = await executeQuery(discount.queryClient, {
      query: GetActivityTicketTitle,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const activityTicket = data.activity_ticket && data.activity_ticket[0] ? data.activity_ticket[0] : null
    if (!activityTicket) return null
    return { productName: activityTicket.title, productId: activityTicket.activity.id }
  },

  ProgramPlan: async discount => {
    const data = await executeQuery(discount.queryClient, {
      query: GetProgramAndProgramPlanInfo,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const programPlan = data.program_plan && data.program_plan[0] ? data.program_plan[0] : null
    if (!programPlan) return null
    return {
      productName: programPlan.program.title,
      productPlanName: programPlan.title,
      productId: programPlan.program.id,
    }
  },

  ProgramPackagePlan: async discount => {
    const data = await executeQuery(discount.queryClient, {
      query: GetProgramPackageAndProgramPackagePlan,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const programPackagePlan =
      data.program_package_plan && data.program_package_plan[0] ? data.program_package_plan[0] : null
    if (!programPackagePlan) return null
    return {
      productName: programPackagePlan.program_package.title,
      productPlanName: programPackagePlan.title,
      productId: programPackagePlan.program_package.id,
    }
  },

  PodcastProgram: async discount => {
    const data = await executeQuery(discount.queryClient, {
      query: GetPodcastProgramAndPlan,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const podcast = data.podcast_program && data.podcast_program[0] ? data.podcast_program[0] : null
    if (!podcast) return null
    return {
      productName: podcast.title,
      productId: podcast.id,
    }
  },

  default: async discount => {
    console.error(`Unknown product type: ${discount.type}`)
    return null
  },
}

export const useMembershipCardTerms = (id: string) => {
  const [cards, setCards] = useState<Card>()
  const { loading, error, data, refetch } = useQuery<hasura.GetCard, hasura.GetCardVariables>(GetCardQuery, {
    variables: { id },
  })

  const queryClient = useApolloClient()

  useEffect(() => {
    if (data && data.card) {
      processCardDiscounts(data.card)
    }
  }, [data])

  const processCardDiscounts = async (cards: hasura.GetCard['card']) => {
    const card = cards[0]
    const processedCard = {
      id: card.id,
      title: card.title,
      description: card.description,
      card_discounts: await Promise.all(
        card.card_discounts.map(async discount => {
          const details = await (strategyMap[discount.product.type] || strategyMap['default'])({
            productId: discount.product.target,
            queryClient,
            type: discount.product.type,
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
    }

    const programPlanEquityData = await fetchMembershipCardEquityProgramPlanProduct(queryClient, card.id)

    if (programPlanEquityData.length > 0) {
      processedCard.card_discounts.push(...programPlanEquityData)
    }

    setCards(processedCard)
  }

  return {
    loading,
    cards,
    error,
    refetch,
  }
}
