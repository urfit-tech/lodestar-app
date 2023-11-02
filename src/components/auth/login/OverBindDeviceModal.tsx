import { useIntl } from 'react-intl'
import * as localAuthMessages from '../translation'
import { StyledModal, StyledModalTitle } from './LoginSection'

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
