import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { useEquityProgramByProgramId, useProgram, useProgramPlansEnrollmentsAggregateList } from '../../hooks/program'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
import ForbiddenPage from '../ForbiddenPage'
import LoadingPage from '../LoadingPage'
import ProgramPageContent from './ProgramPageContent'

const ProgramPage: React.VFC = () => {
  const [visitIntro] = useQueryParam('visitIntro', BooleanParam)
  const [previousPage] = useQueryParam('back', StringParam)
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  const [utmSource] = useQueryParam('utm_source', StringParam)
  const { programId } = useParams<{ programId: string }>()

  const tracking = useTracking()
  const { id: appId } = useApp()
  const { loadingProgram, program } = useProgram(programId)
  const { isAuthenticating } = useAuth()
  const { loading: loadingResourceCollection, resourceCollection } = useResourceCollection(
    [`${appId}:program:${programId}`],
    true,
  )

  const { currentMemberId } = useAuth()
  const { isEquityProgram, loadingEquityProgram } = useEquityProgramByProgramId(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const { loading: loadingProgramPlansEnrollmentsAggregateList } = useProgramPlansEnrollmentsAggregateList(
    program?.plans.map(plan => plan.id) || [],
  )

  useEffect(() => {
    const resource = resourceCollection[0]
    if (!isAuthenticating && !loadingResourceCollection && resource && tracking) {
      tracking.detail(resource, { collection: pageFrom || undefined, utmSource: utmSource || '' })
    }
  }, [resourceCollection, tracking, pageFrom, utmSource, isAuthenticating, loadingResourceCollection])

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

  return (
    <DefaultLayout
      white
      footerBottomSpace={program.plans.length > 1 ? '60px' : '132px'}
      noHeader={loadingProgram ? true : !program.displayHeader}
      noFooter={loadingProgram ? true : !program.displayFooter}
    >
      <ProgramPageContent program={program} layoutTemplateVariant={program.programLayoutTemplateVariant} />
    </DefaultLayout>
  )
}

export default ProgramPage
