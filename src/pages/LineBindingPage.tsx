import { Button, Icon } from '@chakra-ui/react'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { ReactComponent as lineCircle } from '../images/line-circle.svg'
import { ReactComponent as lineLinking } from '../images/line-linking.svg'
import pageMessages from './translation'

const StyledBindingIcon = styled.div`
  font-size: 64px;
  display: inline-block;
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
  const { authToken, currentMember, currentMemberId } = useAuth()
  const { id: appId, name } = useApp()
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const accountLinkToken = query.get('accountLinkToken') || ''

  const handleAccountLink = async (appId: String, accountLinkToken: String, authToken: String) => {
    setBinding(true)
    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/line/generate-nonce`,
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
          <StyledLinkingText className="text-center">
            {formatMessage(pageMessages.LineBindingPage.isBinding)}
          </StyledLinkingText>
        </StyledBindingContainer>
      </DefaultLayout>
    )
  }
  return (
    <DefaultLayout noHeader noFooter centeredBox>
      <StyledContainer>
        <div className="d-flex justify-content-center mb-4">
          <StyledIcon as={lineCircle} />
          <StyledTitle>{formatMessage(pageMessages.LineBindingPage.linePersonalizedServiceBinding)}</StyledTitle>
        </div>
        <div className="mb-4">
          <p className="text-center">{formatMessage(pageMessages.LineBindingPage.bindAccount, { name: name })}</p>
          <p className="text-center">
            {formatMessage(pageMessages.LineBindingPage.bindLineService, {
              userName: currentMember?.username,
            })}
          </p>
        </div>
        <StyledButton
          variant="primary"
          onClick={() => authToken && handleAccountLink(appId, accountLinkToken, authToken)}
        >
          {formatMessage(pageMessages.LineBindingPage.bindingStart)}
        </StyledButton>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default LineBindingPage
