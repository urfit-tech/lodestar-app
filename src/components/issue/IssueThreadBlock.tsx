import { Divider, Spinner } from '@chakra-ui/react'
import { Menu, message } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { useIssue, useIssueReply, useMutateIssue, useMutateIssueReply } from '../../hooks/issue'
import { ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemIssueFooter from '../common/MessageItemFooter'
import MessageItemHeader from '../common/MessageItemHeader'
import MessageReplyCreationForm from '../common/MessageReplyCreationForm'

const IssueThreadBlock: React.FC<{
  threadId: string
  programRoles: ProgramRoleProps[]
}> = ({ threadId, programRoles }) => {
  const { formatMessage } = useIntl()
  const [qIssueId] = useQueryParam('issueId', StringParam)
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const { loadingIssues, errorIssues, issues, refetchIssues } = useIssue(threadId)

  const { currentMemberId } = useAuth()

  if (loadingIssues) {
    return <Spinner />
  }

  if (errorIssues) {
    return <div>{formatMessage(commonMessages.status.loadingQuestionError)}</div>
  }

  return (
    <div>
      {issues.map(v => {
        const { issueReplies, refetchIssueReplies } = useIssueReply(v.id)
        const { updateIssue, deleteIssue, insertIssueReaction, deleteIssueReaction, insertIssueReply } = useMutateIssue(
          v.id,
        )

        return (
          <div key={v.id}>
            <MessageItem focus={!qIssueReplyId && qIssueId === v.id}>
              <MessageItemHeader programRoles={programRoles} createdAt={v.createdAt} memberId={v.memberId} />
              <MessageItemContent
                title={v.title}
                description={v.description}
                onSubmit={({ title, description }) => {
                  return updateIssue({ title, description: description?.toRAW() })
                    .then(() => {
                      refetchIssues()
                    })
                    .catch(() => message.error(formatMessage(issueMessages.messageError.question)))
                }}
                renderEdit={
                  v.memberId === currentMemberId
                    ? setEditing => (
                        <Menu>
                          <Menu.Item onClick={() => setEditing(true)}>
                            {formatMessage(issueMessages.dropdown.content.editQuestion)}
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              window.confirm(formatMessage(issueMessages.dropdown.content.confirmMessage)) &&
                              deleteIssue().then(() => refetchIssues())
                            }
                          >
                            {formatMessage(issueMessages.dropdown.content.delete)}
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              updateIssue({
                                title: v.title,
                                description: v.description,
                                solvedAt: v.solvedAt ? null : new Date(),
                              }).then(() => refetchIssues())
                            }
                          >
                            {formatMessage(issueMessages.content.markAs)}
                            {v.solvedAt
                              ? formatMessage(issueMessages.dropdown.content.unsolved)
                              : formatMessage(issueMessages.dropdown.content.solved)}
                          </Menu.Item>
                        </Menu>
                      )
                    : undefined
                }
              >
                <MessageItemIssueFooter defaultRepliesVisible={(qIssueReplyId && qIssueId === v.id) || false}>
                  {({ repliesVisible, setRepliesVisible }) => (
                    <>
                      <MessageItemAction
                        reactedMemberIds={v.reactedMemberIds}
                        numReplies={v.issueReplyCount}
                        statusText={
                          v.solvedAt
                            ? formatMessage(issueMessages.dropdown.content.solved)
                            : formatMessage(issueMessages.dropdown.content.unsolved)
                        }
                        onRepliesVisible={setRepliesVisible}
                        onReact={async reacted => {
                          reacted ? await deleteIssueReaction() : await insertIssueReaction()
                          refetchIssues()
                        }}
                      />
                      {repliesVisible && (
                        <>
                          {issueReplies.map(w => {
                            const {
                              updateIssueReply,
                              deleteIssueReply,
                              insertIssueReplyReaction,
                              deleteIssueReplyReaction,
                            } = useMutateIssueReply(w.id)
                            return (
                              <div key={w.id} className="mt-5">
                                <MessageItem focus={qIssueReplyId === w.id}>
                                  <MessageItemHeader
                                    programRoles={programRoles}
                                    memberId={w.memberId}
                                    createdAt={w.createdAt}
                                  />
                                  <MessageItemContent
                                    description={w.content}
                                    onSubmit={({ description }) =>
                                      updateIssueReply(description.toRAW())
                                        .then(() => {
                                          refetchIssueReplies()
                                        })
                                        .catch(() => message.error(formatMessage(issueMessages.messageError.update)))
                                    }
                                    renderEdit={
                                      w.memberId === currentMemberId
                                        ? setEdition => (
                                            <Menu>
                                              <Menu.Item onClick={() => setEdition(true)}>
                                                {formatMessage(issueMessages.dropdown.content.edit)}
                                              </Menu.Item>
                                              <Menu.Item
                                                onClick={() =>
                                                  window.confirm(
                                                    formatMessage(issueMessages.dropdown.content.unrecoverable),
                                                  ) && deleteIssueReply().then(() => refetchIssueReplies())
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
                                      reactedMemberIds={w.reactedMemberIds}
                                      onReact={async reacted => {
                                        reacted ? await deleteIssueReplyReaction() : await insertIssueReplyReaction()
                                        refetchIssueReplies()
                                      }}
                                    />
                                  </MessageItemContent>
                                </MessageItem>
                              </div>
                            )
                          })}
                          <div className="mt-5">
                            <MessageReplyCreationForm onSubmit={content => insertIssueReply(content)} />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </MessageItemIssueFooter>
              </MessageItemContent>
            </MessageItem>
            <Divider className="my-4" />
          </div>
        )
      })}
    </div>
  )
}

export default IssueThreadBlock
