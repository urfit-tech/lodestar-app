import React from 'react'
import { ProjectPlanProps } from '../../types/project'
import ProjectPlanCard from './ProjectPlanCard'

const ProjectPlanCollection: React.VFC<{
  projectPlans: ProjectPlanProps[]
  publishedAt: Date | null
}> = ({ projectPlans, publishedAt }) => {
  return (
    <>
      {projectPlans.map(projectPlan => (
        <div key={projectPlan.id} className="mb-4">
          <ProjectPlanCard {...projectPlan} publishedAt={publishedAt} />
        </div>
      ))}
    </>
  )
}

export default ProjectPlanCollection
