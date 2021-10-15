import { Divider } from '@chakra-ui/react'
import { Menu, message } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { issueMessages } from '../../helpers/translation'
import { useIssueReply, useMutateIssue } from '../../hooks/issue'
import { ProgramRole } from '../../types/program'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemFooter from '../common/MessageItemFooter'
import MessageItemHeader from '../common/MessageItemHeader'
import MessageReplyCreationForm from '../common/MessageReplyCreationForm'
import MessageSuggestReplyItem from './MessageSuggestReplyItem'

const messages = defineMessages({
  editSuggestion: { id: 'program.ui.editSuggestion', defaultMessage: '編輯建議' },
  deleteSuggestion: { id: 'program.ui.deleteSuggestion', defaultMessage: '刪除建議' },
})

const MessageSuggestItem: React.VFC<{
  suggestId: string
  memberId: string
  description: string
  suggestReplyCount: number
  programRoles: Pick<ProgramRole, 'id' | 'name' | 'memberId'>[]
  reactedMemberIds: string[]
  createdAt: Date
  title?: string
  onRefetch?: () => Promise<any>
}> = ({
  suggestId,
  programRoles,
  createdAt,
  memberId,
  description,
  onRefetch,
  reactedMemberIds,
  suggestReplyCount,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { issueReplies, refetchIssueReplies } = useIssueReply(suggestId)
  const { updateIssue, deleteIssue, insertIssueReaction, deleteIssueReaction, insertIssueReply } =
    useMutateIssue(suggestId)

  return (
    <MessageItem>
      <MessageItemHeader programRoles={programRoles} memberId={memberId} createdAt={createdAt} />
      <MessageItemContent
        firstLayer
        description={description}
        onSubmit={({ description }) => {
          return updateIssue({ title: '', description: description?.toRAW() })
            .then(() => {
              onRefetch?.()
            })
            .catch(() => message.error(formatMessage(issueMessages.messageError.question)))
        }}
        renderEdit={
          memberId === currentMemberId
            ? setEditing => (
                <Menu>
                  <Menu.Item onClick={() => setEditing(true)}>{formatMessage(messages.editSuggestion)}</Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      window.confirm(formatMessage(issueMessages.dropdown.content.confirmMessage)) &&
                      deleteIssue()
                        .then(() => onRefetch?.())
                        .catch(() => {})
                    }
                  >
                    {formatMessage(messages.deleteSuggestion)}
                  </Menu.Item>
                </Menu>
              )
            : undefined
        }
      >
        <MessageItemFooter>
          {({ repliesVisible, setRepliesVisible }) => (
            <>
              <MessageItemAction
                reactedMemberIds={reactedMemberIds}
                numReplies={suggestReplyCount}
                onRepliesVisible={setRepliesVisible}
                onReact={async reacted => {
                  try {
                    reacted ? await deleteIssueReaction() : await insertIssueReaction()
                    onRefetch?.()
                  } catch {}
                }}
              />
              {repliesVisible && (
                <>
                  {issueReplies.map(w => (
                    <div className="mt-5">
                      <MessageSuggestReplyItem
                        key={w.id}
                        suggestReplyId={w.id}
                        memberId={w.memberId}
                        content={w.content}
                        programRoles={programRoles}
                        reactedMemberIds={w.reactedMemberIds}
                        createdAt={w.createdAt}
                        onRefetch={() => refetchIssueReplies().then(() => onRefetch?.())}
                      />
                    </div>
                  ))}
                  <div className="mt-5">
                    <MessageReplyCreationForm
                      onSubmit={content =>
                        insertIssueReply(content)
                          .then(() => refetchIssueReplies().then(() => onRefetch?.()))
                          .catch(() => {})
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </MessageItemFooter>
      </MessageItemContent>
      <Divider className="my-4" />
    </MessageItem>
  )
}

export default MessageSuggestItem
