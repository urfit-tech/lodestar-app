import { Typography } from 'antd'
import { sum } from 'ramda'
import React from 'react'
import styled from 'styled-components'
import { useProgramContentProgress } from '../../contexts/ProgressContext'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageProgramProps } from '../../types/programPackage'
import { CommonTitleMixin } from '../common'
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
  program: ProgramPackageProgramProps
  memberId?: string | null
}> = ({ program, memberId }) => {
  const { programContentProgress } = useProgramContentProgress(program.id, memberId || '')
  const viewRate = programContentProgress.length
    ? Math.floor(
        (sum(programContentProgress.map(contentProgress => contentProgress.progress)) / programContentProgress.length) *
          100,
      )
    : 0

  return (
    <div className="mb-4">
      <StyledProgramCover className="mb-3" src={program.coverUrl || EmptyCover} />
      <StyledProgramTitle level={2} ellipsis={{ rows: 2 }} className="mb-3">
        {program.title}
      </StyledProgramTitle>
      {memberId && <ProgressBar percent={viewRate} />}
    </div>
  )
}
