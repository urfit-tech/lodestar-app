import { Tab } from '@chakra-ui/react'
import { colors } from '../style'

const ProgramIntroTab: React.FC<{ children: React.ReactElement | string }> = props => {
  return (
    <Tab
      fontWeight={500}
      color={colors.gray3}
      _selected={{
        color: colors.teal,
        borderColor: colors.teal,
      }}
    >
      {props.children}
    </Tab>
  )
}

export default ProgramIntroTab
