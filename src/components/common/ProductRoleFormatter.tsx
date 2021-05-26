import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { ProductRoleName } from '../../types/general'

const ProductRoleFormatter: React.VFC<{ value: ProductRoleName }> = ({ value }) => {
  const { formatMessage } = useIntl()

  switch (value) {
    case 'owner':
      return <>{formatMessage(commonMessages.role.owner)}</>
    case 'instructor':
      return <>{formatMessage(commonMessages.role.instructor)}</>
    case 'assistant':
      return <>{formatMessage(commonMessages.role.assistant)}</>
    case 'app-owner':
      return <>{formatMessage(commonMessages.role.appOwner)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.character)}</>
  }
}

export default ProductRoleFormatter
