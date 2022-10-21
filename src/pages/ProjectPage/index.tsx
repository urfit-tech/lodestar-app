import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { render } from 'mustache'
import { props } from 'ramda'
import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { Redirect, useParams } from 'react-router-dom'
import { useProject } from '../../hooks/project'
import { ProjectProps } from '../../types/project'
import LoadingPage from '../LoadingPage'
import FundingPage from './FundingPage'
import ModularPage from './ModularPage'
import OnSalePage from './OnSalePage'
import PortfolioPage from './PortfolioPage'
import ProjectPageHelmet from './ProjectPageHelmet'

const renderProjectPage = (project: ProjectProps) => {
  if (project.template) {
    return <div dangerouslySetInnerHTML={{ __html: render(project.template, props) }} />
  }

  switch (project.type) {
    case 'funding':
    case 'pre-order':
      return <FundingPage {...project} />
    // return <PreOrderContentBlock {...props} />
    case 'on-sale':
      return <OnSalePage {...project} />
    case 'modular':
      return <ModularPage projectId={project.id} />
    case 'portfolio':
      return <PortfolioPage id={project.id} />
    default:
      return <div>Default Project Page</div>
  }
}

const ProjectPage: React.VFC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { loadingProject, errorProject, project } = useProject(projectId)
  const { id: appId } = useApp()
  const { resourceCollection } = useResourceCollection([`${appId}:project:${projectId}`], true)

  useEffect(() => {
    if (project) {
      project.projectPlans?.forEach((projectPlan, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: projectPlan.id,
          name: `${project.title} - ${projectPlan.title}`,
          category: 'ProjectPlan',
          price: `${projectPlan.listPrice}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: projectPlan.id,
          name: `${project.title} - ${projectPlan.title}`,
          category: 'ProjectPlan',
          price: `${projectPlan.listPrice}`,
          position: index + 1,
        })
      })
      ReactGA.plugin.execute('ec', 'setAction', 'detail')
      ReactGA.ga('send', 'pageview')
    }
  }, [project])

  if (loadingProject || !project) {
    return <LoadingPage />
  }

  if (errorProject || (project.publishedAt && project.publishedAt.getTime() > Date.now())) {
    return <Redirect to="/" />
  }

  return (
    <>
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      {project && <ProjectPageHelmet project={project} />}
      {renderProjectPage(project)}
    </>
  )
}

export default ProjectPage
