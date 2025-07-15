import { Tab } from '@chakra-ui/react'
import { colors } from '../style'

const InstructorTab: React.FC<{ children: React.ReactElement | string }> = props => {
  return (
    <Tab
      mr={2}
      borderRadius={30}
      borderStyle="solid"
      borderColor="primary.500"
      borderWidth="1px"
      fontWeight={500}
      _selected={{
        bg: 'primary.500',
        color: colors.white,
        borderColor: 'primary.500',
      }}
    >
      {props.children}
    </Tab>
  )
}

export default InstructorTab
