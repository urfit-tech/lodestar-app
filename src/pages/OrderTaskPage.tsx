import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
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
const StyledWarning = styled.div`
  margin-top: 1rem;
  font-size: 14px;
  font-weight: bold;
  color: var(--error);
`

const OrderTaskPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { authToken } = useAuth()
  const { task, retry } = useTask('order', taskId)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (task?.failedReason) {
      message.error(formatMessage(commonMessages.status.fail))
      setErrorMessage(task?.failedReason)
      return
    }
    if (authToken && task?.finishedOn && task?.returnvalue?.orderId) {
      // do not need to pay
      if (task.returnvalue.totalAmount <= 0) {
        history.push(`/orders/${task.returnvalue.orderId}?tracking=1`)
      } else {
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/tasks/payment/`,
            { orderId: task.returnvalue.orderId, clientBackUrl: window.location.origin },
            { headers: { authorization: `Bearer ${authToken}` } },
          )
          .then(({ data: { code, result } }) => {
            if (code === 'SUCCESS') {
              history.push(`/tasks/payment/${result.id}`)
            } else {
              message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
            }
          })
          .catch(handleError)
      }
    }
  }, [authToken, formatMessage, history, task])

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
      <StyledContainer>
        <div className="text-center">
          確認訂單中，請稍候...{(Math.exp(-1 / retry) * 100).toFixed(0)}%
          <StyledWarning>請勿重整與返回上一頁</StyledWarning>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default OrderTaskPage
