export type UserRole = 'app-owner' | 'content-creator' | 'general-member' | 'anonymous'
export type AuthState = 'login' | 'register' | 'forgotPassword' | 'confirm'
export type MemberPublicProps = {
  id: string
  role: UserRole
  pictureUrl: string | null
  username: string
  name: string | null
  tags: string[]
  abstract: string | null
  description: string | null
  title: string | null

  specialtyNames?: string[]
}

export type MemberProps = {
  id: string
  role: UserRole
  username: string
  name: string | null
  email: string
  pictureUrl: string | null
  metadata: { [key: string]: any } | null
  description: string | null
  createdAt: Date
  loginedAt: Date
  facebookUserId: string | null
  googleUserId: string | null
  youtubeChannelIds: string[] | null

  phone?: string
}

export type MemberSocialType = 'youtube' | 'twitch'

export type SocialCardProps = {
  id: string
  channel: {
    id: string
    name: string
    profileUrl: string | null
    url: string | null
    type: MemberSocialType
  }
  plan: {
    id: string
    name: string
    badgeUrl: string | null
    description: string | null
  }
}
