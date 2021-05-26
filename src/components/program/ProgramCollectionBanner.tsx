import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  margin-bottom: 1.5rem;
`
const StyledImage = styled.img`
  width: 100%;
`

const LinkWrapper: React.FC<{
  link?: string | null
}> = ({ link, children }) => {
  if (!link) {
    return <>{children}</>
  }

  if (link.startsWith('http')) {
    return (
      <a href={link} rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return <Link to={link}>{children}</Link>
}

const ProgramCollectionBanner: React.VFC<{
  link?: string
  imgUrls: {
    [key: number]: string // min-width
  }
}> = ({ link, imgUrls }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  const handleResize = useCallback(() => {
    const targetWidth = Object.keys(imgUrls)
      .map(v => parseInt(v))
      .sort((a, b) => b - a)
      .find(minWidth => window.innerWidth > minWidth)

    if (!targetWidth || !imgUrls[targetWidth]) {
      setImgUrl(imgUrls[0])
    } else {
      setImgUrl(imgUrls[targetWidth])
    }
  }, [imgUrls])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  if (!imgUrl) {
    return null
  }

  return (
    <StyledWrapper>
      <LinkWrapper link={link}>
        <StyledImage src={imgUrl} alt="program-collection-banner" />
      </LinkWrapper>
    </StyledWrapper>
  )
}

export default ProgramCollectionBanner
