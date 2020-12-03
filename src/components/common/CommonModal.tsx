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

const CommonModal: React.FC<
  ModalProps & {
    title: string
    renderTrigger: () => React.ReactElement
    renderHeaderIcon?: React.FC
    renderFooter?: () => React.ReactElement
  }
> = ({ title, renderHeaderIcon, renderTrigger, renderFooter, children, ...ModalProps }) => {
  return (
    <>
      {renderTrigger()}

      <Modal {...ModalProps}>
        <ModalOverlay />
        <ModalContent>
          {renderHeaderIcon}
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>{children}</ModalBody>

          {renderFooter && <ModalFooter>{renderFooter()}</ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CommonModal
