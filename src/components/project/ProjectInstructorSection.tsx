import { Carousel } from 'antd'
import React from 'react'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import AngleThinLeft from '../../images/angle-thin-left.svg'
import AngleThinRight from '../../images/angle-thin-right.svg'
import ProjectCalloutButton, { Callout } from './ProjectCalloutButton'

const SectionTitle = styled.h1`
  margin-bottom: 2.5rem;
  color: #585858;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
`
const StyledAvatar = styled.img<{ size?: number }>`
  display: block;
  margin: 0 auto 1.5rem;
  width: ${props => props.size || 56}px;
  height: ${props => props.size || 56}px;
  border-radius: 50%;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  object-fit: cover;
  object-position: center;
`
const StyledSection = styled.section`
  position: relative;
  padding: 5rem 0;
  overflow: hidden;

  ${() =>
    desktopViewMixin(css`
      padding: 5rem 0;
    `)}
`
const StyledContainer = styled.div`
  margin: 0 auto 4rem;
  padding: 0 4rem;
  width: 100%;
  max-width: 1088px;
`
const StyledCarousel = styled(Carousel)`
  && {
    .slick-prev,
    .slick-next {
      margin-top: -32px;
      width: 64px;
      height: 64px;
      font-size: 64px;
    }
    .slick-prev {
      left: -64px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinLeft});
      }
    }
    .slick-next {
      right: -64px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinRight});
      }
    }
  }
`
const StyledInstructorBlock = styled.div`
  padding: 0 2rem;
  color: #9b9b9b;
`
const StyledSubTitle = styled.h2`
  color: #585858;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77;
`

type ProjectInstructorSectionProps = {
  title: string
  callout?: Callout
  items: { title: string; description: string; picture: string }[]
}
const ProjectInstructorSection: React.FC<ProjectInstructorSectionProps> = ({ title, callout, items }) => {
  return (
    <StyledSection>
      <SectionTitle>{title}</SectionTitle>

      <StyledContainer>
        <StyledCarousel
          arrows
          dots={false}
          draggable
          swipeToSlide
          slidesToShow={4}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 192 * 5 - 1 + 128,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 192 * 4 - 1 + 128,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 192 * 3 - 1 + 128,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 192 * 2 - 1 + 128,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {items.map((item, idx) => (
            <StyledInstructorBlock key={idx}>
              <StyledAvatar src={item.picture} alt={item.title} size={128} />
              <StyledSubTitle>{item.title}</StyledSubTitle>
              <div className="text-center">{item.description}</div>
            </StyledInstructorBlock>
          ))}
        </StyledCarousel>

        <div className="pt-5 d-flex justify-content-center">
          {callout && <ProjectCalloutButton href={callout.href} label={callout.label} />}
        </div>
      </StyledContainer>
    </StyledSection>
  )
}

export default ProjectInstructorSection
