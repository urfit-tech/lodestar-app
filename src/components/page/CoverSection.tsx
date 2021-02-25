import { Heading } from '@chakra-ui/react'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

const StyledSection = styled.section`
  margin-bottom: 80px;
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
  height?: { desktopHeight: string; mobileHeight: string }
  srcDesktop: string
  srcMobile: string
}>`
  width: 100%;
  height: ${props => (props.height?.mobileHeight ? props.height.mobileHeight : '600px')};
  background-image: url(${props => props.srcMobile});
  background-size: cover;
  background-position: top center;

  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.srcDesktop});
    height: ${props => (props.height?.desktopHeight ? props.height.desktopHeight : '600px')};
  }
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

const StyledCoverButton = styled(Link)`
  display: inline-block;
  border-radius: 4px;
  width: 142px;
  height: 44px;
  background: ${props => props.theme['@primary-color']};
  color: white;
  line-height: 44px;
  text-align: center;
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
  return (
    <StyledSection>
      <StyledSlider dots infinite arrows={false} autoplay autoplaySpeed={5000}>
        {options.coverInfos.map(
          (v: {
            id: number
            srcDesktop: string
            srcMobile: string
            title: string
            subtitle: string
            buttonText: string
            link: string
            external: boolean
            renderHeading?: () => React.ReactElement
            renderSubHeading?: () => React.ReactElement
            renderButton?: () => React.ReactElement
          }) => (
            <StyledCoverBackground
              key={v.id}
              height={options.sectionHeight}
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
                {v.title &&
                  (v.renderHeading ? (
                    <>{v.renderHeading()}</>
                  ) : (
                    <StyledCoverHeading as="h1" className="mb-3 cover-heading">
                      {v.title}
                    </StyledCoverHeading>
                  ))}
                {v.subtitle &&
                  (v.renderSubHeading ? (
                    <>{v.renderSubHeading}</>
                  ) : (
                    <StyledCoverSubHeading as="h2" className="mb-4 cover-sub-heading">
                      {v.subtitle}
                    </StyledCoverSubHeading>
                  ))}
                {v.buttonText &&
                  (v.renderButton ? (
                    <>{v.renderButton}</>
                  ) : (
                    <StyledCoverButton to={v.link} className="cover-button">
                      {v.buttonText}
                    </StyledCoverButton>
                  ))}
              </div>
            </StyledCoverBackground>
          ),
        )}
      </StyledSlider>
    </StyledSection>
  )
}

export default CoverSection
