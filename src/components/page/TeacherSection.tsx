import Carousel from 'lodestar-app-element/src/components/Carousel'
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

  .frame {
    width: 243px;
    border-radius: 50%;
    overflow: hidden;
  }

  h2 {
    font-size: 60px;
    color: #fff;
  }

  h3 {
    font-size: 40px;
    margin-top: 4px;
    color: #fff;
    padding-bottom: 56px;
  }

  .avatar {
    margin-top: 56px;
  }

  .name {
    font-size: 24px;
    margin-top: 24px;
    margin-bottom: 12px;
    color: #fff;
    text-align: center;
  }

  .description {
    font-size: 16px;
    letter-spacing: 0.2px;
    color: #fff;
    text-align: center;
  }

  .type {
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
  max-width: 1080px;
`

export const StyledCarousel = styled(Carousel)`
  && {
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
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinLeft});
      }
    }
    .slick-next {
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinRight});
      }
    }
    @media (min-width: ${BREAK_POINT}px) {
      .slick-prev {
        left: -64px;
      }
      .slick-next {
        right: -64px;
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
        <div>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
        </div>
        <StyledCarousel
          infinite
          arrows={true}
          autoplay
          autoplaySpeed={10000}
          slidesToShow={3}
          responsive={[
            {
              breakpoint: BREAK_POINT,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {teachers.map(teacher => (
            <div>
              <img className="frame mx-auto" src={teacher.avatarSrc} alt={teacher.name} />
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
