import { useIntl } from 'react-intl'
import authMessages, * as localAuthMessages from '../translation'
import { StyledModal, StyledModalTitle } from './LoginSection'
import { Input, Text, Flex, Box, Button, useToast } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError } from '../../../helpers'
import { AuthModalContext } from '../AuthModal'
import axios from 'axios'
import { fetchCurrentGeolocation } from '../../../hooks/util'

const OverBindDeviceModal: React.FC<{
  member: { id: string; email: string }
  visible: boolean
  onClose: () => void
}> = ({ member, visible, onClose }) => {
  const eventType = 'login-device-limit'
  const toast = useToast()
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const [currentCode, setCurrentCode] = useState('')
  const [error, setError] = useState(false)

  const handleConfirm = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/mail-verification-code/verify`, {
          appId,
          email: member.email,
          memberId: member.id,
          type: eventType,
          code: currentCode,
        })
        .then(({ data: { code, result } }) => {
          if (code !== 'SUCCESS') {
            toast({
              title: formatMessage(authMessages.OverBindDeviceModal.validationFailed),
              status: 'error',
              duration: 3000,
              isClosable: false,
              position: 'top',
            })
            if (result?.intervalTime) {
              localStorage.setItem('mail-last-sent-time', result?.intervalTime || '0')
            }
            setError(true)
          } else {
            toast({
              title: formatMessage(authMessages.OverBindDeviceModal.validationSuccessfulText),
              status: 'success',
              duration: 3000,
              isClosable: false,
              position: 'top',
            })
            localStorage.removeItem('mail-last-sent-time')
            setError(false)
            onClose()
          }
          setAuthModalVisible?.(true)
        })
    } catch (error) {
      handleError(error)
    }
  }

  const handleReSend = async () => {
    try {
      const { ip } = await fetchCurrentGeolocation()
      await axios
        .post(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/mail-verification-code/send`, {
          appId,
          email: member.email,
          type: eventType,
          ip,
        })
        .then(({ data: { code, result } }) => {
          if (code === 'SUCCESS') {
            toast({
              title: formatMessage(authMessages.OverBindDeviceModal.sentSuccessfully),
              status: 'success',
              duration: 3000,
              isClosable: false,
              position: 'top',
            })
          } else {
            toast({
              title: formatMessage(authMessages.OverBindDeviceModal.failedToSend),
              status: 'error',
              duration: 3000,
              isClosable: false,
              position: 'top',
            })
            localStorage.setItem('mail-last-sent-time', result?.lastSentTime)
          }
        })
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <StyledModal
      width={400}
      centered
      visible={visible}
      okText={formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitConfirm)}
      okButtonProps={{ type: 'primary' }}
      onOk={handleConfirm}
      cancelText={null}
      onCancel={() => {
        onClose()
        setError(false)
      }}
    >
      <StyledModalTitle className="mb-4">
        {formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitTitle)}
      </StyledModalTitle>
      <div>{formatMessage(localAuthMessages.default.LoginSection.deviceReachLimitDescription)}</div>
      <div className="mb-4">
        {formatMessage(localAuthMessages.default.LoginSection.yourEmail, { email: member.email })}
      </div>
      <div>
        <Input
          value={currentCode}
          onChange={v => setCurrentCode(v.target.value.trim())}
          placeholder={formatMessage(authMessages.OverBindDeviceModal.deviceVerificationCode)}
          style={{ border: error ? 'red 1px solid' : undefined }}
        />
        <Box mt="0.5rem" display={error ? 'block' : 'none'}>
          <Text textColor="#FF0000">{formatMessage(authMessages.OverBindDeviceModal.validationCodeError)}</Text>
        </Box>
      </div>
      <Flex justifyContent="center" alignItems="center" mt="1rem">
        <Box>{formatMessage(authMessages.OverBindDeviceModal.didNotReceiveVerificationCode)}</Box>
        <Button id="send" onClick={() => handleReSend()} variant="ghost" color="primary.500" fontWeight="500">
          {formatMessage(authMessages.OverBindDeviceModal.reSend)}
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default OverBindDeviceModal
