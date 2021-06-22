import { Icon } from '@chakra-ui/icons'
import { Divider, SkeletonText } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { throttle } from 'lodash'
import moment from 'moment'
import { render } from 'mustache'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { defineMessages, useIntl } from 'react-intl'
import { Link, Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StyledPostMeta } from '../components/blog'
import PostCover from '../components/blog/PostCover'
import { RelativePostCollection } from '../components/blog/PostLinkCollection'
import CreatorCard from '../components/common/CreatorCard'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { useAddPostViews, usePost } from '../hooks/blog'
import { ReactComponent as CalendarAltOIcon } from '../images/calendar-alt-o.svg'
import { ReactComponent as EyeIcon } from '../images/eye.svg'
import { ReactComponent as UserOIcon } from '../images/user-o.svg'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const messages = defineMessages({
  prevPost: { id: 'blog.common.prevPost', defaultMessage: '上一則' },
  nextPost: { id: 'blog.common.nextPost', defaultMessage: '下一則' },
})

const StyledTitle = styled.div`
  margin-bottom: 2.5rem;
  color: var(--gray-darker);
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
`
const StyledTag = styled.span`
  color: ${props => props.theme};
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.4px;
`
const StyledLabel = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
  line-height: 1.83;
  letter-spacing: 0.6px;
`
const StyledSubTitle = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
`

const BlogPostPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { postId } = useParams<{ postId: string }>()
  const { id: appId, loading, enabledModules, settings } = useApp()
  const { loadingPost, post } = usePost(postId)
  const addPostView = useAddPostViews()

  const [isScrollingDown, setIsScrollingDown] = useState(false)

  const handleScroll = useCallback(
    throttle(() => {
      const postCoverElem = document.querySelector('#post-cover')
      const layoutContentElem = document.querySelector('#layout-content')
      if (!postCoverElem || !layoutContentElem) {
        return
      }

      if (layoutContentElem.scrollTop > postCoverElem.scrollHeight) {
        if (isScrollingDown) {
          return
        }
        setIsScrollingDown(true)
      } else {
        setIsScrollingDown(false)
      }
    }, 100),
    [post],
  )

  useEffect(() => {
    document.getElementById('layout-content')?.scrollTo({ top: 0 })
  }, [postId])

  useEffect(() => {
    const layoutContentElem = document.querySelector('#layout-content')
    if (!layoutContentElem) {
      return
    }

    layoutContentElem.addEventListener('scroll', () => handleScroll())
    return layoutContentElem.removeEventListener('scroll', () => handleScroll())
  }, [handleScroll])

  if (loading || loadingPost) {
    return <LoadingPage />
  }

  if (!enabledModules.blog || !post) {
    return <NotFoundPage />
  }

  if (post.codeName && post.codeName !== postId) {
    return <Redirect to={`/posts/${post.codeName}`} />
  }

  try {
    const visitedPosts = JSON.parse(sessionStorage.getItem('kolable.posts.visited') || '[]') as string[]
    if (!visitedPosts.includes(post.id)) {
      visitedPosts.push(post.id)
      sessionStorage.setItem('kolable.posts.visited', JSON.stringify(visitedPosts))
      addPostView(post.id)
    }
  } catch (error) {}

  let seoMeta: { title?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ActivityPage
  } catch (error) {}

  const siteTitle = post.title
    ? seoMeta?.title
      ? `${render(seoMeta.title, { activityTitle: post.title })}`
      : post.title
    : appId

  const siteDescription = BraftEditor.createEditorState(post.description)
    .toHTML()
    .replace(/(<([^>]+)>)/gi, '')
    .substr(0, 50)

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: post.coverUrl,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: siteTitle,
      description: siteDescription,
    },
  })

  return (
    <DefaultLayout white noHeader={isScrollingDown}>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post.coverUrl || ''} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      {!loadingPost && (
        <PostCover
          title={post?.title || ''}
          coverUrl={post?.videoUrl || post?.coverUrl || null}
          type={post?.videoUrl ? 'video' : 'picture'}
          merchandises={post?.merchandises || []}
          isScrollingDown={isScrollingDown}
        />
      )}

      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-lg-9">
            <StyledPostMeta className="pb-3">
              <Icon as={UserOIcon} className="mr-1" />
              <span className="mr-2">{post?.author.name}</span>
              <Icon as={CalendarAltOIcon} className="mr-1" />
              <span className="mr-2">{post?.publishedAt ? moment(post.publishedAt).format('YYYY-MM-DD') : ''}</span>
              <Icon as={EyeIcon} className="mr-1" />
              <span>{post?.views}</span>
            </StyledPostMeta>
            <StyledTitle>{post?.title}</StyledTitle>
            <div className="mb-5">
              {loadingPost ? (
                <SkeletonText mt="1" noOfLines={4} spacing="4" />
              ) : (
                <BraftContent>{post?.description}</BraftContent>
              )}
            </div>
            <div className="mb-5">
              {post?.tags.map(tag => (
                <Link key={tag} to={`/posts/?tags=${tag}`} className="mr-2">
                  <StyledTag>#{tag}</StyledTag>
                </Link>
              ))}
            </div>
            <Divider />
            <div className="py-3">
              {post?.author && (
                <CreatorCard
                  id={post.author.id}
                  avatarUrl={post.author.avatarUrl}
                  title={post.author.name}
                  labels={[]}
                  description={post.author.abstract || ''}
                  withProgram
                  withPodcast
                  withAppointment
                  withBlog
                  noPadding
                />
              )}
            </div>
            <Divider className="mb-5" />
            <div className="row mb-5">
              <div className="col-6 col-lg-4">
                {post?.prevPost && (
                  <Link to={`/posts/${post.prevPost.codeName || post.prevPost.id}`}>
                    <StyledLabel>{formatMessage(messages.prevPost)}</StyledLabel>
                    <StyledSubTitle>{post.prevPost.title}</StyledSubTitle>
                  </Link>
                )}
              </div>
              <div className="col-6 col-lg-4 offset-lg-4">
                {post?.nextPost && (
                  <Link to={`/posts/${post.nextPost.codeName || post.nextPost.id}`} className="text-right">
                    <StyledLabel>{formatMessage(messages.nextPost)}</StyledLabel>
                    <StyledSubTitle>{post.nextPost.title}</StyledSubTitle>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 pl-4">
            <RelativePostCollection postId={postId} tags={post?.tags} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogPostPage
