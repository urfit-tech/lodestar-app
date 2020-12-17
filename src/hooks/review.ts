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
  const averageScore = data?.review_public_aggregate.aggregate?.avg?.score || 0
  const reviewCount = data?.review_public_aggregate.aggregate?.count || 0

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

export const useProductEditorIds = (targetId: string) => {
  const { loading, error, data } = useQuery<types.GET_PRODUCT_EDITOR_IDS, types.GET_PRODUCT_EDITOR_IDSVariables>(
    gql`
      query GET_PRODUCT_EDITOR_IDS($targetId: uuid!) {
        program(where: { id: { _eq: $targetId } }) {
          program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member_id
            name
          }
        }
        podcast_program(where: { id: { _eq: $targetId } }) {
          podcast_program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member_id
            name
          }
        }
      }
    `,
    {
      variables: { targetId },
    },
  )

  const productEditorIds: string[] =
    loading || error || !data
      ? []
      : [
          ...((data.program.length !== 0 && data?.program[0].program_roles.map(v => v.member_id)) || []),
          ...((data.podcast_program.length !== 0 &&
            data?.podcast_program[0].podcast_program_roles.map(v => v.member_id)) ||
            []),
        ]
  return {
    loadingProductEditorIds: loading,
    errorProductEditorIds: error,
    productEditorIds,
  }
}
