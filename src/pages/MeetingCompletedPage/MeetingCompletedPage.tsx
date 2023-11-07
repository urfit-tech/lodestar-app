import { Button, Icon as ChakraIcon } from '@chakra-ui/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { ReactComponent as SuccessIcon } from '../../images/status-success.svg'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;
  text-align: center;
  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem;
  }
`
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

const MeetingCompletedPage: React.FC = () => {
  const history = useHistory()

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <div className="mb-4">
          <ChakraIcon as={SuccessIcon} w="64px" h="64px" />
        </div>
        <>
          <StyledTitle>已成功預約專屬諮詢！</StyledTitle>
          <StyledItemInfo>後續將有專業的顧問在您方便的時段與您聯繫。</StyledItemInfo>
          <Button variant="outline" borderRadius="5px" onClick={() => history.push('/')}>
            回首頁
          </Button>
        </>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default MeetingCompletedPage
