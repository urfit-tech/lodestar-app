import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import ProgramBlock from 'lodestar-app-element/src/components/blocks/ProgramBlock'
import React from 'react'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'

const ProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <BackgroundSection>
      <SectionTitle>{options?.title || '線上課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          <ProgramBlock displayAmount={3} />
        </div>
      </div>

      <div className="text-center">
        <StyledLink to={`/programs${options?.categoryId ? '?active=' + options?.categoryId : ''}`}>
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default ProgramSection
