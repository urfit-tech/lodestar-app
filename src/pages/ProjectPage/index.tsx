import { render } from 'mustache'
import { props } from 'ramda'
import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { Redirect, useParams } from 'react-router-dom'
import { useProject } from '../../hooks/project'
import LoadingPage from '../LoadingPage'
import FundingPage from './FundingPage'
import ModularPage from './ModularPage'
import OnSalePage from './OnSalePage'

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { loadingProject, errorProject, project } = useProject(projectId)

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

  if (loadingProject) {
    return <LoadingPage />
  }

  if (errorProject || !project || (project.publishedAt && project.publishedAt.getTime() > Date.now())) {
    return <Redirect to="/" />
  }

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
    default:
      return <div>Default Project Page</div>
  }
}

export default ProjectPage
