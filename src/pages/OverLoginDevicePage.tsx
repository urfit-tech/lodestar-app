import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { getFingerPrintId } from 'lodestar-app-element/src/hooks/util'
import { createLodestarServerClient } from 'lodestar-app-element/src/services/http'
import OverLoginDeviceModal from '../components/auth/login/OverLoginDeviceModal'
import DefaultLayout from '../components/layout/DefaultLayout'
import { handleError } from '../helpers'

const OverLoginDevicePage: React.FC = () => {
  const { id: appId } = useApp()
  let member: { id: string; email: string }
  try {
    member = JSON.parse(decodeURIComponent(Cookies.get('member')) || '{}')
  } catch (error) {
    member = { id: '', email: '' }
  }

  const handleForceLogin = async () => {
    const fingerPrintId = await getFingerPrintId()
    await createLodestarServerClient({ withCredentials: true })
      .post('/device/manage-logged-in-limit', {
        appId,
        memberId: member.id,
        fingerPrintId,
      })
      .then(() => (window.location.href = '/'))
      .catch(error => handleError(error))
      .finally(() => Cookies.remove('member'))
  }

  return (
    <DefaultLayout>
      <OverLoginDeviceModal
        visible={true}
        onOk={() => handleForceLogin()}
        onClose={() => (window.location.href = '/')}
      />
    </DefaultLayout>
  )
}

export default OverLoginDevicePage
