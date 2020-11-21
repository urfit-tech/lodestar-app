import React, { useContext } from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
import { ThemeContext } from 'styled-components'
import './MessengerChat.css'

type MessengerChatProps = {
  appId: string
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
const MessengerChat: React.FC<MessengerChatProps> = ({ children, ...options }) => {
  const themeContext = useContext(ThemeContext)
  return <MessengerCustomerChat {...options} themeColor={options.themeColor || themeContext['@primary-color']} />
}

export default MessengerChat
