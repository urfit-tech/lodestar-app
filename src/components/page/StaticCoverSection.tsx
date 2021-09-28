import styled from 'styled-components'
import { useOnceAnimation } from '../../helpers'
import { BREAK_POINT } from '../common/Responsive'

type StaticCover = {
  animation: string
  coverInfo: {
    desktop: { url: string; height: string }
    mobile: { url: string; height: string }
    title: string
  }
}

const StyledCoverWrapper = styled.div<Pick<StaticCover, 'coverInfo'>>`
  background-size: cover;
  background-position: center;
  background-image: ${props => props.coverInfo?.mobile?.url && `url(${props.coverInfo.mobile.url})`};
  height: ${props => props.coverInfo?.mobile?.height};
  @media (min-width: ${BREAK_POINT}px) {
    background-image: ${props => props.coverInfo?.desktop?.url && `url(${props.coverInfo.desktop.url})`};
    height: ${props => props.coverInfo?.desktop?.height};
  }
`

const StaticCoverSection: React.VFC<{ options: StaticCover }> = ({ options: { animation, coverInfo } }) => {
  const { ref, activated } = useOnceAnimation()

  return (
    <StyledCoverWrapper
      ref={ref}
      className={`${animation && activated ? `animate__animated ${animation}` : ''}`}
      coverInfo={coverInfo}
    />
  )
}

export default StaticCoverSection
