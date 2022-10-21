import { Icon, IconButton } from '@chakra-ui/react'
import { TicketOIcon } from '../../images'

const ApplyTagButton: React.VFC = () => {
  return (
    <IconButton
      aria-label="applyTag"
      icon={<Icon as={TicketOIcon} />}
      variant="ghost"
      border="1px solid var(--gray)"
      color="primary.500"
      borderRadius="50%"
      bg="#fff"
      mr="0.5rem"
    />
  )
}
export default ApplyTagButton
