import { EditorState } from 'braft-editor'
import { ProgramRole } from '../types/program'
export type PracticePreviewProps = {
  id: string
  title: string
  coverUrl: string | null
  memberId: string
  suggestCount: number
  reactedMemberIds: string[]
  reactedMemberIdsCount: number
  isCoverRequired: boolean
}

export type SuggestProps = {
  id: string
  description: string
  memberId: string
  createdAt: Date
  reactedMemberIds: string[]
  suggestReplyCount: number
  suggestReplies: SuggestReplyProps[]
}

export type SuggestReplyProps = {
  id: string
  memberId: string
  content: EditorState
  createdAt: Date
  reactedMemberIds: string[]
}

export type PracticeProps = PracticePreviewProps & {
  createdAt: Date
  programContentId: string
  programContentTitle: string
  programId: string
  programRoles?: Pick<ProgramRole, 'id' | 'memberId' | 'name'>[]
  programTitle: string
  description: string | null
  suggests: SuggestProps[]
  attachments: {
    id: string
    data: any
    options: any
  }[]
}
