import { ThemeOverride } from '@chakra-ui/react'
import { AppProvider } from 'lodestar-app-element/src/contexts/AppContext'
import { AppThemeProvider } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { AuthProvider } from 'lodestar-app-element/src/contexts/AuthContext'
import { LanguageProvider } from 'lodestar-app-element/src/contexts/LanguageContext'
import React, { createContext } from 'react'
import { ApiProvider } from './ApiContext'

export const LodestarAppProvider: React.FC<{ appId: string; extend?: { chakraTheme?: ThemeOverride } }> = ({
  appId,
  children,
  extend,
}) => {
  const LodestarAppContext = createContext({ appId })

  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider extendChakraTheme={extend?.chakraTheme}>{children}</AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}
