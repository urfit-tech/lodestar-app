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
  margin: 0 auto;
  max-width: 720px;
  width: 100%;
`
const StyledCloseButtonBlock = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
`

const CommonModal: React.FC<
  {
    title: string | React.ReactElement
    renderTrigger: () => React.ReactElement | null
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
          <StyledWrapper>
            {renderHeaderIcon?.()}

            <ModalHeader className="pt-4 pb-0">{title}</ModalHeader>

            {renderCloseButtonBlock ? (
              <StyledCloseButtonBlock>{renderCloseButtonBlock()}</StyledCloseButtonBlock>
            ) : (
              <ModalCloseButton />
            )}

            <ModalBody>{children}</ModalBody>

            {renderFooter && <ModalFooter className="pb-4">{renderFooter()}</ModalFooter>}
          </StyledWrapper>
        </StyledModalContent>
      </Modal>
    </>
  )
}

export default CommonModal
