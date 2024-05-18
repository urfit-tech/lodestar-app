import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { Redirect, useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { BREAK_POINT } from '../../../../components/common/Responsive'
import DefaultLayout from '../../../../components/layout/DefaultLayout'
import MediaPlayerContext from '../../../../contexts/MediaPlayerContext'
import PodcastPlayerContext from '../../../../contexts/PodcastPlayerContext'
import { desktopViewMixin, handleError } from '../../../../helpers'
import {
  useEquityProgramByProgramId,
  useProgram,
  useProgramPlansEnrollmentsAggregateList,
} from '../../../../hooks/program'
import { useEnrolledProgramPackage } from '../../../../hooks/programPackage'
import { DisplayModeEnum } from '../../../../types/program'
import ForbiddenPage from '../../../ForbiddenPage'
import LoadingPage from '../../../LoadingPage'
import ProgramPageHelmet from '../../Primary/ProgramPageHelmet'
import PreviewBlock from '../PreviewBlock'
import ProgramIntroTabs from '../ProgramIntroTabs'
import SecondaryProgramBanner from '../SecondaryProgramBanner'
import SecondaryProgramInfoCard from '../SecondaryProgramInfoCard'
import SecondaryProgramPlanCard from '../SecondaryProgramPlanCard'

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    padding-left: 35px;
  `)}
`
const ProgramAbstract = styled.span`
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  width: 100%;
`
const VideoIframe = styled.iframe`
  width: 100%;
  height: 315px;
`

const ContentWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
  margin-bottom: 3rem;
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
  const { isEquityProgram, loadingEquityProgram } = useEquityProgramByProgramId(programId)
  const { loading: loadingProgramPlansEnrollmentsAggregateList, programPlansEnrollmentsAggregateList } =
    useProgramPlansEnrollmentsAggregateList(program?.plans.map(plan => plan.id) || [])
  const [isPlanListSticky, setIsPlanListSticky] = useState(false)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const planListHeightRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const scrollToPreview = () => previewRef?.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToPlanBlock = () => planBlockRef?.current?.scrollIntoView({ behavior: 'smooth' })

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

  if (!loadingEquityProgram && !visitIntro && isEquityProgram) {
    return <Redirect to={`/programs/${programId}/contents?back=${previousPage || `programs_${programId}`}`} />
  }

  if (
    loadingProgram ||
    enrolledProgramPackages.loading ||
    loadingEquityProgram ||
    loadingProgramPlansEnrollmentsAggregateList
  ) {
    return <LoadingPage />
  }

  if (!program) {
    return <ForbiddenPage />
  }
  const isEnrolledByProgramPackage = !!enrolledProgramPackages.data.length

  const isDelivered = isEnrolledByProgramPackage
    ? enrolledProgramPackages.data.some(programPackage =>
        programPackage.enrolledPlans.some(plan => !plan.isTempoDelivery)
          ? true
          : programPackage.programs.some(program => program.id === programId && program.isDelivered),
      )
    : false

  const trailProgramContents = program.contentSections
    .filter(programContentSection => programContentSection.contents.length)
    .map(programContentSection =>
      programContentSection.contents
        .filter(
          programContent =>
            programContent.displayMode === DisplayModeEnum.trial ||
            programContent.displayMode === DisplayModeEnum.loginToTrial,
        )
        .filter(programContent => programContent.contentType === 'audio' || programContent.contentType === 'video'),
    )
    .flat()

  console.log(trailProgramContents)

  const testYoutubeVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=bX981Ok7fCc5jQfp'
  return (
    <DefaultLayout white footerBottomSpace={program.plans.length > 1 ? '60px' : '132px'}>
      {!loadingApp && <ProgramPageHelmet program={program} />}

      <div>
        <SecondaryProgramBanner
          program={program}
          isEnrolledByProgramPackage={isEnrolledByProgramPackage}
          isDelivered={isDelivered}
          hasTrail={trailProgramContents?.length > 0}
          scrollToPreview={scrollToPreview}
          scrollToPlanBlock={scrollToPlanBlock}
        />

        <ProgramIntroBlock>
          <div className="container">
            <div className="row">
              <ContentWrapper className="col-12 col-lg-8">
                <SecondaryProgramInfoCard program={program} />
                <ProgramAbstract>{program?.abstract}</ProgramAbstract>
                <VideoIframe src={testYoutubeVideo} />
                <ProgramIntroTabs program={program} />
                <PreviewBlock ref={previewRef} trailProgramContents={trailProgramContents} />
              </ContentWrapper>

              <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4">
                <div
                  id="subscription"
                  className={`mb-5${isPlanListSticky ? ' programPlanSticky' : ''}`}
                  ref={planListHeightRef}
                >
                  {program.plans
                    .filter(programPlan => programPlan.publishedAt)
                    .map(programPlan => (
                      <div key={programPlan.id} className="mb-3">
                        <SecondaryProgramPlanCard
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
              </StyledIntroWrapper>
            </div>
          </div>
        </ProgramIntroBlock>
      </div>
    </DefaultLayout>
  )
}

export default SecondaryProgramPageContent
