import { LockIcon } from '@chakra-ui/icons'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { programMessages } from '../../helpers/translation'

const StyledNoAuthBlock = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`

const StyledText = styled.span`
  vertical-align: bottom;
`

const ProgramContentNoAuthBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  return (
    <StyledNoAuthBlock className="p-2 text-center">
      <LockIcon className="mr-2" />
      <StyledText>{formatMessage(programMessages.text.noAuth)}</StyledText>
    </StyledNoAuthBlock>
  )
}
export default ProgramContentNoAuthBlock
