import { Button, Stack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { desktopViewMixin } from '../../helpers'
import { useAuthModal } from '../../hooks/auth'
import authMessages from './translation'

const CenteredBox = styled.div`
  margin: 1rem;
  width: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);

  ${desktopViewMixin(
    css`
      width: calc(100% / 4);
    `,
  )}
`

const StyledWrapper = styled.div`
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--gray-darker);
`

const StyledTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 1.5px;
`
const StyledDescription = styled.div`
  margin: 20px auto 32px auto;
  font-size: 14px;
  letter-spacing: 0.4px;
  width: 67%;
`
const StyledButton = styled(props => <Button {...props} />)`
  && {
    width: 105px;
    height: 44px;
    cursor: pointer;
    background-color: #009d95;
    color: #fff;
    border-radius: 4px;
    font-weight: 400;
    letter-spacing: 0.2px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:focus {
      box-shadow: none;
      outline: none;
    }
    &:hover {
      background: transparent;
      color: ${props => props.theme['@error-color']};
      border: 1px solid ${props => props.theme['@error-color']};
    }
  }
`

const AskLoginPage: React.VFC = () => {
  const { setVisible } = useContext(AuthModalContext)
  const authModal = useAuthModal()
  const { formatMessage } = useIntl()

  const handleClick = () => {
    authModal.open(setVisible)
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      backgroundColor="rgba(255, 255, 255, 0.6)"
      pos="absolute"
      zIndex="1"
    >
      <CenteredBox>
        <StyledWrapper>
          <StyledTitle>{formatMessage(authMessages.AskLoginPage.title)}</StyledTitle>
          <StyledDescription>{formatMessage(authMessages.AskLoginPage.description)}</StyledDescription>
          <StyledButton onClick={handleClick} variant="outline">
            {formatMessage(authMessages.AskLoginPage.goToLogin)}
          </StyledButton>
        </StyledWrapper>
      </CenteredBox>
    </Stack>
  )
}
export default AskLoginPage
