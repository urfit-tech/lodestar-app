export type PracticePreviewProps = {
  id: string
  title: string
  coverUrl: string | null
  memberId?: string
  avatarUrl?: string | null
  name?: string
  suggestCount: number
  reactedMemberIds: string[]
  reactedMemberIdsCount: number
}
export type PracticeSuggestProps = {
  id: string
  description: string
  memberId: string
  createdAt: Date
  reactedMemberIds: string[]
}

export type PracticeProps = PracticePreviewProps & {
  createdAt: Date
  description: string | null
  programContentId: string
  programContentTitle: string
  programId: string
  programTitle: string
  suggests: PracticeSuggestProps[]
}
