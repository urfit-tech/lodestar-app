import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import PictureBanner from './PictureBanner'
import VideoBanner from './VideoBanner'

const Banner: React.FC<{
  coverUrl: { mobileUrl?: string | undefined; desktopUrl?: string | undefined; videoUrl?: string | undefined }
  children: React.ReactNode
}> = ({ coverUrl, children }) => {
  const isDesktop = useMediaQuery({ minWidth: BREAK_POINT })
  const isVideo = isDesktop && coverUrl?.videoUrl
  if (isVideo) {
    return (
      <VideoBanner coverUrl={coverUrl} width={{ desktop: '40vw', mobile: '400px' }} videoWidth="100%">
        {children}
      </VideoBanner>
    )
  } else {
    return (
      <PictureBanner coverUrl={coverUrl} width={{ desktop: '700px', mobile: '400px' }}>
        {children}
      </PictureBanner>
    )
  }
}
export default Banner
