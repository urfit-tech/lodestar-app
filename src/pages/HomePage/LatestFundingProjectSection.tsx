import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import ProjectIntroCard from '../../components/project/ProjectIntroCard'
import { ReactComponent as HotIcon } from '../../images/icon-hot2.svg'
import { ProjectIntroProps } from '../../types/project'
import SectionHeading from './SectionHeading'

const LatestFundingProjectSection: React.FC<{
  projects: ProjectIntroProps[]
}> = ({ projects }) => {
  return (
    <section>
      <SectionHeading icon={<Icon src={HotIcon} />} title="最新募資" subtitle="LATEST FUNDRAISING" />
      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          <Link to="/projects">更多專案</Link>
        </div>
        <div className="row">
          {projects.map(project => (
            <div key={project.id} className="col-12 col-lg-4 mb-4">
              <Link to={`projects/${project.id}`}>
                <ProjectIntroCard {...project}></ProjectIntroCard>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestFundingProjectSection
