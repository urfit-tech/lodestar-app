import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
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
import { useEnrolledProgramIds, useProgram, useProgramPlansEnrollmentsAggregateList } from '../../../../hooks/program'
import { useEnrolledProgramPackage } from '../../../../hooks/programPackage'
import ForbiddenPage from '../../../ForbiddenPage'
import LoadingPage from '../../../LoadingPage'
import SecondaryProgramBanner from '../../ProgramBanner/SecondaryProgramBanner'
import ProgramContentListSection from '../../ProgramContentListSection'
import SecondaryProgramInfoCard from '../../ProgramInfoBlock/SecondaryProgramInfoCard'
import ProgramInstructorCollectionBlock from '../../ProgramInstructorCollectionBlock'
import ProgramPageHelmet from '../../ProgramPageHelmet'
import ProgramPlanCard from '../../ProgramPlanCard'

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    padding-left: 35px;
  `)}
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
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
        <SecondaryProgramBanner
          program={program}
          isEnrolledByProgramPackage={isEnrolledByProgramPackage}
          isDelivered={isDelivered}
        />

        <ProgramIntroBlock>
          <div className="container">
            <div className="row">
              <ContentWrapper className="col-12 col-lg-8">
                <SecondaryProgramInfoCard program={program} />
                <BraftContent>{program.description}</BraftContent>
                <ProgramInstructorCollectionBlock program={program} />
                <ProgramContentListSection program={program} />
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
              </StyledIntroWrapper>
            </div>
          </div>
        </ProgramIntroBlock>
      </div>
    </DefaultLayout>
  )
}

export default SecondaryProgramPageContent
