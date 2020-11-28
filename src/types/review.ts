export type reviewRoleName = 'app-owner' | 'content-creator'

export type ReviewProps = {
  isAdmin?: boolean
  reviewId: string
  memberId: string | null
  score: number | 0
  title: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
  privateContent?: string | null
  reviewReplies: ReviewReplyItemProps[]
  labelRole?: ReviewLabelRoleProps[]
}

export type ReviewLabelRoleProps = {
  memberId: string
  name: string
}

export type ReviewReplyItemProps = {
  reviewReplyId?: string
  reviewReplyMemberId?: string | null
  memberId?: string | null
  programRole?: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
  labelRole?: ReviewLabelRoleProps[]
}

export type MemberReviewProps = {
  id: string
  memberId: string
  score: number
  title: string
  content: string | null
  privateContent: string | null
} | null
