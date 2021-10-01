import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import React from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'

type MessengerChatProps = {
  options: {
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
}
const MessengerChat: React.VFC<MessengerChatProps> = ({ options: { appId, themeColor, ...options } }) => {
  const { settings } = useApp()
  const theme = useAppTheme()

  if (!appId && !settings['auth.facebook_app_id']) {
    return null
  }

  return (
    <MessengerCustomerChat
      appId={appId || settings['auth.facebook_app_id']}
      themeColor={themeColor || theme.colors.primary[500]}
      {...options}
    />
  )
}

export default MessengerChat
