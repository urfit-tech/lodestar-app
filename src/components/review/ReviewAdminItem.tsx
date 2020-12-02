import { useQuery } from '@apollo/react-hooks'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import types from '../../types'
import { ReviewLabelRoleProps, ReviewProps } from '../../types/review'
import { StyledDivider } from './ReviewCollectionBlock'
import ReviewItem from './ReviewItem'

const ReviewAdminItem: React.FC<{
  targetId: string
  path: string
  appId: string
}> = ({ targetId, path, appId }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { loadingReviews, reviews, labelRole, refetchReviews, loadMoreReviews } = useReviewCollection(
    path,
    appId,
    targetId,
  )

  if (loadingReviews) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonCircle size="36" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    )
  }

  return (
    <>
      {reviews.map(v => (
        <div key={v.id} className="review-item">
          <ReviewItem
            isAdmin
            id={v.id}
            memberId={v.memberId}
            score={v.score}
            title={v.title}
            content={v.content}
            privateContent={v.privateContent}
            createdAt={v.createdAt}
            updatedAt={v.updatedAt}
            reviewReplies={v.reviewReplies}
            labelRole={labelRole}
            onRefetch={refetchReviews}
          />
          <StyledDivider className="review-divider" />
        </div>
      ))}
      {loadMoreReviews && (
        <div className="text-center mt-4 load-more-reviews">
          <Button
            isLoading={loading}
            variant="outline"
            onClick={() => {
              setLoading(true)
              loadMoreReviews().finally(() => setLoading(false))
            }}
          >
            {formatMessage(commonMessages.button.loadMore)}
          </Button>
        </div>
      )}
    </>
  )
}

const useReviewCollection = (path: string, appId: string, targetId: string) => {
  const condition: types.GET_REVIEW_ADMINVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }
  const { loading, error, data, refetch, fetchMore } = useQuery<
    types.GET_REVIEW_ADMIN,
    types.GET_REVIEW_ADMINVariables
  >(
    gql`
      query GET_REVIEW_ADMIN($condition: review_bool_exp, $appId: String!, $targetId: uuid, $limit: Int!) {
        review_aggregate(where: $condition) {
          aggregate {
            count
          }
        }
        review(where: $condition, order_by: { created_at: desc }, limit: $limit) {
          id
          member_id
          score
          title
          updated_at
          created_at
          content
          private_content
          review_replies(order_by: { created_at: desc }) {
            id
            content
            created_at
            updated_at
            member {
              id
              role
            }
          }
        }
        program_role(where: { program_id: { _eq: $targetId }, member: { app_id: { _eq: $appId } } }) {
          id
          name
          member_id
        }
      }
    `,
    {
      variables: {
        condition,
        appId,
        targetId,
        limit: 5,
      },
    },
  )

  const reviews: ReviewProps[] =
    data?.review.map(v => ({
      id: v.id,
      memberId: v.member_id,
      score: v.score,
      title: v.title,
      content: v.content,
      createdAt: new Date(v.created_at),
      updatedAt: new Date(v.updated_at),
      privateContent: v.private_content,
      reviewReplies: v?.review_replies.map(v => ({
        id: v.id,
        reviewReplyMemberId: v.member?.id,
        memberRole: v.member?.role,
        content: v.content,
        createdAt: new Date(v.created_at),
        updatedAt: new Date(v.updated_at),
      })),
    })) || []

  const labelRole: ReviewLabelRoleProps[] =
    loading || error || !data
      ? []
      : data.program_role.map(v => ({
          memberId: v.member_id,
          name: v.name,
        }))

  const loadMoreReviews = () =>
    fetchMore({
      variables: {
        condition: {
          ...condition,
          created_at: { _lt: data?.review.slice(-1)[0]?.created_at },
        },
        limit: 5,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev
        }
        return Object.assign({}, prev, {
          review: [...prev.review, ...fetchMoreResult.review],
        })
      },
    })

  return {
    loadingReviews: loading,
    errorReviews: error,
    reviews,
    labelRole,
    refetchReviews: refetch,
    loadMoreReviews: (data?.review_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default ReviewAdminItem
