import OverBindDeviceModal from '../components/auth/login/OverBindDeviceModal'
import DefaultLayout from '../components/layout/DefaultLayout'

const OverBindDevicePage: React.VFC = () => {
  return (
    <>
      <DefaultLayout>
        <OverBindDeviceModal
          visible={true}
          onClose={() => {
            window.location.href = '/'
          }}
        />
      </DefaultLayout>
    </>
  )
}

export default OverBindDevicePage
