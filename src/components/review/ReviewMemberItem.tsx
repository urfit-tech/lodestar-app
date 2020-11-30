import { useQuery } from '@apollo/react-hooks'
import { Button, Divider } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { HTMLAttributes, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'
import { commonMessages } from '../../helpers/translation'
import types from '../../types'
import { ReviewLabelRoleProps, ReviewProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
import ReviewItem from './ReviewItem'

export interface ReviewMemberItemRef {
  onReviewMemberItemRefetch: () => void
}

const ReviewMemberItem: React.ForwardRefRenderFunction<
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
    onReviewMemberItemRefetch: () => onRefetch(),
  }))

  return (
    <>
      {memberReviews.map((v: ReviewProps) => {
        return (
          <div key={uuid()} className="review-item">
            <ReviewItem
              key={uuid()}
              reviewId={v.reviewId}
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
            <Divider
              className="review-divider"
              css={{ margin: '24px 0', height: '1px', background: '#ececec', borderStyle: 'none', opacity: 1 }}
            />
          </div>
        )
      })}
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
      reviewId: v.id,
      memberId: v.member_id,
      score: v.score,
      title: v.title,
      content: v.content,
      createdAt: new Date(v.created_at),
      updatedAt: new Date(v.updated_at),
      reviewReplies: v?.review_replies.map(v => ({
        reviewReplyId: v.id,
        memberId: v.member?.id,
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

export default React.forwardRef(ReviewMemberItem)
