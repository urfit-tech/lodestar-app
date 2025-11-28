import { ApolloClient } from '@apollo/client'
import hasura from '../../hasura'
import { polling, PollingStatus } from '../../helpers'
import { adaptIssueReplyDTO, GET_ISSUE_REPLIES, useIssue, useIssueReply } from '../../hooks/issue'

export type Issues = ReturnType<typeof useIssue>['issues']
export type Issue = Issues[number]
export type IssueReplies = ReturnType<typeof useIssueReply>['issueReplies']
export type IssueReply = IssueReplies[number]

export const getTheNextReplyNotFromAuthorOfIssue: (
  authorId: string,
) => (issueReplies: IssueReplies) => (referenceReplyId: string | undefined | null) => IssueReply | undefined =
  authorId => issueReplies => referenceReplyId =>
    referenceReplyId
      ? issueReplies.find(
          (issueReply, index) =>
            issueReply.memberId !== authorId && index > issueReplies.findIndex(reply => reply.id === referenceReplyId),
        )
      : issueReplies.find((issueReply, index) => issueReply.memberId !== authorId && index >= 0)

export type RefetchIssues = ReturnType<typeof useIssue>['refetchIssues']
export type RefetchIssueReply = ReturnType<typeof useIssueReply>['refetchIssueReplies']

export const pollUntilTheNextReplyNotFromAuthorOfIssueUpdated: (
  apolloClient: ApolloClient<object>,
) => (
  issueId: string,
) => (
  setPollingStatus?: (value: React.SetStateAction<PollingStatus>) => void,
) => (
  cond: (now: Date) => (issueReplies: IssueReply[]) => boolean,
) => (refetch: RefetchIssues | RefetchIssueReply) => void =
  apolloClient => issueId => setPollingStatus => cond => async refetch =>
    polling(1000)(
      async () =>
        await apolloClient.query<hasura.GET_ISSUE_REPLIES, hasura.GET_ISSUE_REPLIESVariables>({
          query: GET_ISSUE_REPLIES,
          variables: { issueId },
          fetchPolicy: 'no-cache',
        }),
    )({
      prepareForPolling: () => {
        console.log('Polling starts.')
        setPollingStatus?.('START')
        return { now: new Date(), pollingTime: 1 }
      },
      onSuccess: ({ result, preparation, polling }) => {
        const fetchedIssueReplies = result?.data?.issue_reply.map(adaptIssueReplyDTO) ?? []
        if (!cond(preparation.now)(fetchedIssueReplies)) {
          refetch()
          clearInterval(polling)
          setPollingStatus?.('END')
          console.log('Polling ends.')
          setPollingStatus?.('NONE')
        }
      },
    })
