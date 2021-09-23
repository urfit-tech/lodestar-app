import { Link } from 'react-router-dom'
import styled from 'styled-components'

type NavItem = {
  padding?: string
  backgroundColor?: string
  color?: string
  fontSize?: string
  fontWeight?: string | number
  height?: string
  letterSpacing?: string | number
  transition?: string
  hover?: {
    color?: string
    backgroundColor?: string
    borderRadius?: string
  }
}

const StyledBar = styled.div`
  position: sticky;
  top: 0;
  width: 100%;

  overflow: hidden;
  background: white;
  text-align: center;
  z-index: 1;
`
const StyledWrapper = styled.div<{ padding?: string; height?: string; backgroundColor?: string }>`
  padding: ${props => props.padding || '8px 0px'};
  background-color: ${props => props.backgroundColor};
  height: ${props => props.height || '56px'};
`
const StyledItem = styled.div<{
  itemStyle?: NavItem
}>`
  display: inline-block;
  cursor: pointer;
  padding: ${props => props.itemStyle?.padding || `12px 10px`};
  color: ${props => props.itemStyle?.color || '#585858'};
  background-color: ${props => props.itemStyle?.backgroundColor};

  font-size: ${props => props.itemStyle?.fontSize};
  font-weight: ${props =>
    props.itemStyle?.fontWeight
      ? typeof props.itemStyle.fontWeight === 'string'
        ? `${props.itemStyle.fontWeight}`
        : props.itemStyle.fontWeight
      : 500};
  height: ${props => props.itemStyle?.height || '40px'};
  letter-spacing: ${props =>
    props.itemStyle?.letterSpacing
      ? typeof props.itemStyle.letterSpacing === 'string'
        ? `${props.itemStyle.letterSpacing}`
        : props.itemStyle.letterSpacing
      : '0.2px'};
  transition: ${props => props.itemStyle?.transition};

  &:hover {
    color: ${props => (props.itemStyle?.hover?.color ? props.itemStyle.hover.color : props.theme['@primary-color'])};
    background-color: ${props => props.itemStyle?.hover?.backgroundColor};
    border-radius: ${props => props.itemStyle?.hover?.borderRadius};
  }
`

const NavSection: React.VFC<{
  options: {
    backgroundColor?: string
    height?: string
    navList?: { id: string; title?: string; link?: string }[]
    itemStyle?: NavItem
  }
}> = ({ options }) => {
  console.log(options.itemStyle)
  return (
    <StyledBar>
      <StyledWrapper backgroundColor={options.backgroundColor || ''}>
        {options.navList
          ? options.navList.map(nav =>
              nav.link ? (
                <Link to={nav.link}>
                  <StyledItem itemStyle={options.itemStyle}>{nav.title}</StyledItem>
                </Link>
              ) : (
                <a href={`#${nav.id}`}>
                  <StyledItem itemStyle={options.itemStyle}>{nav.title}</StyledItem>
                </a>
              ),
            )
          : ''}
      </StyledWrapper>
    </StyledBar>
  )
}

export default NavSection
