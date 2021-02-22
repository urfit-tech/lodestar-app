import React from 'react'
import { Redirect } from 'react-router-dom'
import { usePage } from '../hooks/page'
import LoadingPage from './LoadingPage'
import ModularPage from './ModularPage'

const HomePage = () => {
  const { sections } = usePage()
  if (!sections) return <LoadingPage />

  return sections ? <ModularPage sections={sections} /> : <Redirect to="/programs" />
}

export default HomePage
