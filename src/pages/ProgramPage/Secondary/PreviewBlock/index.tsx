import { Box } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { useEquityProgramByProgramId } from '../../../../hooks/program'
import { DisplayModeEnum, Program, ProgramRole } from '../../../../types/program'
import PreviewPlayer from './PreviewPlayer'

const Wrapper = styled(Box)`
  padding: 24px 18px;
  border-radius: 8px;
  background: #f7f8f8;
  padding-bottom: 1rem;
`

const PreviewBlock: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
}> = ({ program }) => {
  const { isEquityProgram } = useEquityProgramByProgramId(program.id)
  const trailProgramContents = program.contentSections
    .filter(programContentSection => programContentSection.contents.length)
    .map(programContentSection =>
      isEquityProgram
        ? programContentSection.contents
        : programContentSection.contents.filter(
            programContent =>
              program.isIntroductionSectionVisible &&
              (programContent.displayMode === DisplayModeEnum.trial ||
                programContent.displayMode === DisplayModeEnum.loginToTrial),
          ),
    )
    .flat()
  return (
    <Wrapper>
      <PreviewPlayer trailProgramContents={trailProgramContents} />
    </Wrapper>
  )
}

export default PreviewBlock
