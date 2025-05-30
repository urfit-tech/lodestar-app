import { Icon } from '@chakra-ui/icons'
import { Button } from 'antd'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import { codeMessages, commonMessages } from '../helpers/translation'
import { useTask } from '../hooks/task'
import { ReactComponent as ErrorIcon } from '../images/error.svg'

const messages = defineMessages({
  generatingPaymentInfo: {
    id: 'paymentTaskPage.message.generatingPaymentInfo',
    defaultMessage: '產生付款資訊中...',
  },
  doNotRefresh: {
    id: 'paymentTaskPage.message.doNotRefresh',
    defaultMessage: '請勿重整與返回上一頁',
  },
})

const StyledWrapper = styled.div`
  padding: 4rem 1rem;
`
const StyledTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 0.8px;
  color: var(--gray-darker);
`
const StyledButton = styled(Button)`
  width: 160px;
  height: 44px;
`
const StyledWarning = styled.div`
  margin-top: 1rem;
  font-size: 14px;
  font-weight: bold;
  color: var(--error);
`

const PaymentTaskPage: React.FC = () => {
  const tracking = useTracking()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { task, retry } = useTask('payment', taskId)
  const [errorMessage, setErrorMessage] = useState('')

  const taskResult = task?.returnvalue
  useEffect(() => {
    if (taskResult) {
      tracking.addPaymentInfo({ gateway: taskResult.gateway, method: taskResult.method })
      if (taskResult.payForm.url) {
        window.location.assign(taskResult.payForm.url)
      } else if (taskResult.payForm.html) {
        document.write(taskResult.payForm.html)
      } else {
        history.push(`/payments/${taskResult.paymentNo}`)
      }
    } else {
      setErrorMessage(task?.failedReason || '')
    }
  }, [history, task?.failedReason, taskResult, tracking])

  if (errorMessage) {
    const errorCode = errorMessage.split(':')[0]
    const errorMessageContent =
      errorCode in codeMessages ? formatMessage(codeMessages[errorCode as keyof typeof codeMessages]) : errorMessage
    return (
      <DefaultLayout noFooter noHeader centeredBox>
        <StyledWrapper className="d-flex flex-column justify-content-between align-items-center">
          <Icon as={ErrorIcon} w={100} h={100} />

          <div className="mb-4 d-flex flex-column text-center">
            <StyledTitle className="mb-2">{errorMessageContent}</StyledTitle>
          </div>

          <Link to="/">
            <StyledButton>{formatMessage(commonMessages.button.backToHome)}</StyledButton>
          </Link>
        </StyledWrapper>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout noFooter noHeader centeredBox>
      <StyledContainer>
        <div className="text-center">
          {formatMessage(messages.generatingPaymentInfo)}
          {(Math.exp(-1 / retry) * 100).toFixed(0)}%
          <StyledWarning>{formatMessage(messages.doNotRefresh)}</StyledWarning>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default PaymentTaskPage
