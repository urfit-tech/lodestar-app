import moment from 'moment-timezone'
import React from 'react'
import Icon from 'react-inlinesvg'
import { StyledPostMeta } from '.'
import CalendarAltOIcon from '../../images/calendar-alt-o.svg'
import UserOIcon from '../../images/user-o.svg'

const PostPreviewMeta: React.FC<{
  author: {
    id: string
    name: string
  }
  publishedAt: Date | null
}> = ({ author, publishedAt }) => {
  return (
    <StyledPostMeta>
      <div className="mb-1">
        <Icon src={UserOIcon} className="mr-1" />
        <span className="mr-2">{author.name}</span>
      </div>
      <div className="mb-1">
        <Icon src={CalendarAltOIcon} className="mr-1" />
        <span>{publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : ''}</span>
      </div>
    </StyledPostMeta>
  )
}

export default PostPreviewMeta
