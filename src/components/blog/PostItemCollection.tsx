import { Button } from 'antd'
import { uniqBy } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StyledPostTitle } from '.'
import { commonMessages } from '../../helpers/translation'
import { PostPreviewProps } from '../../types/blog'
import PostPreviewCover from './PostPreviewCover'
import PostPreviewMeta from './PostPreviewMeta'

const StyledTagButton = styled(Button)<{ selected?: boolean }>`
  margin-bottom: 0.75rem;
  transition: background-color 0.2s ease-in-out;

  &,
  &:active,
  &:hover,
  &:focus {
    background-color: ${props => (props.selected ? props.theme['@primary-color'] : 'transparent')};
    color: ${props => (props.selected ? 'white' : 'var(--gray-darker)')};
  }
`

const PostItemCollection: React.FC<{
  posts: PostPreviewProps[]
  withTagSelector?: boolean
}> = ({ posts, withTagSelector }) => {
  const { formatMessage } = useIntl()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const categories = uniqBy(category => category.id, posts.map(post => post.categories).flat())

  return (
    <>
      {withTagSelector && (
        <div className="mb-4">
          <StyledTagButton
            type="link"
            selected={selectedCategoryId === null}
            shape="round"
            onClick={() => setSelectedCategoryId(null)}
          >
            {formatMessage(commonMessages.form.option.all)}
          </StyledTagButton>
          {categories.map(category => (
            <StyledTagButton
              key={category.id}
              type="link"
              selected={selectedCategoryId === category.id}
              shape="round"
              className="ml-2"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </StyledTagButton>
          ))}
        </div>
      )}

      <div className="row">
        {posts
          .filter(post => !selectedCategoryId || post.categories.some(category => category.id === selectedCategoryId))
          .map(post => (
            <div key={post.id} className="col-6 col-lg-4 pb-2 mb-4">
              <Link to={`/posts/${post.codeName || post.id}`}>
                <div className="mb-3">
                  <PostPreviewCover coverUrl={post.coverUrl} withVideo={typeof post.videoUrl === 'string'} />
                </div>
                <StyledPostTitle>{post.title}</StyledPostTitle>
                <PostPreviewMeta author={post.author} publishedAt={post.publishedAt} />
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default PostItemCollection
