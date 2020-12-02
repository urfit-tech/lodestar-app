export type ReviewProps = {
  isAdmin?: boolean
  id: string
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
export type ReviewReplyItemProps = {
  id: string
  reviewReplyMemberId?: string | null
  memberRole?: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
  labelRole?: ReviewLabelRoleProps[]
}
export type ReviewLabelRoleProps = {
  memberId: string | null
  name: string | null
}
export type MemberReviewProps = {
  id: string
  memberId: string
  score: number
  title: string
  content: string | null
  privateContent: string | null
}
