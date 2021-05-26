import { Icon } from '@chakra-ui/icons'
import React from 'react'
import styled, { css } from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as PlayCircleIcon } from '../../images/play-circle.svg'
import { CustomRatioImage } from '../common/Image'

const StyledCover = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`
const StyledVideoIconBlock = styled.div<{ variant?: 'featuring' | 'popular' | 'list-item' }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  font-size: 1.5rem;
  line-height: 1;

  ${props =>
    props.variant === 'featuring'
      ? css`
          padding: 0.75rem;
        `
      : props.variant === 'popular'
      ? css`
          font-size: 1rem;
        `
      : ''}
`

const PostPreviewCover: React.VFC<{
  variant?: 'featuring' | 'popular' | 'list-item'
  coverUrl?: string | null
  withVideo?: boolean
}> = ({ withVideo, coverUrl, variant }) => {
  return (
    <StyledCover>
      {withVideo && (
        <StyledVideoIconBlock variant={variant}>
          <Icon as={PlayCircleIcon} />
        </StyledVideoIconBlock>
      )}
      <CustomRatioImage width="100%" ratio={variant === 'list-item' ? 2 / 3 : 9 / 16} src={coverUrl || EmptyCover} />
    </StyledCover>
  )
}

export default PostPreviewCover
