import { useIntl } from 'react-intl'
import * as localAuthMessages from '../translation'
import { StyledModal, StyledModalTitle } from './LoginSection'

const OverLoginDeviceModal: React.VFC<{
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
      okText={formatMessage(localAuthMessages.default.LoginSection.forceLogout)}
      cancelText={formatMessage(localAuthMessages.default.LoginSection.cancelLogin)}
      okButtonProps={{ loading, type: 'primary' }}
      onOk={onOk}
      onCancel={onClose}
    >
      <StyledModalTitle className="mb-4">
        {formatMessage(localAuthMessages.default.LoginSection.loginAlertModalTitle)}
      </StyledModalTitle>
      <div className="mb-4">{formatMessage(localAuthMessages.default.LoginSection.loginAlertModelDescription)}</div>
    </StyledModal>
  )
}

export default OverLoginDeviceModal
