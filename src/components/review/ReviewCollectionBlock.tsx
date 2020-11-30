import { useQuery } from '@apollo/react-hooks'
import { Divider, Icon } from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { reviewMessages } from '../../helpers/translation'
import { ReactComponent as StarEmptyIcon } from '../../images/star-empty.svg'
import { ReactComponent as StarLargeIcon } from '../../images/star-l.svg'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'
import ReviewAdminItem from './ReviewAdminItem'
import ReviewMemberItem, { ReviewMemberItemRef } from './ReviewMemberItem'
import ReviewModal from './ReviewModal'
import ReviewPublicItem from './ReviewPublicItem'

const Wrapper = styled.div`
  &:not(.load-more-reviews) {
    .review-item:last-child {
      .chakra-divider.review-divider {
        display: none;
      }
    }
  }
  &:has(.load-more-reviews) {
    .review-item:nth-last-child(2) {
      .chakra-divider.review-divider {
        display: none;
      }
    }
  }
`
export const StyledTitle = styled.h2`
  font-size: 24px;
  color: #585858;
  letter-spacing: 0.2px;
  font-weight: bold;
`
export const StyledAvgScore = styled.div`
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 1px;
`
export const StyledReviewAmount = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledEmptyText = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const EmptyIconWrapper = styled.div`
  text-align: center;
`

const ReviewCollectionBlock: React.FC<{
  title?: string
  targetId: string
  path: string
}> = ({ title, targetId, path }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { settings, id: appId } = useApp()
  const { averageScore, reviewCount } = useReviewCount(path, appId)
  const { productRoles } = useProductRoles(targetId, appId)
  const { enrolledMembers } = useEnrolledMembers(targetId, appId)
  const { memberReview } = useMemberReview(currentMemberId, path, appId)

  const reviewMemberItemRef = useRef() as React.RefObject<ReviewMemberItemRef>

  return (
    <>
      <StyledTitle>{title || formatMessage(reviewMessages.title.programReview)}</StyledTitle>
      <Divider mt={1} css={{ height: '1px', background: '#ececec', borderStyle: 'none', opacity: 1 }} />

      <div className="d-flex align-items-center mt-3">
        <StyledAvgScore className="mr-1">{averageScore === 0 ? 0 : averageScore?.toFixed(1)}</StyledAvgScore>
        <div className="mr-2">
          <Icon as={StarLargeIcon} />
        </div>
        <StyledReviewAmount className="flex-grow-1">
          {formatMessage(reviewMessages.text.reviewAmount, { amount: reviewCount })}
        </StyledReviewAmount>
        {enrolledMembers.includes(currentMemberId) &&
          (currentUserRole !== 'app-owner' || (currentMemberId && productRoles?.includes(currentMemberId))) && (
            <ReviewModal
              path={path}
              memberReview={memberReview}
              onRefetch={reviewMemberItemRef.current?.onReviewMemberRefetch}
            />
          )}
      </div>

      {reviewCount && reviewCount >= Number(settings.review_lower_bound) ? (
        currentUserRole === 'app-owner' || (currentMemberId && productRoles?.includes(currentMemberId)) ? (
          <Wrapper>
            <ReviewAdminItem targetId={targetId} path={path} appId={appId} />
          </Wrapper>
        ) : currentUserRole === 'anonymous' ||
          (currentUserRole !== 'general-member' && !enrolledMembers.includes(currentMemberId)) ? (
          <Wrapper>
            <ReviewPublicItem targetId={targetId} path={path} appId={appId} />
          </Wrapper>
        ) : (
          <Wrapper>
            <ReviewMemberItem ref={reviewMemberItemRef} targetId={targetId} path={path} appId={appId} />
          </Wrapper>
        )
      ) : (
        <>
          <EmptyIconWrapper className="mt-4">
            <Icon as={StarEmptyIcon} w="100" h="100" />
            <StyledEmptyText className="mt-3">{formatMessage(reviewMessages.text.notEnoughReviews)}</StyledEmptyText>
          </EmptyIconWrapper>
        </>
      )}
    </>
  )
}

const useReviewCount = (path: string, appId: string) => {
  const { loading, error, data } = useQuery<types.GET_REVIEW_PUBLISH, types.GET_REVIEW_PUBLISHVariables>(
    gql`
      query GET_REVIEW_PUBLISH($path: String, $appId: String) {
        review_public_aggregate(where: { path: { _eq: $path }, app_id: { _eq: $appId } }) {
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
        appId,
      },
    },
  )
  const averageScore = loading || error || !data ? null : data.review_public_aggregate.aggregate?.avg?.score || 0
  const reviewCount = loading || error || !data ? null : data.review_public_aggregate.aggregate?.count || 0

  return {
    loading,
    error,
    averageScore,
    reviewCount,
  }
}

const useProductRoles = (targetId: string, appId: string) => {
  const { loading, error, data } = useQuery<types.GET_PRODUCT_ROLES, types.GET_PRODUCT_ROLESVariables>(
    gql`
      query GET_PRODUCT_ROLES($targetId: uuid, $appId: String) {
        program(where: { app_id: { _eq: $appId }, id: { _eq: $targetId } }) {
          program_roles(where: { name: { _eq: "instructor" } }) {
            member_id
            name
          }
        }
        podcast_program(where: { id: { _eq: $targetId } }) {
          podcast_program_roles(where: { name: { _eq: "instructor" }, member: { app_id: { _eq: $appId } } }) {
            member_id
            name
          }
        }
      }
    `,
    { variables: { appId, targetId } },
  )

  const productRoles: string[] | null =
    loading || error || !data
      ? null
      : data.program
      ? data.program[0].program_roles.map(v => v.member_id)
      : data.podcast_program
      ? data.podcast_program[0].podcast_program_roles.map(v => v.member_id)
      : null

  return { productRoles }
}

const useEnrolledMembers = (targetId: string, appId: string) => {
  const { loading, error, data } = useQuery<types.GET_ENROLLED_MEMBERS, types.GET_ENROLLED_MEMBERSVariables>(
    gql`
      query GET_ENROLLED_MEMBERS($targetId: uuid, $appId: String) {
        program_enrollment(where: { program: { app_id: { _eq: $appId }, id: { _eq: $targetId } } }) {
          member_id
        }
      }
    `,
    {
      variables: { targetId, appId },
    },
  )
  const enrolledMembers = loading || error || !data ? [] : data.program_enrollment.map(v => v.member_id)
  return {
    enrolledMembers,
  }
}

const useMemberReview = (currentMemberId: string | null, path: string, appId: string) => {
  const { loading, error, data } = useQuery<types.GET_MEMBER_REVIEW, types.GET_MEMBER_REVIEWVariables>(
    gql`
      query GET_MEMBER_REVIEW($currentMemberId: String, $path: String, $appId: String) {
        review(where: { member_id: { _eq: $currentMemberId }, path: { _eq: $path }, app_id: { _eq: $appId } }) {
          id
          member_id
          score
          title
          content
          private_content
        }
      }
    `,
    {
      variables: { currentMemberId, path, appId },
    },
  )
  const memberReview =
    loading || error || !data
      ? null
      : data.review.map(v => ({
          id: v.id,
          memberId: v.member_id,
          score: v.score,
          title: v.title,
          content: v.content,
          privateContent: v.private_content,
        }))

  return {
    loading,
    error,
    memberReview,
  }
}

export default ReviewCollectionBlock
