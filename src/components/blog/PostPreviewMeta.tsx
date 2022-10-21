import { Icon } from '@chakra-ui/icons'
import { Skeleton } from '@chakra-ui/react'
import { usePublicMember } from 'lodestar-app-element/src/hooks/data'
import React from 'react'
import { StyledPostMeta } from '.'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'

const PostPreviewMeta: React.VFC<{
  authorId: string
  publishedAt: Date | null
}> = ({ authorId, publishedAt }) => {
  const { loadingMember, member } = usePublicMember(authorId)

  if (loadingMember) return <Skeleton />

  return (
    <StyledPostMeta>
      <div className="mb-1">
        <Icon as={UserOIcon} className="mr-1" />
        <span className="mr-2">{member?.name || ''}</span>
      </div>
      {/* <div className="mb-1">
        <Icon as={CalendarAltOIcon} className="mr-1" />
        <span>{publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : ''}</span>
      </div> */}
    </StyledPostMeta>
  )
}

export default PostPreviewMeta
