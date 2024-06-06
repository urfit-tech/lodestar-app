import { TabList, TabPanels, Tabs } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { Program, ProgramRole } from '../../../../types/program'
import CollapseContentBlock from './CollapseContentBlock'
import InstructorPanel from './InstructorPanel'
import InstructorTab from './InstructorTab'
import NormalContent from './NormalContent'

const SecondaryInstructorCollectionBlock: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
  title?: string
}> = ({ program }) => {
  return (
    <Tabs variant="unstyled">
      <TabList justifyContent="center" gap={8}>
        {program.roles.map(instructor => (
          <InstructorTab key={instructor.id}>{instructor.memberName}</InstructorTab>
        ))}
      </TabList>
      <TabPanels>
        {program.roles.map(instructor => (
          <InstructorPanel
            key={instructor.id}
            instructorInfo={{
              instructorName: instructor.memberName,
              avatarUrl: instructor.pictureUrl || '',
              instructorSubtitle: instructor.abstract || '',
            }}
          >
            <NormalContent title="介紹">
              <BraftContent>{instructor.description}</BraftContent>
            </NormalContent>
            <CollapseContentBlock creatorId={instructor.memberId} />
          </InstructorPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default SecondaryInstructorCollectionBlock
