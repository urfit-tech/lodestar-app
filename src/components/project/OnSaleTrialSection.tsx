import { Carousel } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'
import FundingCoverBlock from './FundingCoverBlock'

type Video = {
  src: string
  title: string
}

type OnSaleTrialSectionProps = {
  title: string
  videos: Video[]
}

const StyledSection = styled.section`
  h3 {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    color: var(--gray-darker);
    margin: 0 auto;
    text-align: center;
  }
`

const StyledContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 270px;
  padding-bottom: 80px;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 960px;
  }
`

const StyledSlide = styled.div`
  position: relative;
  max-width: 100vw;
  padding: 52px 32px;

  h4 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 10px;
    width: 200px;
    text-align: center;
  }

  @media (min-width: ${BREAK_POINT}px) {
    h4 {
      width: 100%;
    }
  }
`

const StyledImage = styled.img`
  width: 40px !important;
  height: 40px !important;
`

const OnSaleTrialSection: React.VFC<OnSaleTrialSectionProps> = ({ title, videos }) => {
  return (
    <StyledSection>
      <StyledContainer>
        <h3>{title}</h3>
        <Carousel
          arrows={true}
          draggable={true}
          slidesToShow={2}
          dots={false}
          slidesToScroll={1}
          prevArrow={<StyledImage src={`https://static.kolable.com/images/xuemi/angle-thin-left.svg`} />}
          nextArrow={<StyledImage src={`https://static.kolable.com/images/xuemi/angle-thin-right.svg`} />}
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
          {videos.map(video => (
            <StyledSlide key={video.src}>
              <FundingCoverBlock coverType="video" coverUrl={video.src} />
              <h4>{video.title}</h4>
            </StyledSlide>
          ))}
        </Carousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default OnSaleTrialSection
