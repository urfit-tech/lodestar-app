import { gql, useApolloClient, useQuery } from '@apollo/client'
import { Icon } from '@chakra-ui/react'
import { Button, Form, message, Spin } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useEffect, useState } from 'react'
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { GET_MANAGEMENT_DOMAIN } from '../components/common/AdminMenu'
import MigrationInput from '../components/common/MigrationInput'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { handleError } from '../helpers'
import { codeMessages, commonMessages, usersMessages } from '../helpers/translation'
import pageMessages from './translation'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;

  .ant-form-explain {
    font-size: 14px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem;
  }
`
const StyledTitle = styled.h1`
  margin-bottom: 2rem;
  color: #585858;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 1.6;
  letter-spacing: 0.8px;
`

const ResetPasswordPage: React.VFC<FormComponentProps> = ({ form }) => {
  const { formatMessage } = useIntl()
  const { login, authToken, currentMemberId, isAuthenticating } = useAuth()
  const history = useHistory()
  const [token] = useQueryParam('token', StringParam)
  const [memberId] = useQueryParam('member', StringParam)
  const [isProjectPortfolioParticipant] = useQueryParam('isProjectPortfolioParticipant', BooleanParam)
  const { id: appId } = useApp()
  const tracking = useTracking()
  const apolloClient = useApolloClient()
  const [loading, setLoading] = useState(false)

  const { data: memberEmailData, loading: loadingMemberEmail } = useQuery<
    hasura.GET_EMAIL_AND_NAME_BY_MEMBER_ID,
    hasura.GET_EMAIL_AND_NAME_BY_MEMBER_IDVariables
  >(GET_EMAIL_AND_NAME_BY_MEMBER_ID, { variables: { memberId: memberId || '' } })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && login) {
        setLoading(true)
        if (isProjectPortfolioParticipant) {
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_ROOT}/auth/set-participant-password`,
              {
                appId,
                name: values.name,
                memberId,
                password: values.password,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .then(({ data: { code } }) => {
              if (code === 'SUCCESS') {
                tracking.login()
                login({
                  account: memberEmailData?.member_public[0].email || '',
                  password: values.password,
                })
                  .then(
                    async () =>
                      await apolloClient
                        .query<hasura.GET_MANAGEMENT_DOMAIN, hasura.GET_MANAGEMENT_DOMAINVariables>({
                          query: GET_MANAGEMENT_DOMAIN,
                          variables: {
                            appId,
                          },
                        })
                        .then(res =>
                          window.location.replace(
                            `//${res.data.app_host?.[0].host}/admin/project-portfolio?tab=marked`,
                          ),
                        ),
                  )
                  .catch(handleError)
                  .finally(() => setLoading(false))
              } else {
                message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
              }
            })
            .catch(handleError)
            .finally(() => setLoading(false))
        } else {
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_ROOT}/auth/reset-password`,
              {
                appId,
                memberId,
                newPassword: values.password,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .then(({ data: { code } }) => {
              if (code === 'SUCCESS') {
                history.push('/reset-password-success')
              } else {
                message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
              }
            })
            .catch(handleError)
            .finally(() => setLoading(false))
        }
      }
    })
  }

  // FIXME: set auth token to reset password
  // useEffect(() => {
  //   try {
  //     localStorage.removeItem(`${localStorage.getItem('kolable.app.id')}.auth.token`)
  //   } catch (error) {}
  //   setAuthToken && setAuthToken(null)
  // }, [setAuthToken])

  useEffect(() => {
    if (authToken && currentMemberId && currentMemberId === memberId) {
      apolloClient
        .query<hasura.GET_MANAGEMENT_DOMAIN, hasura.GET_MANAGEMENT_DOMAINVariables>({
          query: GET_MANAGEMENT_DOMAIN,
          variables: {
            appId,
          },
        })
        .then(res => window.location.replace(`//${res.data.app_host?.[0].host}/admin/project-portfolio?tab=marked`))
        .catch(error => handleError(error))
    }
  }, [apolloClient, appId, authToken, currentMemberId, history, memberId])

  if (isAuthenticating) return <Spin />

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        {isProjectPortfolioParticipant ? (
          loadingMemberEmail ? (
            <Spin />
          ) : (
            <>
              <StyledTitle>
                {formatMessage(pageMessages.ResetPasswordPage.TitleFirstText, {
                  account: memberEmailData?.member_public[0].email,
                })}
                <br />
                {formatMessage(pageMessages.ResetPasswordPage.TitleSecondText)}
              </StyledTitle>
            </>
          )
        ) : (
          <StyledTitle>{formatMessage(usersMessages.title.resetPassword)}</StyledTitle>
        )}

        <Form onSubmit={handleSubmit}>
          {isProjectPortfolioParticipant && memberEmailData && (
            <Form.Item>
              {form.getFieldDecorator('name', {
                initialValue: memberEmailData?.member_public[0].name,
                rules: [
                  {
                    required: true,
                    message: formatMessage(commonMessages.form.message.name),
                  },
                ],
              })(
                <MigrationInput
                  placeholder={formatMessage(commonMessages.form.message.name)}
                  suffix={<Icon as={AiOutlineUser} />}
                />,
              )}
            </Form.Item>
          )}
          <Form.Item>
            {form.getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage(usersMessages.messages.enterPassword),
                },
              ],
            })(
              <MigrationInput
                type="password"
                placeholder={
                  isProjectPortfolioParticipant
                    ? formatMessage(usersMessages.placeholder.enterNewPasswordParticipant)
                    : formatMessage(usersMessages.placeholder.enterNewPassword)
                }
                suffix={<Icon as={AiOutlineLock} />}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('passwordCheck', {
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: formatMessage(usersMessages.messages.confirmPassword),
                },
                {
                  validator: (rule, value, callback) => {
                    if (value && value !== form.getFieldValue('password')) {
                      callback(formatMessage(usersMessages.messages.confirmPassword))
                    } else {
                      callback()
                    }
                  },
                },
              ],
            })(
              <MigrationInput
                type="password"
                placeholder={
                  isProjectPortfolioParticipant
                    ? formatMessage(usersMessages.placeholder.enterNewPasswordAgainParticipant)
                    : formatMessage(usersMessages.placeholder.enterNewPasswordAgain)
                }
                suffix={<Icon as={AiOutlineLock} />}
              />,
            )}
          </Form.Item>
          <Form.Item className="m-0">
            <Button htmlType="submit" type="primary" block loading={loading || loadingMemberEmail}>
              {formatMessage(commonMessages.button.confirm)}
            </Button>
          </Form.Item>
        </Form>
      </StyledContainer>
    </DefaultLayout>
  )
}

const GET_EMAIL_AND_NAME_BY_MEMBER_ID = gql`
  query GET_EMAIL_AND_NAME_BY_MEMBER_ID($memberId: String!) {
    member_public(where: { id: { _eq: $memberId } }) {
      id
      email
      name
    }
  }
`

export default Form.create<FormComponentProps>()(ResetPasswordPage)
