import { Tab } from '@chakra-ui/react'
import { colors } from '../style'

const InstructorTab: React.FC<{ children: React.ReactElement | string }> = props => {
  return (
    <Tab
      mr={2}
      borderRadius={30}
      borderStyle="solid"
      borderColor="#ececec"
      borderWidth="1px"
      fontWeight={500}
      _selected={{
        bg: colors.teal,
        color: colors.white,
        borderColor: colors.teal,
      }}
    >
      {props.children}
    </Tab>
  )
}

export default InstructorTab
