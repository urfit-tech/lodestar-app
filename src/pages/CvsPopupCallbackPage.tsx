import queryString from 'query-string'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const CvsPopupCallbackPage: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (window.opener) {
      ;(window.opener as any).callCvsPopupCallback(params)
      window.close()
    }
  }, [location.search])

  return <div />
}

export default CvsPopupCallbackPage
