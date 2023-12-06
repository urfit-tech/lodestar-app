import { gql, useQuery } from '@apollo/client'
import { Editor, Frame } from '@craftjs/core'
import Axios from 'axios'
import Cookies from 'js-cookie'
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
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
  const { defaultLocale } = useContext(LocaleContext)
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false)
  const { loadingAppPage, appPage } = usePage(location.pathname)
  const ogLocale = getOgLocale(defaultLocale)

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
    Cookies.set('landing', window.location.href, { expires: Number(settings['utm.expires']) || 30 })
    Cookies.set('referrer', document.referrer, { expires: Number(settings['utm.expires']) || 30 })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (loadingAppPage) {
    return <LoadingPage />
  }

  if (location.pathname !== '/repairing' && settings['repairing'] === '1') {
    return <Redirect to="/repairing" />
  }
  return (
    <>
      {appPage ? (
        <>
          {metaLoaded && <Tracking.View />}
          <PageHelmet
            title={appPage?.metaTag?.seo?.pageTitle || appPage?.title || ''}
            description={appPage?.metaTag?.seo?.description || appPage.defaultSettings.description || ''}
            keywords={appPage?.metaTag?.seo?.keywords?.split(',')}
            isNoIndex={!appPage.publishedAt}
            openGraph={[
              { property: 'fb:app_id', content: settings['auth.facebook_app_id'] },
              { property: 'og:site_name', content: settings['name'] },
              { property: 'og:type', content: 'website' },
              { property: 'og:url', content: window.location.href },
              {
                property: 'og:title',
                content:
                  appPage?.metaTag?.openGraph?.title ||
                  appPage?.title ||
                  settings['open_graph.title'] ||
                  settings['title'],
              },
              {
                property: 'og:description',
                content: getBraftContent(
                  appPage?.metaTag?.openGraph?.description ||
                    appPage.defaultSettings.description ||
                    settings['open_graph.description'] ||
                    settings['description'],
                )?.slice(0, 150),
              },
              { property: 'og:locale', content: ogLocale },
              {
                property: 'og:image',
                content:
                  appPage?.metaTag?.openGraph?.image ||
                  appPage.defaultSettings.img ||
                  settings['open_graph.image'] ||
                  settings['logo'],
              },
              { property: 'og:image:width', content: '1200' },
              { property: 'og:image:height', content: '630' },
              { property: 'og:image:alt', content: appPage?.metaTag?.openGraph?.imageAlt || '' },
            ]}
            onLoaded={() => setMetaLoaded(true)}
          />
          <DefaultLayout {...appPage.options}>
            {appPage.craftData ? (
              <Editor enabled={false} resolver={CraftElement}>
                <CraftBlock craftData={appPage.craftData} />
              </Editor>
            ) : (
              <Editor enabled={false} resolver={CraftElement}>
                <Frame>
                  <>
                    {appPage.appPageSections.map(section => {
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
  const { loading, error, data } = useQuery<hasura.GET_PAGE, hasura.GET_PAGEVariables>(
    gql`
      query GET_PAGE($path: String, $appId: String) {
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

  let defaultImg = '',
    defaultDescription = ''
  if (data?.app_page[0]?.craft_data) {
    const craftData = data.app_page[0].craft_data
    craftData?.ROOT?.nodes?.forEach((node: string) => {
      if (!defaultImg && craftData && craftData[node].type.resolvedName === 'CraftImage') {
        defaultImg = craftData[node]?.props?.customStyle?.backgroundImage?.match(/(?:\(['"]?)(.*?)(?:['"]?\))/, '')[1]
      }
      if (!defaultDescription && craftData && craftData[node].type.resolvedName === 'CraftParagraph') {
        defaultDescription = craftData[node]?.props?.content
      }
    })
  }

  type AppPageSectionProps = {
    id: string
    options: any
    type: SectionType
  }

  const appPage: {
    id: string | null
    title: string | null
    path: string | null
    craftData: { [key: string]: any } | null
    options: { [key: string]: string } | null
    metaTag: MetaTag | null
    publishedAt: Date | null
    appPageSections: AppPageSectionProps[]
    defaultSettings: { img: string; description: string }
  } | null = data?.app_page[0]
    ? {
        id: data.app_page[0].id,
        title: data.app_page[0].title || '',
        path: data.app_page[0].path || '',
        craftData: data.app_page[0].craft_data,
        options: data.app_page[0].options || null,
        metaTag: data.app_page[0].meta_tag || null,
        publishedAt: data.app_page[0].published_at || null,
        appPageSections: data.app_page[0]
          ? data.app_page[0].app_page_sections.map(v => ({
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
    : null
  return {
    loadingAppPage: !appId || loading,
    errorAppPage: error,
    appPage,
  }
}

export default AppPage
