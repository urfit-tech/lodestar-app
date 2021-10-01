import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import ProfileAccountAdminCard from '../../components/profile/ProfileAccountAdminCard'
import ProfileBasicAdminCard from '../../components/profile/ProfileBasicAdminCard'
import ProfilePasswordAdminCard from '../../components/profile/ProfilePasswordAdminCard'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as UserIcon } from '../../images/user.svg'

const ProfileAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <MemberAdminLayout content={{ icon: UserIcon, title: formatMessage(commonMessages.content.personalSettings) }}>
      <div className="mb-3">{currentMemberId && <ProfileBasicAdminCard memberId={currentMemberId} />}</div>
      <div className="mb-3">{currentMemberId && <ProfileAccountAdminCard memberId={currentMemberId} />}</div>
      <div className="mb-3">{currentMemberId && <ProfilePasswordAdminCard memberId={currentMemberId} />}</div>
    </MemberAdminLayout>
  )
}

export default ProfileAdminPage
