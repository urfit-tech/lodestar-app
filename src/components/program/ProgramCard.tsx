import { Icon } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { durationFormatter } from '../../helpers'
import { useProgramEnrollmentAggregate } from '../../hooks/program'
import { useProductEditorIds, useReviewAggregate } from '../../hooks/review'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as StarIcon } from '../../images/star-current-color.svg'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'
import { CustomRatioImage } from '../common/Image'
import MemberAvatar from '../common/MemberAvatar'
import StarRating from '../common/StarRating'
import programMessages from './translation'

const InstructorPlaceHolder = styled.div`
  height: 2rem;
`
const StyledWrapper = styled.div<{ variant?: ProgramCardVariant }>`
  overflow: hidden;
  cursor: pointer;
  ${props =>
    (props.variant === 'primary' || !props.variant) &&
    css`
      border-radius: 4px;
      background-color: white;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
    `}
`
const StyledContentBlock = styled.div<{ variant?: ProgramCardVariant }>`
  padding-top: 1rem;
  padding-bottom: 1.25rem;
  ${props =>
    (props.variant === 'primary' || !props.variant) &&
    css`
      padding: 1.25rem;
    `}
`
const StyledTitle = styled.div<{ variant?: ProgramCardVariant }>`
  ${MultiLineTruncationMixin}
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  ${props =>
    (props.variant === 'primary' || !props.variant) &&
    css`
      margin-bottom: 1.25rem;
      height: 3em;
    `}
`
const StyledReviewRating = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  text-align: justify;
`
const StyledDescription = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 12px;
  height: 3em;
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
const StyledCategoryName = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledIcon = styled(Icon)`
  color: ${props => props.theme['@primary-color']};
`

type ProgramCardVariant = 'primary' | 'secondary'
type ProgramCardProps = {
  program: ProgramBriefProps & {
    categories?: Category[]
    roles: ProgramRole[]
    plans: ProgramPlan[]
  }
  variant?: ProgramCardVariant
  noInstructor?: boolean
  noPrice?: boolean
  noTotalDuration?: boolean
  withMeta?: boolean
  withProgress?: boolean
  programType?: string | null
  previousPage?: string
  onClick?: () => void
  renderCover?: (cover: string) => React.ReactElement
  renderCustomDescription?: () => React.ReactElement
}
type SharedProps = {
  programLink: string
}

const ProgramCard: React.VFC<ProgramCardProps> = programCardProps => {
  const { program, variant, programType, previousPage } = programCardProps
  const { settings } = useApp()
  const mergedVariant = variant || settings['feature.program_card.variant']

  const programLink =
    programType && previousPage
      ? `/programs/${program.id}?type=${programType}&back=${previousPage}`
      : programType
      ? `/programs/${program.id}?type=${programType}`
      : previousPage
      ? `/programs/${program.id}?back=${previousPage}`
      : `/programs/${program.id}`

  switch (mergedVariant) {
    case 'primary':
      return <PrimaryCard {...programCardProps} programLink={programLink} />
    case 'secondary':
      return <SecondaryCard {...programCardProps} programLink={programLink} />
    default:
      return <PrimaryCard {...programCardProps} programLink={programLink} />
  }
}

const PrimaryCard: React.VFC<ProgramCardProps & SharedProps> = ({
  program,
  variant = 'primary',
  noInstructor,
  noPrice,
  noTotalDuration,
  withMeta,
  onClick,
  renderCover,
  renderCustomDescription,
  programLink,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { productEditorIds } = useProductEditorIds(program.id)
  const { enabledModules, settings } = useApp()
  const history = useHistory()

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

      <StyledWrapper
        onClick={() => {
          onClick && onClick()
          history.push(programLink)
        }}
      >
        {renderCover ? (
          renderCover(program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover)
        ) : (
          <CustomRatioImage
            width="100%"
            ratio={9 / 16}
            src={program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover}
          />
        )}

        <StyledContentBlock variant={variant}>
          <StyledTitle variant={variant}>
            <Link to={programLink} onClick={onClick}>
              {program.title}
            </Link>
          </StyledTitle>

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
          <StyledDescription>{program.abstract}</StyledDescription>

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
                      currencyId={program.plans[0]?.currency.id}
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
    </>
  )
}
const SecondaryCard: React.VFC<ProgramCardProps & SharedProps> = ({
  program,
  variant = 'secondary',
  onClick,
  renderCover,
  programLink,
}) => {
  const { enabledModules } = useApp()
  const history = useHistory()
  const { averageScore } = useReviewAggregate(`/programs/${program.id}`)

  return (
    <StyledWrapper
      variant={variant}
      onClick={() => {
        onClick && onClick()
        history.push(programLink)
      }}
    >
      {renderCover ? (
        renderCover(program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover)
      ) : (
        <CustomRatioImage
          width="100%"
          ratio={9 / 16}
          src={program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover}
        />
      )}

      <StyledContentBlock variant={variant}>
        <StyledTitle variant={variant}>
          <Link to={programLink} onClick={onClick}>
            {program.title}
          </Link>
        </StyledTitle>

        <div className="d-flex mt-1">
          <StyledCategoryName className="flex-grow-1">
            {program.categories
              ?.map(c => (c.name.includes('/') ? c.name.split('/')[1] : c.name))
              .slice(0, 3)
              .join('・')}
          </StyledCategoryName>
          {enabledModules.customer_review && Boolean(averageScore) && (
            <div className="flex-shrink-0 d-flex justify-content-center align-items-center">
              <span className="mr-1">{averageScore}</span>
              <StyledIcon as={StarIcon} />
            </div>
          )}
        </div>
      </StyledContentBlock>
    </StyledWrapper>
  )
}

export default ProgramCard
