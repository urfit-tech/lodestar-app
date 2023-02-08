import { Icon } from '@chakra-ui/icons'
import { usePublicMember } from 'lodestar-app-element/src/hooks/data'
import React from 'react'
import styled from 'styled-components'
import { StyledPostMeta, StyledPostTitle } from '.'
import { ReactComponent as PinOIcon } from '../../images/pin.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { PostPreviewProps } from '../../types/blog'
import PostPreviewCover from './PostPreviewCover'

const StyledWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  ::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: ' ';
    background-image: linear-gradient(rgba(0, 0, 0, 0) 25%, black);
  }
`
const StyledBody = styled.div`
  z-index: 10;
  position: absolute;
  bottom: 0;
  padding: 1.25rem;
  width: 100%;
`

const FeaturingPostItem: React.VFC<
  PostPreviewProps & {
    variant?: 'headline' | 'featuring'
  }
> = ({ coverUrl, videoUrl, title, authorId, publishedAt, variant, pinnedAt }) => {
  const { member } = usePublicMember(authorId)

  return (
    <StyledWrapper className="mb-3">
      <PostPreviewCover variant="featuring" coverUrl={coverUrl} withVideo={typeof videoUrl === 'string'} />
      <StyledBody>
        <div className="d-flex align-items-center justify-content-center">
          <StyledPostTitle className={variant}>{title}</StyledPostTitle>
          {pinnedAt ? <Icon as={PinOIcon} className="mr-1" /> : ''}
        </div>

        <StyledPostMeta>
          <Icon as={UserOIcon} className="mr-1" />
          <span className="mr-2">{member?.name || ''}</span>
          {/* <Icon as={CalendarAltOIcon} className="mr-1" />
          <span>{publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : ''}</span> */}
        </StyledPostMeta>
      </StyledBody>
    </StyledWrapper>
  )
}

export default FeaturingPostItem
