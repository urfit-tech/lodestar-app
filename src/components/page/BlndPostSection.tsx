import { Icon } from '@chakra-ui/icon'
import { Skeleton } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment-timezone'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useLatestPost } from '../../hooks/blog'
import { ReactComponent as ArrowRightIcon } from '../../images/arrow-right.svg'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as PlayCircleIcon } from '../../images/play-circle.svg'
import { MultiLineTruncationMixin } from '../common'
import { CustomRatioImage } from '../common/Image'
import { BREAK_POINT } from '../common/Responsive'

const StyledSection = styled.section`
  padding: 120px 0 100px;
  background-color: #29303e;
  position: relative;
`
const StyledDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(400px, 75vw, 600px);
  height: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('https://static.kolable.com/images/blnd/deco2-m.png');

  @media (min-width: ${BREAK_POINT}px) {
    width: 55vw;
    background-image: url('https://static.kolable.com/images/blnd/deco2.png');
  }
`
const StyledCustomRatioImage = styled(CustomRatioImage)`
  transition: transform 0.5s ease-in-out;
`
const StyleTitle = styled.h2`
  font-family: Noto Sans TC;
  font-size: 28px;
  letter-spacing: 0.23px;
  text-align: center;
  color: #fff;
  position: relative;
  font-weight: bold;
  line-height: 1;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
  }
`
const StyledSubTitle = styled.h3`
  font-size: 40px;
  font-weight: bold;
  line-height: 1.1;
  letter-spacing: 1px;
  text-align: center;
  color: #fff;
  font-family: Noto Sans TC;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 60px;
  }
`
const StyledTitleLink = styled.div`
  position: absolute;
  right: 0;
`
const StyledPostCard = styled(Link)`
  width: 348px;
  &:hover {
    ${StyledCustomRatioImage} {
      transform: scale(1.2);
    }
  }
`
const StyledPostTitle = styled.h4`
  font-family: Noto Sans TC;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  text-align: justify;
  color: #fff;
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
  ${MultiLineTruncationMixin}
  -webkit-line-clamp: 3;
  color: white;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-align: justify;
`
const StyledPostMeta = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;

  i,
  span {
    line-height: 1px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    > div {
      display: inline;
    }
  }
`
const StyledLink = styled(Link)`
  color: white;
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;

  &:hover {
    color: var(--dark-light);
  }
`

const BlndPostSection: React.VFC = () => {
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
    <StyledSection>
      <StyledDecoration />
      <div className="container px-0">
        <StyledSubTitle>BLOG</StyledSubTitle>
        <StyleTitle className="mb-5">
          延伸閱讀
          <StyledTitleLink className="d-none d-lg-inline-block">
            <ReadMoreLink />
          </StyledTitleLink>
        </StyleTitle>
        <StyledPostListContainer>
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
                <StyledPostTitle className="list-item mb-2">{post.title}</StyledPostTitle>
                <StyledPostMeta className="d-flex align-items-center mb-3">
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
        <div className="d-block d-lg-none text-center">
          <ReadMoreLink />
        </div>
      </div>
    </StyledSection>
  )
}

const ReadMoreLink: React.VFC = () => {
  return (
    <StyledLink to="/blog">
      <span className="mr-1">查看更多</span>
      <Icon style={{ color: '#4c60ff' }} as={ArrowRightIcon} />
    </StyledLink>
  )
}

export default BlndPostSection
