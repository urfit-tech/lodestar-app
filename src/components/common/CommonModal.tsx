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
    renderFooter?: () => React.ReactElement
  }
> = ({ title, renderTrigger, renderFooter, children, ...ModalProps }) => {
  return (
    <>
      {renderTrigger()}

      <Modal {...ModalProps}>
        <ModalOverlay />
        <ModalContent>
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
