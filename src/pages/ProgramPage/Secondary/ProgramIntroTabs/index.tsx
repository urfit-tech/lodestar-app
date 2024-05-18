import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import styled from 'styled-components'
import { Program, ProgramRole } from '../../../../types/program'
import SecondaryInstructorCollectionBlock from '../SecondaryInstructorCollectionBlock'
import SecondaryProgramContentListSection from '../SecondaryProgramContentListSection'
import ProgramIntroTab from './ProgramIntroTab'

const StyledPanel = styled(TabPanel)`
  padding-top: 30px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  @media (min-width: ${BREAK_POINT}px) {
    padding-top: 24px !important;
  }
`

const StyledTabList = styled(TabList)`
  z-index: 10;
`

const ProgramIntroTabs: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
}> = ({ program }) => {
  return (
    <Tabs position="relative" width="100%">
      <StyledTabList justifyContent="center">
        <ProgramIntroTab>簡介</ProgramIntroTab>
        <ProgramIntroTab>章節</ProgramIntroTab>
        <ProgramIntroTab>講師</ProgramIntroTab>
      </StyledTabList>

      <TabPanels>
        <StyledPanel>
          <BraftContent>{program.description}</BraftContent>
        </StyledPanel>
        <StyledPanel>
          <SecondaryProgramContentListSection program={program} />
        </StyledPanel>
        <StyledPanel>
          <SecondaryInstructorCollectionBlock program={program} />
        </StyledPanel>
      </TabPanels>
    </Tabs>
  )
}

export default ProgramIntroTabs
