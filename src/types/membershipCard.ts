import { ApolloClient } from '@apollo/client'

export type MembershipCardTermsModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  membershipCardId: string
}

export type MembershipCardTermsProductType = 'ActivityTicket' | 'ProgramPlan' | 'ProgramPackagePlan' | 'PodcastProgram'

export type MembershipCardEquityProgramPlanProduct = {
  id: string
  type: string
  amount: number
  product: {
    type: string
    details: {
      productName: string
      productPlanName: string
      productId: string
    }
  }
}

export type StrategyDiscount = {
  productId: string
  queryClient: ApolloClient<object>
  type?: string
}

export type MembershipCardPlanDetails = {
  productName: string
  productPlanName?: string
  productId: string
  creatorId?: string
} | null

export type CardDiscount = {
  id: string
  type: string
  amount: number
  product: {
    type: string
    details?: MembershipCardPlanDetails
  }
}

export type Card = {
  id: string
  title: string
  description: string
  cardDiscounts: CardDiscount[]
}
