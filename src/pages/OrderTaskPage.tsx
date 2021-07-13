import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import { handleError } from '../helpers'
import { codeMessages, commonMessages } from '../helpers/translation'
import { useTask } from '../hooks/task'
import { ReactComponent as ErrorIcon } from '../images/error.svg'

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

const OrderTaskPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { authToken, apiHost } = useAuth()
  const { task, retry } = useTask('order', taskId)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (task?.failedReason) {
      message.error(formatMessage(commonMessages.status.fail))
      setErrorMessage(task?.failedReason)
      return
    }
    if (authToken && task?.finishedOn && task?.returnvalue?.orderId) {
      console.log('5. completed task(order)', task)
      axios
        .post(
          //`//${apiHost}/tasks/payment/`,
          'http://localhost:8081/v1/tasks/payment',
          { orderId: task.returnvalue.orderId },
          { headers: { authorization: `Bearer ${authToken}` } },
        )
        .then(({ data: { code, result } }) => {
          console.log('6. /tasks/payment result', result)
          if (code === 'SUCCESS') {
            history.push(`/tasks/payment/${result.id}`)
          } else {
            message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
          }
        })
        .catch(handleError)
    }
  }, [authToken, apiHost, formatMessage, history, task])

  if (errorMessage) {
    return (
      <DefaultLayout noFooter noHeader centeredBox>
        <StyledWrapper className="d-flex flex-column justify-content-between align-items-center">
          <Icon as={ErrorIcon} w={100} h={100} />

          <div className="mb-4 d-flex flex-column text-center">
            <StyledTitle className="mb-2">{errorMessage}</StyledTitle>
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
      <StyledContainer>確認訂單中，請稍候...{(Math.exp(-1 / retry) * 100).toFixed(0)}%</StyledContainer>
    </DefaultLayout>
  )
}

export default OrderTaskPage
