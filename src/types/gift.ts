export type ProductGiftPlan = {
  id: string
  giftPlan: GiftPlan
  startedAt: string
  endedAt: string
}

type GiftPlan = {
  id: string
  title?: string
  gifts: Gift[]
}

export type Gift = {
  id: string
  title: string
  coverUrl: string | null
  price: number
  currencyId: string
  isDeliverable: boolean
}
