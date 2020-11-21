import React from 'react'
import { ProjectPlanProps } from '../../types/project'
import ProjectPlanCard from './ProjectPlanCard'

const ProjectPlanCollection: React.FC<{
  projectPlans: ProjectPlanProps[]
}> = ({ projectPlans }) => {
  return (
    <>
      {projectPlans.map(projectPlan => (
        <div key={projectPlan.id} className="mb-4">
          <ProjectPlanCard {...projectPlan} />
        </div>
      ))}
    </>
  )
}

export default ProjectPlanCollection
