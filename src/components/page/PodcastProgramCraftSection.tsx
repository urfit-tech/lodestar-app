import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import PodcastProgramBlock from 'lodestar-app-element/src/components/blocks/PodcastProgramBlock'
import React from 'react'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'

const PodcastProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <BackgroundSection>
      <SectionTitle>{options?.title || '精選廣播'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          <PodcastProgramBlock displayAmount={3} />
        </div>
      </div>

      <div className="text-center">
        <StyledLink to="/podcasts">
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default PodcastProgramSection
