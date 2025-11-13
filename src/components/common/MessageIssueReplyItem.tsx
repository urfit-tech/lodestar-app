import { useApolloClient } from '@apollo/client'
import { Menu, message } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { issueMessages } from '../../helpers/translation'
import { useMutateIssueReply } from '../../hooks/issue'
import { ProgramRole } from '../../types/program'
import MessageItem from '../common/MessageItem'
import MessageItemAction from '../common/MessageItemAction'
import MessageItemContent from '../common/MessageItemContent'
import MessageItemHeader from '../common/MessageItemHeader'
import {
  getTheNextReplyNotFromAuthorOfIssue,
  IssueReply,
  pollUntilTheNextReplyNotFromAuthorOfIssueUpdated,
} from '../issue/issueHelper'

const MessageIssueReplyItem: React.FC<{
  issueId: string
  issueReply: IssueReply
  issueReplies: IssueReply[]
  programRoles: ProgramRole[]
  onRefetch?: () => Promise<any>
  setReplyEditorDisabled: (value: React.SetStateAction<boolean>) => void
}> = ({ issueId, issueReply, issueReplies, programRoles, onRefetch, setReplyEditorDisabled }) => {
  const { id: issueReplyId, memberId, createdAt, content, reactedMemberIds } = issueReply
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const { updateIssueReply, deleteIssueReply, insertIssueReplyReaction, deleteIssueReplyReaction } =
    useMutateIssueReply(issueReplyId)
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { settings } = useApp()

  const apolloClient = useApolloClient()
  const conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated = () => {
    if (settings['program_issue.prompt_reply'] && onRefetch) {
      const getTargetReply = (issueReplies: IssueReply[]) =>
        getTheNextReplyNotFromAuthorOfIssue(memberId)(issueReplies)(issueReplyId)
      const cond = (now: Date) => (issueReplies: IssueReply[]) =>
        !getTargetReply(issueReplies) || (getTargetReply(issueReplies)?.updatedAt ?? 0) < now
      pollUntilTheNextReplyNotFromAuthorOfIssueUpdated(apolloClient)(issueId)(setReplyEditorDisabled)(cond)(onRefetch)
    }
  }

  const conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueDeleted =
    (currentIssueReplies: IssueReply[]) => (issueReplyId: string) => {
      if (settings['program_issue.prompt_reply'] && onRefetch) {
        const targetReply = getTheNextReplyNotFromAuthorOfIssue(memberId)(currentIssueReplies)(issueReplyId)
        const cond = () => (issueReplies: IssueReply[]) => issueReplies.map(v => v.id).includes(targetReply?.id ?? '')
        pollUntilTheNextReplyNotFromAuthorOfIssueUpdated(apolloClient)(issueId)(setReplyEditorDisabled)(cond)(onRefetch)
      }
    }
  type MemberStylePair = {
    member_id: string
    style: string
  }
  const getStyleByMember = (memberStyleMap: MemberStylePair[]) => (memberId: string) =>
    memberStyleMap.find(v => v.member_id === memberId)?.style
  const specialMembers = JSON.parse(settings['program_issue.special_member']) as MemberStylePair[]
  const customizedStyle = ['*', memberId].map(getStyleByMember(specialMembers)).join(' ')

  return (
    <MessageItem focus={qIssueReplyId === issueReplyId}>
      <MessageItemHeader programRoles={programRoles} memberId={memberId} createdAt={createdAt} />
      <MessageItemContent
        description={content}
        onSubmit={({ description }) =>
          updateIssueReply(description.toRAW())
            .then(() => {
              onRefetch?.()
              conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated()
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
                        .then(res => {
                          conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueDeleted(issueReplies)(
                            res.data?.update_issue_reply?.returning[0].id,
                          )
                          onRefetch?.()
                        })
                        .catch(() => {})
                    }
                  >
                    {formatMessage(issueMessages.dropdown.content.delete)}
                  </Menu.Item>
                </Menu>
              )
            : undefined
        }
        customizedStyle={customizedStyle}
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

export default MessageIssueReplyItem
