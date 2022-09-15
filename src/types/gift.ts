export type ProductGiftPlan = {
  id: string
  giftPlan: GiftPlan
  startedAt: string
  endedAt: string
}

type GiftPlan = {
  id: string
  title?: string
  gift: Gift
}

type Gift = {
  id: string
  title: string
  coverUrl: string | null
  isDeliverable: boolean
}
