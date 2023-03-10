import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Button, Icon } from '@chakra-ui/react'
import { Checkbox, Form, Input, message, Skeleton } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import Axios from 'axios'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { parsePayload } from 'lodestar-app-element/src/hooks/util'
import { isEmpty } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import hasura from '../../hasura'
import { uploadFile } from '../../helpers'
import { codeMessages, commonMessages } from '../../helpers/translation'
import { useSignUpProperty } from '../../hooks/common'
import { AuthState } from '../../types/member'
import BusinessSignupForm from '../common/BusinessSignupForm'
import MigrationInput from '../common/MigrationInput'
import SignupForm from '../common/SignupForm'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton } from './SocialLoginButton'
import authMessages from './translation'

const StyledParagraph = styled.p`
  color: var(--gray-dark);
  font-size: 14px;
`

type RegisterSectionProps = FormComponentProps & {
  isBusinessMember?: boolean
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
}

const RegisterSection: React.VFC<RegisterSectionProps> = ({ form, isBusinessMember, onAuthStateChange }) => {
  const { settings, enabledModules, id: appId } = useApp()
  const { formatMessage } = useIntl()
  const apolloClient = useApolloClient()
  const { register, sendSmsCode, verifySmsCode } = useAuth()
  const { setVisible, setIsBusinessMember } = useContext(AuthModalContext)
  const { renderRegisterTerm } = useCustomRenderer()
  const { loadingSignUpProperty, signUpProperties, errorSignUpProperty } = useSignUpProperty(isBusinessMember ?? false)
  const { loadingPropertyIdMap, propertyIdMap, errorPropertyIdMap } = useBusinessSignupPropertyIdMap()

  const [loading, setLoading] = useState(false)
  const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'ready'>('ready')
  const [verifying, setVerifying] = useState(false)
  const [authState, setAuthState] = useState<'sms_verification' | 'register' | 'signup_info'>()
  const [signupInfos, setSignupInfos] = useState<{ id: string; value: string }[]>()
  const [passwordShow, setPasswordShow] = useState(false)
  const [companyPictureFile, setCompanyPictureFile] = useState<File | null>(null)

  useEffect(() => {
    setAuthState(
      enabledModules.sms_verification && !isBusinessMember
        ? 'sms_verification'
        : settings['feature.signup_info.enable'] === '1' || (enabledModules.business_member && isBusinessMember)
        ? 'signup_info'
        : 'register',
    )
  }, [enabledModules.sms_verification, settings, enabledModules.business_member, isBusinessMember])

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
        verifySmsCode({ phoneNumber, code: values.code.trim() })
          .then(() => {
            if (settings['feature.signup_info.enable'] === '1' || isBusinessMember) {
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
      form.validateFields(async (error, values) => {
        if (error) {
          return
        }
        setLoading(true)
        if (isBusinessMember) {
          const { data: dataEmail } = await apolloClient.query<
            hasura.GET_MEMBER_EMAIl,
            hasura.GET_MEMBER_EMAIlVariables
          >({
            query: gql`
              query GET_MEMBER_EMAIl($appId: String!, $email: String!) {
                member(where: { app_id: { _eq: $appId }, email: { _eq: $email } }) {
                  id
                  email
                }
              }
            `,
            variables: { appId, email: values.email.trim().toLowerCase() },
          })
          const { data: dataUsername } = await apolloClient.query<
            hasura.GET_MEMBER_USERNAME,
            hasura.GET_MEMBER_USERNAMEVariables
          >({
            query: gql`
              query GET_MEMBER_USERNAME($appId: String!, $username: String!) {
                member(where: { app_id: { _eq: $appId }, username: { _eq: $username } }) {
                  id
                  username
                }
              }
            `,
            variables: { appId, username: values.username.trim().toLowerCase() },
          })
          if (dataEmail.member.length >= 1) {
            message.error(formatMessage(authMessages.RegisterSection.emailIsAlreadyRegistered))
            setLoading(false)
            return
          } else if (dataUsername.member.length >= 1) {
            message.error(formatMessage(authMessages.RegisterSection.usernameIsAlreadyRegistered))
            setLoading(false)
            return
          }
        }
        register({
          username: values.username.trim().toLowerCase(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          isBusiness: isBusinessMember ?? false,
        })
          .then(async authToken => {
            const decodedToken = parsePayload(authToken)
            if (!decodedToken) {
              throw new Error('no auth token')
            }
            const currentMemberId = decodedToken.sub
            let pictureUrl = null

            if (companyPictureFile) {
              const avatarId = uuid()
              const path = `avatars/${decodedToken.appId}/${currentMemberId}/${avatarId}`
              pictureUrl = `https://${process.env.REACT_APP_S3_BUCKET}/${path}`
              await uploadFile(path, companyPictureFile, authToken)
            }

            process.env.REACT_APP_GRAPHQL_ENDPOINT &&
              Axios.post(
                process.env.REACT_APP_GRAPHQL_ENDPOINT,
                {
                  query: `mutation UPDATE_MEMBER_INFO($memberId: String!, $setMember: member_set_input, $memberProperties: [member_property_insert_input!]!) {
                    update_member(where: { id: { _eq: $memberId } }, _set: $setMember) {
                      affected_rows
                    }
  
                    insert_member_property(objects: $memberProperties) {
                      affected_rows
                    }
                  }
                  `,
                  variables: {
                    memberId: currentMemberId,
                    setMember: isBusinessMember
                      ? { picture_url: pictureUrl }
                      : {
                          name: isBusinessMember
                            ? signupInfos?.find(v => v.id === 'companyShortName')?.value
                            : signupInfos?.find(v => v.id === 'name')?.value,
                        },
                    memberProperties: signupInfos
                      ?.filter(v => v.id !== 'name' && v.id !== 'pictureUrl')
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
            setIsBusinessMember?.(false)
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
    if (loadingSignUpProperty || (isBusinessMember && loadingPropertyIdMap)) return <Skeleton active />
    if (errorSignUpProperty || (isBusinessMember && (errorPropertyIdMap || isEmpty(propertyIdMap)))) {
      return <>{formatMessage(authMessages.RegisterSection.fetchError)}</>
    }

    return (
      <>
        <StyledTitle>
          {formatMessage(
            isBusinessMember ? commonMessages.content.registerCompany : authMessages.RegisterSection.signupInfo,
          )}
        </StyledTitle>
        {isBusinessMember ? (
          <BusinessSignupForm
            form={form}
            companyPictureFile={companyPictureFile}
            setCompanyPictureFile={setCompanyPictureFile}
            onSubmit={submitValues => {
              form.validateFieldsAndScroll(
                {
                  scroll: {
                    offsetTop: 35,
                  },
                },
                (error, values) => {
                  if (error) return
                  const propertyValues = { ...values, ...submitValues }
                  setSignupInfos(
                    Object.keys(propertyValues)
                      .map(key => ({
                        id: propertyIdMap[key],
                        value: propertyValues[key],
                      }))
                      .filter(property => property.id !== undefined && property.value !== undefined),
                  )
                  setAuthState('register')
                },
              )
            }}
          />
        ) : (
          <SignupForm
            form={form}
            signUpProperties={signUpProperties}
            renderDefaultProperty={
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
            }
            renderSubmitButton={
              <Form.Item>
                <Button colorScheme="primary" type="submit" isFullWidth block="true">
                  {formatMessage(authMessages.RegisterSection.nextStep)}
                </Button>
              </Form.Item>
            }
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                  signUpProperties.forEach(p => (signPropertyTypes[p.id] = p.type))
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
          />
        )}
      </>
    )
  }

  return (
    <>
      <StyledTitle>{formatMessage(authMessages.RegisterSection.signUp)}</StyledTitle>

      {!isBusinessMember && !!settings['auth.facebook_app_id'] && (
        <div className="mb-3">
          <FacebookLoginButton />
        </div>
      )}
      {!isBusinessMember && !!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
        <div className="mb-3">
          <LineLoginButton />
        </div>
      )}
      {!isBusinessMember && !!settings['auth.google_client_id'] && (
        <div className="mb-3">
          <GoogleLoginButton />
        </div>
      )}

      {!isBusinessMember &&
        (!!settings['auth.facebook_app_id'] ||
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
              type={passwordShow ? 'text' : 'password'}
              placeholder={formatMessage(commonMessages.form.placeholder.password)}
              suffix={
                <Icon
                  className="cursor-pointer"
                  as={passwordShow ? AiOutlineEye : AiOutlineEyeInvisible}
                  onClick={() => setPasswordShow(!passwordShow)}
                />
              }
            />,
          )}
        </Form.Item>
        <StyledParagraph>
          {renderRegisterTerm?.() || isBusinessMember ? (
            <Form.Item>
              {form.getFieldDecorator('registerTerm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(commonMessages.ui.checkPlease),
                  },
                ],
              })(<Checkbox>{formatMessage(authMessages.RegisterSection.businessTerm)}</Checkbox>)}
            </Form.Item>
          ) : (
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
        <span>
          {formatMessage(
            isBusinessMember ? authMessages.RegisterSection.isBusiness : authMessages.RegisterSection.isMember,
          )}
        </span>
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

export const useBusinessSignupPropertyIdMap = () => {
  const nameMap: { [key: string]: string } = {
    公司抬頭: 'companyTitle',
    公司簡稱: 'companyShortName',
    公司統編: 'companyUniformNumber',
    公司類型: 'companyType',
    官方網站: 'officialWebsite',
    公司縣市: 'city',
    公司鄉鎮區: 'district',
    公司地址: 'companyAddress',
    公司負責人: 'personInChargeOfTheCompany',
    公司電話: 'companyPhone',
    公司簡介: 'companyAbstract',
    公司介紹: 'companyIntro',
  }
  const { loading, error, data } = useQuery<hasura.GET_BUSINESS_SIGNUP_PROPERTY_ID_MAP>(
    gql`
      query GET_BUSINESS_SIGNUP_PROPERTY_ID_MAP($condition: property_bool_exp!) {
        property(where: $condition) {
          id
          name
        }
      }
    `,
    { variables: { condition: { _and: [{ name: { _in: Object.keys(nameMap) } }, { is_business: { _eq: true } }] } } },
  )
  const propertyIdMap: { [key: string]: string } = {}
  if (data !== undefined) {
    data.property.map(p => (propertyIdMap[nameMap[p.name]] = p.id))
  }
  return { loadingPropertyIdMap: loading, propertyIdMap, errorPropertyIdMap: error }
}

export default Form.create<RegisterSectionProps>()(RegisterSection)
