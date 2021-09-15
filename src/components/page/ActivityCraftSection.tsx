import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import ActivityBlock from 'lodestar-app-element/src/components/blocks/ActivityBlock'
import Layout from 'lodestar-app-element/src/components/Layout'
import React from 'react'
import { SectionTitle, StyledAngleRightIcon, StyledLink } from '../../pages/AppPage'

const ProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <BackgroundSection>
      <SectionTitle>{options?.title || '線下實體'}</SectionTitle>

      <div className="container">
        <Layout
          customStyle={{
            type: 'grid',
            mobile: { columnAmount: 1, columnRatio: [12] },
            desktop: { columnAmount: 3, columnRatio: [4, 4, 4] },
          }}
        >
          <ActivityBlock activityIds={[]} />
        </Layout>
      </div>

      <div className="text-center">
        <StyledLink to="/activities">
          查看更多 <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default ProgramSection
