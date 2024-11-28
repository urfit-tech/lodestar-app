import Icon from '@chakra-ui/icon'
import { useAdaptedReviewable } from 'lodestar-app-element/src/hooks/review'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { reviewMessages } from '../../helpers/translation'
import { useReviewAggregate } from '../../hooks/review'
import { ReactComponent as StarIcon } from '../../images/star.svg'

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

const ReviewScorePanel: FC<{ path: string; appId: string }> = ({ path, appId }) => {
  const { formatMessage } = useIntl()
  const { loadingReviewAggregate, averageScore, reviewCount } = useReviewAggregate(path)
  const { data: reviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)

  if (reviewableLoading || loadingReviewAggregate) return <></>

  return !reviewable?.is_score_viewable ? (
    <></>
  ) : (
    <>
      <StyledAvgScore className="mr-1">{averageScore === 0 ? 0 : averageScore?.toFixed(1)}</StyledAvgScore>
      <div className="mr-2">
        <Icon as={StarIcon} w="24px" h="24px" />
      </div>
      <StyledReviewAmount className="flex-grow-1">
        {formatMessage(reviewMessages.text.reviewAmount, {
          amount: reviewCount,
        })}
      </StyledReviewAmount>
    </>
  )
}

export default ReviewScorePanel
