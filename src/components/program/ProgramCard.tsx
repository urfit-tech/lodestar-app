import { Icon } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import { useProgramEnrollmentAggregate } from '../../hooks/program'
import { useProductEditorIds, useReviewAggregate } from '../../hooks/review'
import EmptyCover from '../../images/empty-cover.png'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'
import { CustomRatioImage } from '../common/Image'
import MemberAvatar from '../common/MemberAvatar'
import PriceLabel from '../common/PriceLabel'
import StarRating from '../common/StarRating'
import programMessages from './translation'

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
const StyledExtraBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ProgramCard: React.VFC<{
  program: ProgramBriefProps & {
    categories?: Category[]
    roles: ProgramRole[]
    plans: ProgramPlan[]
  }
  variant?: 'brief'
  programType?: string | null
  noInstructor?: boolean
  noPrice?: boolean
  noTotalDuration?: boolean
  withMeta?: boolean
  withProgress?: boolean
  previousPage?: string
  onClick?: () => void
  renderCover?: (cover: string) => React.ReactElement
  renderCustomDescription?: () => React.ReactElement
}> = ({
  program,
  variant,
  programType,
  noInstructor,
  noPrice,
  noTotalDuration,
  withMeta,
  previousPage,
  onClick,
  renderCover,
  renderCustomDescription,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { productEditorIds } = useProductEditorIds(program.id)
  const { enabledModules, settings } = useApp()

  const instructorId = program.roles.length > 0 && program.roles[0].memberId
  const listPrice = program.plans[0]?.listPrice || 0
  const salePrice =
    program.plans.length > 1 && (program.plans[0]?.soldAt?.getTime() || 0) > Date.now()
      ? program.plans[0]?.salePrice
      : (program.plans[0]?.soldAt?.getTime() || 0) > Date.now()
      ? program.plans[0]?.salePrice
      : undefined
  const periodAmount = program.plans.length > 1 ? program.plans[0]?.periodAmount : null
  const periodType = program.plans.length > 1 ? program.plans[0]?.periodType : null
  const { averageScore, reviewCount } = useReviewAggregate(`/programs/${program.id}`)
  const { data: enrolledCount } = useProgramEnrollmentAggregate(program.id, { skip: !program.isEnrolledCountVisible })

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
          programType && previousPage
            ? `/programs/${program.id}?type=${programType}&back=${previousPage}`
            : programType
            ? `/programs/${program.id}?type=${programType}`
            : previousPage
            ? `/programs/${program.id}?back=${previousPage}`
            : `/programs/${program.id}`
        }
        onClick={onClick}
      >
        <StyledWrapper>
          {renderCover ? (
            renderCover(program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover)
          ) : (
            <CustomRatioImage
              width="100%"
              ratio={9 / 16}
              src={program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover}
            />
          )}

          <StyledContentBlock>
            <StyledTitle variant={variant}>{program.title}</StyledTitle>

            {enabledModules.customer_review ? (
              currentUserRole === 'app-owner' ||
              (currentMemberId && productEditorIds.includes(currentMemberId)) ||
              reviewCount >= (settings.review_lower_bound ? Number(settings.review_lower_bound) : 3) ? (
                <StyledReviewRating className="d-flex mb-2">
                  <StarRating score={Math.round((Math.round(averageScore * 10) / 10) * 2) / 2} max={5} size="20px" />
                  <span>({formatMessage(programMessages.ProgramCard.reviewCount, { count: reviewCount })})</span>
                </StyledReviewRating>
              ) : (
                <StyledReviewRating className="mb-2">
                  {formatMessage(programMessages.ProgramCard.noReviews)}
                </StyledReviewRating>
              )
            ) : null}

            {renderCustomDescription && renderCustomDescription()}
            <StyledDescription variant={variant}>{program.abstract}</StyledDescription>

            {withMeta && (
              <StyledMetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
                {!noPrice && (
                  <div>
                    {program.plans.length === 0 ? (
                      <span>{formatMessage(programMessages.ProgramCard.notForSale)}</span>
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

                <StyledExtraBlock>
                  {program.plans.length === 1 && !noTotalDuration && !!program.totalDuration && (
                    <div className="d-flex align-items-center">
                      <Icon mr="1" as={AiOutlineClockCircle} />
                      {durationFormatter(program.totalDuration)}
                    </div>
                  )}
                  {program.isEnrolledCountVisible && (
                    <div className="d-flex align-items-center">
                      <Icon mr="1" as={AiOutlineUser} />
                      {enrolledCount}
                    </div>
                  )}
                </StyledExtraBlock>
              </StyledMetaBlock>
            )}
          </StyledContentBlock>
        </StyledWrapper>
      </Link>
    </>
  )
}

export default ProgramCard
