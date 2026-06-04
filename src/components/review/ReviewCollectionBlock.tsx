import { gql, useQuery } from '@apollo/client'
import { Divider, Icon } from '@chakra-ui/react'
import { Skeleton } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useAdaptedReviewable } from 'lodestar-app-element/src/hooks/review'
import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { reviewMessages } from '../../helpers/translation'
import { useProductEditorIds, useReviewAggregate } from '../../hooks/review'
import { ReactComponent as StarEmptyIcon } from '../../images/star-empty.svg'
import { MemberReviewProps } from '../../types/review'
import ReviewAdminItemCollection from './ReviewAdminItemCollection'
import ReviewMemberItemCollection, { ReviewMemberItemRef } from './ReviewMemberItemCollection'
import ReviewModal from './ReviewModal'
import ReviewPublicItemCollection from './ReviewPublicItemCollection'
import ReviewScorePanel from './ReviewScorePanel'

const Wrapper = styled.div`
  div {
    .review-item:last-child {
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

const StyledEmptyText = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const EmptyIconWrapper = styled.div`
  text-align: center;
`
export const StyledDivider = styled(Divider)`
  && {
    height: 1px;
    background: #ececec;
    border: none;
    opacity: 1;
    margin: 24px 0px 24px 0px;
  }
`
const ReviewCollectionBlock: React.FC<{
  title?: string
  targetId: string
  path: string
}> = ({ title, targetId, path }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { settings, id: appId } = useApp()
  const { data: reviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)
  const { loadingReviewAggregate, averageScore, reviewCount, refetchReviewAggregate } = useReviewAggregate(path)
  const { loadingIsCurrentMemberEnrollment, isCurrentMemberEnrollment } = useIsCurrentMemberEnrollment(
    targetId,
    currentMemberId,
  )
  const { loadingProductEditorIds, productEditorIds } = useProductEditorIds(targetId)
  const { loadingCurrentMemberReview, currentMemberReview, refetchCurrentMemberReview } = useCurrentMemberReview(
    currentMemberId,
    path,
    appId,
  )

  const reviewMemberItemRef = useRef<ReviewMemberItemRef>(null)

  const isMoreThanReviewLowerBound = !!(
    reviewCount && reviewCount >= (settings.review_lower_bound ? Number(settings.review_lower_bound) : 3)
  )

  const isProductAdmin = !!(
    currentUserRole === 'app-owner' ||
    (currentMemberId && productEditorIds?.includes(currentMemberId))
  )

  if (
    reviewableLoading ||
    loadingIsCurrentMemberEnrollment ||
    loadingProductEditorIds ||
    loadingReviewAggregate ||
    loadingCurrentMemberReview
  ) {
    return (
      <>
        <StyledTitle>{title || formatMessage(reviewMessages.title.programReview)}</StyledTitle>
        <StyledDivider mt={1} />
        <Skeleton />
      </>
    )
  }

  console.log(currentMemberId, currentMemberReview)

  return !isProductAdmin &&
    !reviewable?.is_score_viewable &&
    !reviewable?.is_item_viewable &&
    currentMemberReview.length === 0 &&
    !reviewable?.is_writable ? (
    <></>
  ) : (
    <>
      <StyledTitle>{title || formatMessage(reviewMessages.title.programReview)}</StyledTitle>
      <StyledDivider mt={1} />

      <div className="d-flex align-items-center my-3">
        {isMoreThanReviewLowerBound || isProductAdmin ? <ReviewScorePanel path={path} appId={appId} /> : <></>}
        {isCurrentMemberEnrollment ? (
          <ReviewModal
            path={path}
            memberReviews={currentMemberReview}
            onRefetchReviewMemberItem={reviewMemberItemRef.current?.onRefetchReviewMemberItem}
            onRefetchReviewAggregate={refetchReviewAggregate}
            onRefetchCurrentMemberReview={refetchCurrentMemberReview}
          />
        ) : null}
      </div>

      {isMoreThanReviewLowerBound || isProductAdmin || currentMemberReview.length > 0 ? (
        <Wrapper>
          {isProductAdmin ? (
            <ReviewAdminItemCollection targetId={targetId} path={path} appId={appId} />
          ) : currentUserRole === 'anonymous' ||
            (currentUserRole !== 'general-member' && !isCurrentMemberEnrollment) ? (
            <ReviewPublicItemCollection targetId={targetId} path={path} appId={appId} />
          ) : (
            <ReviewMemberItemCollection ref={reviewMemberItemRef} targetId={targetId} path={path} appId={appId} />
          )}
        </Wrapper>
      ) : (
        <>
          <EmptyIconWrapper className="mt-4">
            <Icon as={StarEmptyIcon} w="100" h="100" />
            <StyledEmptyText className="mt-3">
              {formatMessage(reviewMessages.text.notEnoughReviews, {
                amount: Number(settings.review_lower_bound) || 3,
              })}
            </StyledEmptyText>
          </EmptyIconWrapper>
        </>
      )}
    </>
  )
}

const useIsCurrentMemberEnrollment = (targetId: string, memberId: string | null) => {
  // 改用 program-first 的 current_member_program_enrollment function:
  // 等價於原本 program_enrollment / program_plan_enrollment / program_package_plan_enrollment
  // 三段查詢的 OR 結果,但以 program 為起點做存在性檢查,避免掃描整個 member 的訂單歷史。
  // member_id 與 app_id 由 Hasura 從 session(X-Hasura-User-Id / X-Hasura-App-Id)注入,
  // 前端只需傳 targetId;未登入(無 memberId)時直接 skip,結果為未報名。
  const { loading, error, data } = useQuery<
    hasura.GetCurrentMemberEnrollment,
    hasura.GetCurrentMemberEnrollmentVariables
  >(
    gql`
      query GetCurrentMemberEnrollment($targetId: uuid!) {
        current_member_program_enrollment(args: { p_program_id: $targetId }) {
          is_enrolled
        }
      }
    `,
    { variables: { targetId }, skip: !memberId },
  )

  return {
    loadingIsCurrentMemberEnrollment: loading,
    errorIsCurrentMemberEnrollment: error,
    // function 回傳 SETOF result table,固定 1 列;取 [0].is_enrolled
    isCurrentMemberEnrollment: !!data?.current_member_program_enrollment?.[0]?.is_enrolled,
  }
}

const useCurrentMemberReview = (currentMemberId: string | null, path: string, appId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_CURRENT_MEMBER_REVIEW,
    hasura.GET_CURRENT_MEMBER_REVIEWVariables
  >(
    gql`
      query GET_CURRENT_MEMBER_REVIEW($currentMemberId: String, $path: String, $appId: String) {
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
  const currentMemberReview: MemberReviewProps[] =
    data?.review?.map(v => ({
      id: v.id,
      memberId: v.member_id,
      score: v.score,
      title: v.title,
      content: v.content || null,
      privateContent: v.private_content || null,
    })) || []

  return {
    loadingCurrentMemberReview: loading,
    errorCurrentMemberReview: error,
    currentMemberReview,
    refetchCurrentMemberReview: refetch,
  }
}

export default ReviewCollectionBlock
