import { Tab } from '@chakra-ui/react'

const ProgramIntroTab: React.VFC<{ children: React.ReactElement | string }> = props => {
  return (
    <Tab
      fontWeight={500}
      color="#585858"
      _selected={{
        color: '#009d96 ',
        borderColor: '#009d96',
      }}
    >
      {props.children}
    </Tab>
  )
}

export default ProgramIntroTab
