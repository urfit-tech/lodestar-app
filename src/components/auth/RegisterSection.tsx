import { useQuery } from '@apollo/react-hooks'
import { Button, Icon, Input } from '@chakra-ui/react'
import { Checkbox, Col, Form, message, Row, Select, Skeleton } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import Axios from 'axios'
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { codeMessages, commonMessages } from '../../helpers/translation'
import { AuthState } from '../../types/member'
import MigrationInput from '../common/MigrationInput'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton } from './SocialLoginButton'
import authMessages from './translation'

const StyledParagraph = styled.p`
  color: var(--gray-dark);
  font-size: 14px;
`

const StyledCheckboxGroup = styled(Checkbox.Group)`
  && .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${props => props.theme['@primary-color']};
    border-color: ${props => props.theme['@primary-color']};
  }
`

type RegisterSectionProps = FormComponentProps & {
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
}

const RegisterSection: React.VFC<RegisterSectionProps> = ({ form, onAuthStateChange }) => {
  const { settings, enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const { register, sendSmsCode, verifySmsCode } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const { renderRegisterTerm } = useCustomRenderer()
  const { loadingSighProperty, signProperties, errorSignProperty } = useSignupProperty()

  const [loading, setLoading] = useState(false)
  const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'ready'>('ready')
  const [verifying, setVerifying] = useState(false)
  const [authState, setAuthState] = useState<'sms_verification' | 'register' | 'signup_info'>()
  const [signupInfos, setSignupInfos] = useState<{ id: string; value: string }[]>()

  useEffect(() => {
    setAuthState(
      enabledModules.sms_verification
        ? 'sms_verification'
        : settings['feature.signup_info.enable'] === '1'
        ? 'signup_info'
        : 'register',
    )
  }, [enabledModules.sms_verification, settings])

  const handleSmsSend = () => {
    const phoneNumber = form.getFieldValue('phoneNumber')
    if (sendSmsCode && phoneNumber) {
      setSendingState('loading')
      sendSmsCode({ phoneNumber: phoneNumber.trim() })
        .then(() => {
          setSendingState('idle')
          // TODO: locale
          message.success('成功發送簡訊碼')
          setTimeout(() => {
            setSendingState('ready')
          }, 30000)
        })
        .catch(error => {
          setSendingState('ready')
          message.error(error.message)
        })
    } else {
      // TODO: locale
      message.error('請輸入手機號碼')
    }
  }
  const handleSmsVerify = () => {
    verifySmsCode &&
      form.validateFields((error, values) => {
        if (error) {
          return
        }
        setVerifying(true)
        const phoneNumber = values.phoneNumber.trim()
        verifySmsCode({ phoneNumber , code: values.code.trim() })
          .then(() => {
            if (settings['feature.signup_info.enable'] === '1') {
              setAuthState('signup_info')
            } else {
              setAuthState('register')
            }

            sessionStorage.setItem('phone', phoneNumber)
          })
          .catch((error: Error) => {
            message.error('簡訊驗證失敗')
          })
          .finally(() => setVerifying(false))
      })
  }

  const handleRegister = () => {
    register &&
      form.validateFields((error, values) => {
        if (error) {
          return
        }
        setLoading(true)
        register({
          username: values.username.trim().toLowerCase(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        })
          .then(authToken => {
            const currentMemberId = jwt.decode(authToken)?.sub
            process.env.REACT_APP_GRAPHQL_ENDPOINT &&
              Axios.post(
                process.env.REACT_APP_GRAPHQL_ENDPOINT,
                {
                  query: `mutation UPDATE_MEMBER_INFO($memberId: String!, $name: String,$memberProperties: [member_property_insert_input!]!) {
                  update_member(where: { id: { _eq: $memberId } }, _set: { name: $name }) {
                    affected_rows
                  }

                  insert_member_property(objects: $memberProperties) {
                    affected_rows
                  }
                }
                  `,
                  variables: {
                    memberId: currentMemberId,
                    name: signupInfos?.find(v => v.id === 'name')?.value,
                    memberProperties: signupInfos
                      ?.filter(v => v.id !== 'name')
                      ?.map(v => ({
                        member_id: currentMemberId,
                        property_id: v.id,
                        value: v?.value.toString() || '',
                      })),
                  },
                },
                { headers: { Authorization: `Bearer ${authToken}` } },
              )

            setVisible?.(false)
            form.resetFields()
          })
          .catch((error: Error) => {
            const code = error.message as keyof typeof codeMessages
            if (process.env.NODE_ENV === 'development') {
              message.error(formatMessage(codeMessages[code]))
            } else {
              switch (code) {
                case 'E_USERNAME_EXISTS':
                  message.error(formatMessage(authMessages.RegisterSection.usernameIsAlreadyRegistered))
                  break
                case 'E_EMAIL_EXISTS':
                  message.error(formatMessage(authMessages.RegisterSection.emailIsAlreadyRegistered))
                  break
                default:
                  message.error(formatMessage(authMessages.RegisterSection.registerFailed))
              }
            }
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      })
  }

  if (!authState) {
    return <></>
  }

  if (authState === 'sms_verification') {
    return (
      <>
        <StyledTitle>{formatMessage(authMessages.RegisterSection.smsVerification)}</StyledTitle>
        <Form
          onSubmit={e => {
            e.preventDefault()
            handleSmsVerify()
          }}
        >
          <Form.Item>
            {form.getFieldDecorator('phoneNumber', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages.form.message.phone),
                },
              ],
            })(
              <MigrationInput
                placeholder={formatMessage(commonMessages.form.placeholder.phone)}
                suffix={<Icon as={AiOutlinePhone} />}
              />,
            )}
          </Form.Item>

          <Form.Item>
            {form.getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages.form.message.smsVerification),
                },
              ],
            })(
              <MigrationInput
                placeholder={formatMessage(commonMessages.form.placeholder.smsVerification)}
                suffix={<AiOutlineMail />}
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="button"
              variant="outline"
              isFullWidth
              isLoading={sendingState === 'loading'}
              onClick={handleSmsSend}
              isDisabled={sendingState === 'idle'}
            >
              {sendingState === 'idle'
                ? formatMessage(commonMessages.button.sendSmsIdle)
                : formatMessage(commonMessages.button.sendSms)}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button colorScheme="primary" type="submit" isFullWidth block="true" loading={verifying.toString()}>
              {formatMessage(commonMessages.button.verifySms)}
            </Button>
          </Form.Item>
          <StyledAction>
            <span>{formatMessage(authMessages.RegisterSection.isMember)}</span>
            <Button
              colorScheme="primary"
              variant="ghost"
              size="sm"
              lineHeight="unset"
              onClick={() => onAuthStateChange('login')}
            >
              {formatMessage(commonMessages.button.login)}
            </Button>
          </StyledAction>
        </Form>
      </>
    )
  }

  if (authState === 'signup_info') {
    if (loadingSighProperty) return <Skeleton active />
    if (errorSignProperty) return <>{formatMessage(authMessages.RegisterSection.fetchError)}</>

    return (
      <>
        <StyledTitle>{formatMessage(authMessages.RegisterSection.signupInfo)}</StyledTitle>
        <Form
          layout="vertical"
          onSubmit={e => {
            e.preventDefault()
            form.validateFieldsAndScroll(
              {
                scroll: {
                  offsetTop: 35,
                },
              },
              (error, values) => {
                if (error) return
                const signPropertyTypes: { [key: string]: string } = {}
                signProperties.forEach(p => (signPropertyTypes[p.id] = p.type))
                setSignupInfos(
                  Object.keys(values).map(id => {
                    let value = values[id] || ''
                    if (signPropertyTypes[id] === 'input') {
                      value = value.trim()
                    }
                    return {
                      id: id,
                      value: value,
                    }
                  }),
                )
                setAuthState('register')
              },
            )
          }}
        >
          <Form.Item key="name" label={formatMessage(authMessages.RegisterSection.name)}>
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage(authMessages.RegisterSection.enterName),
                },
              ],
            })(<Input placeholder={formatMessage(authMessages.RegisterSection.nameFieldWarning)} />)}
          </Form.Item>

          {signProperties.map(signProperty => {
            switch (signProperty.type) {
              case 'input':
                return (
                  <Form.Item key={signProperty.propertyId} label={signProperty.name}>
                    {form.getFieldDecorator(signProperty.propertyId, {
                      rules: [
                        {
                          required: signProperty.isRequired,
                          message:
                            signProperty.ruleMessage ||
                            formatMessage(authMessages['*'].isRequiredWarning, { name: signProperty.name }),
                        },
                      ],
                    })(<Input placeholder={signProperty.placeHolder} />)}
                  </Form.Item>
                )
              case 'checkbox':
                return (
                  <Form.Item key={signProperty.propertyId} label={signProperty.name}>
                    {form.getFieldDecorator(signProperty.propertyId, {
                      valuePropName: 'checked',
                      rules: [
                        {
                          required: signProperty.isRequired,
                          message:
                            signProperty.ruleMessage ||
                            formatMessage(authMessages['*'].isRequiredWarning, { name: signProperty.name }),
                        },
                      ],
                    })(
                      <StyledCheckboxGroup className="StyledCheckboxGroup">
                        <Row>
                          {signProperty.selectOptions?.map(selectOption => (
                            <Col className="mb-2" span={Math.floor(24 / (signProperty?.rowAmount || 1))}>
                              <Checkbox value={selectOption}>{selectOption}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </StyledCheckboxGroup>,
                    )}
                  </Form.Item>
                )
              case 'select':
                return (
                  <Form.Item key={signProperty.propertyId} label={signProperty.name}>
                    {form.getFieldDecorator(signProperty.propertyId, {
                      rules: [
                        {
                          required: signProperty.isRequired,
                          message:
                            signProperty.ruleMessage ||
                            formatMessage(authMessages['*'].isRequiredWarning, { name: signProperty.name }),
                        },
                      ],
                    })(
                      <Select placeholder={signProperty.placeHolder}>
                        {signProperty.selectOptions?.map(selectOption => (
                          <Select.Option value={selectOption}>{selectOption}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                )
              // TODO: finish it
              case 'radio':
                return <></>
              // TODO: finish it
              case 'textArea':
                return <></>
              default:
                return <></>
            }
          })}

          <Form.Item>
            <Button colorScheme="primary" type="submit" isFullWidth block="true" loading={verifying.toString()}>
              {formatMessage(authMessages.RegisterSection.nextStep)}
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  return (
    <>
      <StyledTitle>{formatMessage(authMessages.RegisterSection.signUp)}</StyledTitle>

      {!!settings['auth.facebook_app_id'] && (
        <div className="mb-3">
          <FacebookLoginButton />
        </div>
      )}
      {!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
        <div className="mb-3">
          <LineLoginButton />
        </div>
      )}
      {!!settings['auth.google_client_id'] && (
        <div className="mb-3">
          <GoogleLoginButton />
        </div>
      )}

      {(!!settings['auth.facebook_app_id'] ||
        !!settings['auth.google_client_id'] ||
        (!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'])) && (
        <StyledDivider>{formatMessage(commonMessages.defaults.or)}</StyledDivider>
      )}

      <Form
        onSubmit={e => {
          e.preventDefault()
          handleRegister()
        }}
      >
        <Form.Item>
          {form.getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.username),
              },
            ],
          })(
            <MigrationInput
              placeholder={formatMessage(commonMessages.form.placeholder.username)}
              suffix={<Icon as={AiOutlineUser} />}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.email),
              },
              {
                type: 'email',
                message: formatMessage(commonMessages.form.message.emailFormatMessage),
              },
            ],
          })(
            <MigrationInput
              placeholder={formatMessage(commonMessages.form.placeholder.email)}
              suffix={<AiOutlineMail />}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.password),
              },
            ],
          })(
            <MigrationInput
              type="password"
              placeholder={formatMessage(commonMessages.form.placeholder.password)}
              suffix={<AiOutlineLock />}
            />,
          )}
        </Form.Item>
        <StyledParagraph>
          {renderRegisterTerm?.() || (
            <span>
              {formatMessage(authMessages.RegisterSection.registration)}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="ml-1">
                {formatMessage(authMessages.RegisterSection.term)}
              </a>
            </span>
          )}
        </StyledParagraph>
        <Form.Item>
          <Button colorScheme="primary" type="submit" isFullWidth isLoading={loading}>
            {formatMessage(commonMessages.button.signUp)}
          </Button>
        </Form.Item>
      </Form>

      <StyledAction>
        <span>{formatMessage(authMessages.RegisterSection.isMember)}</span>
        <Button
          colorScheme="primary"
          variant="ghost"
          size="sm"
          lineHeight="unset"
          onClick={() => onAuthStateChange('login')}
        >
          {formatMessage(commonMessages.button.login)}
        </Button>
      </StyledAction>
    </>
  )
}

const useSignupProperty = () => {
  const { loading, error, data } = useQuery<hasura.GET_SIGNUP_PROPERTY>(
    gql`
      query GET_SIGNUP_PROPERTY {
        signup_property(order_by: { position: asc }) {
          id
          is_required
          options
          type
          property {
            id
            name
          }
        }
      }
    `,
  )
  const signProperties: {
    id: string
    propertyId: string
    type: string
    name: string
    isRequired: boolean
    placeHolder?: string
    selectOptions?: string[]
    ruleMessage?: string
    rowAmount?: number
  }[] =
    data?.signup_property.map(v => ({
      id: v.id,
      propertyId: v.property.id,
      type: v.type,
      name: v.property.name,
      isRequired: v.is_required,
      placeHolder: v.options?.placeholder || '',
      selectOptions: v.options?.options || [],
      ruleMessage: v.options?.ruleMessage || '',
      rowAmount: v.options?.rowAmount || 1,
    })) || []

  return {
    loadingSighProperty: loading,
    signProperties,
    errorSignProperty: error,
  }
}

export default Form.create<RegisterSectionProps>()(RegisterSection)
