import { CraftCarousel } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled, { CSSObject } from 'styled-components'

const SliderWrapper = styled.div<{ variant: 'normal' | 'custom' }>`
  position: relative;
  padding-top: ${props => (props.variant === 'custom' ? '96%' : '70%')};

  @media (min-width: 992px) {
    padding-top: 32%;
  }
`

const StyledCoverBackground = styled.div<{ srcDesktop: string; srcMobile: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-image: url(${props => props.srcMobile});
  background-size: cover;
  background-position: center;

  @media (min-width: 992px) {
    background-image: url(${props => props.srcDesktop});
  }
`
const StyledCoverHeading = styled.h2<{ customStyle?: CSSObject }>`
  color: ${props => props.customStyle?.color || 'white'};
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.23px;
  text-align: ${props => props.customStyle?.textAlign};

  @media (min-width: 992px) {
    font-size: 52px;
    line-height: 1.3;
    letter-spacing: 1px;
  }
`

const StyledParagraph = styled.p<{ customStyle?: CSSObject }>`
  color: #fff;
  font-size: 16px;
  font-weight: ${props => props.customStyle?.fontWeight};
  line-height: 1.69;
  letter-spacing: 0.2px;

  @media (min-width: 992px) {
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
  @media (min-width: 992px) {
    text-align: center;
  }
`

export const Slide: React.FC<{
  variant: 'normal' | 'custom'
  srcDesktop: string
  srcMobile: string
  title: string
  subtitle: string
  onClick?: () => void
  buttonText?: React.ReactElement | string
}> = ({ variant, srcDesktop, srcMobile, title, subtitle, buttonText, onClick }) => {
  return (
    <SliderWrapper variant={variant}>
      <StyledCoverBackground
        srcDesktop={srcDesktop}
        srcMobile={srcMobile}
        className={`d-flex align-items-center${buttonText ? '' : ' cursor-pointer'} cover-background`}
        onClick={onClick}
      >
        <div className="container">
          <div className="col-12 col-md-10 col-lg-6 mx-auto">
            {title && <StyledCoverHeading className="mb-3">{title}</StyledCoverHeading>}
            {subtitle && <StyledParagraph className="mb-4">{subtitle}</StyledParagraph>}
          </div>
          {buttonText && <StyledCoverButton>{buttonText}</StyledCoverButton>}
        </div>
      </StyledCoverBackground>
    </SliderWrapper>
  )
}

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
    sectionHeight?: { desktopHeight?: string; mobileHeight?: string }
  }
}> = ({ options }) => {
  const history = useHistory()

  return (
    <section>
      <CraftCarousel
        dots
        dotsClass="slick-dots"
        infinite
        arrows={false}
        autoplay
        autoplaySpeed={5000}
        variant="cover"
        responsive={{
          desktop: {
            customStyle: {
              paddingTop: '32%',
            },
          },
          tablet: {
            customStyle: {
              paddingTop: '96%',
            },
          },
          mobile: {
            customStyle: {
              paddingTop: '96%',
            },
          },
        }}
      >
        {options.coverInfos.map(v => (
          <Slide
            variant="custom"
            srcDesktop={v.srcDesktop}
            srcMobile={v.srcMobile}
            title={v.title}
            subtitle={v.subtitle}
            buttonText={v.link && v.buttonText ? <Link to={v.link}>{v.buttonText}</Link> : undefined}
            onClick={() => {
              if (v.buttonText) {
                return
              }
              if (!v.link) return
              v.external ? window.open(v.link) : history.push(v.link)
            }}
          />
        ))}
      </CraftCarousel>
    </section>
  )
}

export default CoverSection
