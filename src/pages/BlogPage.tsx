import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { messages, StyledTitle } from '../components/blog'
import FeaturingPostPreview from '../components/blog/FeaturingPostItem'
import PostItemCollection from '../components/blog/PostItemCollection'
import { PopularPostCollection } from '../components/blog/PostLinkCollection'
import DefaultLayout from '../components/layout/DefaultLayout'
import { desktopViewMixin } from '../helpers'
import { usePostPreviewCollection } from '../hooks/blog'
import ForbiddenPage from './ForbiddenPage'

const PopularPostsBlock = styled.div`
  ${desktopViewMixin(css`
    order: 1;
  `)}
`

const BlogPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const app = useApp()

  const { posts } = usePostPreviewCollection()
  const latestPosts = posts.slice(0, 3)

  if (!app.loading && !app.enabledModules.blog) {
    return <ForbiddenPage />
  }

  return (
    <DefaultLayout white>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12 col-lg-8">
            {latestPosts[0] && (
              <Link to={`/posts/${latestPosts[0].codeName || latestPosts[0].id}`}>
                <FeaturingPostPreview {...latestPosts[0]} variant="headline" />
              </Link>
            )}
          </div>
          <div className="col-12 col-lg-4 d-flex flex-column justify-content-between">
            {latestPosts[1] && (
              <Link to={`/posts/${latestPosts[1].codeName || latestPosts[1].id}`}>
                <FeaturingPostPreview {...latestPosts[1]} variant="featuring" />
              </Link>
            )}
            {latestPosts[2] && (
              <Link to={`/posts/${latestPosts[2].codeName || latestPosts[2].id}`}>
                <FeaturingPostPreview {...latestPosts[2]} variant="featuring" />
              </Link>
            )}
          </div>
        </div>

        <div className="row">
          <PopularPostsBlock className="col-12 col-lg-3 pl-4 mb-4">
            <PopularPostCollection />
          </PopularPostsBlock>

          <div className="col-12 col-lg-9">
            <StyledTitle>{formatMessage(messages.latest)}</StyledTitle>
            <PostItemCollection posts={posts.slice(3)} withTagSelector />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogPage
