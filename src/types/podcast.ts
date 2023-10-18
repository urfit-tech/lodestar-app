import { Category } from './general'

export type PodcastRoleName = 'instructor'

export type PodcastProgramBriefProps = {
  id: string
  coverUrl: string | null
  title: string
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  duration: number
  durationSecond: number
  description: string | null
  categories: Category[]
  instructor: {
    id: string
    avatarUrl: string | null
    name: string
  } | null
  isEnrolled?: boolean
  isSubscribed?: boolean
}

export type PodcastProgramContent = {
  id: string
  title: string
  abstract: string | null
  description: string | null
  coverUrl: string | null
  publishedAt: Date
  categories: Category[]
  tags: string[]
  url: string
  instructorIds: string[]
}

export type PodcastRole = {
  id: string
  name: PodcastRole
  memberId: string
  memberName: string
  createdAt?: Date
}

export type PlaylistProps = {
  id: string
  title: string
  maxPosition: number
}

export type PodcastProgramContentProps = {
  id: string
  coverUrl: string | null
  title: string
  duration: number
  durationSecond: number
  instructor: {
    id: string
    avatarUrl: string | null
    name: string
  }
}

export type PodcastPlanEnrollment = {
  id: string
  creator: {
    id: string
    pictureUrl: string | null
    name: string
    username: string
  }
}
