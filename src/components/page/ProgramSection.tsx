import { Skeleton } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { usePublishedProgramCollection } from '../../hooks/program'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'
import ProgramCard from '../program/ProgramCard'

const StyledSection = styled.section`
  margin-bottom: 80px;
`

const ProgramSection: React.FC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: false,
    categoryId: options?.categoryId,
  })

  if (loadingPrograms || errorPrograms)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (programs.length === 0) return null

  return (
    <StyledSection className="page-section">
      <SectionTitle>{options?.title || '線上課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {programs.slice(0, options?.colAmount || 3).map(program => (
            <div key={program.id} className={`col-12 col-lg-${(options?.colAmount && 12 / options?.colAmount) || 4}`}>
              <ProgramCard program={program} withMeta noInstructor />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <StyledLink to="/programs">
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </StyledSection>
  )
}

export default ProgramSection
