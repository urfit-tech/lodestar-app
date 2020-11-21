import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import AngleThinLeft from '../../images/angle-thin-left.svg'
import AngleThinRight from '../../images/angle-thin-right.svg'
import { MerchandiseProps } from '../../types/merchandise'
import MerchandiseBlock from '../merchandise/MerchandiseBlock'

const StyledModal = styled(Modal)`
  z-index: 1004;
  margin: 0;
  padding: 0;
  max-width: 100%;
  width: 100%;

  .ant-modal-body {
    padding: 2rem;
  }

  ${desktopViewMixin(css`
    width: 60rem;
  `)}
`
const StyledSwitchBlock = styled.div<{ variant?: 'left' | 'right' }>`
  display: block;
  position: fixed;
  top: 50%;
  width: 2rem;
  height: 2rem;
  background-size: cover;
  background-position: center;
  transform: translateY(-50%);
  cursor: pointer;

  ${props =>
    props.variant === 'left'
      ? css`
          left: 0.25rem;
          background-image: url(${AngleThinLeft});
        `
      : css`
          right: 0.25rem;
          background-image: url(${AngleThinRight});
        `}

  ${props =>
    desktopViewMixin(css`
      position: absolute;
      width: 4rem;
      height: 4rem;

      ${props.variant === 'left'
        ? css`
            left: -4rem;
          `
        : css`
            right: -4rem;
          `}
    `)}
`

const MerchandiseModal: React.FC<
  ModalProps & {
    renderTrigger: React.FC<{
      setVisible: () => void
    }>
    merchandises: MerchandiseProps[]
  }
> = ({ renderTrigger, merchandises, ...modalProps }) => {
  const [visible, setVisible] = useState(false)
  const [merchandiseIndex, setMerchandiseIndex] = useState(0)

  const targetMerchandise: MerchandiseProps | undefined = merchandises[merchandiseIndex]

  return (
    <>
      {renderTrigger({ setVisible: () => setVisible(true) })}

      {visible && (
        <StyledModal
          title={null}
          footer={null}
          width=""
          centered
          destroyOnClose
          visible={visible}
          onCancel={() => setVisible(false)}
          {...modalProps}
          maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          {merchandises.length > 1 && (
            <>
              <StyledSwitchBlock
                variant="left"
                onClick={() =>
                  merchandiseIndex === 0
                    ? setMerchandiseIndex(merchandises.length - 1)
                    : setMerchandiseIndex(merchandiseIndex - 1)
                }
              />
              <StyledSwitchBlock
                variant="right"
                onClick={() =>
                  merchandiseIndex === merchandises.length - 1
                    ? setMerchandiseIndex(0)
                    : setMerchandiseIndex(merchandiseIndex + 1)
                }
              />
            </>
          )}

          <div className="container">
            <MerchandiseBlock merchandise={targetMerchandise} />
          </div>
        </StyledModal>
      )}
    </>
  )
}

export default MerchandiseModal
