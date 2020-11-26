import React from 'react'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const CreatorDisplayedPage: React.FC<{}> = () => {
  const { loading, enabledModules } = useApp()

  if (loading) {
    return <LoadingPage />
  }

  if (!enabledModules.creator_display) {
    return <NotFoundPage />
  }

  return <DefaultLayout></DefaultLayout>
}

export default CreatorDisplayedPage
