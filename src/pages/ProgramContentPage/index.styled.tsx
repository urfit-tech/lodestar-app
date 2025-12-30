import { Button } from '@chakra-ui/react'
import styled from 'styled-components'

export const StyledVipButton = styled(Button)<{ isVip?: boolean }>`
  && {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }
  &&:hover {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }
  && svg {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }
  &&:hover svg {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }
`

export const StyledSideBar = styled.div<{ menuVisible?: boolean }>`
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 10px 10px 0px;
  z-index: 2;
  width: 100%;
  position: absolute;
`

export const StyledContentBlock = styled.div`
  padding: 1.25rem;
  background-color: white;
`
