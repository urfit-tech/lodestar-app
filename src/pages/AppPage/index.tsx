import { useQuery } from '@apollo/react-hooks'
import { Editor, Frame } from '@craftjs/core'
import gql from 'graphql-tag'
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link, Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components'
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
import hasura from '../../hasura'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
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
  const { settings } = useApp()
  const { loadingAppPage, errorAppPage, appPage } = usePage(location.pathname)

  if (loadingAppPage) {
    return <LoadingPage />
  }

  if (location.pathname !== '/repairing' && settings['repairing'] === '1') {
    return <Redirect to="/repairing" />
  }
  return (
    <>
      <PageHelmet />
      <Tracking.View />
      {appPage ? (
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
      ) : renderFallback ? (
        renderFallback(location.pathname)
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
          path
          options
          craft_data
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

  const appPage: {
    id: string | null
    path: string | null
    craftData: { [key: string]: string } | null
    options: { [key: string]: string } | null
    appPageSections: AppPageSectionProps[]
  } | null = data?.app_page[0]
    ? {
        id: data.app_page[0].id,
        path: data.app_page[0].path,
        craftData: data.app_page[0].craft_data,
        options: data.app_page[0].options || null,
        appPageSections: data.app_page[0]
          ? data.app_page[0].app_page_sections.map((v: { id: string; options: any; type: string }) => ({
              id: v.id,
              options: v.options,
              type: v.type as SectionType,
            }))
          : [],
      }
    : null
  return {
    loadingAppPage: !appId || loading,
    errorAppPage: error,
    appPage,
  }
}

export default AppPage
