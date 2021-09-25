import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import { productMessages, reviewMessages } from '../../helpers/translation'
import { useProductEditorIds, useReviewAggregate } from '../../hooks/review'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramBriefProps, ProgramPlanProps, ProgramRoleProps } from '../../types/program'
import { MultiLineTruncationMixin } from '../common'
import { CustomRatioImage } from '../common/Image'
import MemberAvatar from '../common/MemberAvatar'
import PriceLabel from '../common/PriceLabel'
import StarRating from '../common/StarRating'

const InstructorPlaceHolder = styled.div`
  height: 2rem;
`
const StyledWrapper = styled.div`
  overflow: hidden;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
`
const StyledContentBlock = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled.div<{ variant?: 'brief' }>`
  ${MultiLineTruncationMixin}
  margin-bottom: ${props => (props.variant === 'brief' ? '0.5rem' : '1.25rem')};
  height: 3em;
  color: var(--gray-darker);
  font-size: ${props => (props.variant === 'brief' ? '16px' : '18px')};
  font-weight: bold;
  letter-spacing: 0.8px;
`
const StyledReviewRating = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  text-align: justify;
`
const StyledDescription = styled.div<{ variant?: 'brief' }>`
  ${MultiLineTruncationMixin}
  margin-bottom: 12px;
  height: ${props => (props.variant === 'brief' ? '' : '3em')};
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledMetaBlock = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 1;
`

const ProgramCard: React.VFC<{
  program: ProgramBriefProps & {
    roles: ProgramRoleProps[]
    plans: ProgramPlanProps[]
  }
  variant?: 'brief'
  programType?: string | null
  isEnrolled?: boolean
  noInstructor?: boolean
  noPrice?: boolean
  noTotalDuration?: boolean
  withMeta?: boolean
  withProgress?: boolean
  renderCover?: (cover: string) => React.ReactElement
  renderCustomDescription?: () => React.ReactElement
}> = ({
  program,
  variant,
  programType,
  isEnrolled,
  noInstructor,
  noPrice,
  noTotalDuration,
  withMeta,
  renderCover,
  renderCustomDescription,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { productEditorIds } = useProductEditorIds(program.id)
  const { enabledModules, settings } = useApp()

  const instructorId = program.roles.length > 0 && program.roles[0].memberId
  const listPrice =
    program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0
  const salePrice =
    program.isSubscription && program.plans.length > 0 && (program.plans[0].soldAt?.getTime() || 0) > Date.now()
      ? program.plans[0].salePrice
      : (program.soldAt?.getTime() || 0) > Date.now()
      ? program.salePrice
      : undefined
  const periodAmount = program.isSubscription && program.plans.length > 0 ? program.plans[0].periodAmount : null
  const periodType = program.isSubscription && program.plans.length > 0 ? program.plans[0].periodType : null
  const { averageScore, reviewCount } = useReviewAggregate(`/programs/${program.id}`)

  return (
    <>
      {!noInstructor && instructorId && (
        <InstructorPlaceHolder className="mb-3">
          <Link to={`/creators/${instructorId}?tabkey=introduction`}>
            <MemberAvatar memberId={instructorId} withName />
          </Link>
        </InstructorPlaceHolder>
      )}

      <Link
        to={
          isEnrolled
            ? `/programs/${program.id}/contents`
            : `/programs/${program.id}` + (programType ? `?type=${programType}` : '')
        }
      >
        <StyledWrapper>
          {renderCover ? (
            renderCover(program.coverUrl ? program.coverUrl : EmptyCover)
          ) : (
            <CustomRatioImage width="100%" ratio={9 / 16} src={program.coverUrl ? program.coverUrl : EmptyCover} />
          )}

          <StyledContentBlock>
            <StyledTitle variant={variant}>{program.title}</StyledTitle>

            {enabledModules.customer_review ? (
              currentUserRole === 'app-owner' ||
              (currentMemberId && productEditorIds.includes(currentMemberId)) ||
              reviewCount >= (settings.review_lower_bound ? Number(settings.review_lower_bound) : 3) ? (
                <StyledReviewRating className="d-flex mb-2">
                  <StarRating score={Math.round((Math.round(averageScore * 10) / 10) * 2) / 2} max={5} size="20px" />
                  <span>({formatMessage(reviewMessages.text.reviewCount, { count: reviewCount })})</span>
                </StyledReviewRating>
              ) : (
                <StyledReviewRating className="mb-2">{formatMessage(reviewMessages.text.noReviews)}</StyledReviewRating>
              )
            ) : null}

            {renderCustomDescription && renderCustomDescription()}
            <StyledDescription variant={variant}>{program.abstract}</StyledDescription>

            {withMeta && (
              <StyledMetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
                {!noPrice && (
                  <div>
                    {program.isSubscription && program.plans.length === 0 ? (
                      <span>{formatMessage(productMessages.program.content.notForSale)}</span>
                    ) : (
                      <PriceLabel
                        variant="inline"
                        listPrice={listPrice}
                        salePrice={salePrice}
                        periodAmount={periodAmount}
                        periodType={periodType || undefined}
                      />
                    )}
                  </div>
                )}

                {!program.isSubscription && !noTotalDuration && !!program.totalDuration && (
                  <div>{durationFormatter(program.totalDuration)}</div>
                )}
              </StyledMetaBlock>
            )}
          </StyledContentBlock>
        </StyledWrapper>
      </Link>
    </>
  )
}

export default ProgramCard
