import moment from 'moment'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages } from '../../helpers/translation'
import { useEnrolledMembershipCards, useMembershipCard } from '../../hooks/card'
import { useMember } from '../../hooks/member'
import { MemberProps } from '../../types/member'
import CommonModal from '../common/CommonModal'
import MembershipCardBlock from '../membershipCard/MembershipCardBlock'

const StyledContainer = styled.div`
  margin-bottom: 0.75rem;
  padding: 1rem;
  border: solid 1px #ececec;
  border-radius: 4px;
  cursor: pointer;
`

const MembershipCardSelectionModal: React.FC<{
  memberId: string
  onSelect?: (membershipCardId: string) => void
  render?: React.FC<{
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    selectedMembershipCard?: { id: string; title: string }
  }>
}> = ({ memberId, onSelect, render }) => {
  const { enrolledMembershipCards } = useEnrolledMembershipCards(memberId)
  const { loadingMember, errorMember, member } = useMember(memberId)
  const [visible, setVisible] = useState(false)
  const [selectedMembershipCard, setSelectedMembershipCard] = useState<{ id: string; title: string }>()
  const { formatMessage } = useIntl()

  if (loadingMember || errorMember || !member) {
    return render?.({ setVisible, selectedMembershipCard }) || null
  }

  return (
    <>
      {render?.({ setVisible, selectedMembershipCard })}

      <CommonModal
        title={formatMessage(checkoutMessages.title.chooseMemberCard)}
        onClose={() => setVisible(false)}
        isOpen={visible}
      >
        {enrolledMembershipCards.map(membershipCard => (
          <div
            key={membershipCard.card.id}
            onClick={() => {
              onSelect && onSelect(membershipCard.card.id)
              setSelectedMembershipCard({
                id: membershipCard.card.id,
                title: membershipCard.card.title,
              })
              setVisible(false)
            }}
          >
            <MembershipCardItem
              member={member}
              membershipCardId={membershipCard.card.id}
              startedAt={membershipCard.startedAt}
              endedAt={membershipCard.endedAt}
            />
          </div>
        ))}
      </CommonModal>
    </>
  )
}

const MembershipCardItem: React.FC<{
  member: MemberProps
  membershipCardId: string
  startedAt?: Date | null
  endedAt?: Date | null
}> = ({ member, membershipCardId, startedAt, endedAt }) => {
  const { loadingMembershipCard, errorMembershipCard, membershipCard } = useMembershipCard(membershipCardId)

  if (loadingMembershipCard || errorMembershipCard || !membershipCard) {
    return null
  }

  return (
    <StyledContainer>
      <MembershipCardBlock
        membershipCardId={membershipCardId}
        template={membershipCard.template}
        templateVars={{
          avatar: member.pictureUrl,
          name: member.name || '',
          account: member.username,
          date: startedAt ? moment(startedAt).format('YYYY//MM/DD') : '',
        }}
        title={membershipCard.title}
        description={membershipCard.description}
        variant="list-item"
        startedAt={startedAt}
        endedAt={endedAt}
      />
    </StyledContainer>
  )
}

export default MembershipCardSelectionModal
