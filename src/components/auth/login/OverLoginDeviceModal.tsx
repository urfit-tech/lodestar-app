import { useIntl } from 'react-intl'
import authMessages from '../translation'
import { StyledModal, StyledModalTitle } from './LoginSection'

const OverLoginDeviceModal: React.FC<{
  visible: boolean
  onClose: () => void
  onOk?: () => void
  loading?: boolean
}> = ({ visible, onClose, onOk, loading }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledModal
      width={400}
      centered
      visible={visible}
      okText={formatMessage(authMessages.LoginSection.forceLogout)}
      cancelText={formatMessage(authMessages.LoginSection.cancelLogin)}
      okButtonProps={{ loading, type: 'primary' }}
      onOk={onOk}
      onCancel={onClose}
    >
      <StyledModalTitle className="mb-4">
        {formatMessage(authMessages.LoginSection.loginAlertModalTitle)}
      </StyledModalTitle>
      <div className="mb-4">{formatMessage(authMessages.LoginSection.loginAlertModelDescription)}</div>
    </StyledModal>
  )
}

export default OverLoginDeviceModal
