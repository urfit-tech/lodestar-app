import { gql, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IntlProvider } from 'react-intl'
import hasura from '../hasura'

type LocaleMessages = Record<string, string>

declare const __DEFAULT_LOCALE__: string
declare const __DEFAULT_APP_MESSAGES__: LocaleMessages
declare const __DEFAULT_ELEMENT_MESSAGES__: LocaleMessages

moment.locale(__DEFAULT_LOCALE__)

const appLocaleLoaders = import.meta.glob('../translations/locales/*.json', {
  import: 'default',
}) as Record<string, () => Promise<LocaleMessages>>
const elementLocaleLoaders = import.meta.glob(
  '../../node_modules/lodestar-app-element/src/translations/locales/*.json',
  { import: 'default' },
) as Record<string, () => Promise<LocaleMessages>>

const buildAppLoaderKey = (locale: string) => `../translations/locales/${locale}.json`
const buildElementLoaderKey = (locale: string) =>
  `../../node_modules/lodestar-app-element/src/translations/locales/${locale}.json`

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
  const settingsDefaultLocale = settings['language'] || 'zh-tw'
  const [currentLocale, setCurrentLocale] = useState<string>(__DEFAULT_LOCALE__)
  const [messagesState, setMessagesState] = useState<{
    appMessages: LocaleMessages
    elementMessages: LocaleMessages
  }>({
    appMessages: __DEFAULT_APP_MESSAGES__,
    elementMessages: __DEFAULT_ELEMENT_MESSAGES__,
  })
  const latestLocaleRef = useRef<string | null>(null)
  const layoutLanguageSortedListSettings = settings['layout.language_sorted_list']

  const languagesList = useMemo(() => {
    if (!layoutLanguageSortedListSettings) {
      return SUPPORTED_LOCALES
    }

    try {
      const settingLanguageList = JSON.parse(layoutLanguageSortedListSettings)
      const sortedLanguagesList = SUPPORTED_LOCALES.filter(language =>
        settingLanguageList.includes(language.label),
      ).sort((a, b) => {
        return settingLanguageList.indexOf(a.label) - settingLanguageList.indexOf(b.label)
      })
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

  const loadLocaleMessages = useCallback(async (locale: string) => {
    const appLoader = appLocaleLoaders[buildAppLoaderKey(locale)]
    const elementLoader = elementLocaleLoaders[buildElementLoaderKey(locale)]
    if (!appLoader && !elementLoader) {
      console.warn(`[locale] no messages for "${locale}"`)
      return null
    }
    const [appMessages, elementMessages] = await Promise.all([
      appLoader ? appLoader() : Promise.resolve({} as LocaleMessages),
      elementLoader ? elementLoader() : Promise.resolve({} as LocaleMessages),
    ])
    return { appMessages, elementMessages }
  }, [])

  useEffect(() => {
    let detected = settingsDefaultLocale
    const cachedLocale = localStorage.getItem('kolable.app.language')?.toLowerCase()
    if (
      cachedLocale &&
      SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === cachedLocale.toLowerCase())
    ) {
      detected = cachedLocale
    } else if (Boolean(settings['language'])) {
      detected = settings['language']
    } else if (
      enabledModules.locale &&
      navigator.language &&
      SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === navigator.language.toLowerCase())
    ) {
      detected = navigator.language.toLowerCase()
    }

    if (detected === currentLocale) return

    let cancelled = false
    ;(async () => {
      const next = await loadLocaleMessages(detected)
      if (!next || cancelled) return
      setMessagesState(next)
      setCurrentLocale(detected)
      moment.locale(detected)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsDefaultLocale, enabledModules, settings])

  const updateCurrentLocale = useCallback(
    async (newLocale: string) => {
      if (!SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === newLocale)) return
      if (newLocale === currentLocale) return
      latestLocaleRef.current = newLocale
      const next = await loadLocaleMessages(newLocale)
      if (!next || latestLocaleRef.current !== newLocale) return
      setMessagesState(next)
      setCurrentLocale(newLocale)
      localStorage.setItem('kolable.app.language', newLocale)
      moment.locale(newLocale)
    },
    [currentLocale, loadLocaleMessages],
  )

  const messages = useMemo(
    () => ({
      ...messagesState.elementMessages,
      ...messagesState.appMessages,
      ...appLocaleMessages,
    }),
    [messagesState, appLocaleMessages],
  )

  const contextValue = useMemo(
    () => ({
      defaultLocale: settingsDefaultLocale,
      currentLocale,
      setCurrentLocale: updateCurrentLocale,
      languagesList,
    }),
    [currentLocale, settingsDefaultLocale, languagesList, updateCurrentLocale],
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
