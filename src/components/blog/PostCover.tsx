import { Icon } from '@chakra-ui/icons'
import { Button, Icon as AntdIcon } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import { ReactComponent as ArrowUpCircleIcon } from '../../images/arrow-up-circle.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as ShopOIcon } from '../../images/shop-o.svg'
import { MerchandiseProps } from '../../types/merchandise'
import MerchandiseModal from './MerchandiseModal'

const messages = defineMessages({
  checkMerchandises: { id: 'common.ui.checkMerchandises', defaultMessage: '查看商品' },
})

const StyledPlayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`

const StyledPictureCover = styled.div`
  margin-bottom: 24px;

  @media (max-width: 575px) {
    margin-left: -15px;
    margin-right: -15px;
    margin-bottom: 40px;
  }

  img {
    height: auto;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
`
const StyledVideoCover = styled.div<{ height?: number | null }>`
  background: black;
  margin-bottom: 24px;

  ${desktopViewMixin(css`
    padding: 2.5rem 0;
  `)}
`
const StyledVideoBlock = styled.div<{ variant?: 'mini-player' }>`
  ${props =>
    props.variant === 'mini-player'
      ? css`
          z-index: 1;
          position: fixed;
          right: 1.5rem;
          bottom: 1.5rem;
          padding: 1rem 1rem;
          width: 20rem;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
          background: white;
          animation-duration: 0.5s;
        `
      : ''}
`
const StyledVideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
`
const StyledHeader = styled.div`
  margin-bottom: 0.75rem;

  > i {
    margin-left: 0.75rem;
  }
`
const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StyledButton = styled(Button)`
  width: 100%;

  ${desktopViewMixin(css`
    margin: 0 auto;
    padding: 0 3.5rem;
    width: auto;
  `)}
`
const StyledOverlayBlock = styled.div<{ width?: number }>`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  overflow: hidden;
  animation-duration: 0.5s;
`
const StyledOverlay = styled.div`
  padding: 0.75rem 1rem;
  background: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.3);
`

const PostCover: React.VFC<{
  title: string
  coverUrl: string | null
  type: 'picture' | 'video'
  merchandises: MerchandiseProps[]
  isScrollingDown?: boolean
}> = ({ title, coverUrl, type, merchandises, isScrollingDown }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const coverRef = useRef<HTMLDivElement | null>(null)

  const [isClosed, setIsClosed] = useState(false)
  const [coverHeight, setCoverHeight] = useState<number | null>(null)

  const layoutContentElem = document.querySelector('#layout-content')

  const backToTop = useCallback(() => {
    layoutContentElem?.scroll({ top: 0, behavior: 'smooth' })
  }, [layoutContentElem])

  useEffect(() => {
    setCoverHeight(coverRef.current?.scrollHeight || null)
  }, [])

  const merchandiseModal = merchandises.length ? (
    <MerchandiseModal
      renderTrigger={({ setVisible }) =>
        isScrollingDown ? (
          <StyledOverlayBlock className="animated fadeInDown pb-4" width={layoutContentElem?.scrollWidth}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-9">
                  <StyledOverlay className="d-flex align-items-center justify-content-between">
                    <StyledTitle>{title}</StyledTitle>
                    {enabledModules.merchandise && merchandises.length > 0 && (
                      <Button type="link" size="small" onClick={setVisible}>
                        <Icon as={ShopOIcon} />
                        {formatMessage(messages.checkMerchandises)}
                      </Button>
                    )}
                  </StyledOverlay>
                </div>
              </div>
            </div>
          </StyledOverlayBlock>
        ) : enabledModules.merchandise && merchandises.length > 0 && type === 'video' ? (
          <div className="container p-3 p-lg-0 pt-lg-4 text-center">
            <StyledButton type="primary" onClick={setVisible}>
              <Icon as={ShopOIcon} />
              {formatMessage(messages.checkMerchandises)}
            </StyledButton>
          </div>
        ) : null
      }
      merchandises={merchandises}
    />
  ) : null

  if (type === 'picture') {
    return (
      <div className="container pt-sm-5">
        <div className="row justify-content-center">
          <StyledPictureCover id="post-cover" className="col-12 col-lg-9">
            <img src={coverUrl || EmptyCover} alt="cover" />
            {merchandiseModal}
          </StyledPictureCover>
        </div>
      </div>
    )
  }

  return (
    <StyledVideoCover
      ref={coverRef}
      id="post-cover"
      className="col-12 pt-sm-5"
      style={{ height: coverHeight ? `${coverHeight}px` : '' }}
    >
      <div className="container">
        <StyledVideoBlock
          className={`${!isClosed && isScrollingDown ? 'animated fadeInUp' : ''}`}
          variant={!isClosed && isScrollingDown ? 'mini-player' : undefined}
        >
          <StyledHeader className={`${isScrollingDown ? 'd-flex' : 'd-none'}`}>
            <StyledTitle className="flex-grow-1">{title}</StyledTitle>
            <Icon as={ArrowUpCircleIcon} className="cursor-pointer" onClick={() => backToTop()} />
            <AntdIcon type="close" className="cursor-pointer" onClick={() => setIsClosed(true)} />
          </StyledHeader>
          {coverUrl && (
            <StyledVideoWrapper>
              <StyledPlayer>
                {coverUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
                  <video
                    className="smartvideo"
                    src={coverUrl}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <ReactPlayer url={coverUrl} width="100%" height="100%" controls />
                )}
              </StyledPlayer>
            </StyledVideoWrapper>
          )}
        </StyledVideoBlock>
      </div>

      {merchandiseModal}
    </StyledVideoCover>
  )
}

export default PostCover
