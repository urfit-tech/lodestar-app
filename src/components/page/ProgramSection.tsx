import { Skeleton } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React from 'react'
import styled from 'styled-components'
import { usePublishedProgramCollection } from '../../hooks/program'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink, StyledSection } from '../../pages/AppPage'
import ProgramCard from '../program/ProgramCard'

const StyledAngleRightIcon = styled(AngleRightIcon)`
  display: inline-block;
`

const ProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  const tracking = useTracking()

  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: false,
    categoryId: options?.categoryId,
  })
  const { resourceCollection } = useResourceCollection(
    programs.slice(0, options?.colAmount || 3).map(program => `${appId}:program:${program.id}`),
    true,
  )

  if (loadingPrograms)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (programs.length === 0 || errorPrograms) return null

  return (
    <StyledSection className="page-section">
      <Tracking.Impression resources={resourceCollection} />

      <SectionTitle>{options?.title || '線上課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {programs.slice(0, options?.colAmount || 3).map((program, idx) => (
            <div
              key={program.id}
              className={`col-12 col-lg-${(options?.colAmount && 12 / options?.colAmount) || 4} mb-5`}
            >
              <ProgramCard
                program={program}
                withMeta
                noInstructor
                onClick={() => {
                  const resource = resourceCollection[idx]
                  resource && tracking.click(resource, { position: idx + 1 })
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <StyledLink to={`/programs${options?.categoryId ? '?active=' + options?.categoryId : ''}`}>
          查看更多 <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </StyledSection>
  )
}

export default ProgramSection
