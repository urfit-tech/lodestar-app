import { TabList, TabPanels, Tabs } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { useIntl } from 'react-intl'
import { Program, ProgramRole } from '../../../../types/program'
import ProgramPageMessages from '../../translation'
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
  const { formatMessage } = useIntl()
  return (
    <Tabs variant="unstyled">
      <TabList justifyContent="center" gap={8}>
        {program.roles
          .filter(role => role.name === 'instructor')
          .map(instructor => (
            <InstructorTab key={instructor.id}>{instructor.memberName}</InstructorTab>
          ))}
      </TabList>
      <TabPanels>
        {program.roles
          .filter(role => role.name === 'instructor')
          .map(instructor => (
            <InstructorPanel
              key={instructor.id}
              instructorInfo={{
                instructorName: instructor.memberName,
                avatarUrl: instructor.pictureUrl || '',
                instructorSubtitle: instructor.abstract || '',
              }}
            >
              <NormalContent title={formatMessage(ProgramPageMessages.SecondaryInstructorCollectionBlock.introduction)}>
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
