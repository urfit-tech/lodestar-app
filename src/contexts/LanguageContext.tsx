import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { useApp } from '../containers/common/AppContext'

const supportedLanguages = ['zh', 'en', 'vi']

type LanguageProps = {
  currentLanguage: string
  setCurrentLanguage?: (language: string) => void
}

const LanguageContext = createContext<LanguageProps>({
  currentLanguage: 'zh',
})

export const LanguageProvider: React.FC = ({ children }) => {
  const { enabledModules } = useApp()
  const [currentLanguage, setCurrentLanguage] = useState('zh')

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0]
    const cachedLanguage = localStorage.getItem('kolable.app.language')
    setCurrentLanguage(
      enabledModules.locale
        ? typeof cachedLanguage === 'string' && supportedLanguages.includes(cachedLanguage)
          ? cachedLanguage
          : supportedLanguages.includes(browserLanguage)
          ? browserLanguage
          : 'zh'
        : 'zh',
    )
  }, [enabledModules])

  moment.locale(currentLanguage)

  let messages: any = {}
  try {
    if (enabledModules.locale) {
      messages = require(`../translations/locales/${currentLanguage}.json`)
    }
  } catch {}

  const language: LanguageProps = {
    currentLanguage,
    setCurrentLanguage: (language: string) => {
      if (supportedLanguages.includes(language)) {
        localStorage.setItem('kolable.app.language', language)

        setCurrentLanguage(language)

        switch (language) {
          case 'zh':
            moment.locale('zh-tw')
            break
          default:
            moment.locale(language)
        }
      }
    },
  }

  return (
    <LanguageContext.Provider value={language}>
      <IntlProvider defaultLocale="zh" locale={currentLanguage} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
}

export default LanguageContext
