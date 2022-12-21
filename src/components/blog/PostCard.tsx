import React from 'react'
import { Link } from 'react-router-dom'
import { PostPreviewProps } from '../../types/blog'
import { StyledPostTitle } from './'
import PostPreviewCover from './PostPreviewCover'
import PostPreviewMeta from './PostPreviewMeta'

const PostCard: React.VFC<
  Pick<PostPreviewProps, 'id' | 'codeName' | 'coverUrl' | 'videoUrl' | 'title' | 'authorId' | 'publishedAt'> & {
    onClick?: () => void
  }
> = ({ onClick, ...post }) => {
  return (
    <Link to={`/posts/${post.codeName || post.id}`}>
      <div className="mb-3">
        <PostPreviewCover coverUrl={post.coverUrl} withVideo={typeof post.videoUrl === 'string'} />
      </div>
      <StyledPostTitle>{post.title}</StyledPostTitle>
      <PostPreviewMeta authorId={post.authorId} publishedAt={post.publishedAt} />
    </Link>
  )
}

export default PostCard
