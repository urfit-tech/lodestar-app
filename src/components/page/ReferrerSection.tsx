import {
  CraftCard,
  CraftCarousel,
  CraftImage,
  CraftParagraph,
  CraftTitle,
} from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import styled from 'styled-components'
import { StyledSection } from '../../pages/AppPage'

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
        <CraftCarousel
          dots
          infinite
          arrows={false}
          autoplay
          autoplaySpeed={5000}
          slidesToShow={3}
          responsive={{
            mobile: {
              slidesToShow: 1,
            },
          }}
        >
          {infos?.map(v => (
            <CraftCard
              customStyle={{
                margin: '0 44px 20px 44px',
                padding: 0,
              }}
            >
              <CraftImage customStyle={{ backgroundImage: `url(${v.imgSrc})` }} />
              <CraftTitle title={v.name} />
              <CraftTitle
                title={v.title}
                customStyle={{
                  margin: '0 0 16px 0',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#585858',
                }}
              />
              <CraftParagraph
                content={v.description}
                customStyle={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 'normal',
                  lineHeight: 1.57,
                  color: '#585858',
                  margin: '0 32px 0 0 ',
                }}
              />
            </CraftCard>
          ))}
        </CraftCarousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default ReferrerSection
