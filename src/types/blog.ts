import { Category, MetaTag } from './general'
import { MerchandiseProps } from './merchandise'
import { SuggestProps } from './practice'

export type PostLinkProps = {
  id: string
  codeName: string | null
  title: string
  coverUrl: string | null
  videoUrl: string | null
}

export type PostPreviewProps = PostLinkProps & {
  abstract: string | null
  authorId: string
  publishedAt: Date | null
  updatedAt: Date
  categories: Category[]
  tags: string[]
}

export type PostRoleName = 'author' | 'creator'

export type PostRole = {
  id: string
  name: PostRoleName
  memberId: string
}

export type Post = Omit<PostPreviewProps, 'authorId'> & {
  author: {
    id: string
    name: string
    username: string
    avatarUrl: string | null
    abstract: string | null
    withPodcast?: boolean
    withAppointment?: boolean
  }
  views: number
  source: string | null
  merchandises: MerchandiseProps[]
  description: string | null
  metaTag: MetaTag
  prevPost: {
    id: string
    codeName: string | null
    title: string
  } | null
  nextPost: {
    id: string
    codeName: string | null
    title: string
  } | null
  reactedMemberIdsCount: number
  suggests: SuggestProps[]
  postRoles?: Pick<PostRole, 'id' | 'memberId' | 'name'>[]
}

export type PostLatestProps = PostLinkProps & {
  abstract: string | null
  publishedAt: Date | null
  description: string | null
}
