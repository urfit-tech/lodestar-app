import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { issueMessages } from '../../helpers/translation'
import { useIssueReply } from '../../hooks/issue'
import { ProgramRole } from '../../types/program'
import IssueReplyCreationBlock from './IssueReplyCreationBlock'
import IssueReplyItem from './IssueReplyItem'

const IssueReplyCollectionBlock: React.FC<{
  programRoles: ProgramRole[]
  issueId: string
}> = ({ programRoles, issueId }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loadingIssueReplies, errorIssueReplies, issueReplies, refetchIssueReplies } = useIssueReply(issueId)

  return (
    <>
      {loadingIssueReplies
        ? formatMessage(issueMessages.status.loadingReply)
        : errorIssueReplies
        ? formatMessage(issueMessages.status.loadingReplyError)
        : issueReplies.map(issueReply => (
            <div key={issueReply.id} className="mt-5">
              <IssueReplyItem
                programRoles={programRoles}
                issueReplyId={issueReply.id}
                memberId={issueReply.memberId}
                content={issueReply.content}
                createdAt={new Date(issueReply.createdAt)}
                reactedMemberIds={issueReply.reactedMemberIds}
                onRefetch={() => refetchIssueReplies()}
              />
            </div>
          ))}

      {currentMemberId && (
        <div className="mt-5">
          <IssueReplyCreationBlock
            memberId={currentMemberId}
            issueId={issueId}
            onRefetch={() => refetchIssueReplies()}
          />
        </div>
      )}
    </>
  )
}

export default IssueReplyCollectionBlock
