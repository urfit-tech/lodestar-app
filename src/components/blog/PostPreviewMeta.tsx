import { Icon } from '@chakra-ui/icons'
import moment from 'moment-timezone'
import React from 'react'
import { StyledPostMeta } from '.'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'

const PostPreviewMeta: React.VFC<{
  author: {
    id: string
    name: string
  }
  publishedAt: Date | null
}> = ({ author, publishedAt }) => {
  return (
    <StyledPostMeta>
      <div className="mb-1">
        <Icon as={UserOIcon} className="mr-1" />
        <span className="mr-2">{author.name}</span>
      </div>
      <div className="mb-1">
        <Icon as={CalendarAltOIcon} className="mr-1" />
        <span>{publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : ''}</span>
      </div>
    </StyledPostMeta>
  )
}

export default PostPreviewMeta
