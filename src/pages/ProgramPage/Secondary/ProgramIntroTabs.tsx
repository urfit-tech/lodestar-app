import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { Program, ProgramRole } from '../../../types/program'
import SecondaryProgramContentListSection from '../Secondary/SecondaryProgramContentListSection'
import SecondaryInstructorCollectionBlock from './SecondaryInstructorCollectionBlock'

const ProgramIntroTabs: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
}> = ({ program }) => {
  return (
    <Tabs>
      <TabList justifyContent="center">
        <Tab>簡介</Tab>
        <Tab>章節</Tab>
        <Tab>講師</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <BraftContent>{program.description}</BraftContent>
        </TabPanel>
        <TabPanel>
          <SecondaryProgramContentListSection program={program} />
        </TabPanel>
        <TabPanel>
          <SecondaryInstructorCollectionBlock program={program} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default ProgramIntroTabs
