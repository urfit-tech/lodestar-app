import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout.styled'
import { useTask } from '../hooks/task'

const PaymentTaskPage: React.FC = () => {
  const { authToken } = useAuth()
  const history = useHistory()
  const { taskId } = useParams<{ taskId: string }>()
  const { task, retry } = useTask('payment', taskId)

  useEffect(() => {
    if (authToken && task?.finishedOn) {
      history.push(`/payments/${task.returnvalue.paymentNo}`)
    }
  }, [history, authToken, task])

  return (
    <DefaultLayout noFooter noHeader centeredBox>
      <StyledContainer>產生付款資訊中...{(Math.exp(-1 / retry) * 100).toFixed(0)}%</StyledContainer>
    </DefaultLayout>
  )
}

export default PaymentTaskPage
