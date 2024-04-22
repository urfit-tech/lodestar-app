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

const executeQuery = async (queryClient: any, query: any, variables: any, processData: any) => {
  let response
  try {
    response = await queryClient.query({
      query: query,
      variables: variables,
    })
  } catch (error) {
    console.error('Error executing query:', error)
    return null
  }

  return processData(response.data)
}

// Strategy functions map
const strategyMap: { [key: string]: (discount: strategyDiscount) => Promise<MembershipCardPlanDetails> } = {
  ActivityTicket: async discount => {
    const processData = (data: any) => {
      const activityTicket = first(data.activity_ticket) as { title: string }
      return { productName: activityTicket?.title }
    }

    return executeQuery(discount.queryClient, Get_Activity_Ticket_Title, { id: discount.productId }, processData)
  },

  ProgramPlan: async discount => {
    const processData = (data: any) => {
      const programPlan = first(data.program_plan) as { title: string; program: { title: string } }
      return {
        productName: programPlan?.program?.title,
        productPlanName: programPlan?.title,
      }
    }

    return executeQuery(
      discount.queryClient,
      Get_Program_And_Program_Plan_Info,
      { id: discount.productId },
      processData,
    )
  },

  ProgramPackagePlan: async discount => {
    const processData = (data: any) => {
      const programPackagePlan = first(data.program_package_plan) as {
        title: string
        program_package: { title: string }
      }
      return {
        productName: programPackagePlan?.program_package?.title,
        productPlanName: programPackagePlan?.title,
      }
    }

    return executeQuery(
      discount.queryClient,
      Get_Program_Package_And_Program_Package_Plan,
      { id: discount.productId },
      processData,
    )
  },

  default: async discount => {
    // Default product strategy, possibly no need for querying
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

  const { data: testdata, loading: testLoad } = useQuery(Get_Program_Package_And_Program_Package_Plan, {
    variables: { id: 'bb02a165-44f5-40ff-8219-4e9f1e030f59' },
    fetchPolicy: 'network-only', // Example: Ensures fresh data is fetched each time
  })

  useEffect(() => {
    console.log(testdata)
  }, [testdata, testLoad])

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
