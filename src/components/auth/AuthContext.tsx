import Axios from 'axios'
import jwt from 'jsonwebtoken'
import React, { useContext, useState } from 'react'
import ReactGA from 'react-ga'
import { UserRole } from '../../types/member'

type AuthContext = {
  isAuthenticating: boolean
  isAuthenticated: boolean
  currentUserRole: UserRole
  currentMemberId: string | null
  authToken: string | null
  currentMember: { name: string; username: string; email: string; pictureUrl: string } | null
  apiHost: string
  refreshToken?: (data: { appId: string }) => Promise<void>
  register?: (data: { appId: string; username: string; email: string; password: string }) => Promise<void>
  login?: (data: { appId: string; account: string; password: string }) => Promise<void>
  socialLogin?: (data: { appId: string; provider: string; providerToken: any }) => Promise<void>
  logout?: () => void
}

const defaultAuthContext: AuthContext = {
  isAuthenticating: true,
  isAuthenticated: false,
  currentUserRole: 'anonymous',
  currentMemberId: null,
  authToken: null,
  currentMember: null,
  apiHost: '',
}

const AuthContext = React.createContext<AuthContext>(defaultAuthContext)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{
  apiHost: string
}> = ({ apiHost, children }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(defaultAuthContext.isAuthenticating)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // TODO: add auth payload type
  const payload: any = authToken && jwt.decode(authToken)
  if (payload) {
    const _window = window as any
    _window.insider_object = {
      user: {
        gdpr_optin: true,
        sms_optin: true,
        email: payload.email,
        phone_number: payload.phoneNumber,
        email_optin: true,
      },
    }
    ReactGA.set({ userId: payload.sub })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticating,
        isAuthenticated: Boolean(authToken),
        currentUserRole: (payload && payload.role) || 'anonymous',
        currentMemberId: payload && payload.sub,
        authToken,
        currentMember: payload && {
          name: payload.name,
          username: payload.username,
          email: payload.email,
          pictureUrl: payload.pictureUrl,
        },
        apiHost,
        refreshToken: apiHost
          ? async ({ appId }) =>
              Axios.post(
                `https://${apiHost}/auth/refresh-token`,
                { appId },
                {
                  method: 'POST',
                  withCredentials: true,
                },
              )
                .then(({ data: { code, message, result } }) => {
                  if (code === 'SUCCESS') {
                    setAuthToken(result.authToken)
                  } else {
                    setAuthToken(null)
                  }
                })
                .finally(() => setIsAuthenticating(false))
          : undefined,
        register: apiHost
          ? async ({ appId, username, email, password }) =>
              Axios.post(
                `https://${apiHost}/auth/register`,
                {
                  appId,
                  username,
                  email,
                  password,
                },
                { withCredentials: true },
              ).then(({ data: { code, message, result } }) => {
                if (code === 'SUCCESS') {
                  setAuthToken(result.authToken)
                } else {
                  setAuthToken(null)
                  throw new Error(code)
                }
              })
          : undefined,
        login: apiHost
          ? async ({ appId, account, password }) =>
              Axios.post(
                `https://${apiHost}/auth/general-login`,
                { appId, account, password },
                { withCredentials: true },
              ).then(({ data: { code, result } }) => {
                if (code === 'SUCCESS') {
                  setAuthToken(result.authToken)
                } else if (code === 'I_RESET_PASSWORD') {
                  window.location.assign(`/check-email?email=${account}&type=reset-password`)
                } else {
                  setAuthToken(null)
                  throw new Error(code)
                }
              })
          : undefined,
        socialLogin: apiHost
          ? async ({ appId, provider, providerToken }) =>
              Axios.post(
                `https://${apiHost}/auth/social-login`,
                {
                  appId,
                  provider,
                  providerToken,
                },
                { withCredentials: true },
              ).then(({ data: { code, message, result } }) => {
                if (code === 'SUCCESS') {
                  setAuthToken(result.authToken)
                } else {
                  setAuthToken(null)
                  throw new Error(code)
                }
              })
          : undefined,
        logout: apiHost
          ? async () => {
              localStorage.clear()
              Axios(`https://${apiHost}/auth/logout`, {
                method: 'POST',
                withCredentials: true,
              }).then(({ data: { code, message, result } }) => {
                setAuthToken(null)
                if (code !== 'SUCCESS') {
                  throw new Error(code)
                }
              })
            }
          : undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
