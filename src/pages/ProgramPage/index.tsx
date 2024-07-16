import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useProgram } from '../../hooks/program'
import ProgramPageContent from './ProgramPageContent'

const ProgramPage: React.VFC = () => {
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  const [utmSource] = useQueryParam('utm_source', StringParam)
  const tracking = useTracking()
  const { programId } = useParams<{ programId: string }>()
  const { id: appId } = useApp()
  const { program } = useProgram(programId)
  const { isAuthenticating } = useAuth()
  const { loading: loadingResourceCollection, resourceCollection } = useResourceCollection(
    [`${appId}:program:${programId}`],
    true,
  )

  useEffect(() => {
    const resource = resourceCollection[0]
    if (!isAuthenticating && !loadingResourceCollection && resource && tracking) {
      tracking.detail(resource, { collection: pageFrom || undefined, utmSource: utmSource || '' })
    }
  }, [resourceCollection, tracking, pageFrom, utmSource, isAuthenticating, loadingResourceCollection])

  return <ProgramPageContent layoutTemplateVariant={program?.programLayoutTemplateVariant} />
}

export default ProgramPage
