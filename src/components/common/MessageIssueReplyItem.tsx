import { Menu, message } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { issueMessages } from '../../helpers/translation'
import { useMutateIssueReply } from '../../hooks/issue'
import { ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemHeader from '../common/MessageItemHeader'

const MessageIssueReplyItem: React.FC<{
  issueReplyId: string
  memberId: string
  content: string
  programRoles: ProgramRoleProps[]
  reactedMemberIds: string[]
  createdAt: Date
  title?: string | undefined
  onRefetch?: () => Promise<any>
}> = ({ issueReplyId, programRoles, memberId, createdAt, content, onRefetch, reactedMemberIds }) => {
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const {
    updateIssueReply,
    deleteIssueReply,
    insertIssueReplyReaction,
    deleteIssueReplyReaction,
  } = useMutateIssueReply(issueReplyId)
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <MessageItem focus={qIssueReplyId === issueReplyId}>
      <MessageItemHeader programRoles={programRoles} memberId={memberId} createdAt={createdAt} />
      <MessageItemContent
        description={content}
        onSubmit={({ description }) =>
          updateIssueReply(description.toRAW())
            .then(() => {
              onRefetch?.()
            })
            .catch(() => message.error(formatMessage(issueMessages.messageError.update)))
        }
        renderEdit={
          memberId === currentMemberId
            ? setEdition => (
                <Menu>
                  <Menu.Item onClick={() => setEdition(true)}>
                    {formatMessage(issueMessages.dropdown.content.edit)}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      window.confirm(formatMessage(issueMessages.dropdown.content.unrecoverable)) &&
                      deleteIssueReply().then(() => onRefetch?.())
                    }
                  >
                    {formatMessage(issueMessages.dropdown.content.delete)}
                  </Menu.Item>
                </Menu>
              )
            : undefined
        }
      >
        <MessageItemAction
          reactedMemberIds={reactedMemberIds}
          onReact={async reacted => {
            reacted ? await deleteIssueReplyReaction() : await insertIssueReplyReaction()
            onRefetch?.()
          }}
        />
      </MessageItemContent>
    </MessageItem>
  )
}

export default MessageIssueReplyItem
