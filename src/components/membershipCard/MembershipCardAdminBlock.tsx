import dayjs from 'dayjs'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useMembershipCard } from 'lodestar-app-element/src/hooks/card'
import styled from 'styled-components'
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
}> = ({ cardId, startedAt, endedAt, updatedAt }) => {
  const { loadingMembershipCard, errorMembershipCard, membershipCard } = useMembershipCard(cardId)
  const { currentMember } = useAuth()

  if (loadingMembershipCard || errorMembershipCard || !currentMember || !membershipCard) {
    return null
  }

  return (
    <StyledContainer>
      <MembershipCardBlock
        template={membershipCard.template}
        templateVars={{
          avatar: currentMember.pictureUrl,
          name: currentMember.name || '',
          account: currentMember.username,
          date: updatedAt ? dayjs(updatedAt).format('YYYY/MM/DD') : '',
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
