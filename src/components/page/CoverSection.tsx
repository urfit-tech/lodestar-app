import { Heading } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

const StyledSection = styled.section`
  margin-bottom: 80px;
`
const SliderWrapper = styled.div`
  position: relative;
  padding-top: 36%;
`
const StyledSlider = styled(Slider)`
  && {
    position: relative;

    .slick-dots {
      position: absolute;
      bottom: 5%;
    }
    li button::before {
      opacity: 1;
      font-size: 10px;
      color: #cdcdcd;
      transition: 0.3s;
    }
    li.slick-active button::before {
      color: ${props => props.theme['@primary-color']};
    }

    @media (min-width: ${BREAK_POINT}px) {
      li button::before {
        font-size: 12px;
      }
    }
  }
`
const StyledCoverBackground = styled.div<{
  srcDesktop: string
  srcMobile: string
}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-image: url(${props => props.srcDesktop});
  background-size: cover;
  background-position: top center;
`
const StyledCoverHeading = styled(Heading)`
  color: ${props => (props?.headColor ? props.headColor : '#fff')};
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 52px;
    line-height: 1.3;
    letter-spacing: 1px;
    text-align: center;
  }
`

const StyledCoverSubHeading = styled(Heading)`
  color: ${props => (props?.headColor ? props.headColor : '#fff')};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 27px;
    text-align: center;
  }
`

const StyledCoverButton = styled.div`
  border-radius: 4px;
  width: 142px;
  height: 44px;
  background: ${props => props.theme['@primary-color']};
  color: white;
  line-height: 44px;
  @media (min-width: ${BREAK_POINT}px) {
    text-align: center;
  }
`

const CoverSection: React.FC<{
  options: {
    coverInfos: {
      id: number
      srcDesktop: string
      srcMobile: string
      title: string
      subtitle: string
      buttonText: string
      link: string
      external: boolean
    }[]
    sectionHeight: { desktopHeight: string; mobileHeight: string }
  }
}> = ({ options }) => {
  const history = useHistory()
  const [scale, setScale] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleResize = useCallback(() => {
    if (containerRef.current && cardRef.current) {
      setScale(containerRef.current.offsetWidth / cardRef.current.offsetWidth)
    }
  }, [containerRef, cardRef])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <StyledSection>
      <StyledSlider dots infinite arrows={false} autoplay autoplaySpeed={5000}>
        {options.coverInfos.map(v => (
          <div>
            <SliderWrapper ref={containerRef}>
              <StyledCoverBackground
                key={v.id}
                ref={cardRef}
                srcDesktop={v.srcDesktop}
                srcMobile={v.srcMobile}
                className={`d-flex align-items-center${v.buttonText ? '' : ' cursor-pointer'} cover-background`}
                onClick={() => {
                  if (v.buttonText) {
                    return
                  }
                  if (!v.link) return
                  v.external ? window.open(v.link) : history.push(v.link)
                }}
              >
                <div className="container">
                  {v.title && (
                    <StyledCoverHeading as="h1" className="mb-3 cover-heading">
                      {v.title}
                    </StyledCoverHeading>
                  )}
                  {v.subtitle && (
                    <StyledCoverSubHeading as="h2" className="mb-4 cover-sub-heading">
                      {v.subtitle}
                    </StyledCoverSubHeading>
                  )}
                  {v.buttonText && (
                    <StyledCoverButton className="cover-button">
                      <Link to={v.link}>{v.buttonText}</Link>
                    </StyledCoverButton>
                  )}
                </div>
              </StyledCoverBackground>
            </SliderWrapper>
          </div>
        ))}
      </StyledSlider>
    </StyledSection>
  )
}

export default CoverSection
