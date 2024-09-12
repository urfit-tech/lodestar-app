import { CraftLayout, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { SectionTitle, StyledAngleRightIcon, StyledLink } from '../../pages/AppPage'

const PodcastProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <CraftSection>
      <SectionTitle>{options?.title || '精選廣播'}</SectionTitle>

      <div className="container">
        <CraftLayout
          ratios={[6, 6]}
          responsive={{
            mobile: {
              ratios: [12],
            },
          }}
        >
          {/* <PodcastProgramBlock /> */}
        </CraftLayout>
      </div>

      <div className="text-center">
        <StyledLink to="/podcasts">
          查看更多 <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </CraftSection>
  )
}

export default PodcastProgramSection
