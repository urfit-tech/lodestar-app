import { Divider } from '@chakra-ui/react'
import { Menu, message } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { issueMessages } from '../../helpers/translation'
import { useIssueReply, useMutateIssue } from '../../hooks/issue'
import { ProgramRole } from '../../types/program'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemFooter from '../common/MessageItemFooter'
import MessageItemHeader from '../common/MessageItemHeader'
import MessageReplyCreationForm from '../common/MessageReplyCreationForm'
import MessageIssueReplyItem from './MessageIssueReplyItem'

const MessageIssueItem: React.VFC<{
  issueId: string
  memberId: string
  description: string
  issueReplyCount: number
  programRoles: ProgramRole[]
  reactedMemberIds: string[]
  createdAt: Date
  solvedAt: Date | null
  title?: string
  onRefetch?: () => Promise<any>
}> = ({
  issueId,
  programRoles,
  createdAt,
  memberId,
  title,
  description,
  onRefetch,
  solvedAt,
  reactedMemberIds,
  issueReplyCount,
}) => {
  const [qIssueId] = useQueryParam('issueId', StringParam)
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { issueReplies, refetchIssueReplies } = useIssueReply(issueId)
  const { updateIssue, deleteIssue, insertIssueReaction, deleteIssueReaction, insertIssueReply } =
    useMutateIssue(issueId)

  return (
    <MessageItem focus={!qIssueReplyId && qIssueId === issueId}>
      <MessageItemHeader programRoles={programRoles} memberId={memberId} createdAt={createdAt} />
      <MessageItemContent
        firstLayer
        title={title}
        description={description}
        onSubmit={({ title, description }) => {
          if (description.toText().trim().length === 0) {
            return Promise.reject(message.error(formatMessage(issueMessages.form.validator.enterQuestion)))
          }
          return updateIssue({ title, description: description?.toRAW() })
            .then(() => {
              onRefetch?.()
            })
            .catch(() => message.error(formatMessage(issueMessages.messageError.question)))
        }}
        renderEdit={
          memberId === currentMemberId
            ? setEditing => (
                <Menu>
                  <Menu.Item onClick={() => setEditing(true)}>
                    {formatMessage(issueMessages.dropdown.content.editQuestion)}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      window.confirm(formatMessage(issueMessages.dropdown.content.confirmMessage)) &&
                      deleteIssue()
                        .then(() => onRefetch?.())
                        .catch(() => {})
                    }
                  >
                    {formatMessage(issueMessages.dropdown.content.delete)}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      if (description.trim().length === 0) {
                        return Promise.reject(message.error(formatMessage(issueMessages.form.validator.enterQuestion)))
                      }
                      return updateIssue({
                        title: title,
                        description: description,
                        solvedAt: solvedAt ? null : new Date(),
                      })
                        .then(() => onRefetch?.())
                        .catch(() => message.error(formatMessage(issueMessages.messageError.question)))
                    }}
                  >
                    {formatMessage(issueMessages.content.markAs)}
                    {solvedAt
                      ? formatMessage(issueMessages.dropdown.content.unsolved)
                      : formatMessage(issueMessages.dropdown.content.solved)}
                  </Menu.Item>
                </Menu>
              )
            : undefined
        }
      >
        <MessageItemFooter defaultRepliesVisible={!!(qIssueReplyId && qIssueId === issueId)}>
          {({ repliesVisible, setRepliesVisible }) => (
            <>
              <MessageItemAction
                reactedMemberIds={reactedMemberIds}
                numReplies={issueReplyCount}
                statusText={
                  solvedAt
                    ? formatMessage(issueMessages.dropdown.content.solved)
                    : formatMessage(issueMessages.dropdown.content.unsolved)
                }
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
                      <MessageIssueReplyItem
                        key={w.id}
                        issueReplyId={w.id}
                        memberId={w.memberId}
                        content={w.content}
                        programRoles={programRoles}
                        reactedMemberIds={w.reactedMemberIds}
                        createdAt={w.createdAt}
                        onRefetch={() => refetchIssueReplies()}
                      />
                    </div>
                  ))}
                  <div className="mt-5">
                    <MessageReplyCreationForm
                      onSubmit={content =>
                        insertIssueReply(content)
                          .then(() => refetchIssueReplies())
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

export default MessageIssueItem
