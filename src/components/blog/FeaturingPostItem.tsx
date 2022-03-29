import { Icon } from '@chakra-ui/icons'
import { usePublicMember } from 'lodestar-app-element/src/hooks/data'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { StyledPostMeta, StyledPostTitle } from '.'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
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
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, black);
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
> = ({ coverUrl, videoUrl, title, authorId, publishedAt, variant }) => {
  const { member } = usePublicMember(authorId)

  return (
    <StyledWrapper className="mb-3">
      <PostPreviewCover variant="featuring" coverUrl={coverUrl} withVideo={typeof videoUrl === 'string'} />
      <StyledBody>
        <StyledPostTitle className={variant}>{title}</StyledPostTitle>
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
