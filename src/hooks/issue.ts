import { useMutation, useQuery } from '@apollo/react-hooks'
import { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import hasura from '../hasura'

const useIssue = (threadId: string) => {
  const { id: appId } = useApp()
  const { loading, error, data, refetch } = useQuery<hasura.GET_ISSUE_THREAD, hasura.GET_ISSUE_THREADVariables>(
    GET_ISSUE_THREAD,
    {
      variables: {
        appId,
        threadId,
      },
    },
  )

  const issues: {
    id: string
    title: string
    description: string
    memberId: string
    createdAt: Date
    solvedAt: Date | null
    reactedMemberIds: string[]
    issueReplyCount: number
  }[] =
    loading || error || !data
      ? []
      : data.issue.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          memberId: v.member_id,
          createdAt: new Date(v.created_at),
          solvedAt: v.solved_at ? new Date(v.solved_at) : null,
          reactedMemberIds: v.issue_reactions.map(w => w.member_id),
          issueReplyCount: v.issue_replies_aggregate?.aggregate?.count || 0,
        }))

  return {
    loadingIssues: loading,
    errorIssues: error,
    issues,
    refetchIssues: refetch,
  }
}

const useMutateIssue = (issueId: string) => {
  const { currentMemberId } = useAuth()
  const [updateIssueHandler] = useMutation<hasura.UPDATE_ISSUE, hasura.UPDATE_ISSUEVariables>(UPDATE_ISSUE)
  const [deleteIssueHandler] = useMutation<hasura.DELETE_ISSUE, hasura.DELETE_ISSUEVariables>(DELETE_ISSUE)
  const [insertIssueReactionHandler] = useMutation<hasura.INSERT_ISSUE_REACTION, hasura.INSERT_ISSUE_REACTIONVariables>(
    INSERT_ISSUE_REACTION,
  )
  const [deleteIssueReactionHandler] = useMutation<hasura.DELETE_ISSUE_REACTION, hasura.DELETE_ISSUE_REACTIONVariables>(
    DELETE_ISSUE_REACTION,
  )
  const [insertIssueReplyHandler] = useMutation<hasura.INSERT_ISSUE_REPLY, hasura.INSERT_ISSUE_REPLYVariables>(
    INSERT_ISSUE_REPLY,
  )

  const updateIssue = (options?: { title?: string; description?: string; solvedAt?: Date | null }) => {
    return updateIssueHandler({
      variables: {
        issueId,
        solvedAt: options?.solvedAt,
        title: options?.title,
        description: options?.description,
      },
    })
  }

  const deleteIssue = () => {
    return deleteIssueHandler({
      variables: { issueId },
    })
  }

  const insertIssueReaction = () => {
    return insertIssueReactionHandler({
      variables: { issueId, memberId: currentMemberId || '' },
    })
  }

  const deleteIssueReaction = () => {
    return deleteIssueReactionHandler({
      variables: { issueId, memberId: currentMemberId || '' },
    })
  }

  const insertIssueReply = (content: any) => {
    return insertIssueReplyHandler({
      variables: {
        memberId: currentMemberId || '',
        issueId,
        content,
      },
    })
  }

  return {
    updateIssue,
    deleteIssue,
    insertIssueReaction,
    deleteIssueReaction,
    insertIssueReply,
  }
}

const useIssueReply = (issueId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_ISSUE_REPLIES, hasura.GET_ISSUE_REPLIESVariables>(
    GET_ISSUE_REPLIES,
    { variables: { issueId } },
  )

  const issueReplies: {
    id: string
    memberId: string
    content: EditorState
    createdAt: Date
    reactedMemberIds: string[]
  }[] =
    data?.issue_reply.map(v => ({
      id: v.id,
      memberId: v.member_id,
      content: v.content,
      createdAt: v.created_at,
      reactedMemberIds: v.issue_reply_reactions.map(w => w.public_member?.id || ''),
    })) || []

  return {
    loadingIssueReplies: loading,
    errorIssueReplies: error,
    issueReplies,
    refetchIssueReplies: refetch,
  }
}

const useMutateIssueReply = (issueReplyId: string) => {
  const { currentMemberId } = useAuth()
  const [updateIssueReplyHandler] = useMutation<hasura.UPDATE_ISSUE_REPLY, hasura.UPDATE_ISSUE_REPLYVariables>(
    UPDATE_ISSUE_REPLY,
  )
  const [deleteIssueReplyHandler] = useMutation<hasura.DELETE_ISSUE_REPLY, hasura.DELETE_ISSUE_REPLYVariables>(
    DELETE_ISSUE_REPLY,
  )
  const [insertIssueReplyReactionHandler] = useMutation<
    hasura.INSERT_ISSUE_REPLY_REACTION,
    hasura.INSERT_ISSUE_REPLY_REACTIONVariables
  >(INSERT_ISSUE_REPLY_REACTION)
  const [deleteIssueReplyReactionHandler] = useMutation<
    hasura.DELETE_ISSUE_REPLY_REACTION,
    hasura.DELETE_ISSUE_REPLY_REACTIONVariables
  >(DELETE_ISSUE_REPLY_REACTION)

  const updateIssueReply = (content: any) => {
    return updateIssueReplyHandler({
      variables: { issueReplyId, content },
    })
  }
  const deleteIssueReply = () => {
    return deleteIssueReplyHandler({ variables: { issueReplyId } })
  }
  const insertIssueReplyReaction = () => {
    return insertIssueReplyReactionHandler({
      variables: { issueReplyId, memberId: currentMemberId || '' },
    })
  }
  const deleteIssueReplyReaction = () => {
    return deleteIssueReplyReactionHandler({
      variables: { issueReplyId, memberId: currentMemberId || '' },
    })
  }

  return {
    updateIssueReply,
    deleteIssueReply,
    insertIssueReplyReaction,
    deleteIssueReplyReaction,
  }
}

const GET_ISSUE_THREAD = gql`
  query GET_ISSUE_THREAD($appId: String!, $threadId: String!) {
    issue(
      where: { app_id: { _eq: $appId }, thread_id: { _eq: $threadId } }
      order_by: [
        { created_at: desc }
        # { issue_reactions_aggregate: { count: desc } }
      ]
    ) {
      id
      title
      description
      solved_at
      created_at
      member_id
      issue_reactions {
        member_id
      }
      issue_replies_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

const UPDATE_ISSUE = gql`
  mutation UPDATE_ISSUE($issueId: uuid!, $title: String, $description: String, $solvedAt: timestamptz) {
    update_issue(
      where: { id: { _eq: $issueId } }
      _set: { title: $title, description: $description, solved_at: $solvedAt }
    ) {
      affected_rows
    }
  }
`

const DELETE_ISSUE = gql`
  mutation DELETE_ISSUE($issueId: uuid!) {
    delete_issue_reply_reaction(where: { issue_reply: { issue_id: { _eq: $issueId } } }) {
      affected_rows
    }
    delete_issue_reply(where: { issue_id: { _eq: $issueId } }) {
      affected_rows
    }
    delete_issue_reaction(where: { issue_id: { _eq: $issueId } }) {
      affected_rows
    }
    delete_issue(where: { id: { _eq: $issueId } }) {
      affected_rows
    }
  }
`

const INSERT_ISSUE_REACTION = gql`
  mutation INSERT_ISSUE_REACTION($memberId: String!, $issueId: uuid!) {
    insert_issue_reaction(objects: { member_id: $memberId, issue_id: $issueId }) {
      affected_rows
    }
  }
`

const DELETE_ISSUE_REACTION = gql`
  mutation DELETE_ISSUE_REACTION($memberId: String!, $issueId: uuid!) {
    delete_issue_reaction(where: { member_id: { _eq: $memberId }, issue_id: { _eq: $issueId } }) {
      affected_rows
    }
  }
`

const GET_ISSUE_REPLIES = gql`
  query GET_ISSUE_REPLIES($issueId: uuid!) {
    issue_reply(where: { issue_id: { _eq: $issueId } }, order_by: [{ created_at: asc }]) {
      id
      content
      created_at
      member_id
      issue_reply_reactions {
        public_member {
          id
          name
        }
      }
    }
  }
`

const INSERT_ISSUE_REPLY_REACTION = gql`
  mutation INSERT_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {
    insert_issue_reply_reaction(objects: { member_id: $memberId, issue_reply_id: $issueReplyId }) {
      affected_rows
    }
  }
`

const DELETE_ISSUE_REPLY_REACTION = gql`
  mutation DELETE_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {
    delete_issue_reply_reaction(where: { member_id: { _eq: $memberId }, issue_reply_id: { _eq: $issueReplyId } }) {
      affected_rows
    }
  }
`

const INSERT_ISSUE_REPLY = gql`
  mutation INSERT_ISSUE_REPLY($memberId: String!, $issueId: uuid!, $content: String) {
    insert_issue_reply(objects: { member_id: $memberId, issue_id: $issueId, content: $content }) {
      affected_rows
    }
  }
`

const UPDATE_ISSUE_REPLY = gql`
  mutation UPDATE_ISSUE_REPLY($issueReplyId: uuid!, $content: String) {
    update_issue_reply(where: { id: { _eq: $issueReplyId } }, _set: { content: $content }) {
      affected_rows
    }
  }
`

const DELETE_ISSUE_REPLY = gql`
  mutation DELETE_ISSUE_REPLY($issueReplyId: uuid!) {
    delete_issue_reply_reaction(where: { issue_reply_id: { _eq: $issueReplyId } }) {
      affected_rows
    }
    delete_issue_reply(where: { id: { _eq: $issueReplyId } }) {
      affected_rows
    }
  }
`

export { useIssue, useMutateIssue, useIssueReply, useMutateIssueReply }
