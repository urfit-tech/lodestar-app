import { CraftLayout, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import { Project } from 'lodestar-app-element/src/types/data'
import React from 'react'
import { SectionTitle, StyledAngleRightIcon, StyledLink } from '../../pages/AppPage'

const ProjectSection: React.FC<{
  options: {
    title?: string
    projectType?: Project['type']
  }
}> = ({ options: { title, projectType } }) => {
  return (
    <CraftSection>
      <SectionTitle>{title}</SectionTitle>
      <div className="container">
        <CraftLayout
          ratios={[4, 4, 4]}
          responsive={{
            mobile: {
              ratios: [12],
            },
          }}
        >
          {/* <ProjectBlock projectType={projectType} /> */}
        </CraftLayout>
      </div>
      <div className="text-center">
        <StyledLink to="/projects">
          查看更多
          <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </CraftSection>
  )
}

export default ProjectSection
