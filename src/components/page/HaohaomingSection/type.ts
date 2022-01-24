type Typography = { title?: string; subtitle?: string }
export type CoverProp = Typography
export type PhilosophyProp = Typography & { content?: string }
export type TeacherIntroductionProp = Typography & {
  content?: string
}
export type RecommendProp = Typography & {
  recommenders?: {
    photo: string
    name: string
    jobTitle: string
    words: string
  }[]
}
export type ReviewsProp = Typography & {
  students?: {
    name: string
    rate: number
    reviews: string
    photo: string
  }[]
}
export type FAQsProp = Typography & {
  questions?: {
    header: string
    answer: string
  }[]
}
