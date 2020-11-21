import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { ProgramRoleName } from '../../types/program'

const ProgramRoleFormatter: React.FC<{ value: ProgramRoleName }> = ({ value }) => {
  const { formatMessage } = useIntl()

  switch (value) {
    case 'owner':
      return <>{formatMessage(commonMessages.role.owner)}</>
    case 'instructor':
      return <>{formatMessage(commonMessages.role.instructor)}</>
    case 'assistant':
      return <>{formatMessage(commonMessages.role.assistant)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.character)}</>
  }
}

export default ProgramRoleFormatter
