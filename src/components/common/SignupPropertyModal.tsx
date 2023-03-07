import { Modal } from 'antd'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import SignupPropertySection from './SignupPropertySection'
import commonMessages from './translation'

export const StyledTitle = styled.h1`
  ${CommonLargeTitleMixin}
  margin-bottom: 1.5rem;
  text-align: center;
`

const SignupPropertyModal: React.VFC = () => {
  const { settings } = useApp()
  const { isAuthenticating, currentMemberId, isFinishedSignUpProperty } = useAuth()
  const { formatMessage } = useIntl()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    settings['feature.signup_info.enable'] === '1' &&
      !isAuthenticating &&
      currentMemberId &&
      !isFinishedSignUpProperty &&
      setVisible(true)
  }, [settings, isAuthenticating, currentMemberId, isFinishedSignUpProperty])

  return (
    <Modal footer={null} onCancel={() => setVisible && setVisible(false)} visible={visible} maskClosable={false}>
      <StyledTitle>{formatMessage(commonMessages.SignupPropertyModal.signupInfo)}</StyledTitle>
      <SignupPropertySection onModalVisible={setVisible} />
    </Modal>
  )
}

export default SignupPropertyModal
