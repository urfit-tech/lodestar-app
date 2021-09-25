import React from 'react'
import ReactPixel from 'react-facebook-pixel'
import { useApp } from './containers/common/AppContext'
import { useGAPageView } from './hooks/util'

const LoadablePage: React.VFC<{ pageName: string }> = ({ pageName }) => {
  const { settings } = useApp()
  useGAPageView()
  settings['tracking.fb_pixel_id'] && ReactPixel.pageView()
  const PageComponent = React.lazy(() => import(`./pages/${pageName}`))
  return <PageComponent />
}

export default LoadablePage
