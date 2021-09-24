import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

type Intro = {
  padding: string
  spacing: string
  imageInfo: {
    url: string
    position: 'leftTop' | 'right'
    alt: string
    height: string
    animation: string
  }
  titleInfo: {
    title: string
    fontSize: string
    letterSpacing: string
    color: string
    fontWeight: string | number
  }
  contentWrapper: {
    mobileWidth: string
    desktopWidth: string
    fontSize: string
    letterSpacing: string
    color: string
    lineHeight: string
  }
  contents: string[]
}
const StyledSection = styled.div<Pick<Intro, 'padding'>>`
  padding: ${props => props.padding || '100px 0'};
`
const StyledImage = styled.img<Pick<Intro, 'imageInfo'>>`
  height: ${props => props.imageInfo.height || '100%'};
  order: ${props => props.imageInfo.position === 'right' && 2};
  margin: auto;
  @media (min-width: ${BREAK_POINT}px) {
    margin: ${props => (props.imageInfo.position === 'right' ? 'auto 0px auto 60px' : 'auto 60px auto 0')};
  }
`
const StyledTitle = styled.div<Pick<Intro, 'titleInfo'>>`
  text-align: center;
  font-size: ${props => props.titleInfo?.fontSize || '1rem'};
  font-weight: ${props =>
    props.titleInfo?.fontWeight
      ? typeof props.titleInfo?.fontWeight === 'string'
        ? `${props.titleInfo?.fontWeight}`
        : props.titleInfo?.fontWeight
      : 500};
  color: ${props => props.titleInfo?.color || '#585858'};
  margin: 32px 0 16px 0;
  @media (min-width: ${BREAK_POINT}px) {
    margin: 0 0 16px 0;
    text-align: left;
  }
`
const StyledContent = styled.div<Pick<Intro, 'contentWrapper'>>`
  text-align: center;
  margin: auto;
  width: ${props => props.contentWrapper?.mobileWidth};
  font-size: ${props => props.contentWrapper?.fontSize || '1rem'};
  letter-spacing: ${props => props.contentWrapper?.letterSpacing || '0.2px'};
  color: ${props => props.contentWrapper?.color || '#585858'};
  line-height: ${props => props.contentWrapper?.lineHeight};
  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
    width: ${props => props.contentWrapper?.desktopWidth};
  }
`

const IntroSection: React.VFC<{ options: Intro }> = ({ options }) => {
  return (
    <StyledSection className="d-lg-flex justify-content-center align-content-center" padding={options.padding}>
      <StyledImage imageInfo={options.imageInfo} src={options.imageInfo.url} alt={options.imageInfo.alt} />
      <div>
        <StyledTitle titleInfo={options.titleInfo}>{options.titleInfo.title}</StyledTitle>
        <StyledContent contentWrapper={options.contentWrapper}>
          {options.contents.map(content => (
            <p>{content}</p>
          ))}
        </StyledContent>
      </div>
    </StyledSection>
  )
}
export default IntroSection
