import { Skeleton } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment-timezone'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import { useLatestPost } from '../../hooks/blog'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as PlayCircleIcon } from '../../images/play-circle.svg'
import { SectionTitle, StyledLink, StyledSection } from '../../pages/AppPage'
import { StyledPostTitle } from '../blog'
import { BREAK_POINT } from '../common/Responsive'

const StyledCustomRatioImage = styled(CustomRatioImage)`
  transition: transform 0.5s ease-in-out;
`
const StyledPostCard = styled(Link)`
  width: 348px;
  &:hover {
    ${StyledCustomRatioImage} {
      transform: scale(1.2);
    }
  }
`
const StyledPostCoverContainer = styled.div`
  &:hover {
    background-size: 50%;
  }
`
const StyledCover = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`
const StyledVideoIconBlock = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  font-size: 1.5rem;
  line-height: 1;
`
const StyledPostListContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  @media (max-width: 576px) {
    .post-card-container:nth-child(2) {
      display: none;
    }
  }
  @media (max-width: ${BREAK_POINT}px) {
    .post-card-container:nth-child(3) {
      display: none;
    }
  }
  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0;
    width: 100%;
  }
`
const StyledPostAbstract = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    ${MultiLineTruncationMixin}
    color: var(--gray-darker);
    line-height: 1.69;
    letter-spacing: 0.4px;
    text-align: justify;
  }
`
const StyledPostMeta = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;

  i,
  span {
    line-height: 20px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    > div {
      display: inline;
    }
  }
`
const StyledAngleRightIcon = styled(AngleRightIcon)`
  display: inline-block;
`

const PostSection: React.VFC<{ options: { title?: string } }> = ({ options }) => {
  const { enabledModules } = useApp()
  const { loadingPosts, posts, errorPosts } = useLatestPost({ limit: 3 })

  if (loadingPosts)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (posts.length === 0 || errorPosts || !enabledModules.blog) return null

  return (
    <StyledSection className="page-section">
      <SectionTitle>{options?.title || '部落格專欄'}</SectionTitle>

      <div className="container px-0">
        <StyledPostListContainer className="mb-5">
          {posts.map(post => (
            <div key={post.id} className="col-12 col-lg-4 mb-5 post-card-container">
              <StyledPostCard className="mb-4" to={`/posts/${post.codeName || post.id}`}>
                <StyledPostCoverContainer className="mb-3">
                  <StyledCover>
                    {typeof post.videoUrl === 'string' && (
                      <StyledVideoIconBlock>
                        <PlayCircleIcon />
                      </StyledVideoIconBlock>
                    )}
                    <StyledCustomRatioImage width="100%" ratio={2 / 3} src={post.coverUrl || EmptyCover} />
                  </StyledCover>
                </StyledPostCoverContainer>
                <StyledPostTitle className="list-item">{post.title}</StyledPostTitle>
                <StyledPostMeta className="mb-2">
                  <CalendarAltOIcon className="mr-1" />
                  <span>{post.publishedAt ? moment(post.publishedAt).format('YYYY-MM-DD') : ''}</span>
                </StyledPostMeta>
                <StyledPostAbstract>
                  {BraftEditor.createEditorState(post.description)
                    .toHTML()
                    .replace(/(<([^>]+)>)/gi, '')
                    .slice(0, 50)}
                </StyledPostAbstract>
              </StyledPostCard>
            </div>
          ))}
        </StyledPostListContainer>

        <div className="text-center">
          <StyledLink to="/blog">
            查看更多 <StyledAngleRightIcon />
          </StyledLink>
        </div>
      </div>
    </StyledSection>
  )
}

export default PostSection
