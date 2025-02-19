import { gql, useApolloClient } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import OverLoginDeviceModal from '../components/auth/login/OverLoginDeviceModal'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import axios from 'axios'
import Cookies from 'js-cookie'
import { getFingerPrintId } from 'lodestar-app-element/src/hooks/util'
import { handleError } from '../helpers'

const OverLoginDevicePage: React.FC = () => {
  const { id: appId, settings } = useApp()
  const apollo = useApolloClient()
  let member: { id: string; email: string }
  try {
    member = JSON.parse(decodeURIComponent(Cookies.get('member')) || '{}')
  } catch (error) {
    member = { id: '', email: '' }
  }

  const handleForceLogin = async () => {
    const fingerPrintId = await getFingerPrintId()
    const { data: memberDevicesData } = await apollo.query<hasura.GetMemberDevices, hasura.GetMemberDevicesVariables>({
      query: gql`
        query GetMemberDevices($id: String!) {
          member_device(where: { member_id: { _eq: $id } }, order_by: { last_login_at: desc }) {
            member_id
            fingerprint_id
            is_login
            last_login_at
          }
        }
      `,
      variables: {
        id: member.id || '',
      },
    })
    if (memberDevicesData.member_device.length < Number(settings['login_device_num'])) {
      await axios
        .post(
          `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/device/manage-logged-in-limit`,
          {
            appId,
            memberId: member.id,
            fingerPrintId,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => (window.location.href = '/'))
        .catch(error => handleError(error))
        .finally(() => Cookies.remove('member'))
    }
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
