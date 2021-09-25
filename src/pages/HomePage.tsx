import React from 'react'
import { Redirect } from 'react-router-dom'
import { useApp } from '../containers/common/AppContext'
import AppPage from './AppPage'

const HomePage: React.VFC = () => {
  const { settings } = useApp()
  return settings['home.redirect'] ? <Redirect to={settings['home.redirect']} /> : <AppPage />
}

export default HomePage
