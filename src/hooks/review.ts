import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import types from '../types'

export const useReviewAggregate = (path: string) => {
  const { loading, error, data, refetch } = useQuery<types.GET_REVIEW_AGGREGATE, types.GET_REVIEW_AGGREGATEVariables>(
    gql`
      query GET_REVIEW_AGGREGATE($path: String) {
        review_public_aggregate(where: { path: { _eq: $path } }) {
          aggregate {
            avg {
              score
            }
            count
          }
        }
      }
    `,
    {
      variables: {
        path,
      },
    },
  )
  const averageScore = loading || error || !data ? null : data.review_public_aggregate.aggregate?.avg?.score || 0
  const reviewCount = loading || error || !data ? null : data.review_public_aggregate.aggregate?.count || 0

  return {
    loadingReviewAggregate: loading,
    errorReviewAggregate: error,
    averageScore,
    reviewCount,
    refetchReviewAggregate: refetch,
  }
}

export const useMutateReviewReply = () => {
  const [updateReviewReply] = useMutation<types.UPDATE_REVIEW_REPLY, types.UPDATE_REVIEW_REPLYVariables>(
    gql`
      mutation UPDATE_REVIEW_REPLY(
        $id: uuid!
        $memberId: String
        $content: String
        $appId: String!
        $updateAt: timestamptz
      ) {
        update_review_reply(
          where: { id: { _eq: $id }, member_id: { _eq: $memberId }, member: { app_id: { _eq: $appId } } }
          _set: { content: $content, updated_at: $updateAt }
        ) {
          affected_rows
        }
      }
    `,
  )

  const [deleteReviewReply] = useMutation<types.DELETE_REVIEW_REPLY, types.DELETE_REVIEW_REPLYVariables>(
    gql`
      mutation DELETE_REVIEW_REPLY($id: uuid!, $memberId: String, $appId: String) {
        delete_review_reply(
          where: { id: { _eq: $id }, member_id: { _eq: $memberId }, member: { app_id: { _eq: $appId } } }
        ) {
          affected_rows
        }
      }
    `,
  )

  return { updateReviewReply, deleteReviewReply }
}
