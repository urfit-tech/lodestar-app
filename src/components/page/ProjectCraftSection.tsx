import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import ProjectBlock from 'lodestar-app-element/src/components/blocks/ProjectBlock'
import { ProjectType } from 'lodestar-app-element/src/types/data'
import React from 'react'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'

const ProjectSection: React.FC<{
  options: {
    title?: string
    projectType?: ProjectType
  }
}> = ({ options: { title, projectType } }) => {
  return (
    <BackgroundSection>
      <SectionTitle>{title}</SectionTitle>
      <div className="container">
        <div className="row">
          <ProjectBlock projectType={projectType} />
        </div>
      </div>
      <div className="text-center">
        <StyledLink to="/projects">
          查看更多
          <AngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default ProjectSection
