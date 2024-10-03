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
      query: gql`
        query GetActivityTicketTitle($id: uuid!) {
          activity_ticket(where: { id: { _eq: $id }, is_published: { _eq: true } }) {
            title
            activity {
              id
            }
          }
        }
      `,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const activityTicket = data.activity_ticket && data.activity_ticket[0] ? data.activity_ticket[0] : null
    if (!activityTicket) return null
    return { productName: activityTicket.title, productId: activityTicket.activity.id }
  },

  ProgramPlan: async discount => {
    const data: hasura.GetProgramPlanInfo = await executeQuery(discount.queryClient, {
      query: gql`
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
      `,
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
      query: gql`
        query GetProgramPackageAndProgramPackagePlan($id: uuid!) {
          program_package_plan(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
            title
            program_package {
              title
              id
            }
          }
        }
      `,
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
      query: gql`
        query GetPodcastProgram($id: uuid!) {
          podcast_program(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
            title
            id
          }
        }
      `,
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
  AppointmentPlan: async discount => {
    const data: hasura.GetAppointmentPlan = await executeQuery(discount.queryClient, {
      query: gql`
        query GetAppointmentPlan($id: uuid!) {
          appointment_plan(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
            title
            id
            creator_id
          }
        }
      `,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const appointmentPlan = data.appointment_plan && data.appointment_plan[0] ? data.appointment_plan[0] : null

    return appointmentPlan
      ? {
          productName: appointmentPlan.title,
          productId: appointmentPlan.id,
        }
      : null
  },
  MerchandiseSpec: async discount => {
    const data: hasura.GetMerchandiseSpec = await executeQuery(discount.queryClient, {
      query: gql`
        query GetMerchandiseSpec($id: uuid!) {
          merchandise_spec(where: { id: { _eq: $id }, is_deleted: { _eq: false } }) {
            title
            id
          }
        }
      `,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const merchandiseSpec = data.merchandise_spec && data.merchandise_spec[0] ? data.merchandise_spec[0] : null

    return merchandiseSpec
      ? {
          productName: merchandiseSpec.title,
          productId: merchandiseSpec.id,
        }
      : null
  },
  ProjectPlan: async discount => {
    const data: hasura.GetProjectPlan = await executeQuery(discount.queryClient, {
      query: gql`
        query GetProjectPlan($id: uuid!) {
          project_plan(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
            title
            id
          }
        }
      `,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const projectPlan = data.project_plan && data.project_plan[0] ? data.project_plan[0] : null

    return projectPlan
      ? {
          productName: projectPlan.title,
          productId: projectPlan.id,
        }
      : null
  },
  PodcastPlan: async discount => {
    const data: hasura.GetPodcastPlan = await executeQuery(discount.queryClient, {
      query: gql`
        query GetPodcastPlan($id: uuid!) {
          podcast_plan(where: { id: { _eq: $id }, published_at: { _is_null: false } }) {
            id
            creator {
              id
              name
            }
          }
        }
      `,
      variables: { id: discount.productId },
    })
    if (!data) return null
    const podcastPlan = data.podcast_plan && data.podcast_plan[0] ? data.podcast_plan[0] : null

    return podcastPlan
      ? {
          productName: podcastPlan.creator?.name || '',
          productId: podcastPlan.id,
          creatorId: podcastPlan.creator?.id || '',
        }
      : null
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
