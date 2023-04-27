import { gql, useQuery } from '@apollo/client'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { HTMLAttributes, useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReviewProps } from '../../types/review'
import { StyledDivider } from './ReviewCollectionBlock'
import ReviewItem from './ReviewItem'

export interface ReviewMemberItemRef {
  onRefetchReviewMemberItem: () => void
}

const ReviewMemberItemCollection: React.ForwardRefRenderFunction<
  ReviewMemberItemRef,
  HTMLAttributes<HTMLDivElement> & {
    targetId: string
    path: string
    appId: string
  }
> = ({ path, appId, targetId }, ref) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const [loading, setLoading] = useState(false)
  const { loadingReviews, memberReviews, memberPrivateContent, onRefetch, loadMoreReviews } = useReviewMemberCollection(
    path,
    appId,
    currentMemberId,
  )

  React.useImperativeHandle(ref, () => ({
    onRefetchReviewMemberItem: () => onRefetch(),
  }))

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
        {memberReviews.map(v => (
          <div key={v.id} className="review-item">
            <ReviewItem
              isLiked={v.isLiked}
              likedCount={v.reactionCount}
              id={v.id}
              memberId={v.memberId}
              score={v.score}
              title={v.title}
              content={v.content}
              createdAt={v.createdAt}
              updatedAt={v.updatedAt}
              reviewReplies={v.reviewReplies}
              privateContent={
                memberPrivateContent &&
                memberPrivateContent.length !== 0 &&
                v.memberId === memberPrivateContent[0].memberId
                  ? memberPrivateContent[0].privateContent
                  : null
              }
              targetId={targetId}
              onRefetch={onRefetch}
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

const useReviewMemberCollection = (path: string, appId: string, currentMemberId: string | null) => {
  const condition: hasura.GET_REVIEW_MEMBERVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }

  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_REVIEW_MEMBER,
    hasura.GET_REVIEW_MEMBERVariables
  >(
    gql`
      query GET_REVIEW_MEMBER(
        $condition: review_public_bool_exp
        $path: String!
        $currentMemberId: String
        $limit: Int!
      ) {
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
        review(where: { path: { _eq: $path }, member_id: { _eq: $currentMemberId } }) {
          id
          member_id
          private_content
        }
      }
    `,
    {
      variables: {
        condition,
        path,
        currentMemberId,
        limit: 5,
      },
    },
  )

  const memberReviews: (ReviewProps & { isLiked: boolean; reactionCount: number })[] =
    data?.review_public.map(v => ({
      id: v.id,
      memberId: v.member_id || null,
      score: v.score,
      title: v.title || null,
      content: v.content || null,
      createdAt: new Date(v.created_at),
      updatedAt: new Date(v.updated_at),
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

  const memberPrivateContent =
    data?.review?.map(v => ({
      memberId: v.member_id,
      privateContent: v.private_content,
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
    error,
    memberReviews,
    memberPrivateContent,
    onRefetch: refetch,
    loadMoreReviews: (data?.review_public_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default React.forwardRef(ReviewMemberItemCollection)
