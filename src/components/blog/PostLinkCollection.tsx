import { Button } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { messages, StyledPostTitle, StyledTitle } from '.'
import { commonMessages } from '../../helpers/translation'
import { usePopularPostCollection, useRelativePostCollection } from '../../hooks/blog'
import { PostLinkProps } from '../../types/blog'
import PostPreviewCover from './PostPreviewCover'

export const PopularPostCollection: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { posts, postCount, fetchMorePost } = usePopularPostCollection()
  const [page, setPage] = useState(0)

  return (
    <PostLinkCollection
      title={formatMessage(messages.popular)}
      posts={posts}
      onFetchMore={posts.length < postCount ? () => fetchMorePost(page + 1).then(() => setPage(page + 1)) : undefined}
    />
  )
}

export const RelativePostCollection: React.VFC<{ postId: string; tags?: string[] }> = ({ postId, tags }) => {
  const { formatMessage } = useIntl()
  const { posts, postCount, fetchMorePost } = useRelativePostCollection(postId, tags)
  const [page, setPage] = useState(0)

  return (
    <PostLinkCollection
      title={posts.length ? formatMessage(messages.relative) : undefined}
      posts={posts}
      onFetchMore={posts.length < postCount ? () => fetchMorePost(page + 1).then(() => setPage(page + 1)) : undefined}
    />
  )
}

const PostLinkCollection: React.VFC<{
  title?: string
  posts: PostLinkProps[]
  onFetchMore?: () => Promise<any>
}> = ({ title, posts, onFetchMore }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <>
      {typeof title === 'string' && <StyledTitle>{title}</StyledTitle>}

      {posts.map(post => (
        <Link key={post.id} to={`/posts/${post.codeName || post.id}`}>
          <div className="row align-items-center mb-3">
            <div className="col-6">
              <PostPreviewCover variant="popular" coverUrl={post.coverUrl} withVideo={!!post.videoUrl} />
            </div>
            <div className="col-6 pl-1">
              <StyledPostTitle className="feature" rows={2}>
                {post.title}
              </StyledPostTitle>
            </div>
          </div>
        </Link>
      ))}

      {onFetchMore && (
        <div>
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              setLoading(true)
              onFetchMore && onFetchMore().finally(() => setLoading(false))
            }}
            loading={loading}
          >
            {formatMessage(commonMessages.defaults.more)}
          </Button>
        </div>
      )}
    </>
  )
}
