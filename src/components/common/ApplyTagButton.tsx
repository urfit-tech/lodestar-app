import { Icon, IconButton } from '@chakra-ui/react'
import { TicketOIcon } from '../../images'

const ApplyTagButton: React.VFC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="applyTag"
      icon={<Icon as={TicketOIcon} />}
      variant="ghost"
      border="1px solid var(--gray)"
      color="var(--gray-darker)"
      borderRadius="50%"
      bg="#fff"
      mr="0.5rem"
      _hover={{ color: 'var(--gray-darker)' }}
      onClick={onClick}
    />
  )
}
export default ApplyTagButton
