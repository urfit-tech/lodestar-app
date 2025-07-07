import { Tab } from '@chakra-ui/react'

const ProgramIntroTab: React.FC<{ children: React.ReactElement | string }> = props => {
  return <Tab fontWeight={500}>{props.children}</Tab>
}

export default ProgramIntroTab
