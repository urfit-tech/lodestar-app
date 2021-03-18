import { useQuery } from '@apollo/react-hooks'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReviewProps } from '../../types/review'
import { StyledDivider } from './ReviewCollectionBlock'
import ReviewItem from './ReviewItem'

const ReviewPublicItemCollection: React.FC<{
  targetId: string
  path: string
  appId: string
}> = ({ path, appId, targetId }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { loadingReviews, publicReviews, loadMoreReviews } = useReviewPublicCollection(path, appId)

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
      <div>
        {publicReviews.map(v => (
          <div key={v.id} className="review-item">
            <ReviewItem
              id={v.id}
              memberId={v.memberId}
              score={v.score}
              title={v.title}
              content={v.content}
              createdAt={v.createdAt}
              updatedAt={v.updatedAt}
              reviewReplies={v.reviewReplies}
              targetId={targetId}
            />
            <StyledDivider className="review-divider" />
          </div>
        ))}
      </div>
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

const useReviewPublicCollection = (path: string, appId: string) => {
  const condition: hasura.GET_REVIEW_PUBLICVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_REVIEW_PUBLIC,
    hasura.GET_REVIEW_PUBLICVariables
  >(
    gql`
      query GET_REVIEW_PUBLIC($condition: review_public_bool_exp, $limit: Int!) {
        review_public_aggregate(where: $condition) {
          aggregate {
            count
          }
        }
        review_public(where: $condition, order_by: { created_at: desc }, limit: $limit) {
          id
          member_id
          score
          title
          content
          created_at
          updated_at
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
      }
    `,
    {
      variables: {
        condition,
        limit: 5,
      },
    },
  )

  const publicReviews: ReviewProps[] =
    data?.review_public.map(v => ({
      id: v.id,
      memberId: v.member_id,
      score: v.score,
      title: v.title,
      content: v.content,
      createdAt: new Date(v.created_at),
      updatedAt: new Date(v.updated_at),
      reviewReplies: v?.review_replies.map(v => ({
        id: v.id,
        reviewReplyMemberId: v.member?.id,
        memberRole: v.member?.role,
        content: v.content,
        createdAt: new Date(v.created_at),
        updatedAt: new Date(v.updated_at),
      })),
    })) || []

  const loadMoreReviews = () =>
    fetchMore({
      variables: {
        condition: {
          ...condition,
          created_at: { _lt: data?.review_public.slice(-1)[0]?.created_at },
        },
        limit: 5,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev
        }
        return Object.assign({}, prev, {
          review_public: [...prev.review_public, ...fetchMoreResult.review_public],
        })
      },
    })

  return {
    loadingReviews: loading,
    errorReviews: error,
    publicReviews,
    onRefetch: refetch,
    loadMoreReviews: (data?.review_public_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default ReviewPublicItemCollection
