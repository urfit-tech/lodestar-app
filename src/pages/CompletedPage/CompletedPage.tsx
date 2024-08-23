import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import MessageBox from '../../components/common/MessageBox'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { ReactComponent as SuccessIcon } from '../../images/status-success.svg'

const messages = defineMessages({
  consultationSuccessTitle: {
    id: 'completedPage.consultationSuccessTitle',
    defaultMessage: '已成功預約專屬諮詢！',
  },
  consultationSuccessInfo: {
    id: 'completedPage.consultationSuccessInfo',
    defaultMessage: '後續將有專業的顧問在您方便的時段與您聯繫。',
  },
  formReceivedTitle: {
    id: 'completedPage.formReceivedTitle',
    defaultMessage: '已收到您的金流補件表！',
  },
  formReceivedInfo: {
    id: 'completedPage.formReceivedInfo',
    defaultMessage: '後續將有專人與您聯繫。',
  },
})

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
  const { formatMessage } = useIntl()

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        {!!meets && (
          <MessageBox
            icon={SuccessIcon}
            title={formatMessage(messages.consultationSuccessTitle)}
            info={formatMessage(messages.consultationSuccessInfo)}
          />
        )}
        {!!additionalForm && (
          <MessageBox
            icon={SuccessIcon}
            title={formatMessage(messages.formReceivedTitle)}
            info={formatMessage(messages.formReceivedInfo)}
          />
        )}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default CompletedPage
