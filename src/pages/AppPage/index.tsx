import { gql, useQuery } from '@apollo/client'
import { Editor, Frame } from '@craftjs/core'
import Axios from 'axios'
import Cookies from 'js-cookie'
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { fetchCurrentGeolocation, getFingerPrintId } from 'lodestar-app-element/src/hooks/util'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParams } from 'use-query-params'
import MessengerChat from '../../components/common/MessengerChat'
import PageHelmet from '../../components/common/PageHelmet'
import DefaultLayout from '../../components/layout/DefaultLayout'
import {
  ActivityIntroSection,
  ActivitySection,
  BlndCTASection,
  BlndPostSection,
  CoverSection,
  CreatorListSection,
  CreatorSection,
  CustomCoverSection,
  IntroSection,
  LittlestarFeaturedPodcastSection,
  LittlestarLastTimePodcastSection,
  MisaFeatureSection,
  MisaNavigationBar,
  NavSection,
  PodcastAlbumCollectionSection,
  PostSection,
  ProgramIntroSection,
  ProgramSection,
  ReferrerSection,
  StaticBlock,
  StaticCoverSection,
  TableListSection,
  TeacherSection,
} from '../../components/page'
import HaohaomingSection from '../../components/page/HaohaomingSection'
import LocaleContext from '../../contexts/LocaleContext'
import hasura from '../../hasura'
import { getBraftContent, getOgLocale } from '../../helpers'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { MetaTag } from '../../types/general'
import { TrackingEvent } from '../../types/tracking'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
import pageMessages from '../translation'
import CraftBlock from './CraftBlock'

type SectionType =
  | 'homeCover'
  | 'homeActivity'
  | 'homeCreator'
  | 'homePost'
  | 'homeProgram'
  | 'homeProgramCategory'
  | 'messenger'

export const SectionTitle = styled.div<{ white?: boolean }>`
  margin: 0 auto;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: 0.23px;
  text-align: center;
  color: var(--gray-color);
`
export const StyledLink = styled(Link)<{ $backgroundActive?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  & .ant-btn-primary:active {
    background: ${props =>
      props.$backgroundActive ? props.$backgroundActive : props.theme['@primary-color']} !important;
  }
  margin-top: 56px;
`
export const StyledAngleRightIcon = styled(AngleRightIcon)`
  transform: translateY(-0.5px);
`

export const StyledSection = styled.section`
  padding: 64px 0;
  background: white;
`

const sectionConverter = {
  // general
  homeActivity: ActivitySection,
  homeActivityIntro: ActivityIntroSection,
  homeCreator: CreatorSection,
  homeCreatorList: CreatorListSection,
  homeCover: CoverSection,
  homeCustomCover: CustomCoverSection,
  homeStaticCover: StaticCoverSection,
  homeNav: NavSection,
  homePost: PostSection,
  homeProgram: ProgramSection,
  homeProgramCategory: ProgramSection,
  homeProgramIntro: ProgramIntroSection,
  homePodcastCollection: PodcastAlbumCollectionSection,
  homeReferrer: ReferrerSection,
  homeStatic: StaticBlock,
  homeTeacher: TeacherSection,
  homeIntro: IntroSection,
  messenger: MessengerChat,
  homeTableList: TableListSection,
  // custom
  homeBlndPost: BlndPostSection,
  homeBlndCTA: BlndCTASection,
  homeMisaFeature: MisaFeatureSection,
  homeMisaNav: MisaNavigationBar,
  homeLittlestarLastTimePodcast: LittlestarLastTimePodcastSection,
  homeLittlestarFeaturedPodcast: LittlestarFeaturedPodcastSection,
  homeHaohaoming: HaohaomingSection,
}

const AppPage: React.VFC<{ renderFallback?: (path: string) => React.ReactElement }> = ({ renderFallback }) => {
  const location = useLocation()
  const { settings, id: appId, enabledModules } = useApp()
  const { updateAuthToken } = useAuth()
  const { defaultLocale, currentLocale } = useContext(LocaleContext)
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false)
  const { loadingAppPages, appPages } = usePage(location.pathname)
  const ogLocale = getOgLocale(defaultLocale || '')
  const tracking = useTracking()
  const { formatMessage } = useIntl()

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
    if (enabledModules.login_restriction || enabledModules.device_management) {
      const refreshTokenAsync = async () => {
        const fingerPrintId = await getFingerPrintId()
        const { ip, country, countryCode } = await fetchCurrentGeolocation()

        const {
          data: { code },
        } = await Axios.post(
          `${process.env.REACT_APP_API_BASE_ROOT}/auth/refresh-token`,
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
      const trackingRegisterMethod = Cookies.get(TrackingEvent.METHOD)
      if (trackingEvent === 'register') {
        tracking.register(trackingRegisterMethod, trackingPage)
        Cookies.remove(TrackingEvent.EVENT)
        Cookies.remove(TrackingEvent.PAGE)
        Cookies.remove(TrackingEvent.METHOD)  
      }
    } catch (error) {
      console.error(`tracking failed: ${error}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (loadingAppPages) {
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
      {currentAppPage ? (
        <>
          {metaLoaded && <Tracking.View />}
          <PageHelmet
            title={currentAppPage?.metaTag?.seo?.pageTitle || currentAppPage?.title || ''}
            description={currentAppPage?.metaTag?.seo?.description || currentAppPage.defaultSettings.description || ''}
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
            {currentAppPage.craftData ? (
              <Editor enabled={false} resolver={CraftElement}>
                <CraftBlock craftData={currentAppPage.craftData} />
              </Editor>
            ) : (
              <Editor enabled={false} resolver={CraftElement}>
                <Frame>
                  <>
                    {currentAppPage.appPageSections.map(section => {
                      const Section = sectionConverter[section.type]
                      if (!sectionConverter[section.type]) {
                        return null
                      }
                      return <Section key={section.id} options={section.options} />
                    })}
                  </>
                </Frame>
              </Editor>
            )}
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
