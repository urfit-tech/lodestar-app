import { SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import MembershipCardAdminBlock from '../../components/membershipCard/MembershipCardAdminBlock'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCards } from '../../hooks/card'
import { ReactComponent as MemberCardIcon } from '../../images/membercard.svg'
import ForbiddenPage from '../ForbiddenPage'

const CardCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const app = useApp()
  const { enrolledMembershipCards } = useEnrolledMembershipCards(currentMemberId || '')

  if (app.loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!app.loading && !app.enabledModules.member_card) {
    return <ForbiddenPage />
  }

  return (
    <MemberAdminLayout content={{ icon: MemberCardIcon, title: formatMessage(commonMessages.content.memberCard) }}>
      <div className="row">
        {enrolledMembershipCards.map(membershipCard => (
          <div className="col-12 col-lg-6" key={membershipCard.card.id}>
            <MembershipCardAdminBlock
              cardId={membershipCard.card.id}
              updatedAt={membershipCard.updatedAt}
              startedAt={membershipCard.startedAt}
              endedAt={membershipCard.endedAt}
            />
          </div>
        ))}
      </div>
    </MemberAdminLayout>
  )
}

export default CardCollectionAdminPage
