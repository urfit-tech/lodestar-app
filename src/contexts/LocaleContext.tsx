import { gql, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import hasura from '../hasura'
import defaultLocaleMessages from '../translations/locales/en-us.json'

export const SUPPORTED_LOCALES = [
  { locale: 'zh-cn', label: '简体中文' },
  { locale: 'zh-tw', label: '繁體中文' },
  { locale: 'en-us', label: 'English' },
  { locale: 'vi', label: 'Tiếng việt' },
  { locale: 'id', label: 'Indonesia' },
  { locale: 'ja', label: '日本語' },
  { locale: 'ko', label: '한국어' },
]
type SupportedLocales = {
  locale: string
  label: string
}[]

type LocaleContextProps = {
  defaultLocale: string | null
  currentLocale: string | null
  languagesList: SupportedLocales
  setCurrentLocale?: (language: string) => void
}

const defaultLocaleContextValue: LocaleContextProps = {
  defaultLocale: null,
  currentLocale: null,
  languagesList: SUPPORTED_LOCALES,
}

export const LocaleContext = createContext<LocaleContextProps>(defaultLocaleContextValue)

export const LocaleProvider: React.FC = ({ children }) => {
  const { enabledModules, settings, id: appId } = useApp()
  const defaultLocale = settings['language'] || 'zh-tw'
  const [currentLocale, setCurrentLocale] = useState(defaultLocaleContextValue.currentLocale || defaultLocale)
  const layoutLanguageSortedListSettings = settings['layout.language_sorted_list']

  let sortedLanguagesList: SupportedLocales = []

  if (!!layoutLanguageSortedListSettings) {
    try {
      const settingLanguageList = JSON.parse(layoutLanguageSortedListSettings)
      sortedLanguagesList = SUPPORTED_LOCALES.filter(language => settingLanguageList.includes(language.label)).sort(
        (a, b) => {
          return settingLanguageList.indexOf(a.label) - settingLanguageList.indexOf(b.label)
        },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const languagesList = sortedLanguagesList.length > 0 ? sortedLanguagesList : SUPPORTED_LOCALES

  const { data } = useQuery<hasura.GetAppLanguage, hasura.GetAppLanguageVariables>(
    gql`
      query GetAppLanguage($appId: String!) {
        app_language(where: { app_id: { _eq: $appId } }) {
          id
          language
          data
        }
      }
    `,
    { variables: { appId } },
  )
  const appLocaleMessages = data?.app_language.find(v => v.language === currentLocale)?.data || {}

  useEffect(() => {
    let currentLocale = defaultLocaleContextValue.currentLocale || defaultLocale
    const cachedLocale = localStorage.getItem('kolable.app.language')?.toLowerCase()
    if (
      cachedLocale &&
      SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === cachedLocale.toLowerCase())
    ) {
      currentLocale = cachedLocale
    } else if (Boolean(settings['language'])) {
      currentLocale = settings['language']
    } else if (
      enabledModules.locale &&
      navigator.language &&
      SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === navigator.language.toLowerCase())
    ) {
      currentLocale = navigator.language.toLowerCase()
    }
    setCurrentLocale(currentLocale)
  }, [defaultLocale, enabledModules, settings])

  moment.locale(currentLocale)
  let localeMessages: { [key: string]: string } = defaultLocaleMessages
  let elementMessages: { [key: string]: string } = {}
  try {
    localeMessages = require(`../translations/locales/${currentLocale}.json`)
    elementMessages = require(`lodestar-app-element/src/translations/locales/${currentLocale}.json`)
  } catch (error) {
    console.warn('cannot load the locale:', currentLocale, error)
  }
  localeMessages = { ...elementMessages, ...localeMessages, ...appLocaleMessages }

  return (
    <LocaleContext.Provider
      value={{
        defaultLocale,
        currentLocale,
        setCurrentLocale: (newLocale: string) => {
          if (SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === newLocale)) {
            localStorage.setItem('kolable.app.language', newLocale)
            setCurrentLocale(newLocale)
          }
        },
        languagesList,
      }}
    >
      <IntlProvider defaultLocale="zh" locale={currentLocale} messages={localeMessages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export default LocaleContext
