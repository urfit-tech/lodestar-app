import { Heading } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'

const StyledSection = styled.section`
  margin-bottom: 80px;
  /* clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%); */
`

const StyledSlider = styled(Slider)`
  && {
    position: relative;

    .slick-dots {
      position: absolute;
      bottom: 10%;
    }
    li button::before {
      opacity: 1;
      font-size: 6px;
      color: #cdcdcd;
      transition: 0.3s;
    }
    li.slick-active button::before {
      color: ${props => props.theme['@primary-color']};
    }

    @media (min-width: ${BREAK_POINT}px) {
      li button::before {
        font-size: 10px;
      }
    }
  }
`

const StyledCoverBackground = styled.div<{ srcDesktop: string; srcMobile: string }>`
  width: 100%;
  height: 370px;
  background-image: url(${props => props.srcMobile});
  background-size: cover;
  background-position: top center;

  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.srcDesktop});
    height: 728px;
  }
`
const StyledCoverContainer = styled.div`
  margin-bottom: 10%;
`
const StyledCoverHeading = styled(Heading)`
  max-width: 208px;
  color: #3b517f;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 410px;
    font-size: 66px;
  }
`

const StyledCoverSubHeading = styled(Heading)`
  max-width: 200px;
  color: #ac2323;
  font-size: 16px;
  font-weight: 500;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 456px;
  }
`

const StyledCoverLink = styled(Link)`
  display: inline-block;
  border-radius: 4px;
  width: 142px;
  height: 44px;
  background: ${props => props.theme['@primary-color']};
  color: white;
  line-height: 44px;
  text-align: center;
`

const CoverSection: React.FC = () => {
  const history = useHistory()
  const { settings } = useApp()

  const coverInfos: {
    srcDesktop: string
    srcMobile: string
    link?: string
    external?: boolean
    title?: string
    subtitle?: string
    buttonText?: string
  }[] = (() => {
    try {
      return JSON.parse(settings['homepage_cover_slides'])
    } catch {
      return []
    }
  })()

  return (
    <StyledSection>
      <StyledSlider dots infinite arrows={false} autoplay autoplaySpeed={5000}>
        {coverInfos.map(({ srcDesktop, srcMobile, title, subtitle, buttonText, link, external }) => (
          <StyledCoverBackground
            key={srcDesktop}
            srcDesktop={srcDesktop}
            srcMobile={srcMobile}
            className={`d-flex align-items-center${buttonText ? '' : ' cursor-pointer'}`}
            onClick={() => {
              if (buttonText) {
                return
              }
              if (!link) return
              external ? window.open(link) : history.push(link)
            }}
          >
            <StyledCoverContainer className="container">
              {title && (
                <StyledCoverHeading as="h1" className="mb-3">
                  {title}
                </StyledCoverHeading>
              )}
              {subtitle && (
                <StyledCoverSubHeading as="h2" className="mb-4">
                  {subtitle}
                </StyledCoverSubHeading>
              )}
              {buttonText && <StyledCoverLink to={link || ''}>{buttonText}</StyledCoverLink>}
            </StyledCoverContainer>
          </StyledCoverBackground>
        ))}
      </StyledSlider>
    </StyledSection>
  )
}

export default CoverSection
