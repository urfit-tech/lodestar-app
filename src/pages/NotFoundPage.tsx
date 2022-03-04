import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'
import { ReactComponent as routeErrorIcon } from '../images/404.svg'
import { ReactComponent as error2Icon } from '../images/error-2.svg'
import { ReactComponent as errorIcon } from '../images/error.svg'

const StyledWrapper = styled.div`
  padding: 5rem 1rem;
  text-align: center;
  color: var(--gray-darker);
`
const StyledIcon = styled(Icon)`
  width: 100px;
`
const StyledTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 1.5px;
`
const StyledDescription = styled.div`
  height: 3em;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledButton = styled(props => <Button {...props} />)`
  && {
    margin-top: 1.25rem;
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

const NotFoundPage: React.VFC<{
  variant?: 'error' | 'repairing'
}> = ({ variant }) => {
  const { formatMessage } = useIntl()
  let history = useHistory()

  const handleClick =
    variant === 'error'
      ? () => {
          window.location.reload()
        }
      : variant === 'repairing'
      ? undefined
      : () => {
          history.goBack()
        }

  return (
    <DefaultLayout centeredBox>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <StyledWrapper>
        <StyledIcon
          as={variant === 'error' ? error2Icon : variant === 'repairing' ? errorIcon : routeErrorIcon}
          className="mb-4 mx-auto"
        />
        <StyledTitle>
          {formatMessage(
            variant === 'error'
              ? commonMessages.title.error
              : variant === 'repairing'
              ? commonMessages.title.repairing
              : commonMessages.title.routeError,
          )}
        </StyledTitle>
        <StyledDescription>
          {formatMessage(
            variant === 'error'
              ? commonMessages.content.errorDescription
              : variant === 'repairing'
              ? commonMessages.content.repairingDescription
              : commonMessages.content.routeErrorDescription,
          )}
        </StyledDescription>
        {handleClick && (
          <StyledButton onClick={handleClick} variant="outline">
            {formatMessage(variant === 'error' ? commonMessages.button.reload : commonMessages.button.previousPage)}
          </StyledButton>
        )}
      </StyledWrapper>
    </DefaultLayout>
  )
}

export default NotFoundPage
