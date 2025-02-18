import { Box } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError, notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { BREAK_POINT } from '../../../components/common/Responsive'
import CartContext from '../../../contexts/CartContext'
import { camelCaseToSnake } from '../../../helpers'
import { commonMessages } from '../../../helpers/translation'
import { useEnrolledPlanIds } from '../../../hooks/program'
import { ReactComponent as PlayIcon } from '../../../images/play-fill.svg'
import { Program } from '../../../types/program'
import Banner from './Banner'
import { SecondaryEnrollButton, SecondaryOutlineButton } from './SecondaryCTAButton'
import SocialSharePopover from './SocialSharePopover'
import { colors } from './style'

const ContentWrapper = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  bottom: 40px;
  left: 16px;

  @media (min-width: ${BREAK_POINT}px) {
    left: 80px;
    bottom: 60px;
  }

  @media (max-width: 576px) {
    bottom: 16px;
  }
`

const StyledCoverLabelWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 16px;

  @media (min-width: ${BREAK_POINT}px) {
    left: 80px;
  }
`

const IconWrapper = styled.a`
  position: absolute;
  top: 24px;
  right: 24px;
`

const StyledInstructor = styled.h1`
  color: ${colors.white};
  font-size: 16px;
`

const StyledTitle = styled.h1`
  color: white;
  font-size: 24px;
  line-height: 1.23;
  letter-spacing: 1px;
  font-weight: bold;
  max-width: 240px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
    max-width: 520px;
  }
`

const StyledTitleBlock = styled.div<{ noVideo?: boolean }>`
  position: relative;
  height: 100%;
`

const EnrollButton = styled(SecondaryEnrollButton)`
  && {
    width: 140px;
    height: 45px;
    border-radius: 21.5px;
    @media (min-width: ${BREAK_POINT}px) {
      width: 200px;
    }
  }
`

const StyledCoverLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding: 6px;
  width: 100px;
  height: 45px;
  background-color: ${colors.orange};
  font-weight: 600;
  color: ${colors.white};
  @media (min-width: ${BREAK_POINT}px) {
    width: 100px;
  }
`

const PreviewButton = styled(SecondaryOutlineButton)`
  && {
    width: 140px;
    height: 45px;
    border-radius: 21.5px;
    border: solid 1px #fff;
    @media (min-width: ${BREAK_POINT}px) {
      width: 200px;
    }
  }
`

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 12px;
  width: 150px;
  @media (min-width: ${BREAK_POINT}px) {
    grid-template-columns: 1fr;
  }
`

const WordingWrapper = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 32px;
  }
`

const layoutTemplateConfigMap: Record<string, string> = {
  coverLabel: 'ef021415-0a5f-44a1-9530-de419f9431e0',
}

const SecondaryProgramBanner: React.VFC<{
  program: Program & {
    tags: string[]
  }
  isEnrolledByProgramPackage?: boolean
  isDelivered?: boolean
  hasIntroductionVideo?: boolean
  scrollToPreview: () => void | undefined
  scrollToPlanBlock: () => void | undefined
}> = ({ program, hasIntroductionVideo, scrollToPreview, scrollToPlanBlock }) => {
  const { formatMessage } = useIntl()
  const tracking = useTracking()
  const history = useHistory()
  const { enabledModules, id: appId } = useApp()
  const { addCartProduct } = useContext(CartContext)
  const { programPlanIds: enrolledProgramIds } = useEnrolledPlanIds()
  const firstPurchaseProgramPlan = program.plans.filter(programPlan => {
    return (
      programPlan.publishedAt &&
      !enrolledProgramIds.includes(programPlan.id) &&
      !programPlan.isSubscription &&
      !(enabledModules.group_buying && programPlan.groupBuyingPeople > 1)
    )
  })?.[0]
  const type = 'ProgramPlan'
  const target = firstPurchaseProgramPlan?.id
  const { resourceCollection } = useResourceCollection([`${appId}:${camelCaseToSnake(type)}:${target}`])
  const sessionStorageKey = `lodestar.sharing_code.${type}_${target}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)
  const handleAddCart = () => {
    return addCartProduct?.(type, target, {
      from: window.location.pathname,
      sharingCode,
    }).catch(handleError)
  }

  return (
    <Box overflow="hidden">
      <Banner
        coverUrl={{
          videoUrl: program.coverType.includes('video') && !!program.coverUrl ? program.coverUrl : undefined,
          mobileUrl: program.coverMobileUrl || undefined,
          desktopUrl: program.coverUrl || undefined,
        }}
      >
        <StyledTitleBlock>
          <StyledCoverLabelWrapper>
            <StyledCoverLabel>
              <p>{program.moduleData?.[layoutTemplateConfigMap.coverLabel]}</p>
            </StyledCoverLabel>
          </StyledCoverLabelWrapper>

          <IconWrapper>
            <SocialSharePopover url={window.location.href} />
          </IconWrapper>
          <ContentWrapper>
            <WordingWrapper>
              <StyledInstructor className="text-start">
                {program.roles
                  .filter(role => role.name === 'instructor')
                  .map(role => role.memberName)
                  .join(', ')}
              </StyledInstructor>
              <StyledTitle className="text-start">{program.title}</StyledTitle>
            </WordingWrapper>
            <ButtonWrapper>
              {firstPurchaseProgramPlan && (
                <EnrollButton
                  onClick={() => {
                    const resource = resourceCollection?.find(notEmpty)
                    resource && tracking.addToCart(resource, { direct: true })
                    handleAddCart()?.then(() => {
                      history.push('/cart?direct=true', { productUrn: resource?.urn })
                    })
                  }}
                >
                  {formatMessage(commonMessages.ui.ctaButton)}
                </EnrollButton>
              )}
              {hasIntroductionVideo ? (
                <PreviewButton colorScheme="outlined" onClick={scrollToPreview} leftIcon={<PlayIcon />}>
                  {formatMessage(commonMessages.ui.previewButton)}
                </PreviewButton>
              ) : (
                <div />
              )}
            </ButtonWrapper>
          </ContentWrapper>
        </StyledTitleBlock>
      </Banner>
    </Box>
  )
}

export default SecondaryProgramBanner
