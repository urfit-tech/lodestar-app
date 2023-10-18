export type Meet = {
    id: string
    target: string
    hostMemberId: string
    startedAt: Date
    endedAt: Date
    appId: string
    options: any
    meetMembers: MeetMember[]
}

type MeetMember = {
    id: string
    memberId: string
}