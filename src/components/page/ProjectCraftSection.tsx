import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import ProjectBlock from 'lodestar-app-element/src/components/blocks/ProjectBlock'
import Layout from 'lodestar-app-element/src/components/Layout'
import { ProjectType } from 'lodestar-app-element/src/types/data'
import React from 'react'
import { SectionTitle, StyledAngleRightIcon, StyledLink } from '../../pages/AppPage'

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
        <Layout
          customStyle={{
            type: 'grid',
            mobile: { columnAmount: 1, columnRatio: [12] },
            desktop: { columnAmount: 3, columnRatio: [4, 4, 4] },
          }}
        >
          <ProjectBlock projectType={projectType} />
        </Layout>
      </div>
      <div className="text-center">
        <StyledLink to="/projects">
          查看更多
          <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default ProjectSection
