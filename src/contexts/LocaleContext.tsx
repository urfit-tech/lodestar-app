import { gql, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'
import hasura from '../hasura'
import defaultLocaleMessages from '../translations/locales/en-us.json'

type LocaleMessages = Record<string, string>

const localeMessageModules = import.meta.glob('../translations/locales/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, LocaleMessages>
const elementMessageModules = import.meta.glob(
  '../../node_modules/lodestar-app-element/src/translations/locales/*.json',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, LocaleMessages>

export const SUPPORTED_LOCALES = [
  { locale: 'zh-cn', label: '简体中文' },
  { locale: 'zh-tw', label: '繁體中文' },
  { locale: 'en-us', label: 'English' },
  { locale: 'vi', label: 'Tiếng việt' },
  { locale: 'id', label: 'Indonesia' },
  { locale: 'ja', label: '日本語' },
  { locale: 'ko', label: '한국어' },
  { locale: 'de-de', label: 'Deutsch' },
]
type SupportedLocales = {
  locale: string
  label: string
}[]

type LocaleContextProps = {
  defaultLocale: string
  currentLocale: string
  languagesList: SupportedLocales
  setCurrentLocale?: (language: string) => void
}

const defaultLocaleContextValue: LocaleContextProps = {
  defaultLocale: 'zh-tw',
  currentLocale: 'zh-tw',
  languagesList: SUPPORTED_LOCALES,
}

export const LocaleContext = createContext<LocaleContextProps>(defaultLocaleContextValue)

export const LocaleProvider: React.FC = ({ children }) => {
  const { enabledModules, settings, id: appId } = useApp()
  const defaultLocale = settings['language'] || 'zh-tw'
  const [currentLocale, setCurrentLocale] = useState(defaultLocaleContextValue.currentLocale || defaultLocale)
  const layoutLanguageSortedListSettings = settings['layout.language_sorted_list']

  const languagesList = useMemo(() => {
    if (!layoutLanguageSortedListSettings) {
      return SUPPORTED_LOCALES
    }

    try {
      const settingLanguageList = JSON.parse(layoutLanguageSortedListSettings)
      const sortedLanguagesList = SUPPORTED_LOCALES.filter(language => settingLanguageList.includes(language.label)).sort(
        (a, b) => {
          return settingLanguageList.indexOf(a.label) - settingLanguageList.indexOf(b.label)
        },
      )
      return sortedLanguagesList.length > 0 ? sortedLanguagesList : SUPPORTED_LOCALES
    } catch (err) {
      console.log(err)
      return SUPPORTED_LOCALES
    }
  }, [layoutLanguageSortedListSettings])

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
    { variables: { appId }, skip: !appId },
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
  const localeMessages = localeMessageModules[`../translations/locales/${currentLocale}.json`] || defaultLocaleMessages
  const elementMessages =
    elementMessageModules[`../../node_modules/lodestar-app-element/src/translations/locales/${currentLocale}.json`] ||
    {}

  if (!localeMessages && !elementMessages) {
    console.warn('cannot load the locale:', currentLocale)
  }
  const messages = { ...elementMessages, ...localeMessages, ...appLocaleMessages }

  const updateCurrentLocale = useCallback((newLocale: string) => {
    if (SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === newLocale)) {
      localStorage.setItem('kolable.app.language', newLocale)
      setCurrentLocale(newLocale)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      defaultLocale,
      currentLocale,
      setCurrentLocale: updateCurrentLocale,
      languagesList,
    }),
    [currentLocale, defaultLocale, languagesList, updateCurrentLocale],
  )

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider defaultLocale="zh" locale={currentLocale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export default LocaleContext
