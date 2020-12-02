import { useQuery } from '@apollo/react-hooks'
import { Box, Button, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { HTMLAttributes, useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import types from '../../types'
import { ReviewLabelRoleProps, ReviewProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
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
  const {
    loadingReviews,
    memberReviews,
    memberPrivateContent,
    labelRole,
    onRefetch,
    loadMoreReviews,
  } = useReviewMemberCollection(path, appId, currentMemberId, targetId)

  React.useImperativeHandle(ref, () => ({
    onRefetchReviewMemberItem: () => onRefetch(),
  }))

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
        {memberReviews.map(v => (
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
              labelRole={labelRole}
              privateContent={
                memberPrivateContent &&
                memberPrivateContent.length !== 0 &&
                v.memberId === memberPrivateContent[0].memberId
                  ? memberPrivateContent[0].privateContent
                  : null
              }
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

const useReviewMemberCollection = (path: string, appId: string, currentMemberId: string | null, targetId: string) => {
  const condition: types.GET_REVIEW_MEMBERVariables['condition'] = {
    path: { _eq: path },
    app_id: { _eq: appId },
  }

  const { loading, error, data, refetch, fetchMore } = useQuery<
    types.GET_REVIEW_MEMBER,
    types.GET_REVIEW_MEMBERVariables
  >(
    gql`
      query GET_REVIEW_MEMBER(
        $condition: review_public_bool_exp
        $path: String!
        $currentMemberId: String
        $targetId: uuid
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
        path,
        currentMemberId,
        targetId,
        limit: 5,
      },
    },
  )

  const memberReviews: ReviewProps[] =
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

  const memberPrivateContent =
    loading || error || !data
      ? null
      : data.review.map(v => ({
          memberId: v.member_id,
          privateContent: v.private_content,
        }))

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
    error,
    memberReviews,
    memberPrivateContent,
    labelRole,
    onRefetch: refetch,
    loadMoreReviews: (data?.review_public_aggregate.aggregate?.count || 0) > 5 ? loadMoreReviews : undefined,
  }
}

export default React.forwardRef(ReviewMemberItemCollection)
