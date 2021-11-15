import { CraftCarousel } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import styled from 'styled-components'
import AngleThinLeft from '../../images/angle-thin-left.svg'
import AngleThinRight from '../../images/angle-thin-right.svg'
import { BREAK_POINT } from '../common/Responsive'

type Info = {
  avatarSrc: string
  name: string
  title: string
  subtitle: string
  tags: string[]
}

const StyledSection = styled.section`
  width: 100%;
  padding: 80px 0;
  background: #4c60ff;
  -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 8%);
  position: relative;
  top: 5px;

  .frame {
    width: 243px;
    border-radius: 50%;
    overflow: hidden;

    img:hover {
      transform: scale(1.2);
      transition: 0.7s;
    }
  }

  h2 {
    font-size: 60px;
    font-family: Noto Sans TC;
    color: #fff;
  }

  h3 {
    font-size: 40px;
    margin-top: 4px;
    color: #fff;
    font-family: Noto Sans TC;
    padding-bottom: 56px;
  }

  .avatar {
    margin-top: 56px;
  }

  .name {
    font-family: Noto Sans TC;
    font-size: 24px;
    margin-top: 24px;
    margin-bottom: 12px;
    color: #fff;
    text-align: center;
  }

  .description {
    font-family: Noto Sans TC;
    font-size: 16px;
    letter-spacing: 0.2px;
    color: #fff;
    text-align: center;
  }

  .type {
    font-family: Noto Sans TC;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    margin-top: 12px;
    color: #fff;
    text-align: center;
    margin: 0 auto;
    width: 68px;
    margin-top: 12px;
    padding: 2px 4px;
  }
`

const StyledContainer = styled.div`
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
  width: 100%;
  max-width: 1120px;
`

const StyledHeading = styled.div`
  text-align: center;

  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
  }
`
const StyledTitle = styled.h2`
  font-family: Noto Sans TC;
  font-weight: bold;
  line-height: 1;
`

const StyledSubTitle = styled.h3`
  font-family: Noto Sans TC;
`

export const StyledCarousel = styled(CraftCarousel)`
  height: 400px;
  && {
    overflow: unset;
    .slick-prev:before,
    .slick-next:before {
      content: '';
    }

    .slick-prev,
    .slick-next {
      z-index: 100;
      margin-top: -32px;
      width: 64px;
      height: 64px;
      font-size: 64px;
    }
    .slick-prev {
      left: -16px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinLeft});
      }
    }
    .slick-next {
      right: -16px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinRight});
      }
    }
    @media (min-width: ${BREAK_POINT}px) {
      .slick-prev {
        left: -4vw;
      }
      .slick-next {
        right: -4vw;
      }
    }
  }
`

const TeacherSection: React.FC<{
  options: {
    title?: string
    subtitle?: string
    teachers?: Info[]
  }
}> = ({ options: { title = '', subtitle = '', teachers = [] } }) => {
  return (
    <StyledSection>
      <StyledContainer>
        <StyledHeading>
          <StyledTitle>{title}</StyledTitle>
          <StyledSubTitle>{subtitle}</StyledSubTitle>
        </StyledHeading>
        <StyledCarousel
          infinite
          arrows={true}
          autoplay
          autoplaySpeed={10000}
          slidesToShow={2}
          responsive={{
            desktop: {
              slidesToShow: 4,
            },
            tablet: {
              slidesToShow: 3,
            },
            mobile: {
              slidesToShow: 1,
            },
          }}
        >
          {teachers.map(teacher => (
            <div>
              <div className="frame mx-auto">
                <img src={teacher.avatarSrc} alt={teacher.name} />
              </div>
              <div className="name">{teacher.name}</div>
              <div className="description">
                {teacher.title}
                <br />
                {teacher.subtitle}
              </div>
              <div className="text-center">
                {teacher.tags.map(tag => (
                  <span className="type mr-2"># {tag}</span>
                ))}
              </div>
            </div>
          ))}
        </StyledCarousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default TeacherSection
