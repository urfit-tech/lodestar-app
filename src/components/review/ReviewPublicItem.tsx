import { useQuery } from '@apollo/react-hooks'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'
import { commonMessages } from '../../helpers/translation'
import types from '../../types'
import { ReviewLabelRoleProps, ReviewProps } from '../../types/review'
import { StyledDivider } from './ReviewCollectionBlock'
import ReviewItem from './ReviewItem'

const ReviewPublicItem: React.FC<{
  targetId: string
  path: string
  appId: string
}> = ({ path, appId, targetId }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { loadingReviews, publicReviews, labelRole, loadMoreReviews } = useReviewPublicCollection(path, appId, targetId)

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
      {publicReviews.map((v: ReviewProps) => (
        <div key={uuid()} className="review-item">
          <ReviewItem
            key={v.id}
            id={v.id}
            memberId={v.memberId}
            score={v.score}
            title={v.title}
            content={v.content}
            createdAt={v.createdAt}
            updatedAt={v.updatedAt}
            reviewReplies={v.reviewReplies}
            labelRole={labelRole}
          />
          <StyledDivider className="review-divider" />
        </div>
      ))}
      {!loadingReviews && loadMoreReviews && (
        <div className="text-center mt-4">
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

const useReviewPublicCollection = (path: string, appId: string, targetId: string) => {
  const condition: types.GET_REVIEW_PUBLICVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }
  const { loading, error, data, refetch, fetchMore } = useQuery<
    types.GET_REVIEW_PUBLIC,
    types.GET_REVIEW_PUBLICVariables
  >(
    gql`
      query GET_REVIEW_PUBLIC($condition: review_public_bool_exp, $targetId: uuid, $limit: Int!) {
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
        program_role(where: { program_id: { _eq: $targetId } }) {
          id
          name
          member_id
        }
      }
    `,
    {
      variables: {
        condition,
        targetId,
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
    labelRole,
    onRefetch: refetch,
    loadMoreReviews: (data?.review_public_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default ReviewPublicItem
