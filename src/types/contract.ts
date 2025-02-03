export type MemberContract = {
  id: string
  startedAt: Date | null
  endedAt: Date | null
  values: any
  agreedAt: Date | null
  agreedIp: string | null
  agreedOptions: any
  memberId: string
  memberName: string | null
  memberEmail: string | null
  revokedAt: Date | null
  contract: {
    id: string
    name: string
    description: string
    template: string
  }
}
