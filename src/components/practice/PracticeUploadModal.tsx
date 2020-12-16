import { Button, useDisclosure } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import CommonModal from '../common/CommonModal'

const messages = defineMessages({
  uploadPractice: { id: 'program.ui.uploadPractice', defaultMessage: '上傳作業' },
})

const StyledButton = styled(Button)`
  && {
    width: 100%;
  }
`

const PracticeUploadModal: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <CommonModal
      title={formatMessage(messages.uploadPractice)}
      isOpen={isOpen}
      onClose={onClose}
      renderTrigger={() => <StyledButton onClick={onOpen}>{formatMessage(messages.uploadPractice)}</StyledButton>}
    >
      <BraftEditor />
    </CommonModal>
  )
}

export default PracticeUploadModal
