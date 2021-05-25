import React, { useContext } from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
import { ThemeContext } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import './MessengerChat.css'

type MessengerChatProps = {
  appId?: string
  pageId: string
  debug?: boolean
  themeColor?: string
  shouldShowDialog?: boolean
  htmlRef?: string
  minimized?: boolean
  loggedInGreeting?: string
  loggedOutGreeting?: string
  greetingDialogDisplay?: string
  greetingDialogDelay?: number
  autoLogAppEvents?: boolean
  xfbml?: boolean
  version?: string
  language?: string
  onCustomerChatDialogShow?: () => void
  onCustomerChatDialogHide?: () => void
}
const MessengerChat: React.VFC<MessengerChatProps> = ({ appId, themeColor, ...options }) => {
  const { settings } = useApp()
  const themeContext = useContext(ThemeContext)

  if (!appId && !settings['auth.facebook_app_id']) {
    return null
  }

  return (
    <MessengerCustomerChat
      appId={appId || settings['auth.facebook_app_id']}
      themeColor={themeColor || themeContext['@primary-color']}
      {...options}
    />
  )
}

export default MessengerChat
