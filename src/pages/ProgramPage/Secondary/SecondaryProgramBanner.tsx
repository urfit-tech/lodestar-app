import { Badge, Text } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError, notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CountDownTimeBlock from '../../../components/common/CountDownTimeBlock'
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

const StyledWrapper = styled.div`
  overflow: hidden;
  @media (min-width: ${BREAK_POINT}px) {
    width: 100vw;
    height: calc(100vw * 9 / 21);
  }
`

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  item-justify: center;
  padding: 10vmin;
  justify-content: space-between;

  @media (min-width: ${BREAK_POINT}px) {
    // left: 80px;
    // bottom: 60px;
  }

  @media (max-width: 576px) {
    // bottom: 16px;
  }
`

const StyledCoverLabelWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`

const IconWrapper = styled.a`
  position: relative;
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
  max-width: 100%;
  white-space: normal;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
    max-width: 520px;
    white-space: nowrap;
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

const StyledCoverLabel = styled(Badge)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  padding: 0.4rem;
  height: 1.8rem;
  font-weight: 600;
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
    width: 100%;
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

const StyledCountDownBlock = styled.div`
  display: flex;
  margin-top: 5px;
  margin-left: 8px;
  @media (min-width: ${BREAK_POINT}px) {
    display: inline-block;
  }
`

const StyledSaleButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const layoutTemplateConfigMap: Record<string, string> = {
  coverLabel: 'ef021415-0a5f-44a1-9530-de419f9431e0',
}

const SecondaryProgramBanner: React.FC<{
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
  const firstPublishProgramPlan = program.plans.filter(plan => !!plan.publishedAt)[0]
  const firstProgramPlanIsOnSale = (firstPublishProgramPlan?.soldAt?.getTime() || 0) > Date.now()

  return (
    <StyledWrapper>
      <Banner
        coverUrl={{
          videoUrl: program.coverType.includes('video') && !!program.coverUrl ? program.coverUrl : undefined,
          mobileUrl: program.coverMobileUrl || undefined,
          desktopUrl: program.coverUrl || undefined,
        }}
      >
        <StyledTitleBlock>
          <ContentWrapper>
            <StyledCoverLabelWrapper>
              {program.moduleData?.[layoutTemplateConfigMap.coverLabel] ? (
                <StyledCoverLabel colorScheme="secondary" variant="solid" style={{ margin: 0 }}>
                  <p>{program.moduleData?.[layoutTemplateConfigMap.coverLabel]}</p>
                </StyledCoverLabel>
              ) : (
                <div />
              )}
              <IconWrapper>
                <SocialSharePopover url={window.location.href} />
              </IconWrapper>
            </StyledCoverLabelWrapper>

            <div>
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
                {hasIntroductionVideo ? (
                  <PreviewButton colorScheme="outlined" onClick={scrollToPreview} leftIcon={<PlayIcon />}>
                    {formatMessage(commonMessages.ui.previewButton)}
                  </PreviewButton>
                ) : null}
                {firstPurchaseProgramPlan && (
                  <>
                    <StyledSaleButtonWrapper>
                      <EnrollButton
                        onClick={() => {
                          const resource = resourceCollection?.find(notEmpty)
                          resource && tracking.addToCart(resource, { direct: true })
                          handleAddCart()?.then(() => {
                            history.push('/cart?direct=true', { productUrn: resource?.urn })
                          })
                        }}
                      >
                        {firstPublishProgramPlan?.salePrice === null && firstPublishProgramPlan?.listPrice === 0
                          ? `${formatMessage(commonMessages.button.join)} $${firstPublishProgramPlan?.listPrice}`
                          : formatMessage(commonMessages.ui.ctaButton, {
                              price: ` $${
                                firstPublishProgramPlan?.salePrice !== null
                                  ? firstPublishProgramPlan?.salePrice
                                  : firstPublishProgramPlan?.listPrice
                              }`,
                            })}
                      </EnrollButton>
                      {firstPublishProgramPlan?.salePrice !== null && (
                        <Text
                          as="del"
                          style={{ color: '#D3D3D3', textShadow: '2px 2px 3px #333333', padding: '2px' }}
                          marginLeft="4px"
                        >{`$${firstPublishProgramPlan?.listPrice}`}</Text>
                      )}
                    </StyledSaleButtonWrapper>
                  </>
                )}
              </ButtonWrapper>
              {firstPublishProgramPlan?.isCountdownTimerVisible &&
                firstPublishProgramPlan?.soldAt &&
                firstProgramPlanIsOnSale && (
                  <StyledCountDownBlock>
                    <CountDownTimeBlock yellow renderIcon={() => <div />} expiredAt={firstPublishProgramPlan?.soldAt} />
                  </StyledCountDownBlock>
                )}
            </div>
          </ContentWrapper>
        </StyledTitleBlock>
      </Banner>
    </StyledWrapper>
  )
}

export default SecondaryProgramBanner
