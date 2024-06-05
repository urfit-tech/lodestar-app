import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import hasura from '../hasura'
import {
  Card,
  MembershipCardEquityProgramPlanProduct,
  MembershipCardPlanDetails,
  StrategyDiscount,
} from '../types/membershipCard'
import { executeQuery } from './util'

const GetCard = gql`
  query GetCard($cardId: uuid!) {
    card(where: { id: { _eq: $cardId } }) {
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
    activity_ticket(where: { id: { _eq: $id }, is_published: { _eq: true } }) {
      title
      activity {
        id
      }
    }
  }
`

const GetProgramAndProgramPlanInfo = gql`
  query GetProgramPlanInfo($id: uuid!) {
    program_plan(
      where: { id: { _eq: $id }, program: { published_at: { _is_null: false }, is_deleted: { _eq: false } } }
    ) {
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
    program_package_plan(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
      title
      program_package {
        title
        id
      }
    }
  }
`

const GetPodcastProgram = gql`
  query GetPodcastProgram($id: uuid!) {
    podcast_program(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
      title
      id
    }
  }
`

const GetProgramPlanByMembershipCardId = gql`
  query GetProgramPlanByMembershipCard($cardId: uuid!) {
    program_plan(
      where: {
        card_products: { card_id: { _eq: $cardId } }
        program: { published_at: { _is_null: false } }
        is_deleted: { _eq: false }
      }
    ) {
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
  const data: hasura.GetProgramPlanByMembershipCard = await executeQuery(queryClient, {
    query: GetProgramPlanByMembershipCardId,
    variables: { cardId: membershipCardId },
  })

  if (!data) return null

  const programPlan: MembershipCardEquityProgramPlanProduct[] = data.program_plan.map(programPlan => {
    return {
      id: programPlan.id,
      type: 'equity',
      amount: 1,
      product: {
        type: 'ProgramPlan',
        details: {
          productName: programPlan.program?.title,
          productPlanName: programPlan.title,
          productId: programPlan.program?.id,
        },
      },
    }
  })
  return programPlan
}

// Strategy functions map
const strategyMap: { [key: string]: (discount: StrategyDiscount) => Promise<MembershipCardPlanDetails | null> } = {
  ActivityTicket: async discount => {
    const data: hasura.GetActivityTicketTitle = await executeQuery(discount.queryClient, {
      query: GetActivityTicketTitle,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const activityTicket = data.activity_ticket && data.activity_ticket[0] ? data.activity_ticket[0] : null
    if (!activityTicket) return null
    return { productName: activityTicket.title, productId: activityTicket.activity.id }
  },

  ProgramPlan: async discount => {
    const data: hasura.GetProgramPlanInfo = await executeQuery(discount.queryClient, {
      query: GetProgramAndProgramPlanInfo,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const programPlan = data.program_plan && data.program_plan[0] ? data.program_plan[0] : null
    if (!programPlan) return null
    return {
      productName: programPlan.program?.title,
      productPlanName: programPlan.title,
      productId: programPlan.program?.id,
    }
  },

  ProgramPackagePlan: async discount => {
    const data: hasura.GetProgramPackageAndProgramPackagePlan = await executeQuery(discount.queryClient, {
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
    const data: hasura.GetPodcastProgram = await executeQuery(discount.queryClient, {
      query: GetPodcastProgram,
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

export const useMembershipCardTerms = (cardId: string) => {
  const [cardTerm, setCardTerm] = useState<Card>()
  const { loading, error, data, refetch } = useQuery<hasura.GetCard, hasura.GetCardVariables>(GetCard, {
    variables: { cardId },
  })

  const queryClient = useApolloClient()

  const processCardDiscounts = useCallback(
    async (cards: hasura.GetCard['card']) => {
      const card = cards[0]
      let processedCard: Card = {
        id: card.id,
        title: card.title,
        description: card.description || '',
        cardDiscounts: await Promise.all(
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
                ...(details ? { details } : null),
              },
            }
          }),
        ),
      }

      const programPlanEquityData = await fetchMembershipCardEquityProgramPlanProduct(queryClient, card.id)

      if (programPlanEquityData && programPlanEquityData.length > 0) {
        processedCard = { ...processedCard, cardDiscounts: [...processedCard.cardDiscounts, ...programPlanEquityData] }
      }

      setCardTerm(processedCard)
    },
    [queryClient],
  )

  useEffect(() => {
    if (data && data.card) {
      processCardDiscounts(data.card)
    }
  }, [data, processCardDiscounts])

  return {
    loading,
    cardTerm,
    error,
    refetch,
  }
}
