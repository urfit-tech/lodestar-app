import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'
import { usePage } from '../hooks/page'
import { ReactComponent as routeErrorIcon } from '../images/404.svg'
import { ReactComponent as errorIcon } from '../images/error-2.svg'
import AppPage from './AppPage'
import LoadingPage from './LoadingPage'

const StyledWrapper = styled.div`
  height: 430px;
  text-align: center;
  color: var(--gray-darker);
  padding: 0 1rem;
`
const StyledTitle = styled.h3`
  font-family: NotoSansCJKtc;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 1.5px;
`
const StyledDescription = styled.div`
  margin-bottom: 1.25rem;
  height: 3em;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledButton = styled(props => <Button {...props} />)`
  && {
    width: 160px;
    height: 45px;
    cursor: pointer;
    background: transparent;
    color: var(--gray-darker);
    font-weight: 400;
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
const StyledErrorIcon = styled(Icon)`
  margin-top: 80px;
  margin-bottom: 24px;
`

type NotFoundPageProps = {
  error?: boolean
}
const NotFoundPage: React.FC<NotFoundPageProps> = ({ error }) => {
  const { formatMessage } = useIntl()
  const { loadingAppPage, appPage, errorAppPage } = usePage(window.location.pathname)

  let history = useHistory()
  const clickHandler = () => {
    if (error) {
      window.location.reload()
    } else {
      history.goBack()
    }
  }

  if (loadingAppPage) return <LoadingPage />
  if (!loadingAppPage && !errorAppPage && appPage.path) return <AppPage page={appPage} />

  return (
    <DefaultLayout centeredBox>
      <StyledWrapper>
        <StyledErrorIcon as={error ? errorIcon : routeErrorIcon} />
        <StyledTitle>{formatMessage(error ? commonMessages.title.error : commonMessages.title.routeError)}</StyledTitle>
        <StyledDescription>
          {formatMessage(
            error ? commonMessages.content.errorDescription : commonMessages.content.routeErrorDescription,
          )}
        </StyledDescription>
        <StyledButton onClick={clickHandler} variant="outline">
          {formatMessage(error ? commonMessages.button.reload : commonMessages.button.previousPage)}
        </StyledButton>
      </StyledWrapper>
    </DefaultLayout>
  )
}

export default NotFoundPage
