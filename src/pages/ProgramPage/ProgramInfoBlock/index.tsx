import { Affix } from 'antd'
import React from 'react'
import Responsive from '../../../components/common/Responsive'
import { Category } from '../../../types/general'
import { Program, ProgramContent, ProgramContentSection, ProgramPlan, ProgramRole } from '../../../types/program'
import ProgramContentCountBlock from './ProgramContentCountBlock'
import ProgramInfoCard, { StyledProgramInfoCard } from './ProgramInfoCard'

const ProgramInfoBlock: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
    categories: Category[]
    plans: ProgramPlan[]
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ program }) => {
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''

  return (
    <>
      <Responsive.Default>
        <StyledProgramInfoCard>
          <ProgramContentCountBlock program={program} />
        </StyledProgramInfoCard>
      </Responsive.Default>

      <Responsive.Desktop>
        <Affix offsetTop={40} target={() => document.getElementById('layout-content')}>
          <ProgramInfoCard instructorId={instructorId} program={program} />
        </Affix>
      </Responsive.Desktop>
    </>
  )
}

export default ProgramInfoBlock
