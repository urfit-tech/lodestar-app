import { EditorState } from 'braft-editor'
import { ProgramRoleProps } from '../types/program'
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

export type PracticeSuggestProps = {
  id: string
  description: string
  memberId: string
  createdAt: Date
  reactedMemberIds: string[]
  suggestReplyCount: number
  suggestReplies: PracticeSuggestReplyProps[]
}

export type PracticeSuggestReplyProps = {
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
  programRoles?: ProgramRoleProps[]
  programTitle: string
  description: string | null
  suggests: PracticeSuggestProps[]
  attachments: {
    id: string
    data: any
    options: any
  }[]
}
