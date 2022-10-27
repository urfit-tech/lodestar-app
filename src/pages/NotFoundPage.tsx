import { Icon } from '@chakra-ui/icons'
import { Button, Stack } from '@chakra-ui/react'
import { Icon as AntdIcon } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../components/layout/DefaultLayout'
import { CenteredBox } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import { commonMessages } from '../helpers/translation'
import { ReactComponent as routeErrorIcon } from '../images/404.svg'
import { ReactComponent as error2Icon } from '../images/error-2.svg'
import { ReactComponent as errorIcon } from '../images/error.svg'
import { messages } from './OrderPage'

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
  margin-bottom: 24px;
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
  const [errorCode] = useQueryParam('code', StringParam)
  const [period] = useQueryParam('period', StringParam)

  const isPaymentGatewayError: boolean = errorCode === 'E_PAYMENT_GATEWAY'

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

  const content = (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <StyledWrapper>
        {isPaymentGatewayError ? (
          <AntdIcon
            className="mb-5"
            type="warning"
            theme="twoTone"
            twoToneColor="#ffbe1e"
            style={{ fontSize: '4rem' }}
          />
        ) : (
          <StyledIcon
            as={variant === 'error' ? error2Icon : variant === 'repairing' ? errorIcon : routeErrorIcon}
            className="mb-4 mx-auto"
          />
        )}
        <StyledTitle>
          {formatMessage(
            isPaymentGatewayError
              ? commonMessages.title.systemBusy
              : variant === 'error'
              ? commonMessages.title.error
              : variant === 'repairing'
              ? commonMessages.title.repairing
              : commonMessages.title.routeError,
          )}
        </StyledTitle>
        <StyledDescription>
          {isPaymentGatewayError ? (
            <>
              {formatMessage(commonMessages.content.busyProcessing)}
              <br />
              {formatMessage(commonMessages.content.busyCheck)}
              <br />
              {formatMessage(commonMessages.content.busyContact)}
            </>
          ) : (
            formatMessage(
              variant === 'error'
                ? commonMessages.content.errorDescription
                : variant === 'repairing' && period
                ? commonMessages.content.repairingDescriptionWithPeriod
                : variant === 'repairing'
                ? commonMessages.content.repairingDescription
                : commonMessages.content.routeErrorDescription,
              { period, br: <br /> },
            )
          )}
        </StyledDescription>
        {isPaymentGatewayError ? (
          <Link to="/settings/orders" className="mt-4">
            <Button>{formatMessage(messages.orderTracking)}</Button>
          </Link>
        ) : (
          handleClick && (
            <StyledButton onClick={handleClick} variant="outline">
              {formatMessage(variant === 'error' ? commonMessages.button.reload : commonMessages.button.previousPage)}
            </StyledButton>
          )
        )}
      </StyledWrapper>
    </>
  )
  return variant === 'repairing' ? (
    <Stack justifyContent="center" alignItems="center" height="100vh" backgroundColor="#f7f8f8">
      <CenteredBox>{content}</CenteredBox>
    </Stack>
  ) : (
    <DefaultLayout centeredBox>{content}</DefaultLayout>
  )
}

export default NotFoundPage
