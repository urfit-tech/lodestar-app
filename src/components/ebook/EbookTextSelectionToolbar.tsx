// TextSelectionToolbar.tsx
import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { FaTrashCan } from 'react-icons/fa6'
import styled from 'styled-components'

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: 44px;
  padding: 0 12px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  background-color: #222;
  position: absolute;
  z-index: 1000;
  gap: 10px;
`

const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  .anticon {
    color: white;
  }
`

const CircleButton = styled.button`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: orange;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

type TextSelectionToolbarProps = {
  visible: boolean
  position: { top: number; left: number }
  onHighlight: () => void
  onComment: () => void
  onDelete: () => void
}

const EbookTextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  visible,
  position,
  onHighlight,
  onComment,
  onDelete,
}) => {
  if (!visible) return null

  return (
    <ToolbarContainer style={{ top: position.top + 55, left: position.left }}>
      <StyledButton onClick={onHighlight}>
        <CircleButton />
      </StyledButton>
      <StyledButton onClick={onComment}>
        <BiEditAlt style={{ color: 'white' }} />
      </StyledButton>
      <StyledButton onClick={onDelete}>
        <FaTrashCan style={{ color: 'white' }} />
      </StyledButton>
    </ToolbarContainer>
  )
}

export default EbookTextSelectionToolbar
