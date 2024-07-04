import { Button, Icon as ChakraIcon } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const StyledTitle = styled.div`
  margin-bottom: 0.25rem;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;
  color: var(--gray-darker);
`
const StyledItemInfo = styled.div`
  margin-bottom: 1rem;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-dark);
`

const MessageBox: React.FC<{ icon: React.FunctionComponent; title: string; info: string }> = ({
  icon,
  title,
  info,
}) => {
  const history = useHistory()
  return (
    <>
      <div className="mb-4">
        <ChakraIcon as={icon} w="64px" h="64px" />
      </div>
      <StyledTitle>{title}</StyledTitle>
      <StyledItemInfo>{info}</StyledItemInfo>
      <Button variant="outline" borderRadius="5px" onClick={() => history.push('/')}>
        回首頁
      </Button>
    </>
  )
}

export default MessageBox
