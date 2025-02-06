import { useIntl } from 'react-intl'
import * as localAuthMessages from '../translation'
import { StyledModal, StyledModalTitle } from './LoginSection'
import { Input, Text, Flex, Box, Button, useToast } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError } from '../../../helpers'
import { AuthModalContext } from '../AuthModal'
import axios from 'axios'
import { fetchCurrentGeolocation } from '../../../hooks/util'

const OverBindDeviceModal: React.VFC<{
  visible: boolean
  onClose: () => void
}> = ({ visible, onClose }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledModal
      width={400}
      centered
      visible={visible}
      okText={formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitConfirm)}
      okButtonProps={{ type: 'primary' }}
      onOk={onClose}
      cancelText={null}
      onCancel={onClose}
    >
      <StyledModalTitle className="mb-4">
        {formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitTitle)}
      </StyledModalTitle>
      <div className="mb-4">{formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitDescription)}</div>
    </StyledModal>
  )
}

export default OverBindDeviceModal
