import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../../components/layout/DefaultLayout'
import LocaleContext from '../../contexts/LocaleContext'
import { useEquityProgramByProgramId, useProgram, useProgramPlansEnrollmentsAggregateList } from '../../hooks/program'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
import ForbiddenPage from '../ForbiddenPage'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
import ProgramPageHelmet from './Primary/ProgramPageHelmet'
import ProgramPageContent from './ProgramPageContent'

const ProgramPage: React.FC = () => {
  const [visitIntro] = useQueryParam('visitIntro', BooleanParam)
  const [previousPage] = useQueryParam('back', StringParam)
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  const [utmSource] = useQueryParam('utm_source', StringParam)
  const { programId } = useParams<{ programId: string }>()

  const tracking = useTracking()
  const { id: appId, loading: loadingApp } = useApp()
  const { loadingProgram, program } = useProgram(programId)
  const { isAuthenticating, currentMemberId } = useAuth()
  const { loading: loadingResourceCollection, resourceCollection } = useResourceCollection(
    [`${appId}:program:${programId}`],
    true,
  )
  const { isEquityProgram, loadingEquityProgram } = useEquityProgramByProgramId(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const { loading: loadingProgramPlansEnrollmentsAggregateList } = useProgramPlansEnrollmentsAggregateList(
    program?.plans.map(plan => plan.id) || [],
  )
  const { currentLocale } = useContext(LocaleContext)

  useEffect(() => {
    const resource = resourceCollection?.[0]
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

  if (program?.supportLocale !== null && !program.supportLocale?.some(locale => locale === currentLocale)) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout
      white
      footerBottomSpace={program.plans.length > 1 ? '60px' : '132px'}
      noHeader={loadingProgram ? true : !program.displayHeader}
      noFooter={loadingProgram ? true : !program.displayFooter}
    >
      {!loadingApp && <ProgramPageHelmet program={program} />}

      <ProgramPageContent program={program} layoutTemplateVariant={program.programLayoutTemplateVariant} />
    </DefaultLayout>
  )
}

export default ProgramPage
