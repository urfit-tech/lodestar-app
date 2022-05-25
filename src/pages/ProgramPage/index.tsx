import { Box, Button, Icon, Spinner } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { defineMessage, useIntl } from 'react-intl'
import { Link, Redirect, useHistory, useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import Responsive, { BREAK_POINT } from '../../components/common/Responsive'
import { BraftContent } from '../../components/common/StyledBraftEditor'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ReviewCollectionBlock from '../../components/review/ReviewCollectionBlock'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin, rgba } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledProgramIds, useProgram } from '../../hooks/program'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
import { ReactComponent as PlayIcon } from '../../images/play-fill-icon.svg'
import ForbiddenPage from '../ForbiddenPage'
import { CustomizeProgramBanner, PerpetualProgramBanner } from './ProgramBanner'
import ProgramBestReviewsCarousel from './ProgramBestReviewsCarousel'
import ProgramContentListSection from './ProgramContentListSection'
import ProgramContentCountBlock from './ProgramInfoBlock/ProgramContentCountBlock'
import ProgramInfoCard, { StyledProgramInfoCard } from './ProgramInfoBlock/ProgramInfoCard'
import ProgramInstructorCollectionBlock from './ProgramInstructorCollectionBlock'
import ProgramPageHelmet from './ProgramPageHelmet'
import ProgramPlanCard from './ProgramPlanCard'

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    order: 1;
    padding-left: 35px;
  `)}
`
const ProgramAbstract = styled.span`
  padding-right: 2px;
  padding-bottom: 2px;
  background-image: linear-gradient(
    to bottom,
    transparent 40%,
    ${props => rgba(props.theme['@primary-color'], 0.1)} 40%
  );
  background-repeat: no-repeat;
  font-size: 20px;
  font-weight: bold;
  white-space: pre-line;
`
const ProgramIntroBlock = styled.div`
  position: relative;
  padding-top: 2.5rem;
  padding-bottom: 6rem;
  background: white;

  @media (min-width: ${BREAK_POINT}px) {
    padding-top: 3.5rem;
    padding-bottom: 1rem;
  }
`
const FixedBottomBlock = styled.div<{ bottomSpace?: string }>`
  margin: auto;
  position: fixed;
  width: 100%;
  bottom: ${props => props.bottomSpace || 0};
  left: 0;
  right: 0;
  z-index: 999;
`
const StyledButtonWrapper = styled.div`
  padding: 0.5rem 0.75rem;
  background: white;
`

const ProgramPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { programId } = useParams<{ programId: string }>()
  const { pathname } = useLocation()
  const { currentMemberId } = useAuth()
  const { id: appId, settings, enabledModules } = useApp()
  const { resourceCollection } = useResourceCollection([`${appId}:program:${programId}`], true)
  const { visible } = useContext(PodcastPlayerContext)
  const { loadingProgram, program } = useProgram(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [visitIntro] = useQueryParam('visitIntro', BooleanParam)
  const params = queryString.parse(location.search)
  const { loading: loadingEnrolledProgramIds, enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const isEnrolled = enrolledProgramIds.includes(programId)
  const [previousPage] = useQueryParam('back', StringParam)

  useEffect(() => {
    if (customerReviewBlockRef.current && params.moveToBlock) {
      customerReviewBlockRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [customerReviewBlockRef, params])

  useEffect(() => {
    ReactGA.ga('send', 'pageview')
  }, [])

  if (loadingProgram || enrolledProgramPackages.loading || loadingEnrolledProgramIds) {
    return (
      <DefaultLayout>
        <Box className="d-flex justify-content-center align-items-center" h="100vh">
          <Spinner />
        </Box>
      </DefaultLayout>
    )
  }

  if (!program) {
    return <ForbiddenPage />
  }

  if (!visitIntro && isEnrolled) {
    return <Redirect to={`/programs/${programId}/contents?back=${previousPage}`} />
  }

  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''

  const isEnrolledByProgramPackage = !!enrolledProgramPackages.data.length

  const isDelivered = isEnrolledByProgramPackage
    ? enrolledProgramPackages.data.some(programPackage =>
        programPackage.enrolledPlans.some(plan => !plan.isTempoDelivery)
          ? true
          : programPackage.programs.some(program => program.id === programId && program.isDelivered),
      )
    : false

  return (
    <DefaultLayout white footerBottomSpace={program.plans.length > 1 ? '60px' : '132px'}>
      <ProgramPageHelmet program={program} />
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}

      <div>
        {Number(settings['layout.program_page']) ? (
          <CustomizeProgramBanner program={program} isEnrolled={isEnrolled} />
        ) : (
          <PerpetualProgramBanner
            program={program}
            isEnrolledByProgramPackage={isEnrolledByProgramPackage}
            isDelivered={isDelivered}
          />
        )}

        <ProgramIntroBlock>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                {!Number(settings['layout.program_page']) ? (
                  <Responsive.Default>
                    <StyledProgramInfoCard>
                      <ProgramContentCountBlock program={program} />
                    </StyledProgramInfoCard>
                  </Responsive.Default>
                ) : null}
                {!Number(settings['layout.program_page']) && program.abstract ? (
                  <div className="mb-5">
                    <ProgramAbstract>{program.abstract}</ProgramAbstract>
                  </div>
                ) : null}

                {Number(settings['layout.program_page']) ? (
                  <Responsive.Default>
                    <StyledIntroWrapper className="col-12 col-lg-4 mb-5 p-0">
                      {!!program.tags.length && (
                        <ProgramTagCard
                          tags={program.tags.map(tag => ({
                            id: tag,
                            name: tag,
                          }))}
                        />
                      )}
                    </StyledIntroWrapper>
                  </Responsive.Default>
                ) : null}

                {Number(settings['layout.program_page']) ? (
                  <div className="mb-5">
                    <ProgramBestReviewsCarousel
                      pathname={pathname}
                      onReviewBlockScroll={() => customerReviewBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    />
                  </div>
                ) : null}

                <div className="mb-5">
                  <BraftContent>{program.description}</BraftContent>
                </div>

                {!Number(settings['layout.program_page']) ? (
                  <div className="mb-5">
                    <ProgramContentListSection memberId={currentMemberId || ''} program={program} />
                  </div>
                ) : null}
              </div>

              {Number(settings['layout.program_page']) ? (
                <Responsive.Desktop>
                  <StyledIntroWrapper className="col-12 col-lg-4 mb-3">
                    {!!program.tags.length && (
                      <ProgramTagCard
                        tags={program.tags.map(tag => ({
                          id: tag,
                          name: tag,
                        }))}
                      />
                    )}
                  </StyledIntroWrapper>
                </Responsive.Desktop>
              ) : (
                <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4">
                  <div>
                    <Responsive.Desktop>
                      <ProgramInfoCard instructorId={instructorId} program={program} />
                    </Responsive.Desktop>

                    {!isEnrolledByProgramPackage && (
                      <div className="mb-5">
                        <div id="subscription">
                          {program.plans
                            .filter(programPlan => programPlan.publishedAt)
                            .map(programPlan => (
                              <div key={programPlan.id} className="mb-3">
                                <ProgramPlanCard programId={program.id} programPlan={programPlan} />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </StyledIntroWrapper>
              )}
            </div>

            {!Number(settings['layout.program_page']) ? (
              <div className="row">
                <div className="col-12 col-lg-8">
                  <div className="mb-5">
                    <ProgramInstructorCollectionBlock program={program} />
                  </div>
                </div>
              </div>
            ) : null}

            <div id="customer-review" ref={customerReviewBlockRef}>
              {enabledModules.customer_review && (
                <div className="row">
                  <div className="col-12 col-lg-8">
                    <div className="mb-5">
                      <ReviewCollectionBlock path={pathname} targetId={programId} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ProgramIntroBlock>
      </div>

      {!isEnrolledByProgramPackage && (
        <Responsive.Default>
          <FixedBottomBlock bottomSpace={visible ? '92px' : ''}>
            {Number(settings['layout.program_page']) ? (
              <StyledButtonWrapper>
                <Link to={isEnrolled ? `/programs/${program.id}/contents` : settings['link.program_page']}>
                  <Button isFullWidth colorScheme="primary" leftIcon={<Icon as={PlayIcon} />}>
                    {formatMessage(defineMessage({ id: 'common.ui.start', defaultMessage: '開始進行' }))}
                  </Button>
                </Link>
              </StyledButtonWrapper>
            ) : isEnrolled ? (
              <StyledButtonWrapper>
                <Link to={`${program.id}/contents`}>
                  <Button variant="primary" isFullWidth>
                    {formatMessage(commonMessages.button.enter)}
                  </Button>
                </Link>
              </StyledButtonWrapper>
            ) : (
              <StyledButtonWrapper>
                <Button
                  variant="primary"
                  isFullWidth
                  onClick={() => planBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {formatMessage(commonMessages.button.viewProject)}
                </Button>
              </StyledButtonWrapper>
            )}
          </FixedBottomBlock>
        </Responsive.Default>
      )}
    </DefaultLayout>
  )
}

const StyledProgramTagCard = styled.div`
  position: sticky;
  top: 20px;
  margin-top: 20px;
  border-radius: 4px;
  padding: 24px;
  background-color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
`

const StyleSubCategoryTag = styled(Button)`
  && {
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
`

const StyledViewAllButton = styled(Button)`
  && {
    font-size: 14px;

    &:hover {
      text-decoration: none;
    }
  }
`

const ProgramTagCard: React.VFC<{ tags: { id: string; name: string }[] }> = ({ tags }) => {
  const { formatMessage } = useIntl()
  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory()

  const resultTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name.includes('/') ? tag.name.split('/')[1] : tag.name,
  }))

  return (
    <StyledProgramTagCard>
      {resultTags.slice(0, 8).map(tag => (
        <StyleSubCategoryTag
          className="mb-2 mr-2"
          variant="outline"
          colorScheme="primary"
          onClick={() =>
            history.push('/search/advanced', {
              tagNameSList: [[tag.id]],
            })
          }
        >
          {tag.name}
        </StyleSubCategoryTag>
      ))}

      {resultTags.length > 8 && (
        <div className="mt-2 mb-3">
          <CommonModal title="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {resultTags.map(tag => (
              <StyleSubCategoryTag
                className="mb-2 mr-2"
                variant="outline"
                colorScheme="primary"
                onClick={() =>
                  history.push('/search/advanced', {
                    tagNameSList: [[tag.id]],
                  })
                }
              >
                {tag.name}
              </StyleSubCategoryTag>
            ))}
          </CommonModal>
          <StyledViewAllButton className="d-block" variant="link" onClick={() => setIsOpen(true)}>
            {formatMessage(defineMessage({ id: 'common.ui.viewAll', defaultMessage: '查看全部' }))}
          </StyledViewAllButton>
        </div>
      )}
    </StyledProgramTagCard>
  )
}

export default ProgramPage
