import { Button, Icon } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { ReactComponent as lineCircle } from '../images/line-circle.svg'
import { ReactComponent as lineLinking } from '../images/line-linking.svg'

const messages = defineMessages({
  isBinding: { id: 'line.status.isBinding', defaultMessage: '綁定處理中...' },
  linePersonalizedServiceBinding: {
    id: 'line.title.linePersonalizedServiceBinding',
    defaultMessage: 'Line個人化服務綁定',
  },
  bindingStart: {
    id: 'line.button.bindingStart',
    defaultMessage: '開始綁定',
  },
})

const StyledBindingIcon = styled.div`
  font-size: 64px;
`
const StyledLinkingText = styled.div`
  font-size: 16px;
`
const StyledBindingContainer = styled.div`
  padding: 7rem 4rem;
`
const StyledContainer = styled.div`
  padding: 3.5rem 4rem 4rem;
`
const StyledIcon = styled(Icon)`
  font-size: 36px;
  margin-right: 12px;
`
const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--gray--darker);
  letter-spacing: 0.2px;
`
const StyledButton = styled(Button)`
  && {
    width: 100%;
  }
`
const LineBindingPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const [binding, setBinding] = useState(false)
  const { authToken, apiHost, currentMember, currentMemberId } = useAuth()
  const { id: appId, name } = useApp()
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const accountLinkToken = query.get('accountLinkToken') || ''

  const handleAccountLink = async (appId: String, apiHost: String, accountLinkToken: String, authToken: String) => {
    setBinding(true)
    await axios
      .post(
        `https://${apiHost}/auth/line-account-link`,
        { appId, memberId: currentMemberId },
        {
          headers: { authorization: `Bearer ${authToken}` },
          withCredentials: true,
        },
      )
      .then(async ({ data: { code, message, result } }) => {
        if (code !== 'SUCCESS') {
          throw new Error(code)
        }
        window.location.assign(
          `https://access.line.me/dialog/bot/accountLink?linkToken=${accountLinkToken}&nonce=${result.lineNonce}`,
        )
      })
  }
  if (binding) {
    return (
      <DefaultLayout noHeader noFooter centeredBox>
        <StyledBindingContainer>
          <div className="text-center mb-4">
            <StyledBindingIcon as={lineLinking} />
          </div>
          <StyledLinkingText className="text-center">{formatMessage(messages.isBinding)}</StyledLinkingText>
        </StyledBindingContainer>
      </DefaultLayout>
    )
  }
  return (
    <DefaultLayout noHeader noFooter centeredBox>
      <StyledContainer>
        <div className="d-flex justify-content-center mb-4">
          <StyledIcon as={lineCircle} />
          <StyledTitle>{formatMessage(messages.linePersonalizedServiceBinding)}</StyledTitle>
        </div>
        <div className="mb-4">
          <p className="text-center">將以此 {name} 帳號</p>
          <p className="text-center">{currentMember?.username} 綁定 LINE 個人化服務</p>
        </div>
        <StyledButton
          variant="primary"
          onClick={() => authToken && handleAccountLink(appId, apiHost, accountLinkToken, authToken)}
        >
          {formatMessage(messages.bindingStart)}
        </StyledButton>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default LineBindingPage
