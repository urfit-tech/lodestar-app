import { Typography } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import React from 'react'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageProgram } from '../../types/programPackage'
import ProgressBar from '../common/ProgressBar'

const StyledProgramCover = styled.div<{ src: string }>`
  padding-top: 56.25%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`

const StyledProgramTitle = styled(Typography.Title)`
  && {
    height: 3rem;
    overflow: hidden;
    ${CommonTitleMixin}
  }
`

export const ProgramDisplayedCard: React.VFC<{
  program: ProgramPackageProgram
  memberId?: string | null
}> = ({ program, memberId }) => {
  return (
    <div className="mb-4">
      <StyledProgramCover className="mb-3" src={program.coverUrl || EmptyCover} />
      <StyledProgramTitle level={2} ellipsis={{ rows: 2 }} className="mb-3">
        {program.title}
      </StyledProgramTitle>
      {memberId && <ProgressBar percent={program.viewRate ? program.viewRate * 100 : 0} />}
    </div>
  )
}
