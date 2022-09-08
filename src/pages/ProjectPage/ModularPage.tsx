import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import ModularBriefFooter from '../../components/common/Footer/ModularBriefFooter'
import MessengerChat from '../../components/common/MessengerChat'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProjectBannerSection from '../../components/project/ProjectBannerSection'
import ProjectCalloutSection from '../../components/project/ProjectCalloutSection'
import ProjectCardSection from '../../components/project/ProjectCardSection'
import ProjectCommentSection from '../../components/project/ProjectCommentSection'
import ProjectComparisonSection from '../../components/project/ProjectComparisonSection'
import ProjectInstructorSection from '../../components/project/ProjectInstructorSection'
import ProjectProgramCollectionSection from '../../components/project/ProjectProgramCollectionSection'
import ProjectProgramSearchSection from '../../components/project/ProjectProgramSearchSection'
import ProjectPromotionSection from '../../components/project/ProjectPromotionSection'
import ProjectStaticSection from '../../components/project/ProjectStaticSection'
import ProjectStatisticsSection from '../../components/project/ProjectStatisticsSection'
import ProjectSwitchDisplaySection from '../../components/project/ProjectSwitchDisplaySection'
import ProjectTourSection from '../../components/project/ProjectTourSection'
import { useProject } from '../../hooks/project'
import EmptyCover from '../../images/empty-cover.png'
import NotFoundPage from '../NotFoundPage'

const ModularPage: React.VFC<{
  projectId: string
}> = ({ projectId }) => {
  const { settings } = useApp()
  const { project } = useProject(projectId)
  const [displaySectionTypes, setDisplaySectionTypes] = useState<string[]>(
    project?.projectSections.map(projectSection => projectSection.type) || [],
  )

  useEffect(() => {
    return () => {
      const element = document.getElementById('fb-root')
      element && element.remove()
    }
  }, [])

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout white noFooter>
      {project.projectSections
        .filter(projectSection =>
          displaySectionTypes.find(displaySectionType => projectSection.type === displaySectionType),
        )
        .map(projectSection => {
          switch (projectSection.type) {
            case 'switchDisplay':
              return (
                <ProjectSwitchDisplaySection
                  key={projectSection.id}
                  projectId={project.id}
                  onDisplayProjectSectionTypesSet={setDisplaySectionTypes}
                />
              )
            case 'messenger':
              return (
                <MessengerChat
                  key={projectSection.id}
                  options={{
                    appId: settings['auth.facebook_app_id'],
                    pageId: settings['auth.facebook_page_id'],
                    ...projectSection.options,
                  }}
                />
              )
            case 'banner':
              return (
                <ProjectBannerSection
                  key={projectSection.id}
                  title={project.title}
                  abstract={project.abstract || ''}
                  description={project.description || ''}
                  url={project.coverUrl || EmptyCover}
                  type={project.coverType}
                  expiredAt={project.expiredAt}
                  callout={projectSection.options.callout}
                  backgroundImage={projectSection.options.backgroundImage}
                />
              )
            case 'statistics':
              return (
                <ProjectStatisticsSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  subtitle={projectSection.options.subtitle}
                  items={projectSection.options.items}
                />
              )
            case 'static':
              return <ProjectStaticSection key={projectSection.id} html={projectSection.options.html} />
            case 'card':
              return (
                <ProjectCardSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  subtitle={projectSection.options.subtitle}
                  items={projectSection.options.items}
                />
              )
            case 'tour':
              return <ProjectTourSection key={projectSection.id} trips={projectSection.options.trips} />
            case 'comparison':
              return <ProjectComparisonSection key={projectSection.id} items={projectSection.options.items} />
            case 'promotion':
              return (
                <ProjectPromotionSection
                  key={projectSection.id}
                  expiredAt={project.expiredAt}
                  promotions={projectSection.options.promotions}
                  button={projectSection.options.button}
                />
              )
            case 'comment':
              return <ProjectCommentSection key={projectSection.id} items={projectSection.options.items} />
            case 'callout':
              return (
                <ProjectCalloutSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  callout={projectSection.options.callout}
                />
              )
            case 'instructor':
              return (
                <ProjectInstructorSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  items={projectSection.options.items}
                  callout={projectSection.options.callout}
                />
              )
            case 'programSearch':
              return (
                <ProjectProgramSearchSection
                  key={projectSection.id}
                  projectId={projectId}
                  coverUrl={projectSection.options.coverUrl}
                  category={projectSection.options.programCategory}
                />
              )
            case 'programCollection':
              return (
                <ProjectProgramCollectionSection
                  key={projectSection.id}
                  projectId={projectId}
                  programCategory={projectSection.options.programCategory}
                />
              )
            case 'modularBriefFooter':
              return <ModularBriefFooter key={projectSection.id} navs={projectSection.options.navs} />
            default:
              return <div key={projectSection.id}>{JSON.stringify(projectSection)}</div>
          }
        })}
    </DefaultLayout>
  )
}

export default ModularPage
