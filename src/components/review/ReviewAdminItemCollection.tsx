import { gql, useQuery } from '@apollo/client'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReviewProps } from '../../types/review'
import { StyledDivider } from './ReviewCollectionBlock'
import ReviewItem from './ReviewItem'

const ReviewAdminItemCollection: React.FC<{
  targetId: string
  path: string
  appId: string
}> = ({ targetId, path, appId }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { currentMemberId } = useAuth()
  const { loadingReviews, reviews, refetchReviews, loadMoreReviews } = useReviewCollection(path, appId, currentMemberId)

  if (loadingReviews) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonCircle size="36" />
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </Box>
    )
  }

  return (
    <>
      <div>
        {reviews.map(v => (
          <div key={v.id} className="review-item">
            <ReviewItem
              isLiked={v.isLiked}
              likedCount={v.reactionCount}
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
              onRefetch={refetchReviews}
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

const useReviewCollection = (path: string, appId: string, currentMemberId: string | null) => {
  const condition: hasura.GET_REVIEW_ADMINVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_REVIEW_ADMIN,
    hasura.GET_REVIEW_ADMINVariables
  >(
    gql`
      query GET_REVIEW_ADMIN($condition: review_bool_exp, $currentMemberId: String!, $limit: Int!) {
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
          review_reactions(where: { member_id: { _eq: $currentMemberId } }) {
            id
            member_id
          }
          review_reactions_aggregate {
            aggregate {
              count
            }
          }
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
        currentMemberId: currentMemberId || '',
      },
    },
  )

  const reviews: (ReviewProps & {
    isLiked: boolean
    reactionCount: number
  })[] =
    data?.review.map(v => ({
      id: v.id,
      memberId: v.member_id,
      score: v.score,
      title: v.title,
      content: v.content || null,
      createdAt: new Date(v.created_at),
      updatedAt: new Date(v.updated_at),
      privateContent: v.private_content,
      isLiked: v.review_reactions?.[0]?.member_id === currentMemberId,
      reactionCount: v.review_reactions_aggregate.aggregate?.count || 0,
      reviewReplies: v?.review_replies.map(v => ({
        id: v.id,
        reviewReplyMemberId: v.member?.id,
        memberRole: v.member?.role,
        content: v.content || null,
        createdAt: new Date(v.created_at),
        updatedAt: new Date(v.updated_at),
      })),
    })) || []

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
    refetchReviews: refetch,
    loadMoreReviews: (data?.review_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default ReviewAdminItemCollection
