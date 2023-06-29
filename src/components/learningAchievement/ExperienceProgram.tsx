import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as UserIcon } from '../../images/user.svg'
import { BREAK_POINT } from '../common/Responsive'

const ExperienceProgramLayout = styled(Box)`
  min-width: 310px;
  min-height: 150px;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  align-items: space-between;
  border: solid 1px var(--gray-light);
  position: relative;
  @media (min-width: ${BREAK_POINT}px) {
    max-width: 320px;
  }
`

type ExperienceProgramProps = {
  programTitle: string
  programAbstract: string | null | undefined
  programInstructors: (string | null | undefined)[]
  programId: string
}

const ExperienceProgram: React.FC<ExperienceProgramProps> = ({
  programTitle,
  programAbstract,
  programInstructors,
  programId,
}) => {
  const programPath = `${window.location.origin.toString()}/programs/${programId}`
  return (
    <ExperienceProgramLayout onClick={() => window.open(programPath)} cursor="pointer">
      <Box h="24px" borderColor="#049D96" borderWidth="2px" position="absolute" left="0px" />
      <Text as="b" fontSize="md" color="var(--gray-darker)" isTruncated noOfLines={1}>
        {programTitle}
      </Text>
      <Text marginTop="10px" fontSize="sm" color="var(--gray-dark)" isTruncated noOfLines={2}>
        {programAbstract}
      </Text>
      <Box display="flex" marginTop="20px" alignItems="center" position="absolute" bottom="16px">
        <UserIcon className="mr-2" />
        <Text fontSize="sm" color="var(--gray-darker)" isTruncated noOfLines={1} w="250px">
          {programInstructors?.join('、')}
        </Text>
      </Box>
    </ExperienceProgramLayout>
  )
}

export default ExperienceProgram
