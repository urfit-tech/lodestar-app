import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React from 'react'
import { useIntl } from 'react-intl'
import { issueMessages } from '../../helpers/translation'
import types from '../../types'
import { ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import IssueReplyCreationBlock from './IssueReplyCreationBlock'
import IssueReplyItem from './IssueReplyItem'

const IssueReplyCollectionBlock: React.FC<{
  programRoles: ProgramRoleProps[]
  issueId: string
}> = ({ programRoles, issueId }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, data, error, refetch } = useQuery<types.GET_ISSUE_REPLIES, types.GET_ISSUE_REPLIESVariables>(
    GET_ISSUE_REPLIES,
    { variables: { issueId } },
  )

  return (
    <>
      {loading
        ? formatMessage(issueMessages.status.loadingReply)
        : error || !data
        ? formatMessage(issueMessages.status.loadingReplyError)
        : data.issue_reply.map((value: any) => (
            <div key={value.id} className="mt-5">
              <IssueReplyItem
                programRoles={programRoles}
                issueReplyId={value.id}
                memberId={value.member_id}
                content={value.content}
                createdAt={new Date(value.created_at)}
                reactedMemberIds={value.issue_reply_reactions.map((value: any) => value.public_member.id)}
                onRefetch={() => refetch()}
              />
            </div>
          ))}
      {currentMemberId && (
        <div className="mt-5">
          <IssueReplyCreationBlock memberId={currentMemberId} issueId={issueId} onRefetch={() => refetch()} />
        </div>
      )}
    </>
  )
}

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

export default IssueReplyCollectionBlock
