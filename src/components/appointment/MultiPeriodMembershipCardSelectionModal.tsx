import moment from 'moment'
import { equals, filter, head, path, pipe } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages } from '../../helpers/translation'
import { useMembershipCard } from '../../hooks/card'
import { useMember } from '../../hooks/member'
import { MembershipCardProps } from '../../types/checkout'
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

const MultiPeriodMembershipCardSelectionModal: React.VFC<{
  memberId: string
  membershipCards: MembershipCardProps[]
  loadingMembershipCards: boolean
  onSelect?: (membershipCardId: string) => void
  selectedMembershipCardId: string | null
  render?: React.VFC<{
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    selectedMembershipCard?: MembershipCardProps
  }>
}> = ({ memberId, membershipCards, loadingMembershipCards, onSelect, selectedMembershipCardId, render }) => {
  const { loadingMember, errorMember, member } = useMember(memberId)
  const [visible, setVisible] = useState(false)
  const { formatMessage } = useIntl()

  const [selectedMembershipCard, setSelectedMembershipCard] = useState<MembershipCardProps | undefined>(
    selectedMembershipCardId
      ? (pipe as any)(
          filter((pipe as any)(path(['card', 'id']), equals(selectedMembershipCardId))),
          head,
        )(membershipCards)
      : undefined,
  )

  if (loadingMember || errorMember || !member || loadingMembershipCards) {
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
        {membershipCards.map(membershipCard => (
          <div
            key={membershipCard.card.id}
            onClick={() => {
              onSelect && onSelect(membershipCard.card.id)
              setSelectedMembershipCard(membershipCard)
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

const MembershipCardItem: React.VFC<{
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

export default MultiPeriodMembershipCardSelectionModal
