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
  position: relative;
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
    ${(props: any) => props.mobile && `margin-right: 8px;`}
  }
  &:hover {
    background: #008e86;
  }
  &:active {
    background: #007770;
  }
  ${(props: any) => props.disabled && `opacity: 0.4; pointer-events: none;`}
`

const CWLPageNavButtons: React.VFC<{
  mainBlock: String
  navButtons: Array<{
    text: string
    targetId: string
    gtmName: string
    gtmAction: string
    gtmLabel: string
    linkto?: any
  }>
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

  /** 取得滑至時送 DataLayer Push 的區塊 */
  const getBlockScrollProgress = (navButtons: any) => {
    const shouldSendBlock = []
    if (navButtons.some((button: any) => button.text === '講師簡介')) {
      shouldSendBlock.push({
        element: document.querySelector('#program-instructor-collection'),
        gtmLabel: '捲動至講師簡介',
      })
    }
    if (navButtons.some((button: any) => button.text === '課程內容')) {
      shouldSendBlock.push({
        element: document.querySelector('#program-content-list-section'),
        gtmLabel: '捲動至課程內容',
      })
    }
    return shouldSendBlock
  }

  /** 捲動事件 */
  const handleScrollDataLayer = (scroller: any) => {
    const progressToSend = [25, 50, 75]
    const blockProgressToSend = getBlockScrollProgress(navButtons)
    const onScroll = function () {
      const pageHeight = scroller.getBoundingClientRect().height
      const scrollProgress = (scroller.scrollTop / (scroller.scrollHeight - pageHeight)) * 100
      const dataLayer = (window as any).dataLayer || []
      // console.log('scrollProgress', Math.round(scrollProgress) + '％')
      progressToSend.map(progress => {
        if (scrollProgress >= progress) {
          const eventData = {
            event: 'sendEvent',
            'gtm-name': '課介頁',
            'gtm-action': '頁面瀏覽',
            'gtm-label': '捲動頁面' + progressToSend.shift() + '%',
          }
          console.log('eventData', eventData)
          dataLayer.push(eventData)
          return
        }
      })
      blockProgressToSend.map(block => {
        if (block.element) {
          const elementTop = block.element.getBoundingClientRect().top
          if (elementTop && elementTop < window.innerHeight) {
            const eventData = {
              event: 'sendEvent',
              'gtm-name': '課介頁',
              'gtm-action': '頁面瀏覽',
              'gtm-label': block.gtmLabel,
            }
            blockProgressToSend.splice(blockProgressToSend.indexOf(block), 1)
            console.log('eventData', eventData)
            dataLayer.push(eventData)
            return
          }
        }
      })
      if (!progressToSend.length && !blockProgressToSend.length) {
        scroller.removeEventListener('scroll', onScroll)
      }
    }
    scroller.addEventListener('scroll', onScroll)
  }

  useEffect(() => {
    if (layoutContent) {
      layoutContent.addEventListener('scroll', setPageNavFixed)
      handleScrollDataLayer(layoutContent)
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
                    <div
                      gtm-name={item.gtmName}
                      gtm-action={item.gtmAction}
                      gtm-label={item.gtmLabel}
                      style={{ position: 'absolute', top: '0', left: '0', bottom: '0', right: '0' }}
                    />
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
                      <div
                        gtm-name={item.gtmName}
                        gtm-action={item.gtmAction}
                        gtm-label={item.gtmLabel}
                        style={{ position: 'absolute', top: '0', left: '0', bottom: '0', right: '0' }}
                      />
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
                  <div
                    gtm-name={item.gtmName}
                    gtm-action={item.gtmAction}
                    gtm-label={item.gtmLabel}
                    style={{ position: 'absolute', top: '0', left: '0', bottom: '0', right: '0' }}
                  />
                </PageNavItem>
              ) : (
                <Link to={item.linkto}>
                  <PageNavItem
                    disabled={disabled}
                    mobile
                    style={{ padding: '6px 14px', fontSize: '14px', border: 'solid 1px #fff' }}
                  >
                    {item.text}
                    <div
                      gtm-name={item.gtmName}
                      gtm-action={item.gtmAction}
                      gtm-label={item.gtmLabel}
                      style={{ position: 'absolute', top: '0', left: '0', bottom: '0', right: '0' }}
                    />
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
