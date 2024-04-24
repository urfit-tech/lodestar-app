import { Button, Icon } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { defineMessage, useIntl } from 'react-intl'
import { Link, Redirect, useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import Responsive, { BREAK_POINT } from '../../../../components/common/Responsive'
import DefaultLayout from '../../../../components/layout/DefaultLayout'
import ReviewCollectionBlock from '../../../../components/review/ReviewCollectionBlock'
import MediaPlayerContext from '../../../../contexts/MediaPlayerContext'
import PodcastPlayerContext from '../../../../contexts/PodcastPlayerContext'
import { desktopViewMixin, handleError, rgba } from '../../../../helpers'
import { commonMessages } from '../../../../helpers/translation'
import { useEnrolledProgramIds, useProgram, useProgramPlansEnrollmentsAggregateList } from '../../../../hooks/program'
import { useEnrolledProgramPackage } from '../../../../hooks/programPackage'
import { ReactComponent as PlayIcon } from '../../../../images/play-fill-icon.svg'
import ForbiddenPage from '../../../ForbiddenPage'
import LoadingPage from '../../../LoadingPage'
import { CustomizeProgramBanner, PerpetualProgramBanner } from '../../ProgramBanner'
import ProgramBestReviewsCarousel from '../../ProgramBestReviewsCarousel'
import ProgramContentListSection from '../../ProgramContentListSection'
import ProgramContentCountBlock from '../../ProgramInfoBlock/ProgramContentCountBlock'
import ProgramInfoCard, { StyledProgramInfoCard } from '../../ProgramInfoBlock/ProgramInfoCard'
import ProgramInstructorCollectionBlock from '../../ProgramInstructorCollectionBlock'
import ProgramPageHelmet from '../../ProgramPageHelmet'
import ProgramPlanCard from '../../ProgramPlanCard'
import ProgramTagCard from '../../ProgramTagCard'

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

const SecondaryProgramPageContent: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const { currentMemberId } = useAuth()
  const location = useLocation()
  const params = queryString.parse(location.search)
  const [visitIntro] = useQueryParam('visitIntro', BooleanParam)
  const [previousPage] = useQueryParam('back', StringParam)
  const { programId } = useParams<{ programId: string }>()
  const { settings, enabledModules, loading: loadingApp } = useApp()
  const { visible: podcastPlayerVisible } = useContext(PodcastPlayerContext)
  const { visible: mediaPlayerVisible } = useContext(MediaPlayerContext)
  const { loadingProgram, program, addProgramView } = useProgram(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const { loading: loadingEnrolledProgramIds, enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const { loading: loadingProgramPlansEnrollmentsAggregateList, programPlansEnrollmentsAggregateList } =
    useProgramPlansEnrollmentsAggregateList(program?.plans.map(plan => plan.id) || [])
  const [isPlanListSticky, setIsPlanListSticky] = useState(false)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const planListHeightRef = useRef<HTMLDivElement>(null)

  const isEnrolled = enrolledProgramIds.includes(programId)

  try {
    const visitedPrograms = JSON.parse(sessionStorage.getItem('kolable.programs.visited') || '[]') as string[]
    if (!visitedPrograms.includes(programId)) {
      visitedPrograms.push(programId)
      sessionStorage.setItem('kolable.programs.visited', JSON.stringify(visitedPrograms))
      addProgramView()
    }
  } catch (error) {
    handleError(error)
  }

  useEffect(() => {
    if (customerReviewBlockRef.current && params.moveToBlock === 'customer-review') {
      setTimeout(() => customerReviewBlockRef.current?.scrollIntoView({ behavior: 'smooth' }), 1000)
    }
  }, [customerReviewBlockRef, params])

  useEffect(() => {
    ReactGA.ga('send', 'pageview')
  }, [])

  useEffect(() => {
    if (!loadingProgramPlansEnrollmentsAggregateList) {
      setIsPlanListSticky(window.innerHeight > (planListHeightRef.current?.clientHeight || 0) + 104)
    }
  }, [loadingProgramPlansEnrollmentsAggregateList])

  if (!loadingEnrolledProgramIds && !visitIntro && isEnrolled) {
    return <Redirect to={`/programs/${programId}/contents?back=${previousPage || `programs_${programId}`}`} />
  }

  if (
    loadingProgram ||
    enrolledProgramPackages.loading ||
    loadingEnrolledProgramIds ||
    loadingProgramPlansEnrollmentsAggregateList
  ) {
    return <LoadingPage />
  }

  if (!program) {
    return <ForbiddenPage />
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
      {!loadingApp && <ProgramPageHelmet program={program} />}

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
                    <ProgramContentListSection program={program} />
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
                  <Responsive.Desktop>
                    <ProgramInfoCard instructorId={instructorId} program={program} />
                  </Responsive.Desktop>

                  {!isEnrolledByProgramPackage && programPlansEnrollmentsAggregateList && (
                    <div
                      id="subscription"
                      className={`mb-5${isPlanListSticky ? ' programPlanSticky' : ''}`}
                      ref={planListHeightRef}
                    >
                      {program.plans
                        .filter(programPlan => programPlan.publishedAt)
                        .map(programPlan => (
                          <div key={programPlan.id} className="mb-3">
                            <ProgramPlanCard
                              programId={program.id}
                              programPlan={programPlan}
                              enrollmentCount={
                                programPlansEnrollmentsAggregateList.find(v => v.id === programPlan.id)?.enrollmentCount
                              }
                              isProgramSoldOut={Boolean(program.isSoldOut)}
                              isPublished={Boolean(program.publishedAt)}
                            />
                          </div>
                        ))}
                    </div>
                  )}
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
          <FixedBottomBlock bottomSpace={podcastPlayerVisible || mediaPlayerVisible ? '92px' : ''}>
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

export default SecondaryProgramPageContent
