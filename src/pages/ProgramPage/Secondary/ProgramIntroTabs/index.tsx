import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useEquityProgramByProgramId } from '../../../../hooks/program'
import { DisplayModeEnum, Program, ProgramRole } from '../../../../types/program'
import ProgramPageMessages from '../../translation'
import SecondaryInstructorCollectionBlock from '../SecondaryInstructorCollectionBlock'
import SecondaryProgramContentListSection from '../SecondaryProgramContentListSection'
import { colors } from '../style'
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
  position: sticky;
  top: 0px;
  background: ${colors.white};
`

const ProgramIntroTabs: React.FC<{
  program: Program & {
    roles: ProgramRole[]
  }
  contentInformation?: string
}> = ({ program, contentInformation }) => {
  const { formatMessage } = useIntl()
  const { isEquityProgram } = useEquityProgramByProgramId(program.id)
  const programContentSections = program.contentSections
    .filter(programContentSection => programContentSection.contents.length)
    .map(programContentSection => ({
      id: programContentSection.id,
      title: programContentSection.title,
      description: programContentSection.description,
      collapsedStatus: programContentSection.collapsedStatus,
      contents: isEquityProgram
        ? programContentSection.contents
        : programContentSection.contents.filter(programContent =>
            program.isIntroductionSectionVisible
              ? programContent
              : programContent.displayMode === DisplayModeEnum.trial ||
                programContent.displayMode === DisplayModeEnum.loginToTrial,
          ),
    }))
  return (
    <Tabs position="relative" width="100%">
      <StyledTabList justifyContent="center">
        <ProgramIntroTab>{formatMessage(ProgramPageMessages.ProgramIntroTabs.introduction)}</ProgramIntroTab>
        <ProgramIntroTab>
          {program.programLayoutTemplateVariant === 'ebook'
            ? formatMessage(ProgramPageMessages.ProgramIntroTabs.catalog)
            : formatMessage(ProgramPageMessages.ProgramIntroTabs.chapter)}
        </ProgramIntroTab>
        <ProgramIntroTab>
          {program.programLayoutTemplateVariant === 'ebook'
            ? formatMessage(ProgramPageMessages.ProgramIntroTabs.author)
            : formatMessage(ProgramPageMessages.ProgramIntroTabs.courseInstructor)}
        </ProgramIntroTab>
      </StyledTabList>

      <TabPanels>
        <StyledPanel>
          <BraftContent>{program.description}</BraftContent>
        </StyledPanel>
        <StyledPanel>
          <SecondaryProgramContentListSection
            program={program}
            programContentSections={programContentSections}
            isEquityProgram={isEquityProgram}
          />
          {program.programLayoutTemplateVariant === 'ebook' && <BraftContent>{contentInformation}</BraftContent>}
        </StyledPanel>
        <StyledPanel>
          <SecondaryInstructorCollectionBlock program={program} />
        </StyledPanel>
      </TabPanels>
    </Tabs>
  )
}

export default ProgramIntroTabs
