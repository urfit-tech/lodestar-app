import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, helperMessages } from '../../helpers/translation'

export const UserRoleName: React.VFC<{ userRole?: string }> = ({ userRole }) => {
  const { formatMessage } = useIntl()

  switch (userRole) {
    case 'anonymous':
      return <>{formatMessage(helperMessages.role.anonymous)}</>
    case 'general-member':
      return <>{formatMessage(helperMessages.role.generalMember)}</>
    case 'content-creator':
      return <>{formatMessage(helperMessages.role.contentCreator)}</>
    case 'app-owner':
      return <>{formatMessage(helperMessages.role.appOwner)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.identity)}</>
  }
}

export default UserRoleName
