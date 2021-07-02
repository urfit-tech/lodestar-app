import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import ActivityBlock from 'lodestar-app-element/src/components/blocks/ActivityBlock'
import Layout from 'lodestar-app-element/src/components/Layout'
import React from 'react'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'

const ProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <BackgroundSection>
      <SectionTitle>{options?.title || '線下實體'}</SectionTitle>

      <div className="container mb-5">
        <Layout
          customStyle={{
            type: 'grid',
            mobile: { columnAmount: 1, columnRatio: [12] },
            desktop: { columnAmount: 3, columnRatio: [4, 4, 4] },
          }}
        >
          <ActivityBlock displayAmount={3} />
        </Layout>
      </div>

      <div className="text-center">
        <StyledLink to="/activities">
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default ProgramSection
