import React from 'react'
import styled, { css } from 'styled-components'
import DefaultAvatar from '../../images/avatar.svg'
import { CustomRatioImage } from '../common/Image'

const StyledCardBody = styled.div<{ variant?: string }>`
  background-color: white;

  ${props =>
    props.variant === 'featuring'
      ? css`
          position: relative;
          top: -20px;
        `
      : ''}
`
const StyledTitle = styled.div`
  color: var(--gray-darker);
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledMeta = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: var(--gray-dark);
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 16px;
  text-align: center;
  line-height: 1.69;
  letter-spacing: 0.2px;
`

type CreatorBriefCardProps = {
  imageUrl?: string | null
  title: string
  meta?: string | null
  description?: string | null
  variant?: 'featuring' | 'default'
}
const CreatorBriefCard: React.VFC<CreatorBriefCardProps> = ({ imageUrl, title, meta, description, variant }) => {
  return (
    <div>
      <CustomRatioImage width="100%" ratio={1} src={imageUrl || DefaultAvatar} shape="circle" />

      <StyledCardBody variant={variant} className="py-3">
        <StyledTitle className="mb-1">{title}</StyledTitle>
        {meta && <StyledMeta className="mb-2">{meta}</StyledMeta>}
        {description && <StyledDescription className="mt-1">{description}</StyledDescription>}
      </StyledCardBody>
    </div>
  )
}

export default CreatorBriefCard
