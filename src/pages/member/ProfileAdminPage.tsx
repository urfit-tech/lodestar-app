import { Icon } from '@chakra-ui/icons'
import { Typography } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
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
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={UserIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.content.personalSettings)}</span>
      </Typography.Title>

      <div className="mb-3">{currentMemberId && <ProfileBasicAdminCard memberId={currentMemberId} />}</div>
      <div className="mb-3">{currentMemberId && <ProfileAccountAdminCard memberId={currentMemberId} />}</div>
      <div className="mb-3">{currentMemberId && <ProfilePasswordAdminCard memberId={currentMemberId} />}</div>
    </MemberAdminLayout>
  )
}

export default ProfileAdminPage
