import { Carousel } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

type ProjectCommentSectionProps = {
  items: { name: string; title: string; avatar: string; description: string }[]
}

const StyledSection = styled.section``

const StyledContainer = styled.div`
  margin: 0 auto;
  width: 320px;
  padding: 80px 0;

  @media (min-width: ${BREAK_POINT}px) {
    width: 960px;
    padding-top: 120px;
  }
`

const StyledCarousel = styled(Carousel)`
  && .slick-dots {
    li {
      margin-left: 16px;

      button {
        width: 12px;
        height: 12px;
        background: #cdcdcd;
        border-radius: 50%;
        transition: transform 0.2s ease-in-out;
      }
    }
    li:first-child {
      margin-left: 0;
    }
    li.slick-active {
      button {
        width: 12px;
        transform: scale(1.25, 1.25);
        background: #ff5760;
      }
    }
  }

  && .slick-track {
    display: flex;
  }
`

const StyledSlide = styled.div`
  max-width: 100vw;
  padding: 32px 16px;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 320px;
  }
`

const StyledIntro = styled.div`
  p {
    line-height: 1.71;
    letter-spacing: 0.4px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: var(--gray-darker);
  }
`

const StyledAvatar = styled.img`
  width: 64px;
  margin: 0 auto 16px;
`

const StyledComment = styled.div`
  h4 {
    letter-spacing: 0.2px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #585858;
  }
  p {
    line-height: 1.69;
    letter-spacing: 0.2px;
    text-align: justify;
    font-size: 16px;
    font-weight: 500;
    color: #585858;
  }
  @media (min-width: ${BREAK_POINT}px) {
  }
`

const ProjectCommentSection: React.FC<ProjectCommentSectionProps> = ({ items }) => (
  <StyledSection>
    <StyledContainer>
      <StyledCarousel
        dots={true}
        draggable={true}
        slidesToShow={1}
        slidesToScroll={1}
        variableWidth={true}
        responsive={[
          {
            breakpoint: BREAK_POINT,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ]}
      >
        {items.map(item => (
          <StyledSlide key={item.title}>
            <div>
              <StyledIntro>
                <StyledAvatar src={item.avatar} alt={item.title} />
                <p>{item.name}</p>
              </StyledIntro>
              <StyledComment>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </StyledComment>
            </div>
          </StyledSlide>
        ))}
      </StyledCarousel>
    </StyledContainer>
  </StyledSection>
)

export default ProjectCommentSection
