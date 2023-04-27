import { gql, useQuery } from '@apollo/client'
import { Button, SkeletonText } from '@chakra-ui/react'
import { Carousel } from 'antd'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import moment from 'moment'
import { useState } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import MemberAvatar from '../../components/common/MemberAvatar'
import StarRating from '../../components/common/StarRating'
import { StyledDivider } from '../../components/review/ReviewCollectionBlock'
import hasura from '../../hasura'
import { ReviewProps } from '../../types/review'

const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledPrevArrow = styled.img`
  &&& {
    width: 40px !important;
    height: 100% !important;
    margin: 0 20px;
    display: block;
    z-index: 100;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  }
`

const StyledNextArrow = styled.img`
  &&& {
    width: 40px !important;
    height: 100% !important;
    margin: 0 20px;
    display: block;
    z-index: 100;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 0) 0%);
  }
`

const ProgramBestReviewsCarousel: React.FC<{ pathname: string; onReviewBlockScroll: () => void }> = ({
  pathname,
  onReviewBlockScroll,
}) => {
  const { formatMessage } = useIntl()
  const { loading, data: reviews } = useBestReviews(pathname)
  const [isArrowShow, setIsArrowShow] = useState(true)

  if (loading) {
    return <SkeletonText />
  }

  if (reviews.length === 0) {
    return <></>
  }

  return (
    <div>
      <StyledTitle>
        {formatMessage(defineMessage({ id: 'review.title.bestReview', defaultMessage: '最佳評論' }))}
      </StyledTitle>
      <StyledDivider className="mt-1" />

      <div onMouseEnter={() => setIsArrowShow(true)} onMouseLeave={() => setIsArrowShow(false)}>
        <Carousel
          arrows={isArrowShow}
          dots={false}
          prevArrow={<StyledPrevArrow src={`https://static.kolable.com/images/xuemi/angle-thin-left.svg`} />}
          nextArrow={<StyledNextArrow src={`https://static.kolable.com/images/xuemi/angle-thin-right.svg`} />}
        >
          {reviews.map(review => (
            <ReviewCarouselItem
              memberId={review.memberId}
              score={review.score}
              title={review.title}
              content={review.content}
              createdAt={review.createdAt}
              updatedAt={review.updatedAt}
            />
          ))}
        </Carousel>
      </div>

      <div className="text-center mt-3">
        <Button variant="outline" colorScheme="primary" onClick={onReviewBlockScroll}>
          {formatMessage(defineMessage({ id: 'review.ui.more', defaultMessage: '更多評論' }))}
        </Button>
      </div>
    </div>
  )
}

const useBestReviews: (pathname: string) => {
  loading: boolean
  data: {
    id: string
    memberId: string | null
    score: number
    title: string | null
    content: string | null
    updatedAt: Date
    createdAt: Date
  }[]
} = pathname => {
  const { loading, data } = useQuery<hasura.GET_BEST_REVIEWS, hasura.GET_BEST_REVIEWSVariables>(
    gql`
      query GET_BEST_REVIEWS($pathname: String!) {
        review_public(
          where: { path: { _eq: $pathname } }
          order_by: { review_reactions_aggregate: { count: desc } }
          limit: 4
        ) {
          id
          member_id
          score
          title
          content
          updated_at
          created_at
          review_reactions_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    `,
    { variables: { pathname } },
  )

  return {
    loading,
    data:
      data?.review_public
        .filter(v => v.review_reactions_aggregate.aggregate?.count)
        .map(v => ({
          id: v.id,
          memberId: v.member_id || null,
          score: v.score,
          title: v.title || '',
          content: v.content || null,
          updatedAt: new Date(v.updated_at),
          createdAt: new Date(v.created_at),
        })) || [],
  }
}

const ReviewContentBlock = styled.div`
  padding-left: 48px;
`
const StyledRatingTitle = styled.div`
  font-weight: bold;
  color: var(--gray-darker);
`

const ReviewCarouselItem: React.VFC<
  Pick<ReviewProps, 'memberId' | 'score' | 'title' | 'content' | 'createdAt' | 'updatedAt'>
> = ({ memberId, score, title, content, createdAt, updatedAt }) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar memberId={memberId || ''} withName size={36} />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
        </span>
      </div>
      <ReviewContentBlock>
        <StarRating score={score} max={5} size="16px" />
        <StyledRatingTitle className="mt-3 mb-2">{title}</StyledRatingTitle>
        <BraftContent>{content}</BraftContent>
      </ReviewContentBlock>
    </>
  )
}

export default ProgramBestReviewsCarousel
