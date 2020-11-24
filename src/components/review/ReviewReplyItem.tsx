import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import MoreIcon from '../../images/ellipsis.svg'
import MemberAvatar from '../common/MemberAvatar'
import { BraftContent } from '../common/StyledBraftEditor'

export type ReviewReplyItemProps = {
  reviewId?: string
  reviewReplyId?: string
  memberId?: string | null
  memberRole?: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
}
const ReviewReplyContent = styled.div`
  padding: 16px;
  margin-left: 2.5rem;
  background: var(--gray-lighter);
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
`

const ReviewReplyItem: React.FC<ReviewReplyItemProps> = ({ memberId, memberRole, content, createdAt, updatedAt }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar memberId={memberId || ''} withName size={28} />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
          {updatedAt && updatedAt > createdAt && (
            <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
          )}
        </span>
        <Menu placement="bottom-end">
          <MenuButton>
            <Icon src={MoreIcon} />
          </MenuButton>
          <MenuList minWidth="110px">
            <MenuItem onClick={() => {}}>{formatMessage(commonMessages.button.edit)}</MenuItem>
            <MenuItem onClick={() => {}}>{formatMessage(commonMessages.button.delete)}</MenuItem>
          </MenuList>
        </Menu>
      </div>

      <ReviewReplyContent className="mt-2">
        <BraftContent>{content}</BraftContent>
      </ReviewReplyContent>
    </div>
  )
}

export default ReviewReplyItem
