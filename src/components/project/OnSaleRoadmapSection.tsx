import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

type Step = {
  title: string
  featureUrl: string
  descriptions: string[]
}

type Roadmap = {
  header: string
  steps: Step[]
}

type OnSaleRoadmapSectionProps = {
  roadmaps: Roadmap[]
}

const StyledSection = styled.section`
  @media (min-width: ${BREAK_POINT}px) {
    height: 600px;
  }
`

const StyledWrapper = styled.div`
  padding: 20px;

  @media (min-width: ${BREAK_POINT}px) {
  }
`

const StyledStep = styled.div`
  margin-bottom: 50px;

  @media (min-width: ${BREAK_POINT}px) {
    margin: 0;
    height: 340px;
  }
`

const StyledRoadmap = styled.div`
  @media (max-width: ${BREAK_POINT - 1}px) {
    margin-bottom: 40px;
  }
`

const StyledHeader = styled.h4`
  line-height: 1.3;
  letter-spacing: 0.77px;
  margin-bottom: 40px;
  font-size: 20px;
  font-weight: bold;
  color: var(--gray-darker);
  text-align: center;

  @media (min-width: ${BREAK_POINT}px) {
    letter-spacing: 0.23px;
    margin-bottom: 60px;
    font-size: 28px;
  }
`

const StyledIntro = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
`

const StyledTitle = styled.h5`
  letter-spacing: 0.2px;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: var(--gray-darker);

  @media (min-width: ${BREAK_POINT}px) {
    letter-spacing: 0.77px;
    text-align: center;
    font-size: 20px;
  }
`

const StyledParagraph = styled.p`
  letter-spacing: 0.2px;
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-darker);
  max-width: 213px;

  span {
    display: inline-block;
  }

  @media (min-width: ${BREAK_POINT}px) {
    text-align: center;
    margin: 0 auto;
  }
`

const StyledImage = styled.img`
  width: 100%;
`

const OnSaleRoadmapSection: React.VFC<OnSaleRoadmapSectionProps> = ({ roadmaps }) => {
  return (
    <StyledSection className="d-flex justify-content-center align-items-center">
      <StyledWrapper className="container">
        <div className="row">
          {roadmaps.map(roadmap => (
            <StyledRoadmap key={roadmap.header} className="col-12 col-lg-6">
              <StyledHeader>{roadmap.header}</StyledHeader>
              <div className="row">
                {roadmap.steps.map(step => (
                  <div key={step.title} className="col-12 col-lg-6">
                    <StyledStep className="row">
                      <StyledImage className="col-5 col-lg-12" src={step.featureUrl} alt={step.title} />
                      <StyledIntro className="col-7 col-lg-12">
                        <StyledTitle>{step.title}</StyledTitle>
                        <StyledParagraph>
                          {step.descriptions.map(description => (
                            <span key={description}>{description}</span>
                          ))}
                        </StyledParagraph>
                      </StyledIntro>
                    </StyledStep>
                  </div>
                ))}
              </div>
            </StyledRoadmap>
          ))}
        </div>
      </StyledWrapper>
    </StyledSection>
  )
}

export default OnSaleRoadmapSection
