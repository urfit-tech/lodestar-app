import { useApolloClient } from '@apollo/client'
import { Divider } from '@chakra-ui/react'
import { Menu, message } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
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
import {
  getTheNextReplyNotFromAuthorOfIssue,
  Issue,
  IssueReply,
  pollUntilTheNextReplyNotFromAuthorOfIssueUpdated,
} from '../issue/issueHelper'
import MessageIssueReplyItem from './MessageIssueReplyItem'
import MessageSummaryBlock from './MessageSummaryBlock'

const MessageIssueItem: React.FC<{
  issue: Issue
  programRoles: ProgramRole[]
  onRefetch?: () => Promise<any>
}> = ({ issue, programRoles, onRefetch }) => {
  const {
    id: issueId,
    memberId,
    title,
    description,
    createdAt,
    solvedAt,
    reactedMemberIds,
    issueReplyCount,
    summary,
  } = issue
  const [qIssueId] = useQueryParam('issueId', StringParam)
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { issueReplies, refetchIssueReplies } = useIssueReply(issueId)
  const { updateIssue, deleteIssue, insertIssueReaction, deleteIssueReaction, insertIssueReply } =
    useMutateIssue(issueId)
  const { settings } = useApp()

  const apolloClient = useApolloClient()
  const conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated = () => {
    if (settings['program_issue.prompt_reply'] && onRefetch) {
      const getTargetReply = (issueReplies: IssueReply[]) =>
        getTheNextReplyNotFromAuthorOfIssue(memberId)(issueReplies)(null)
      const cond = (now: Date) => (issueReplies: IssueReply[]) =>
        !getTargetReply(issueReplies) || (getTargetReply(issueReplies)?.updatedAt ?? 0) < now
      setReplyEditorDisabled(true)
      pollUntilTheNextReplyNotFromAuthorOfIssueUpdated(apolloClient)(issueId)(cond)(onRefetch)
      setReplyEditorDisabled(false)
    }
  }

  const [replyEditorDisabled, setReplyEditorDisabled] = useState(false)

  return (
    <>
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
                conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated()
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
                          return Promise.reject(
                            message.error(formatMessage(issueMessages.form.validator.enterQuestion)),
                          )
                        }
                        return updateIssue({
                          title: title,
                          description: description,
                          solvedAt: solvedAt ? null : new Date(),
                        })
                          .then(() => {
                            onRefetch?.()
                            conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated()
                          })
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
            {({ repliesVisible, setRepliesVisible, summaryVisible, setSummaryVisible }) => (
              <>
                <MessageItemAction
                  reactedMemberIds={reactedMemberIds}
                  numReplies={issueReplyCount}
                  statusText={
                    solvedAt
                      ? formatMessage(issueMessages.dropdown.content.solved)
                      : formatMessage(issueMessages.dropdown.content.unsolved)
                  }
                  onRepliesVisible={_ => {
                    if (!repliesVisible) refetchIssueReplies?.()
                    setRepliesVisible(_)
                  }}
                  onSummaryVisible={setSummaryVisible}
                  onReact={async reacted => {
                    try {
                      reacted ? await deleteIssueReaction() : await insertIssueReaction()
                      onRefetch?.()
                    } catch {}
                  }}
                />
                {summaryVisible && <MessageSummaryBlock issueId={issueId} defaultSummary={summary} />}
                {repliesVisible && (
                  <>
                    {issueReplies.map(w => (
                      <div className="mt-5">
                        <MessageIssueReplyItem
                          key={w.id}
                          issueId={issueId}
                          issueReply={w}
                          issueReplies={issueReplies}
                          programRoles={programRoles}
                          onRefetch={refetchIssueReplies}
                        />
                      </div>
                    ))}
                    <div className="mt-5">
                      <MessageReplyCreationForm
                        issue={issue}
                        onRefetch={refetchIssueReplies}
                        onSubmit={insertIssueReply as any}
                        replyEditorDisabled={replyEditorDisabled}
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
    </>
  )
}

export default MessageIssueItem
