import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageProps } from '../../types/programPackage'

const StyledCard = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`
const StyledCover = styled.div<{ src: string }>`
  padding-top: 56.25%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`
const StyledDescription = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled.div`
  && {
    margin-bottom: 1.25rem;
    ${CommonTitleMixin}
    height: 3rem;
  }
`

const PackageCard: React.VFC<
  Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title'> & {
    onClick?: () => void
  }
> = ({ onClick, ...programPackage }) => {
  return (
    <Link to={`/program-packages/${programPackage.id}`}>
      <StyledCard>
        <StyledCover src={programPackage.coverUrl || EmptyCover} />
        <StyledDescription>
          <StyledTitle>{programPackage.title}</StyledTitle>
        </StyledDescription>
      </StyledCard>
    </Link>
  )
}

export default PackageCard
