import React from 'react'
import MessengerChat from '../components/common/MessengerChat'
import DefaultLayout from '../components/layout/DefaultLayout'
import AccordionSection from '../components/page/AccordionSection'
import ArticleSection from '../components/page/ArticleSection'
import BackgroundSection from '../components/page/BackgroundSection'
import CoverSection from '../components/page/CoverSection'
import InstructorCraftSection from '../components/page/InstructorCraftSection'
import CTASection from '../components/page/CTASection'
import DescriptionSection from '../components/page/DescriptionSection'
import FAQSection from '../components/page/FAQSection'
import FeatureDescriptionSection from '../components/page/FeatureDescriptionSection'
import FeatureSection from '../components/page/FeatureSection'
import PostSection from '../components/page/PostSection'
import ProgramCraftSection from '../components/page/ProgramCraftSection'
import ActivityCraftSection from '../components/page/ActivityCraftSection'
import ProjectCraftSection from '../components/page/ProjectCraftSection'
import PodcastProgramCraftSection from '../components/page/PodcastProgramCraftSection'
import ReferrerSection from '../components/page/ReferrerSection'
import SliderSection from '../components/page/SliderSection'
import StatisticsSection from '../components/page/StatisticsSection'
import { usePage } from '../hooks/page'
import LoadingPage from './LoadingPage'

const CraftPage: React.VFC = () => {
  const { loadingAppPage, appPage, errorAppPage } = usePage(window.location.pathname)

  if (loadingAppPage || errorAppPage) {
    return <LoadingPage />
  }
  const sectionConverter = {
    homeAccordion: AccordionSection,
    homeActivity: ActivityCraftSection,
    homeArticle: ArticleSection,
    homeBackground: BackgroundSection,
    homeCover: CoverSection,
    homeCreator: InstructorCraftSection,
    homeCTA: CTASection,
    homeDescription: DescriptionSection,
    homeFeatureDescription: FeatureDescriptionSection,
    homeFAQ: FAQSection,
    homeFeature: FeatureSection,
    homePost: PostSection,
    homeProgram: ProgramCraftSection,
    homeProgramCategory: ProgramCraftSection,
    homeReferrer: ReferrerSection,
    homeSlider: SliderSection,
    homeStatistics: StatisticsSection,
    messenger: MessengerChat,
    homeFundingProject: ProjectCraftSection,
    homeProOrderProject: ProjectCraftSection,
    homePodcastProgram: PodcastProgramCraftSection,
  }

  return (
    <DefaultLayout>
      {appPage.appPageSections.map(section => {
        const Section = sectionConverter[section.type]
        if (!sectionConverter[section.type]) {
          return <div>{section.id}</div>
        }
        return <Section key={section.id} options={section.options} />
      })}
    </DefaultLayout>
  )
}

export default CraftPage
