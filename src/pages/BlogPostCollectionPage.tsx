import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { StyledPostTitle } from '../components/blog'
import { PopularPostCollection } from '../components/blog/PostLinkCollection'
import PostPreviewCover from '../components/blog/PostPreviewCover'
import PostPreviewMeta from '../components/blog/PostPreviewMeta'
import DefaultLayout from '../components/layout/DefaultLayout'
import { desktopViewMixin } from '../helpers'
import { usePostPreviewCollection } from '../hooks/blog'
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
    ${MultiLineTruncationMixin}
    color: var(--gray-darker);
    line-height: 1.69;
    letter-spacing: 0.2px;
    text-align: justify;
  `)}
`

const BlogPostCollectionPage: React.VFC = () => {
  const history = useHistory()
  const [categories] = useQueryParam('categories', StringParam)
  const [tags] = useQueryParam('tags', StringParam)
  const app = useApp()
  const { posts } = usePostPreviewCollection({ tags: tags?.split(','), categories: categories || '' })

  if (!app.loading && !app.enabledModules.blog) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            {!categories &&
              tags?.split(',').map(tag => (
                <span key={tag} className="ml-2">
                  #{tag}
                </span>
              ))}
            <span className="ml-2">
              {(categories &&
                posts
                  .find(post => post.categories.filter(category => category.id === categories))
                  ?.categories.filter(category => category.id === categories)[0].name) ||
                ''}
            </span>
          </StyledBannerTitle>
        </div>
      </StyledBanner>
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-lg-9">
            {posts.map(post => (
              <div
                key={post.id}
                className="row no-gutters align-items-center mb-4 cursor-pointer"
                onClick={() => {
                  history.push(`/posts/${post.codeName || post.id}`)
                }}
              >
                <div className="col-6 col-lg-4">
                  <PostPreviewCover
                    variant="list-item"
                    coverUrl={post.coverUrl}
                    withVideo={typeof post.videoUrl === 'string'}
                  />
                </div>
                <div className="col-6 col-lg-8 pl-3 pl-lg-4">
                  <StyledPostTitle className="list-item">
                    <Link to={`/posts/${post.codeName || post.id}`}>{post.title} </Link>
                  </StyledPostTitle>
                  <div className="mb-lg-4">
                    <PostPreviewMeta authorId={post.authorId} publishedAt={post.publishedAt} />
                  </div>
                  <StyledAbstract>{post.abstract}</StyledAbstract>
                </div>
              </div>
            ))}
          </div>
          {!categories && (
            <div className="col-12 col-lg-3 d-none d-lg-block pl-4">
              <PopularPostCollection />
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogPostCollectionPage
