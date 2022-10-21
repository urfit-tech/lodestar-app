import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Responsive from './Responsive'

const PageNavButtonsContainer = styled.div<{ isFixed?: Boolean }>`
  display: flex;
  width: 100%;
  padding: 22px 0;
  top: 64px;
  margin-bottom: -15px;
  background: #fff;
  ${props => props.isFixed && `visibility: ${props.isFixed ? 'hidden' : 'visible'}`}
  justify-content: center;
  z-index: 1;
`

const PageNav = styled.ol`
  display: flex;
  justify-content: center;
  list-style: none;
`

const PageNavItem = styled.li<{ disabled?: Boolean; mobile?: Boolean }>`
  padding: 9px 21px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: #019d96;
  border-radius: 100px;
  transition: 250ms;
  cursor: pointer;
  user-select: none;
  &:not(:last-child) {
    margin-right: 20px;
    ${props => props.mobile && `margin-right: 8px;`}
  }
  &:hover {
    background: #008e86;
  }
  &:active {
    background: #007770;
  }
  ${props => props.disabled && `opacity: 0.4; pointer-events: none;`}
`

const CWLPageNavButtons: React.VFC<{
  mainBlock: String
  navButtons: Array<{ text: string; targetId: string; linkto?: any }>
}> = ({ mainBlock, navButtons }) => {
  const [isPageNavFixed, setIsPageNavFixed] = useState(false)
  const [isPageNavMobileHide, setIsPageNavMobileHide] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const layoutContent = document.querySelector('#layout-content')
  let timer: any = null
  let currentTop = 0

  const setPageNavFixed = () => {
    const pageNav = document.querySelector('.pageNavButtonsContainer')
    const pageNavBlockTop = pageNav?.getBoundingClientRect().top
    const fixBlock = document.querySelector(`#${mainBlock}`)?.getBoundingClientRect()
    if (currentTop && fixBlock && currentTop < fixBlock.top) {
      setIsPageNavMobileHide(true)
    }
    if (currentTop && fixBlock && currentTop > fixBlock.top) {
      setIsPageNavMobileHide(false)
    }
    if (pageNavBlockTop && pageNavBlockTop <= 65) {
      setIsPageNavFixed(true)
    }
    if (fixBlock && fixBlock.top + fixBlock.height >= 65) {
      setIsPageNavFixed(false)
    }
    if (fixBlock) {
      currentTop = fixBlock.top
    }
  }

  const onNavButtonClick = (element: any) => {
    let prevClientTop = 0
    setDisabled(true)
    function elementScroll() {
      const clientTop = element.getBoundingClientRect().top
      const windowWidth = window.innerWidth
      const basicDistance = windowWidth < 992 ? 85 : 165
      prevClientTop = clientTop
      if (clientTop > basicDistance) {
        layoutContent?.scrollBy(0, +10)
      } else if (clientTop < basicDistance && !(clientTop > basicDistance - 10)) {
        layoutContent?.scrollBy(0, -10)
      } else if (prevClientTop === clientTop) {
        clearInterval(timer)
        setDisabled(false)
      } else {
        clearInterval(timer)
        setDisabled(false)
      }
    }
    timer = setInterval(() => elementScroll(), 2)
  }

  useEffect(() => {
    if (layoutContent) {
      layoutContent.addEventListener('scroll', setPageNavFixed)
    }

    return () => {
      if (layoutContent) {
        layoutContent.removeEventListener('scroll', setPageNavFixed)
      }
    }
  }, [])

  return (
    <div className="ab-test-program-page-nav" style={{ display: 'none' }}>
      <Responsive.Desktop>
        <PageNavButtonsContainer className="pageNavButtonsContainer" isFixed={isPageNavFixed}>
          <div className="container">
            <PageNav>
              {navButtons.map(item => {
                return (
                  <PageNavItem
                    disabled={disabled}
                    onClick={() => {
                      onNavButtonClick(document.querySelector(item.targetId))
                    }}
                  >
                    {item.text}
                  </PageNavItem>
                )
              })}
            </PageNav>
          </div>
        </PageNavButtonsContainer>
        {isPageNavFixed && (
          <PageNavButtonsContainer className="pageNavButtonsContainer pageNavFixed">
            <div className="container">
              <PageNav>
                {navButtons.map(item => {
                  return (
                    <PageNavItem
                      disabled={disabled}
                      onClick={() => {
                        onNavButtonClick(document.querySelector(item.targetId))
                      }}
                    >
                      {item.text}
                    </PageNavItem>
                  )
                })}
              </PageNav>
            </div>
          </PageNavButtonsContainer>
        )}
      </Responsive.Desktop>

      <Responsive.Default>
        <PageNavButtonsContainer
          style={{
            position: 'fixed',
            marginBottom: 'initial',
            padding: '11px 0',
            top: 'initial',
            left: '0',
            bottom: '0',
            background: '#029D96',
            transition: '1s',
            transform: isPageNavMobileHide ? 'translateY(200%)' : 'translateY(0%)',
            zIndex: '1000',
          }}
        >
          <PageNav style={{ whiteSpace: 'nowrap' }}>
            {navButtons.map(item => {
              return !item.linkto ? (
                <PageNavItem
                  disabled={disabled}
                  mobile
                  style={{ padding: '6px 14px', fontSize: '14px', border: 'solid 1px #fff' }}
                  onClick={() => {
                    onNavButtonClick(document.querySelector(item.targetId))
                  }}
                >
                  {item.text}
                </PageNavItem>
              ) : (
                <Link to={item.linkto}>
                  <PageNavItem
                    disabled={disabled}
                    mobile
                    style={{ padding: '6px 14px', fontSize: '14px', border: 'solid 1px #fff' }}
                  >
                    {item.text}
                  </PageNavItem>
                </Link>
              )
            })}
          </PageNav>
        </PageNavButtonsContainer>
      </Responsive.Default>
    </div>
  )
}

export default CWLPageNavButtons
