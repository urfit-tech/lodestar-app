import { Flex, HStack, Text } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { commonMessages, productMessages } from '../../helpers/translation'
import { StyledButton } from '../../pages/ProgramCollectionPage/ProgramCollectionPage'
import programMessages from './translation'

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
              variant={tab === 'program' || tab === 'programEbook' ? 'solid' : 'outline'}
              className="mb-2"
              backgroundColor={tab !== 'program' && tab !== 'programEbook' ? 'white' : undefined}
              onClick={() => (tab.includes('Ebook') ? onProgramTabClick('programEbook') : onProgramTabClick('program'))}
            >
              <Text>
                {tab.includes('Ebook')
                  ? formatMessage(programMessages.ProgramTab.singleEbook)
                  : formatMessage(productMessages.program.title.course)}
              </Text>
            </StyledButton>
          )}
          {totalProgramPackageCounts > 0 && (
            <StyledButton
              colorScheme="primary"
              variant={
                totalProgramCounts === 0 || tab === 'programPackage' || tab === 'programPackageEbook'
                  ? 'solid'
                  : 'outline'
              }
              className="mb-2"
              backgroundColor={
                totalProgramCounts > 0 && tab !== 'programPackage' && tab !== 'programPackageEbook' && 'white'
              }
              onClick={() =>
                tab.includes('Ebook') ? onProgramTabClick('programPackageEbook') : onProgramTabClick('programPackage')
              }
            >
              <Text>
                {tab.includes('Ebook')
                  ? formatMessage(programMessages.ProgramTab.packageEbook)
                  : formatMessage(commonMessages.ui.packages)}
              </Text>
            </StyledButton>
          )}
        </HStack>
      </Flex>
    </>
  )
}
