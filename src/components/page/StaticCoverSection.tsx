import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

type StaticCover = {
  coverInfo: {
    desktop: { url: string; height: string }
    mobile: { url: string; height: string }
    title: string
  }
}

const StyledCoverWrapper = styled.div<StaticCover>`
  background-size: cover;
  background-position: center;
  background-image: ${props => props.coverInfo.mobile?.url && `url(${props.coverInfo.mobile?.url})`};
  height: ${props => props.coverInfo.mobile?.height};
  @media (min-width: ${BREAK_POINT}px) {
    background-image: ${props => props.coverInfo.desktop?.url && `url(${props.coverInfo.desktop.url})`};
    height: ${props => props.coverInfo.desktop?.height};
  }
`

const StaticCoverSection: React.VFC<{ options: StaticCover }> = ({ options }) => {
  return <StyledCoverWrapper coverInfo={options.coverInfo} />
}

export default StaticCoverSection
