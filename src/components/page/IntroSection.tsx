import styled from 'styled-components'
import { useOnceAnimation } from '../../helpers'
import { BREAK_POINT } from '../common/Responsive'

type ImageLabel = {
  text: string
  top: string
  right: string
  bottom: string
  left: string
  fontSize: string
  letterSpacing: string
  color: string
  backgroundColor: string
  padding: string
  width: string
  height: string
}

type Intro = {
  id: string
  padding: string
  imageInfo: {
    position: 'right'
    mobileMargin: string
    desktopMargin: string
    alt: string
    url: string
    width: string
    height: string
    animation: string
    labelInfo: ImageLabel
  }
  titleInfo: {
    title: string
    fontSize: string
    letterSpacing: string
    color: string
    fontWeight: string | number
    mobileMargin: string
    desktopMargin: string
  }
  contentWrapper: {
    mobileWidth: string
    desktopWidth: string
    fontSize: string
    letterSpacing: string
    color: string
    lineHeight: string
    contentsSpacing: boolean
  }
  contents: string[]
}
const StyledSection = styled.div<Pick<Intro, 'padding'>>`
  padding: ${props => props?.padding || '100px 0'};
`
const StyledImage = styled.div<Pick<Intro, 'imageInfo'>>`
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: ${props => props?.imageInfo?.url && `url(${props.imageInfo.url})`};
  width: ${props => props?.imageInfo?.width || '100%'};
  height: ${props => props?.imageInfo?.height || '100%'};
  order: ${props => props?.imageInfo?.position === 'right' && 2};
  margin: ${props => props?.imageInfo?.mobileMargin || 'auto'};
  &::after {
    position: absolute;
    content: ${props => props?.imageInfo?.labelInfo?.text && `"${props.imageInfo.labelInfo.text}"`};
    top: ${props => props?.imageInfo?.labelInfo?.top};
    right: ${props => props?.imageInfo?.labelInfo?.right};
    bottom: ${props => props?.imageInfo?.labelInfo?.bottom};
    left: ${props => props?.imageInfo?.labelInfo?.left};
    font-size: ${props => props?.imageInfo?.labelInfo?.fontSize || '1rem'};
    letter-spacing: ${props => props?.imageInfo?.labelInfo?.letterSpacing || '0.2px'};
    color: ${props => props?.imageInfo?.labelInfo?.color};
    background-color: ${props => props?.imageInfo?.labelInfo?.backgroundColor};
    padding: ${props => props?.imageInfo?.labelInfo?.padding};
    width: ${props => props?.imageInfo?.labelInfo?.width};
    height: ${props => props?.imageInfo?.labelInfo?.height};
  }
  @media (min-width: ${BREAK_POINT}px) {
    margin: ${props => props?.imageInfo?.desktopMargin || 'auto'};
  }
`
const StyledTitle = styled.div<Pick<Intro, 'titleInfo'>>`
  text-align: center;
  font-size: ${props => props?.titleInfo?.fontSize || '1rem'};
  font-weight: ${props =>
    props?.titleInfo?.fontWeight
      ? typeof props.titleInfo?.fontWeight === 'string'
        ? `${props.titleInfo?.fontWeight}`
        : props.titleInfo?.fontWeight
      : 500};
  color: ${props => props?.titleInfo?.color || '#585858'};
  margin: ${props => props?.titleInfo?.mobileMargin};
  @media (min-width: ${BREAK_POINT}px) {
    margin: ${props => props?.titleInfo?.desktopMargin};
    text-align: left;
  }
`
const StyledContent = styled.div<Pick<Intro, 'contentWrapper'>>`
  text-align: center;
  margin: auto;
  width: ${props => props?.contentWrapper?.mobileWidth || '300px'};
  font-size: ${props => props?.contentWrapper?.fontSize || '1rem'};
  letter-spacing: ${props => props?.contentWrapper?.letterSpacing || '0.2px'};
  color: ${props => props?.contentWrapper?.color || '#585858'};
  line-height: ${props => props?.contentWrapper?.lineHeight};
  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
    width: ${props => props?.contentWrapper?.desktopWidth};
  }
`

const IntroSection: React.VFC<{ options: Intro }> = ({ options }) => {
  const { ref, activated } = useOnceAnimation()

  return (
    <StyledSection
      id={options?.id}
      className="d-lg-flex justify-content-center align-content-center"
      padding={options?.padding}
    >
      <StyledImage
        className={`${
          options?.imageInfo?.animation && activated ? `animate__animated ${options.imageInfo.animation}` : ''
        }`}
        ref={ref}
        imageInfo={options?.imageInfo}
      />
      <div>
        <StyledTitle titleInfo={options?.titleInfo}>{options?.titleInfo?.title}</StyledTitle>
        <StyledContent contentWrapper={options?.contentWrapper}>
          {options?.contents.map((content, index) => (
            <>
              <p>{content}</p>
              {options?.contentWrapper?.contentsSpacing && index + 1 !== options.contents.length && <br />}
            </>
          ))}
        </StyledContent>
      </div>
    </StyledSection>
  )
}
export default IntroSection
