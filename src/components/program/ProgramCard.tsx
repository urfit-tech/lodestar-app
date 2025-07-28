import { Box, Icon, Text } from '@chakra-ui/react'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import ReviewScoreStarRow from 'lodestar-app-element/src/components/common/ReviewScoreStarRow'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAdaptedReviewable } from 'lodestar-app-element/src/hooks/review'
import React from 'react'
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { durationFormatter } from '../../helpers'
import { useProgramEnrollmentAggregate } from '../../hooks/program'
import { useReviewAggregate } from '../../hooks/review'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as StarIcon } from '../../images/star-current-color.svg'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'
import { CustomRatioImage } from '../common/Image'
import MemberAvatar from '../common/MemberAvatar'
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
      padding: 0.5rem 1.25rem 1.25rem 1.25rem;
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

const ProgramCard: React.FC<ProgramCardProps> = programCardProps => {
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

const PrimaryCard: React.FC<ProgramCardProps & SharedProps> = ({
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

  const { id: appId } = useApp()
  const path = `/programs/${program.id}`
  const { data: reviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)
  const { data: enrolledCount } = useProgramEnrollmentAggregate(program.id, { skip: !program.isEnrolledCountVisible })

  const programSalePriceColorSetting = settings['program_card.sale_price.color']?.trim()
  const programAdditionalSoldHeadcountSetting = settings['program.additional.sold.headcount'] || '[]'
  let programAdditionalSoldHeadcountSettingValue: { programId: string; count: number }[] | [] = []
  let programLabelColorConfig: { id: number; backgroundColor: string; textColor: string }[] = []

  try {
    programAdditionalSoldHeadcountSettingValue = JSON.parse(programAdditionalSoldHeadcountSetting)
  } catch (err) {
    console.error('App Setting: "program.additional.sold.headcount" Error:', err)
  }

  if (!!settings['program_label_color.config'] && !!enabledModules.program_label) {
    try {
      programLabelColorConfig = JSON.parse(settings['program_label_color.config'])
    } catch (err) {
      console.error('App Setting: "program_label_color.config" Error:', err)
    }
  }

  const programAdditionalSoldHeadcount =
    (Array.isArray(programAdditionalSoldHeadcountSettingValue) &&
      programAdditionalSoldHeadcountSettingValue.length > 0 &&
      programAdditionalSoldHeadcountSettingValue.find(setting => setting?.programId === program.id)?.count) ||
    0

  const programLabelColor = programLabelColorConfig.find(config => config.id === Number(program.labelColorType)) || {
    backgroundColor: '#ececec',
    textColor: '#585858',
  }

  if (reviewableLoading) return <></>

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

        {!!enabledModules.program_label && (
          <Box paddingX="10px" marginTop="10px" minH="25px" width="fit-content">
            {program.label !== '' && (
              <Text
                backgroundColor={programLabelColor?.backgroundColor}
                textColor={programLabelColor?.textColor}
                paddingX="10px"
                borderRadius="4px"
              >
                {program.label}
              </Text>
            )}
          </Box>
        )}

        <StyledContentBlock variant={variant}>
          <StyledTitle variant={variant}>
            <Link to={programLink} onClick={onClick}>
              {program.title}
            </Link>
          </StyledTitle>

          <ReviewScoreStarRow path={path} appId={appId} />

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
                      customStyle={{
                        salePrice: {
                          amount: { color: programSalePriceColorSetting ? programSalePriceColorSetting : undefined },
                        },
                      }}
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
                    {enrolledCount + programAdditionalSoldHeadcount}
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
const SecondaryCard: React.FC<ProgramCardProps & SharedProps> = ({
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
