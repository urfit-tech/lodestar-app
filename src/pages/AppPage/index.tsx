import { gql, useQuery } from '@apollo/client'
import Axios from 'axios'
import Cookies from 'js-cookie'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { fetchCurrentGeolocation, getFingerPrintId } from 'lodestar-app-element/src/hooks/util'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParams } from 'use-query-params'
import { useAppRouter } from '../../components/common/AppRouter'
import LoadingPage from '../../components/common/LoadingView'
import NotFoundPage from '../../components/common/NotFoundView'
import PageHelmet from '../../components/common/PageHelmet'
import { shouldRenderRouteFallbackWhileLoading } from '../../components/common/routeFallback'
import DefaultLayout from '../../components/layout/DefaultLayout'
import VipSidebar from '../../components/layout/VipSidebar'
import LocaleContext from '../../contexts/LocaleContext'
import hasura from '../../hasura'
import { getBraftContent, getOgLocale } from '../../helpers'
import { useVipTheme } from '../../hooks/member'
import { MetaTag } from '../../types/general'
import { TrackingEvent } from '../../types/tracking'
import pageMessages from '../translation'
import type { SectionType } from './AppCraftRenderer'

const AppCraftRenderer = React.lazy(() => import('./AppCraftRenderer'))

const ContentWrapper = styled.div<{ $isVip?: boolean; $sidebarWidth: number }>`
  margin-left: ${props => `${props.$sidebarWidth}px`};
  transition: margin-left 0.3s ease;
  position: relative;
  background: ${props => (props.$isVip ? '#2f387b' : 'transparent')};

  &::before {
    content: '';
    position: absolute;
    left: ${props => (props.$isVip ? `-${props.$sidebarWidth}px` : '0')};
    top: 0;
    width: ${props => (props.$isVip ? `${props.$sidebarWidth}px` : '0')};
    height: 100%;
    background: ${props => (props.$isVip ? '#2f387b' : 'transparent')};
    z-index: -1;
  }
`

const AppPage: React.FC<{ renderFallback?: (path: string) => React.ReactElement }> = ({ renderFallback }) => {
  const location = useLocation()
  const { settings, id: appId, enabledModules } = useApp()
  const { updateAuthToken, currentMemberId } = useAuth()
  const { defaultLocale, currentLocale } = useContext(LocaleContext)
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false)
  const { loadingAppPages, appPages } = usePage(location.pathname)
  const ogLocale = getOgLocale(defaultLocale || '')
  const tracking = useTracking()
  const { formatMessage } = useIntl()
  const { isVip } = useVipTheme()
  const { routesMap, sidebarExpanded } = useAppRouter()
  const shouldRenderFallbackWhileLoading =
    !!renderFallback && shouldRenderRouteFallbackWhileLoading(routesMap, location.pathname)

  const [utmQuery] = useQueryParams({
    utm_campaign: StringParam,
    utm_source: StringParam,
    utm_medium: StringParam,
    utm_content: StringParam,
    // GA4: https://support.google.com/analytics/answer/10917952?hl=en#cc-set-up&zippy=%2Cin-this-article
    utm_source_platform: StringParam,
    utm_campaign_id: StringParam,
    utm_creative_format: StringParam,
    utm_marketing_tactic: StringParam,
    // Adwords
    utm_term: StringParam,
    // custom
    utm_id: StringParam,
    utm_brand: StringParam,
    utm_adgroup: StringParam,
    utm_adname: StringParam,
    utm_categories: StringParam,
    utm_tags: StringParam,
  })
  if (utmQuery.utm_source) {
    Cookies.set('utm', JSON.stringify(utmQuery), { expires: Number(settings['utm.expires']) || 30 })
    Cookies.set('referrer', document.referrer, { expires: Number(settings['utm.expires']) || 30 })
    if (Cookies.get('landing') === undefined) {
      Cookies.set('landing', window.location.href, { expires: Number(settings['utm.expires']) || 30 })
    }
  }
  useEffect(() => {
    if ((enabledModules.login_restriction || enabledModules.device_management) && currentMemberId) {
      const refreshTokenAsync = async () => {
        const fingerPrintId = await getFingerPrintId()
        const { ip, country, countryCode } = await fetchCurrentGeolocation()

        const {
          data: { code },
        } = await Axios.post(
          `${import.meta.env.VITE_API_BASE_ROOT}/auth/refresh-token`,
          { appId, fingerPrintId, geoLocation: { ip, country, countryCode } },
          {
            method: 'POST',
            withCredentials: true,
          },
        )
        if (code !== 'SUCCESS') {
          updateAuthToken?.(null)
        }
        if (code === 'E_NO_DEVICE') {
          alert(formatMessage(pageMessages.AppPage.logoutAlert))
        }
      }
      refreshTokenAsync()
    }
    try {
      const trackingEvent = Cookies.get(TrackingEvent.EVENT)
      const trackingPage = Cookies.get(TrackingEvent.PAGE)
      const trackingMethod = Cookies.get(TrackingEvent.METHOD)
      switch (trackingEvent) {
        case 'register':
          tracking.register(trackingMethod, trackingPage)
          break
        case 'login':
          tracking.login()
          break
        default:
          break
      }
      Cookies.remove(TrackingEvent.EVENT)
      Cookies.remove(TrackingEvent.PAGE)
      Cookies.remove(TrackingEvent.METHOD)
    } catch (error) {
      console.error(`tracking failed: ${error}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentMemberId])

  if (loadingAppPages && !shouldRenderFallbackWhileLoading) {
    return <LoadingPage />
  }

  if (location.pathname !== '/repairing' && settings['repairing'] === '1') {
    return <Redirect to="/repairing" />
  }

  const currentAppPage = enabledModules.locale
    ? appPages.find(appPage => appPage.language === currentLocale) || appPages.find(appPage => !appPage.language)
    : appPages.find(appPage => !appPage.language) || appPages[0]

  return (
    <>
      {isVip && <VipSidebar />}
      <ContentWrapper $isVip={isVip} $sidebarWidth={isVip ? (sidebarExpanded ? 200 : 64) : 0}>
        {currentAppPage ? (
          <>
            {metaLoaded && <Tracking.View />}
            <PageHelmet
              title={currentAppPage?.metaTag?.seo?.pageTitle || currentAppPage?.title || ''}
              description={
                currentAppPage?.metaTag?.seo?.description || currentAppPage.defaultSettings.description || ''
              }
              keywords={currentAppPage?.metaTag?.seo?.keywords?.split(',')}
              isNoIndex={!currentAppPage.publishedAt}
              openGraph={[
                { property: 'fb:app_id', content: settings['auth.facebook_app_id'] },
                { property: 'og:site_name', content: settings['name'] },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: window.location.href },
                {
                  property: 'og:title',
                  content:
                    currentAppPage?.metaTag?.openGraph?.title ||
                    currentAppPage?.title ||
                    settings['open_graph.title'] ||
                    settings['title'],
                },
                {
                  property: 'og:description',
                  content: getBraftContent(
                    currentAppPage?.metaTag?.openGraph?.description ||
                      currentAppPage.defaultSettings.description ||
                      settings['open_graph.description'] ||
                      settings['description'],
                  )?.slice(0, 150),
                },
                { property: 'og:locale', content: ogLocale },
                {
                  property: 'og:image',
                  content:
                    currentAppPage?.metaTag?.openGraph?.image ||
                    currentAppPage.defaultSettings.img ||
                    settings['open_graph.image'] ||
                    settings['logo'],
                },
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { property: 'og:image:alt', content: currentAppPage?.metaTag?.openGraph?.imageAlt || '' },
              ]}
              onLoaded={() => setMetaLoaded(true)}
            />
            <DefaultLayout {...currentAppPage.options}>
              <Suspense fallback={<LoadingPage />}>
                <AppCraftRenderer
                  craftData={currentAppPage.craftData}
                  appPageSections={currentAppPage.appPageSections}
                />
              </Suspense>
            </DefaultLayout>
          </>
        ) : renderFallback ? (
          <>
            <Tracking.View />
            {renderFallback(location.pathname)}
          </>
        ) : (
          <NotFoundPage />
        )}
      </ContentWrapper>
    </>
  )
}

export const usePage = (path: string) => {
  const { id: appId } = useApp()
  const { loading, error, data } = useQuery<hasura.GetPages, hasura.GetPagesVariables>(
    gql`
      query GetPages($path: String, $appId: String) {
        app_page(
          where: {
            path: { _eq: $path }
            app_id: { _eq: $appId }
            published_at: { _is_null: false }
            is_deleted: { _eq: false }
          }
        ) {
          id
          title
          path
          options
          craft_data
          meta_tag
          published_at
          language
          app_page_sections(order_by: { position: asc }) {
            id
            options
            type
          }
        }
      }
    `,
    {
      variables: {
        appId,
        path,
      },
      skip: !appId || !path,
    },
  )

  type AppPageSectionProps = {
    id: string
    options: any
    type: SectionType
  }

  const appPages: {
    id: string | null
    title: string | null
    path: string | null
    craftData: { [key: string]: any } | null
    language: string | null
    options: { [key: string]: string } | null
    metaTag: MetaTag | null
    publishedAt: Date | null
    appPageSections: AppPageSectionProps[]
    defaultSettings: { img: string; description: string }
  }[] = data
    ? data.app_page.map(appPage => {
        let defaultImg = '',
          defaultDescription = ''
        if (appPage.craft_data) {
          const craftData = appPage.craft_data
          craftData?.ROOT?.nodes?.forEach((node: string) => {
            if (!defaultImg && craftData && craftData[node].type.resolvedName === 'CraftImage') {
              defaultImg = craftData[node]?.props?.customStyle?.backgroundImage?.match(
                /(?:\(['"]?)(.*?)(?:['"]?\))/,
                '',
              )[1]
            }
            if (!defaultDescription && craftData && craftData[node].type.resolvedName === 'CraftParagraph') {
              defaultDescription = craftData[node]?.props?.content
            }
          })
        }
        return {
          id: appPage.id,
          title: appPage.title || '',
          path: appPage.path || '',
          craftData: appPage.craft_data,
          language: appPage.language || null,
          options: appPage.options || null,
          metaTag: appPage.meta_tag || null,
          publishedAt: appPage.published_at || null,
          appPageSections: appPage
            ? appPage.app_page_sections.map(v => ({
                id: v.id,
                options: v.options,
                type: v.type as SectionType,
              }))
            : [],
          defaultSettings: {
            img: defaultImg,
            description: defaultDescription,
          },
        }
      })
    : []

  return {
    loadingAppPages: !appId || loading,
    errorAppPages: error,
    appPages,
  }
}

export default AppPage
