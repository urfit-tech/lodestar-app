import { Icon } from '@chakra-ui/icons'
import { Button, message as antdMessage } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../components/layout/DefaultLayout'
import { StyledContainer } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import { handleError } from '../helpers'
import { codeMessages } from '../helpers/translation'
import { ReactComponent as ErrorIcon } from '../images/error.svg'
import { useMember } from '../hooks/member'


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

const VerifyEmailPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [token] = useQueryParam('token', StringParam)


  const [memberId] = useQueryParam('member', StringParam)
  const { authToken } = useAuth()
  const { member } = useMember(memberId || '')


  const [errorMessage, setErrorMessage] = useState('')

  const verifyEmail = useCallback(()=>{
    if (authToken && token && memberId === member?.id && member?.email) {

      axios
        .post(
          `${process.env.REACT_APP_API_BASE_ROOT}/auth/verify-email`,
          { memberId, email: member.email, token },
          { headers: { authorization: `Bearer ${authToken}` } },
        )
        .then(({ data: { code, message, result } }) => {
          if (code === 'SUCCESS') {
  
              window.location.replace(`/settings/profile?verified=1`)
     
           
          } else {
            antdMessage.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
            setErrorMessage(message)

          }
        })
        .catch(error=>{
          handleError(error)
        })
    }
  },[token, memberId, authToken, member?.id, member?.email, formatMessage])

  useEffect(() => {
    verifyEmail()
  }, [verifyEmail])

  if (errorMessage) {
    return (
      <DefaultLayout noFooter noHeader centeredBox noNotificationBar>
        <StyledWrapper className="d-flex flex-column justify-content-between align-items-center">
          <Icon as={ErrorIcon} w={100} h={100} />

          <div className="mb-4 d-flex flex-column text-center">
            <StyledTitle className="mb-2">
              {formatMessage(codeMessages[errorMessage as keyof typeof codeMessages])}
            </StyledTitle>
          </div>

          <Link to="/settings/profile">
            <StyledButton>返回個人設定</StyledButton>
          </Link>
        </StyledWrapper>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout noFooter noHeader centeredBox noNotificationBar>
      <StyledContainer>
        <div className="text-center">
          信箱驗證中，請稍候...
          <StyledWarning>請勿重整與返回上一頁</StyledWarning>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default VerifyEmailPage
