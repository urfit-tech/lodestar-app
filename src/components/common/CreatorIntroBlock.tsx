import React from 'react'
import styled from 'styled-components'
import BlurredBanner from './BlurredBanner'
import { AvatarImage } from './Image'
import { BREAK_POINT } from './Responsive'

const Wrapper = styled.div`
  margin-bottom: -1px;
  padding-top: 7.5rem;
  padding-bottom: calc(2rem + 1px);
  background: linear-gradient(to bottom, transparent 240px, white 240px);
`
const StyledCard = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    align-items: flex-start;
    padding: 2.5rem;
  }
`
const AvatarBlock = styled.div`
  margin: calc(-48px - 1.5rem) auto 1rem;
  width: 96px;
  height: 96px;

  @media (min-width: ${BREAK_POINT}px) {
    flex-shrink: 0;
    margin: 0 2.5rem 0 0;
    width: 128px;
    height: 128px;
  }
`
const DescriptionBlock = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    flex-grow: 1;
  }
`
const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 1.6;
  letter-spacing: 0.8px;

  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
  }
`
const StyledSubTitle = styled.div`
  margin-bottom: 1.25rem;
  color: var(--gray-dark);
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.4px;

  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
  }
`
const StyledDescription = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
  white-space: pre-line;
`
const StyledTag = styled.span`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  letter-spacing: 0.4px;

  :not(:first-child) {
    margin-left: 0.5rem;
  }
`

const CreatorIntroBlock: React.FC<{
  avatarUrl?: string | null
  title: string
  subTitle: string
  tags?: string[] | null
  description: string
}> = ({ avatarUrl, title, subTitle, tags, description }) => {
  return (
    <BlurredBanner coverUrl={avatarUrl}>
      <Wrapper>
        <div className="container">
          <StyledCard>
            <AvatarBlock className="mb-3">
              <AvatarImage src={avatarUrl} size="100%" />
            </AvatarBlock>

            <DescriptionBlock>
              <StyledTitle className="mb-2">{title}</StyledTitle>
              <StyledSubTitle>{subTitle}</StyledSubTitle>
              <StyledDescription className="mb-4">{description}</StyledDescription>

              <div>{!!tags && tags.map(tag => <StyledTag key={tag}>#{tag}</StyledTag>)}</div>
            </DescriptionBlock>
          </StyledCard>
        </div>
      </Wrapper>
    </BlurredBanner>
  )
}

export default CreatorIntroBlock
