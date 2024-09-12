import React from 'react'
import styled from 'styled-components'

const StyledBar = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: white;
  text-align: center;
  z-index: 1;
`
const StyledWrapper = styled.div<{ position?: 'right' }>`
  position: absolute;
  width: auto;
  ${props => (props.position === 'right' ? 'right: 0;' : 'left: 0;')}
  white-space: nowrap;
  transition: all 0.2s ease-in-out;

  @media (min-width: 424px) {
    position: relative;
    margin: 0 auto;
  }
`
const StyledItem = styled.div<{ variant?: 'active' }>`
  display: inline-block;
  padding: 12px 10px;
  color: ${props => (props.variant === 'active' ? '#f39a00' : 'var(--gray-darker)')};
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #f39a00;
  }
`

const sections: {
  id: string
  title: string
}[] = [
  {
    id: 'intro',
    title: 'MISA簡介',
  },
  {
    id: 'chairman',
    title: '理事長的話',
  },
  {
    id: 'co-founder',
    title: '共同創辦人',
  },
  {
    id: 'director-list',
    title: '理監事名單',
  },
]

const NavigationBar: React.FC<{}> = () => {
  return (
    <StyledBar>
      <StyledWrapper>
        {sections.map(section => (
          <a href={`#${section.id}`}>
            <StyledItem>{section.title}</StyledItem>
          </a>
        ))}
      </StyledWrapper>
    </StyledBar>
  )
}

export default NavigationBar
