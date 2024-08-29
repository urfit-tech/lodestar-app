import { CraftLayout, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { SectionTitle, StyledAngleRightIcon, StyledLink } from '../../pages/AppPage'

const PodcastProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  const { formatMessage } = useIntl()
  return (
    <CraftSection>
      <SectionTitle>{options?.title || formatMessage(commonMessages.content.selectPodcast)}</SectionTitle>

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
          {formatMessage(commonMessages.defaults.more)} <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </CraftSection>
  )
}

export default PodcastProgramSection
