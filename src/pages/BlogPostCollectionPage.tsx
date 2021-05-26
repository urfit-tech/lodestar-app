import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { StyledPostTitle } from '../components/blog'
import { PopularPostCollection } from '../components/blog/PostLinkCollection'
import PostPreviewCover from '../components/blog/PostPreviewCover'
import PostPreviewMeta from '../components/blog/PostPreviewMeta'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { desktopViewMixin } from '../helpers'
import { usePostPreviewCollection } from '../hooks/blog'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  height: 6rem;
  background-color: var(--gray-lighter);

  ${desktopViewMixin(css`
    height: 10rem;
  `)}
`
const StyledBannerTitle = styled.div`
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 0.8px;
  text-align: center;

  ${desktopViewMixin(css`
    font-size: 24px;
    line-height: normal;
    letter-spacing: 0.2px;
    text-align: left;
  `)}
`
const StyledAbstract = styled.div`
  display: none;

  ${desktopViewMixin(css`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: var(--gray-darker);
    line-height: 1.69;
    letter-spacing: 0.2px;
    text-align: justify;
  `)}
`

const BlogPostCollectionPage: React.VFC = () => {
  const [tags] = useQueryParam('tags', StringParam)
  const { loading, enabledModules } = useApp()
  const { posts } = usePostPreviewCollection({ tags: tags?.split(',') })

  if (loading) {
    return <LoadingPage />
  }

  if (!enabledModules.blog) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            {tags?.split(',').map(tag => (
              <span key={tag} className="ml-2">
                #{tag}
              </span>
            ))}
          </StyledBannerTitle>
        </div>
      </StyledBanner>
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-lg-9">
            {posts.map(post => (
              <Link key={post.id} to={`/posts/${post.codeName || post.id}`}>
                <div className="row no-gutters align-items-center mb-4">
                  <div className="col-6 col-lg-4">
                    <PostPreviewCover
                      variant="list-item"
                      coverUrl={post.coverUrl}
                      withVideo={typeof post.videoUrl === 'string'}
                    />
                  </div>
                  <div className="col-6 col-lg-8 pl-3 pl-lg-4">
                    <StyledPostTitle className="list-item">{post.title}</StyledPostTitle>
                    <div className="mb-lg-4">
                      <PostPreviewMeta author={post.author} publishedAt={post.publishedAt} />
                    </div>
                    <StyledAbstract>{post.abstract}</StyledAbstract>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="col-12 col-lg-3 d-none d-lg-block pl-4">
            <PopularPostCollection />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogPostCollectionPage
