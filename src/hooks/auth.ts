import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { checkLearningSystem } from '../helpers/learning'

export const useAuthModal = () => {
  const tracking = useTracking()
  const { settings } = useApp()
  let utm: any
  try {
    utm = JSON.parse(Cookies.get('utm') || '{}')
  } catch (error) {
    utm = {}
  }

  const pathName = window.location.pathname
  const isPushToCouponsVoucherPage = pathName.includes('/coupons') || pathName.includes('/voucher')
  const isPushToMemberLearningPage = checkLearningSystem(settings['custom']).isStart && !isPushToCouponsVoucherPage
  return {
    open: (setAuthModalVisible: React.Dispatch<React.SetStateAction<boolean>> | undefined) => {
      if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
        const state = btoa(
          JSON.stringify({
            provider: 'parenting',
            redirect: isPushToMemberLearningPage
              ? '/settings/learning-achievement'
              : window.location.pathname +
                '?' +
                new URLSearchParams(window.location.search + '&' + new URLSearchParams(utm).toString()).toString(),
          }),
        )
        const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
        const oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=`
        tracking.login()
        window.location.assign(oauthLink)
      } else if (settings['auth.cw.client_id'] && settings['auth.email.disabled']) {
        const state = btoa(
          JSON.stringify({
            provider: 'cw',
            redirect: isPushToMemberLearningPage
              ? '/settings/learning-achievement'
              : window.location.pathname +
                '?' +
                new URLSearchParams(window.location.search + '&' + new URLSearchParams(utm).toString()).toString(),
          }),
        )
        const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
        const endpoint = settings[`auth.cw.endpoint`] || 'https://dev-account.cwg.tw'
        const oauthLink = `${endpoint}/oauth/v1.0/authorize?response_type=code&client_id=${settings['auth.cw.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=social`
        tracking.login()
        window.location.assign(oauthLink)
      } else {
        setAuthModalVisible?.(true)
      }
    },
  }
}
