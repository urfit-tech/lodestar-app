import { Flex, HStack } from '@chakra-ui/react'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'

const ViewSwitch: React.FC<{ view: string; onClick: () => void; className?: string }> = ({
  view,
  onClick,
  className,
}) => {
  const { formatMessage } = useIntl()
  return (
    <Flex marginRight="20px" cursor="pointer" className={className}>
      {
        <HStack spacing="5px" onClick={onClick}>
          {view === 'Grid' && (
            <>
              <FiList />
              <span>{formatMessage(commonMessages.term.list)}</span>
            </>
          )}
          {view === 'List' && (
            <>
              <FiGrid />
              <span>{formatMessage(commonMessages.term.grid)}</span>
            </>
          )}
        </HStack>
      }
    </Flex>
  )
}

export default ViewSwitch
