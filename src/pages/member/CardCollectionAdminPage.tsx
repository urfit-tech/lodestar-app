import { SkeletonText } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import MembershipCardBlock from '../../components/common/MembershipCardBlock'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCards, useMembershipCard } from '../../hooks/card'
import { useMember } from '../../hooks/member'
import { ReactComponent as MemberCardIcon } from '../../images/membercard.svg'
import NotFoundPage from '../NotFoundPage'

const StyledContainer = styled.div`
  margin-bottom: 1.25rem;
  padding: 1.5rem;
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
`

const CardCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, enabledModules } = useApp()
  const { enrolledMembershipCards } = useEnrolledMembershipCards(currentMemberId || '')

  if (loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!enabledModules.member_card) {
    return <NotFoundPage />
  }

  return (
    <MemberAdminLayout content={{ icon: MemberCardIcon, title: formatMessage(commonMessages.content.memberCard) }}>
      <div className="row">
        {enrolledMembershipCards.map(membershipCard => (
          <div className="col-12 col-lg-6" key={membershipCard.card.id}>
            <MembershipCardAdminBlock
              cardId={membershipCard.card.id}
              memberId={currentMemberId || ''}
              updatedAt={membershipCard.updatedAt}
            />
          </div>
        ))}
      </div>
    </MemberAdminLayout>
  )
}
const MembershipCardAdminBlock: React.VFC<{
  memberId: string
  cardId: string
  updatedAt?: Date | null
}> = ({ memberId, cardId, updatedAt }) => {
  const { loadingMembershipCard, errorMembershipCard, membershipCard } = useMembershipCard(cardId)
  const { loadingMember, errorMember, member } = useMember(memberId)

  if (loadingMembershipCard || errorMembershipCard || loadingMember || errorMember || !member || !membershipCard) {
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
          date: updatedAt ? moment(updatedAt).format('YYYY/MM/DD') : '',
        }}
        title={membershipCard.title}
        description={membershipCard.description}
      />
    </StyledContainer>
  )
}

export default CardCollectionAdminPage
