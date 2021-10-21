import Carousel from 'lodestar-app-element/src/components/common/Carousel'
import React from 'react'
import styled from 'styled-components'
import { StyledSection } from '../../pages/AppPage'
import { BREAK_POINT } from '../common/Responsive'

type Info = {
  imgSrc: string
  name: string
  title: string
  description: string
}

const StyledTitle = styled.h2`
  font-family: Noto Sans TC;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  line-height: 1.35;
  letter-spacing: 0.5px;
  color: var(--gray-darker);
`

const StyledContainer = styled.div`
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
  width: 100%;
  max-width: 1080px;
`

const ReferrerSection: React.FC<{
  options: {
    title?: string
    infos?: Info[]
  }
}> = ({ options: { title = '', infos = [] } }) => {
  return (
    <StyledSection>
      <StyledTitle className="mb-5">{title}</StyledTitle>
      <StyledContainer>
        <Carousel
          dots
          infinite
          arrows={false}
          autoplay
          autoplaySpeed={5000}
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
          {infos?.map(v => (
            <Carousel.ReferrerCard
              title={v.title}
              name={v.name}
              description={v.description}
              avatarSrc={v.imgSrc}
              customStyle={{
                card: {
                  bordered: false,
                  shadow: false,
                  mt: '0',
                  mb: '20',
                  mr: '44',
                  ml: '44',
                  pt: '0',
                  pb: '0',
                  pr: '0',
                  pl: '0',
                },
                title: {
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#585858',
                  mt: '0',
                  mb: '16',
                  mr: '0',
                  ml: '0',
                },
                paragraph: {
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 'normal',
                  lineHeight: 1.57,
                  color: '#585858',
                  mt: '0',
                  mb: '32',
                  mr: '0',
                  ml: '0',
                },
              }}
            />
          ))}
        </Carousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default ReferrerSection
