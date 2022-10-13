import { Icon } from '@chakra-ui/icons'
import { Divider, SkeletonText } from '@chakra-ui/react'
import { throttle } from 'lodash'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StyledPostMeta } from '../../components/blog'
import PostCover from '../../components/blog/PostCover'
import { RelativePostCollection } from '../../components/blog/PostLinkCollection'
import CreatorCard from '../../components/common/CreatorCard'
import LikesCountButton from '../../components/common/LikedCountButton'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MessageSuggestItem from '../../components/practice/MessageSuggestItem'
import SuggestionCreationModal from '../../components/practice/SuggestionCreationModal'
import { useAddPostViews, useMutatePostReaction, usePost } from '../../hooks/blog'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as EyeIcon } from '../../images/eye.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import ForbiddenPage from '../ForbiddenPage'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
import BlogPostPageHelmet from './BlogPostPageHelmet'

const messages = defineMessages({
  prevPost: { id: 'blog.common.prevPost', defaultMessage: '上一則' },
  nextPost: { id: 'blog.common.nextPost', defaultMessage: '下一則' },
  blogSuggestion: { id: 'blog.label.blogSuggestion', defaultMessage: '回應' },
})

const StyledTitle = styled.div`
  margin-bottom: 1.5rem;
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

const StyledPostTitle = styled.h3`
  ${CommonTitleMixin}
`

const BlogPostPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { searchId } = useParams<{ searchId: string }>()
  const app = useApp()
  const { loadingPost, post, refetchPosts } = usePost(searchId)
  const postId = post?.id
  const addPostView = useAddPostViews()
  const { insertPostReaction, deletePostReaction } = useMutatePostReaction(postId)

  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleGetPostLikes = () => {
    const postLikesData: { postId: string }[] = JSON.parse(localStorage.getItem('kolabe.post_reaction') || '[]')
    const isThisPostLikes: boolean = postLikesData.some(v => v.postId === postId)
    setIsLiked(isThisPostLikes)
  }

  useEffect(() => {
    document.getElementById('layout-content')?.scrollTo({ top: 0 })
    handleGetPostLikes()
  }, [postId])

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
    const layoutContentElem = document.querySelector('#layout-content')
    if (!layoutContentElem) {
      return
    }

    layoutContentElem.addEventListener('scroll', () => handleScroll())
    return layoutContentElem.removeEventListener('scroll', () => handleScroll())
  }, [handleScroll])

  if (!app.loading && !app.enabledModules.blog) {
    return <ForbiddenPage />
  }
  if (loadingPost) {
    return <LoadingPage />
  }
  if (!post) {
    return <NotFoundPage />
  }

  try {
    const visitedPosts = JSON.parse(sessionStorage.getItem('kolable.posts.visited') || '[]') as string[]
    if (!visitedPosts.includes(post.id)) {
      visitedPosts.push(post.id)
      sessionStorage.setItem('kolable.posts.visited', JSON.stringify(visitedPosts))
      addPostView(post.id)
    }
  } catch (error) {}

  const handleLikeStatus = async () => {
    if (isLiked) {
      await deletePostReaction()
      setIsLiked(false)
    } else {
      await insertPostReaction()
      setIsLiked(true)
    }
    await refetchPosts()
  }
  return (
    <DefaultLayout white noHeader={isScrollingDown}>
      <BlogPostPageHelmet post={post} />
      {!loadingPost && (
        <PostCover
          title={post?.title || ''}
          coverUrl={post?.videoUrl || post?.coverUrl || null}
          type={post?.videoUrl ? 'video' : 'picture'}
          merchandises={post?.merchandises || []}
          isScrollingDown={isScrollingDown}
        />
      )}
      <div className="container pb-sm-5">
        <div className="row justify-content-center">
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
            <StyledPostMeta className="pb-3">{post.source}</StyledPostMeta>
            <div className="mb-5">
              {loadingPost ? (
                <SkeletonText mt="1" noOfLines={4} spacing="4" />
              ) : (
                <BraftContent>{post?.description}</BraftContent>
              )}
            </div>
            <div className="row mb-5">
              <div className="col-6 col-lg-4">
                {post?.tags.map(tag => (
                  <Link key={tag} to={`/posts/?tags=${tag}`} className="mr-2">
                    <StyledTag>#{tag}</StyledTag>
                  </Link>
                ))}
              </div>
              <div className="col-6 col-lg-4 offset-lg-4  d-flex align-items-center justify-content-end">
                <SocialSharePopover url={window.location.href} />
                <LikesCountButton onClick={handleLikeStatus} count={post.reactedMemberIdsCount} isLiked={isLiked} />
              </div>
            </div>
            <Divider className="mb-3" />
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
            <div className="row">{postId && <RelativePostCollection postId={postId} tags={post?.tags} />}</div>
            <div className="mb-4">
              <StyledPostTitle className="mb-3">{formatMessage(messages.blogSuggestion)}</StyledPostTitle>
              {currentMemberId && (
                <SuggestionCreationModal threadId={`/posts/${postId}`} onRefetch={() => refetchPosts()} />
              )}
              {post?.suggests.map(v => (
                <div key={v.id}>
                  <MessageSuggestItem
                    key={v.id}
                    suggestId={v.id}
                    memberId={v.memberId}
                    description={v.description}
                    suggestReplyCount={v.suggestReplyCount}
                    programRoles={post?.postRoles || []}
                    reactedMemberIds={v.reactedMemberIds}
                    createdAt={v.createdAt}
                    onRefetch={() => refetchPosts()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogPostPage
