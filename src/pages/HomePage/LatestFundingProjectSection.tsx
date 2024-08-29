import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import ProjectIntroCard from '../../components/project/ProjectIntroCard'
import { ReactComponent as HotIcon } from '../../images/icon-hot2.svg'
import { ProjectIntroProps } from '../../types/project'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'

const LatestFundingProjectSection: React.FC<{
  projects: ProjectIntroProps[]
}> = ({ projects }) => {
  const { formatMessage } = useIntl()
  return (
    <section>
      <SectionHeading
        icon={<Icon src={HotIcon} />}
        title={formatMessage(HomePageMessages.LatestFundingProjectSection.latestFundraising)}
        subtitle={formatMessage(HomePageMessages.LatestFundingProjectSection.latestFundraisingSubtitle)}
      />
      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          <Link to="/projects">{formatMessage(HomePageMessages.LatestFundingProjectSection.moreProjects)}</Link>
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
