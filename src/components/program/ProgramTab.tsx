import { Flex, HStack, Text } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { commonMessages, productMessages } from '../../helpers/translation'
import { StyledButton } from '../../pages/ProgramCollectionPage/ProgramCollectionPage'

export const ProgramTab: React.FC<{
  onProgramTabClick: (tab: string) => void
  tab: string
  totalProgramPackageCounts: number
  totalProgramCounts: number
}> = ({ onProgramTabClick, tab, totalProgramPackageCounts, totalProgramCounts }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Flex cursor="pointer">
        <HStack spacing="10px">
          {totalProgramCounts > 0 && (
            <StyledButton
              colorScheme="primary"
              variant={tab === 'program' ? 'solid' : 'outline'}
              className="mb-2"
              backgroundColor={tab !== 'program' && 'white'}
              onClick={() => onProgramTabClick('program')}
            >
              <Text>{formatMessage(productMessages.program.title.course)}</Text>
            </StyledButton>
          )}
          {totalProgramPackageCounts > 0 && (
            <StyledButton
              colorScheme="primary"
              variant={totalProgramCounts === 0 || tab === 'programPackage' ? 'solid' : 'outline'}
              className="mb-2"
              backgroundColor={totalProgramCounts > 0 && tab !== 'programPackage' && 'white'}
              onClick={() => onProgramTabClick('programPackage')}
            >
              <Text>{formatMessage(commonMessages.ui.packages)}</Text>
            </StyledButton>
          )}
        </HStack>
      </Flex>
    </>
  )
}
