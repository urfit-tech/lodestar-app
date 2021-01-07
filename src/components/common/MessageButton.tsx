import { Button, Icon } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import styled from 'styled-components'
import MemberAvatar from './MemberAvatar'

const StyledButton = styled(Button)`
  && {
    width: 100%;
    height: initial;
    font-size: 14px;
  }
`

const MessageButton: React.FC<{
  text: string
  memberId: string
  onClick: () => void
}> = ({ onClick, memberId, text }) => {
  return (
    <StyledButton
      variant="outline"
      className="d-flex justify-content-between align-items-center mb-5 p-4"
      onClick={onClick}
    >
      <span className="d-flex align-items-center">
        <span className="mr-2">
          <MemberAvatar memberId={memberId} />
        </span>
        <span className="ml-1">{text}</span>
      </span>
      <Icon as={AiOutlineEdit} />
    </StyledButton>
  )
}
export default MessageButton
