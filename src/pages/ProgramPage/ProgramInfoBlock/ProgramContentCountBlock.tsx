import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BREAK_POINT } from '../../../components/common/Responsive'
import { commonMessages } from '../../../helpers/translation'
import { Program, ProgramContent, ProgramContentSection } from '../../../types/program'

const StyledCountBlock = styled.div`
  text-align: center;

  > div {
    padding: 0 1.5rem;
    height: 2.5rem;
    padding-bottom: 0.25rem;
  }
  > div + div {
    border-left: 1px solid #ececec;
  }

  span:first-child {
    color: #585858;
    font-size: 24px;
    letter-spacing: 0.2px;
  }
  span:last-child {
    color: #9b9b9b;
    font-size: 14px;
    letter-spacing: 0.4px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 2rem;
  }
`

const ProgramContentCountBlock: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const numProgramContents = sum(
    program.contentSections.map(programContentSection => programContentSection.contents.length),
  )

  const totalDuration = sum(
    program.contentSections?.map(programContentSection =>
      sum(programContentSection.contents.map(programContent => programContent.duration || 0) || []),
    ) || [],
  )

  return (
    <StyledCountBlock className="d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column justify-content-center">
        <span>{Math.floor(totalDuration / 60)}</span>
        <span>{formatMessage(commonMessages.unit.min)}</span>
      </div>
      {/* <div className="d-flex flex-column justify-content-center">
        <span>
          {program.contentSections.filter(programContentSection => programContentSection.contents.length).length}
        </span>
        <span>{formatMessage(commonMessages.unit.chapter)}</span>
      </div> */}
      <div className="d-flex flex-column justify-content-center">
        <span>{numProgramContents}</span>
        <span>{formatMessage(commonMessages.unit.chapter)}</span>
      </div>
    </StyledCountBlock>
  )
}

export default ProgramContentCountBlock
