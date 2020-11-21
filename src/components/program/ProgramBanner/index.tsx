import ReactPlayer from 'react-player'
import styled from 'styled-components'
import { BREAK_POINT } from '../../common/Responsive'

export const StyledTags = styled.div`
  margin-bottom: 1rem;
  color: white;
  font-size: 14px;
`
export const StyledTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 28px;
  line-height: 1.23;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
  }
`
export const StyledVideoWrapper = styled.div<{ backgroundImage?: string }>`
  position: relative;
  padding-top: 56.25%;
  ${props => props.backgroundImage && `background-image: url(${props.backgroundImage});`}
  background-size: cover;
  background-position: center;
`
export const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`
