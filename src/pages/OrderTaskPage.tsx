import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import { handleError } from '../helpers'
import { codeMessages, commonMessages } from '../helpers/translation'
import { useTask } from '../hooks/task'
import { sleep } from '../hooks/util'
import { ReactComponent as ErrorIcon } from '../images/error.svg'

const messages = defineMessages({
  confirmingOrder: {
    id: 'orderTaskPage.message.confirmingOrder',
    defaultMessage: '確認訂單中，請稍候...',
  },
  doNotRefresh: {
    id: 'orderTaskPage.message.doNotRefresh',
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

const OrderTaskPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { authToken } = useAuth()
  const { task, code, retry } = useTask('order', taskId)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (authToken && code === 'SUCCESS' && task?.finishedOn && task?.returnvalue?.orderId) {
      // do not need to pay
      if (task.returnvalue.totalAmount <= 0) {
        sleep(5000).then(() => window.location.assign(`/orders/${task.returnvalue.orderId}?tracking=1`))
      } else {
        const search = window.location.search
        const clientBackUrl = search.substring(1, search.length).split('&')[0].split('=')[1]
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/tasks/payment/`,
            { orderId: task.returnvalue.orderId, clientBackUrl: clientBackUrl || window.location.origin },
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
    } else if (code !== 'SUCCESS') {
      setErrorMessage(errorMessage.split(':')[0])
    } else {
      setErrorMessage(code)
    }
  }, [authToken, formatMessage, history, code, task, errorMessage])

  if (errorMessage) {
    return (
      <DefaultLayout noFooter noHeader centeredBox>
        <StyledWrapper className="d-flex flex-column justify-content-between align-items-center">
          <Icon as={ErrorIcon} w={100} h={100} />

          <div className="mb-4 d-flex flex-column text-center">
            <StyledTitle className="mb-2">
              {formatMessage(codeMessages[errorMessage as keyof typeof codeMessages])}
            </StyledTitle>
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
          {formatMessage(messages.confirmingOrder)}
          {(Math.exp(-1 / retry) * 100).toFixed(0)}%
          <StyledWarning>{formatMessage(messages.doNotRefresh)}</StyledWarning>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default OrderTaskPage
