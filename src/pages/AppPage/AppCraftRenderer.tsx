import { Editor, Frame } from '@craftjs/core'
import * as CraftElement from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import MessengerChat from '../../components/common/MessengerChat'
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
import CraftBlock from './CraftBlock'

const craftElementResolver = { ...CraftElement }

const sectionConverter = {
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
  homeBlndPost: BlndPostSection,
  homeBlndCTA: BlndCTASection,
  homeMisaFeature: MisaFeatureSection,
  homeMisaNav: MisaNavigationBar,
  homeLittlestarLastTimePodcast: LittlestarLastTimePodcastSection,
  homeLittlestarFeaturedPodcast: LittlestarFeaturedPodcastSection,
  homeHaohaoming: HaohaomingSection,
}

export type SectionType = keyof typeof sectionConverter

type Props = {
  craftData: { [key: string]: any } | null
  appPageSections: { id: string; options: any; type: SectionType }[]
}

const AppCraftRenderer: React.FC<Props> = ({ craftData, appPageSections }) => {
  if (craftData) {
    return (
      <Editor enabled={false} resolver={craftElementResolver}>
        <CraftBlock craftData={craftData} />
      </Editor>
    )
  }
  return (
    <Editor enabled={false} resolver={craftElementResolver}>
      <Frame>
        <>
          {appPageSections.map(section => {
            const Section = sectionConverter[section.type]
            if (!Section) {
              return null
            }
            return <Section key={section.id} options={section.options} />
          })}
        </>
      </Frame>
    </Editor>
  )
}

export default AppCraftRenderer
