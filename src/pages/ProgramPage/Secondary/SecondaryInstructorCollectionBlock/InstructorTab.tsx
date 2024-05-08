import { Tab } from '@chakra-ui/react'

const InstructorTab: React.VFC<{ children: React.ReactElement | string }> = props => {
  return (
    <Tab
      mr={2}
      borderRadius={30}
      borderStyle="solid"
      borderColor="#ececec"
      borderWidth="1px"
      _selected={{
        bg: '#21b1b1',
        color: 'white',
        borderColor: '#21b1b1',
      }}
    >
      {props.children}
    </Tab>
  )
}

export default InstructorTab
