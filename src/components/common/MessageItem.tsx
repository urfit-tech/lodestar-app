import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { rgba } from '../../helpers'

const StyledMessageItem = styled.div`
  position: relative;
  background: none;
  transition: background-color 1s ease-in-out;

  &.focus {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  }
`

const MessageItem: React.FC<{
  focus?: boolean
}> = ({ focus, children }) => {
  const [isFocus, setIsFocus] = useState(focus)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemRef.current && isFocus) {
      itemRef.current.scrollIntoView()
      const timer = setTimeout(() => {
        setIsFocus(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isFocus])

  return (
    <StyledMessageItem className={isFocus ? 'focus' : ''} ref={itemRef}>
      {children}
    </StyledMessageItem>
  )
}

export default MessageItem
