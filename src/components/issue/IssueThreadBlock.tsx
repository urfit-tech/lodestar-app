import { Spinner } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { useIssue } from '../../hooks/issue'
import { ProgramRole } from '../../types/program'
import MessageIssueItem from '../common/MessageIssueItem'
import IssueCreationModal from './IssueCreationModal'

const IssueThreadBlock: React.FC<{
  threadId: string
  programRoles: ProgramRole[]
}> = ({ threadId, programRoles }) => {
  const { formatMessage } = useIntl()
  const { loadingIssues, errorIssues, issues, refetchIssues } = useIssue(threadId)

  if (loadingIssues) {
    return <Spinner />
  }

  if (errorIssues) {
    return <div>{formatMessage(commonMessages.status.loadingQuestionError)}</div>
  }

  return (
    <div>
      <IssueCreationModal threadId={threadId} onRefetch={() => refetchIssues()} />
      {issues.map(v => (
        <MessageIssueItem key={v.id} issue={v} programRoles={programRoles} onRefetch={() => refetchIssues()} />
      ))}
    </div>
  )
}

export default IssueThreadBlock
