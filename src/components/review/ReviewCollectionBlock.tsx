import { useQuery } from '@apollo/react-hooks'
import { Divider } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React from 'react'
import Icon from 'react-inlinesvg'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import StarEmptyIcon from '../../images/star-empty.svg'
import StarLargeIcon from '../../images/star-l.svg'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'
import ReviewItem from './ReviewItem'
import ReviewModal from './ReviewModal'
import { ReviewReplyItemProps } from './ReviewReplyItem'

export type ReviewsProps = {
  reviewId: string
  memberId: string | null
  score: number | 0
  title: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
  reviewReplies: ReviewReplyItemProps[]
}

const Wrapper = styled.div`
  & .review-divider:last-child {
    display: none;
  }
`
const StyledTitle = styled.h2`
  font-size: 24px;
  color: #585858;
  letter-spacing: 0.2px;
  font-weight: bold;
`
const StyledAvgScore = styled.div`
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 1px;
`
const StyledReviewAmount = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledEmptyText = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const messages = defineMessages({
  programReview: { id: 'review.title.programReview', defaultMessage: '課程評價' },
  notEnoughReviews: { id: 'review.text.notEnoughReviews', defaultMessage: '評價不足三人無法顯示' },
  reviewAmount: { id: 'review.text.amount', defaultMessage: '{amount} 則評價' },
})

const ReviewCollectionBlock: React.FC<{
  title?: string
  path: string
}> = ({ title, path }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { settings } = useApp()

  const { reviews, reviewCount } = useReviewCollection(path)

  const AverageScore = (reviews: ReviewsProps[]) => {
    let totalScore = 0
    reviews.map(v => (totalScore += v.score))
    return reviewCount === 0 ? 0 : (totalScore / reviewCount).toFixed(1)
  }

  return (
    <>
      <StyledTitle>{title || formatMessage(messages.programReview)}</StyledTitle>
      <Divider mt={1} css={{ height: '1px', background: '#ececec', borderStyle: 'none', opacity: 1 }} />
      <div className="d-flex align-items-center mt-2">
        <StyledAvgScore className="mr-1">{AverageScore(reviews)}</StyledAvgScore>
        <div className="mr-2">
          <Icon src={StarLargeIcon} />
        </div>
        <StyledReviewAmount className="flex-grow-1">
          {formatMessage(messages.reviewAmount, { amount: reviewCount })}
        </StyledReviewAmount>
        <ReviewModal />
      </div>

      {reviews && reviews.length >= Number(settings.review_lower_bound) ? (
        <Wrapper>
          {reviews.map((v: any, index) => {
            return (
              <div key={v.id}>
                <ReviewItem
                  reviewId={v.reviewId}
                  memberId={v.memberId}
                  score={v.score}
                  title={v.title}
                  content={v.content}
                  createdAt={v.createdAt}
                  updatedAt={v.updatedAt}
                  reviewReplies={v.reviewReplies}
                />
                <Divider
                  className="review-divider"
                  css={{ margin: '24px 0', height: '1px', background: '#ececec', borderStyle: 'none', opacity: 1 }}
                />
              </div>
            )
          })}
        </Wrapper>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Icon src={StarEmptyIcon} />
          <StyledEmptyText className="mt-3">{formatMessage(messages.notEnoughReviews)}</StyledEmptyText>
        </div>
      )}
    </>
  )
}

const useReviewCollection = (path: string) => {
  const { loading, error, data, refetch } = useQuery<types.GET_REVIEW_COLLECTION, types.GET_REVIEW_COLLECTIONVariables>(
    gql`
      query GET_REVIEW_COLLECTION($path: String!) {
        review_public(where: { path: { _eq: $path } }, order_by: { created_at: desc }) {
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
        review_public_aggregate(where: { path: { _eq: $path } }) {
          aggregate {
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

  const reviews: ReviewsProps[] =
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

  const reviewCount = data?.review_public_aggregate.aggregate?.count || 0

  return {
    loadingReviews: loading,
    errorReviews: error,
    reviews,
    reviewCount,
    refetchReviews: refetch,
  }
}

export default ReviewCollectionBlock
