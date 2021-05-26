import { Menu, message } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { issueMessages } from '../../helpers/translation'
import { useMutateIssueReply } from '../../hooks/issue'
import { ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemHeader from '../common/MessageItemHeader'

const MessageSuggestReplyItem: React.VFC<{
  suggestReplyId: string
  memberId: string
  content: string
  programRoles: ProgramRoleProps[]
  reactedMemberIds: string[]
  createdAt: Date
  title?: string | undefined
  onRefetch?: () => Promise<any>
}> = ({ suggestReplyId, programRoles, memberId, createdAt, content, onRefetch, reactedMemberIds }) => {
  const {
    updateIssueReply,
    deleteIssueReply,
    insertIssueReplyReaction,
    deleteIssueReplyReaction,
  } = useMutateIssueReply(suggestReplyId)
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <MessageItem>
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
                      deleteIssueReply()
                        .then(() => onRefetch?.())
                        .catch(() => {})
                    }
                  >
                    {formatMessage(issueMessages.dropdown.content.deleteReply)}
                  </Menu.Item>
                </Menu>
              )
            : undefined
        }
      >
        <MessageItemAction
          reactedMemberIds={reactedMemberIds}
          onReact={async reacted => {
            try {
              reacted ? await deleteIssueReplyReaction() : await insertIssueReplyReaction()
              onRefetch?.()
            } catch {}
          }}
        />
      </MessageItemContent>
    </MessageItem>
  )
}

export default MessageSuggestReplyItem
