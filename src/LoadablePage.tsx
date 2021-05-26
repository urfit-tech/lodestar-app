import { Alert } from 'antd'
import React, { lazy, useMemo } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { Redirect, useLocation } from 'react-router-dom'
import { useAuth } from './components/auth/AuthContext'
import { UserRoleName } from './components/common/UserRoleName'
import { useApp } from './containers/common/AppContext'
import { getUserRoleLevel } from './helpers'
import { useGAPageView } from './hooks/util'
import { UserRole } from './types/member'

const LoadablePage: React.VFC<{
  pageName: string
  authenticated?: boolean
  allowedUserRole?: UserRole
}> = ({ pageName, authenticated, allowedUserRole, ...props }) => {
  const location = useLocation()
  const { isAuthenticated, isAuthenticating, currentUserRole } = useAuth()
  const { settings } = useApp()

  useGAPageView()
  settings['tracking.fb_pixel_id'] && ReactPixel.pageView()

  const Page = useMemo(() => {
    return lazy(() => {
      if (isAuthenticating) {
        return import(`./pages/LoadingPage`)
      }
      const pageComponent =
        allowedUserRole && getUserRoleLevel(allowedUserRole) > getUserRoleLevel(currentUserRole)
          ? import(`./pages/ForbiddenPage`) // load forbidden page if not allowed roles
          : import(`./pages/${pageName}`).catch(() => import('./pages/NotFoundPage'))

      return pageComponent
    })
  }, [allowedUserRole, currentUserRole, isAuthenticating, pageName])

  // redirect to home page if not authenticated
  if (authenticated && !isAuthenticating && !isAuthenticated) {
    return <Redirect to={{ pathname: '/', search: `?back=${location.pathname}`, state: { from: location } }} />
  }

  return (
    <>
      {getUserRoleLevel(currentUserRole) > getUserRoleLevel('general-member') && (
        // node to string
        <Alert message={<UserRoleName userRole={currentUserRole} />} type="warning" closable />
      )}
      <Page {...props} />
    </>
  )
}

export default LoadablePage
