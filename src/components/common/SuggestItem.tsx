import { Icon, IconButton } from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import styled from 'styled-components'
import { rgba } from '../../helpers'
import { ReactComponent as CommentIcon } from '../../images/icon-comment.svg'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'
import MemberAvatar from './MemberAvatar'
import MessageReplyCreationForm from './MessageReplyCreationForm'
import MessageReplyItem from './MessageReplyItem'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'

const StyledMessageItem = styled.div`
  position: relative;
  background: none;
  transition: background-color 1s ease-in-out;

  &.focus {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-light);
  }
`
const StyledContentBlock = styled.div`
  padding-left: 48px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`
const StyledIconButton = styled(IconButton)<{ isActive?: boolean }>`
  && {
    height: 12px;
    min-width: 18px;
    background: white;
    color: ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray)')};
  }
`
const StyledText = styled.span`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const MessageItem: React.VFC<{
  createdAt: Date
  memberId: string
  content: string | null
  isLiked: boolean
  likedCount: number
}> = ({ createdAt, memberId, content, isLiked, likedCount }) => {
  const [likeStatus, setLikeStatus] = useState({
    isLiked,
    likedCount,
  })
  const [isMessageReplyShowing, setIsMessageReplyShowing] = useState<boolean>(false)

  return (
    <StyledMessageItem className="py-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center justify-content-center">
          <MemberAvatar memberId={memberId} withName />
          <span className="ml-2" style={{ fontSize: '12px', color: '#9b9b9b' }}>
            {moment(createdAt).fromNow()}
          </span>
        </div>
      </div>

      <StyledContentBlock>
        <BraftContent>{content}</BraftContent>
        <div className="d-flex align-items-center mt-3">
          <div className="mr-2">
            <StyledIconButton
              className="mr-1"
              variant="ghost"
              isActive={likeStatus.isLiked}
              icon={<Icon as={likeStatus.isLiked ? HeartFillIcon : HeartIcon} />}
              onClick={() =>
                setLikeStatus({
                  isLiked: !likeStatus.isLiked,
                  likedCount: likeStatus.isLiked ? likeStatus.likedCount - 1 : likeStatus.likedCount + 1,
                })
              }
              aria-label="like"
            />
            <StyledText>{likeStatus.likedCount}</StyledText>
          </div>
          <div>
            <StyledIconButton
              onClick={() => setIsMessageReplyShowing(prev => !prev)}
              icon={<Icon as={CommentIcon} />}
              className="mr-1"
              variant="ghost"
            />
            <StyledText>2</StyledText>
          </div>
        </div>
        {isMessageReplyShowing && (
          <>
            <div className="mt-5">
              <MessageReplyItem memberId={memberId} content={'12341'} roleName={'owner'} createdAt={new Date()} />
            </div>
            <div className="mt-5">
              <MessageReplyCreationForm />
            </div>
          </>
        )}
      </StyledContentBlock>
    </StyledMessageItem>
  )
}

export default MessageItem
