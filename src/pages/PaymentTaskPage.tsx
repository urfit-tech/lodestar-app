import { Icon } from '@chakra-ui/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import { commonMessages } from '../helpers/translation'
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

const PaymentTaskPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { task, retry } = useTask('payment', taskId)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (task?.returnvalue) {
      history.push(`/payments/${task.returnvalue.paymentNo}`)
    } else {
      setErrorMessage(task?.failedReason || '')
    }
  }, [history, task])

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
      <StyledContainer>產生付款資訊中...{(Math.exp(-1 / retry) * 100).toFixed(0)}%</StyledContainer>
    </DefaultLayout>
  )
}

export default PaymentTaskPage
