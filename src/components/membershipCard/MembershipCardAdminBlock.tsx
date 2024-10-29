import dayjs from 'dayjs'
import { useMembershipCard } from 'lodestar-app-element/src/hooks/card'
import styled from 'styled-components'
import { useMember } from '../../hooks/member'
import MembershipCardBlock from './MembershipCardBlock'

const StyledContainer = styled.div`
  margin-bottom: 1.25rem;
  padding: 1.5rem;
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
`

const MembershipCardAdminBlock: React.VFC<{
  cardId: string
  startedAt?: Date | null
  endedAt?: Date | null
  updatedAt?: Date | null
  memberId: string
}> = ({ cardId, startedAt, endedAt, updatedAt, memberId }) => {
  const { loadingMembershipCard, errorMembershipCard, membershipCard } = useMembershipCard(cardId)
  const { loadingMember, member } = useMember(memberId)

  if (loadingMembershipCard || errorMembershipCard || !membershipCard || loadingMember || !member) {
    return null
  }

  return (
    <StyledContainer>
      <MembershipCardBlock
        template={membershipCard.template}
        templateVars={{
          avatar: member.pictureUrl,
          name: member.name || '',
          account: member.username,
          date: startedAt ? dayjs(startedAt).format('YYYY/MM/DD') : '',
        }}
        title={membershipCard.title}
        description={membershipCard.description}
        membershipCardId={membershipCard.id}
        startedAt={startedAt}
        endedAt={endedAt}
      />
    </StyledContainer>
  )
}

export default MembershipCardAdminBlock
