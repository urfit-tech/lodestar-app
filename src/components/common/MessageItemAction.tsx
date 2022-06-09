import { Icon, Typography } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledAction = styled.span<{ reacted?: boolean }>`
  padding: 0;
  color: ${props => (props.reacted ? props.theme['@primary-color'] : props.theme['@text-color-secondary'])};
  cursor: pointer;
`
const StyledMessageState = styled(Typography.Text)`
  text-align: right;
  font-size: 12px;
`

const MessageItemAction: React.VFC<{
  reactedMemberIds: string[]
  onRepliesVisible?: React.Dispatch<React.SetStateAction<boolean>>
  numReplies?: number
  statusText?: string
  onReact?: (reacted: boolean) => Promise<any>
}> = ({ reactedMemberIds, onReact, numReplies, statusText, onRepliesVisible }) => {
  const { currentMemberId } = useAuth()
  const [reacted, setReacted] = useState(() => !!(currentMemberId && reactedMemberIds.some(v => v === currentMemberId)))

  const toggleReaction = async (reacted: boolean) => {
    await onReact?.(reacted)
  }

  const otherReactedMemberIds = currentMemberId
    ? reactedMemberIds.filter(id => id !== currentMemberId).length
    : reactedMemberIds.length
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <StyledAction
          className="mr-3"
          onClick={() => {
            setReacted(!reacted)
            toggleReaction(reacted)
          }}
          reacted={reacted}
        >
          <Icon type="heart" theme={reacted ? 'filled' : 'outlined'} className="mr-1" />
          <span>{reacted && currentMemberId ? otherReactedMemberIds + 1 : otherReactedMemberIds}</span>
        </StyledAction>
        {onRepliesVisible && (
          <StyledAction onClick={() => onRepliesVisible(prev => !prev)}>
            <Icon type="message" className="mr-1" />
            {numReplies && <span>{numReplies}</span>}
          </StyledAction>
        )}
      </div>
      {statusText && <StyledMessageState type="secondary">{statusText}</StyledMessageState>}
    </div>
  )
}

export default MessageItemAction
