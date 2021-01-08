import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import React from 'react'
import styled, { css } from 'styled-components'

const StyledModalContent = styled(ModalContent)<{ isFullWidth?: boolean }>`
  && {
    ${props =>
      props.isFullWidth &&
      css`
        margin: 0;
        max-width: 100%;
        min-height: 100vh;
      `}
  }
`
const StyledWrapper = styled.div`
  position: relative;
`
const StyledCloseButtonBlock = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
`

const CommonModal: React.FC<
  {
    title: string
    renderTrigger: () => React.ReactElement
    isFullWidth?: boolean
    renderHeaderIcon?: () => React.ReactElement
    renderCloseButtonBlock?: () => React.ReactElement
    renderFooter?: () => React.ReactElement
  } & ModalProps
> = ({
  title,
  renderTrigger,
  isFullWidth,
  renderHeaderIcon,
  renderCloseButtonBlock,
  renderFooter,
  children,
  ...ModalProps
}) => {
  return (
    <>
      {renderTrigger()}

      <Modal {...ModalProps}>
        <ModalOverlay />
        <StyledModalContent isFullWidth={isFullWidth}>
          <StyledWrapper className="container">
            {renderHeaderIcon?.()}

            <ModalHeader>{title}</ModalHeader>

            {renderCloseButtonBlock ? (
              <StyledCloseButtonBlock>{renderCloseButtonBlock()}</StyledCloseButtonBlock>
            ) : (
              <ModalCloseButton />
            )}

            <ModalBody>{children}</ModalBody>

            {renderFooter && <ModalFooter>{renderFooter()}</ModalFooter>}
          </StyledWrapper>
        </StyledModalContent>
      </Modal>
    </>
  )
}

export default CommonModal
