import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import MessageBox from '../../components/common/MessageBox'
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

const CompletedPage: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname
  const meets = pathname.includes('meets')
  const additionalForm = pathname.includes('additional-form')

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        {!!meets && (
          <MessageBox
            icon={SuccessIcon}
            title="已成功預約專屬諮詢！"
            info="後續將有專業的顧問在您方便的時段與您聯繫。"
          />
        )}
        {!!additionalForm && (
          <MessageBox icon={SuccessIcon} title="已收到您的金流補件表！" info="後續將有專人與您聯繫。" />
        )}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default CompletedPage
