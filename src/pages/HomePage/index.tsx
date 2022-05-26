import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Redirect } from 'react-router-dom'
import AppPage from '../AppPage'

const HomePage: React.VFC = () => {
  const { settings } = useApp()
  return settings['home.redirect'] ? <Redirect to={settings['home.redirect']} /> : <AppPage />
}

export default HomePage
