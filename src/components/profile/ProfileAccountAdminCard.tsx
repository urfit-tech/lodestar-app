import { useApolloClient } from '@apollo/react-hooks'
import { CheckCircleIcon, Icon, WarningIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { commonMessages, profileMessages, settingsMessages } from '../../helpers/translation'
import { GET_MEMBER_EMAIL, GET_MEMBER_USERNAME, useMember, useUpdateMember } from '../../hooks/member'
import { ReactComponent as YouTubeIcon } from '../../images/youtube-icon.svg'
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'
import { default as localProfileMessages } from './translation'

const StyledSocialLogo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gray-lighter);
  font-size: 24px;
  text-align: center;
  line-height: 44px;
`
const StyledText = styled.div`
  line-height: normal;
  margin-top: 0.75rem;

  @media (min-width: 768px) {
    margin-top: 0rem;
    white-space: nowrap;
  }
`

const StyledButton = styled(Button)`
  margin-top: 0.75rem;
  @media (min-width: 768px) {
    margin-top: 0rem;
  }
`

const StyledFormItem = styled(Form.Item)`
  span.ant-form-item-children {
    display: flex;
    align-items: left;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    span.ant-form-item-children {
      flex-direction: row;
    }
  }
`

const UnVerifiedSuffix: React.VFC<{}> = ({}) => {
  const { formatMessage } = useIntl()

  return (
    <div style={{ marginRight: '1rem', color: '#F56565' }}>
      <span style={{ paddingRight: '0.5rem', fontWeight: '500' }}>
        {formatMessage(profileMessages.form.message.emailUnVerified)}
      </span>
      <WarningIcon color="#F56565" />
    </div>
  )
}

const CountDownText: React.VFC<{ email: string; memberId: string }> = ({ email, memberId }) => {
  const { formatMessage } = useIntl()
  const [count, setCount] = useState<number>(30)
  const [showButton, setShowButton] = useState<boolean>(true)

  const { authToken } = useAuth()
  const { id: appId } = useApp()

  useEffect(() => {
    const lastVerificationSent = Number(localStorage.getItem('verifyTime'))
    const currentTime = Math.round(new Date().getTime() / 1000)
    const seconds = currentTime - lastVerificationSent

    if (seconds > 30) {
      setCount(30)
      setShowButton(true)
      localStorage.removeItem('verifyTime')
      return () => {}
    } else {
      setCount(30 - seconds)
      setShowButton(false)
      const initialInterval = setInterval(() => {
        setCount(currentTime => --currentTime)
      }, 1000)

      const initialTimeout = setTimeout(() => {
        clearInterval(initialInterval)
        setShowButton(true)
        setCount(30)
        localStorage.removeItem('verifyTime')
      }, 1000 * (30 - seconds))

      return () => {
        clearInterval(initialInterval)
        clearTimeout(initialTimeout)
        setShowButton(true)
      }
    }
  }, [])

  const handleClick = () => {
    const currentTime = Math.round(new Date().getTime() / 1000)
    localStorage.setItem('verifyTime', currentTime.toString())
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/auth/request-email-verification`,
        {
          appId,
          memberId,
          email,
        },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      .then(({ data: { code } }) => {
        message.success(formatMessage(localProfileMessages.ProfileAccountAdminCard.sendVerifiedEmailSuccessfully))
        setShowButton(false)

        const interval = setInterval(() => {
          setCount(currentCount => --currentCount)
        }, 1000)

        const timeout = setTimeout(() => {
          clearInterval(interval)
          setShowButton(true)
          setCount(30)
          localStorage.removeItem('currentTime')
        }, 1000 * 30)
        // cleanup
        return () => {
          clearInterval(interval)
          clearTimeout(timeout)
          setShowButton(true)
        }
      })
      .catch(handleError)
  }

  return (
    <div className="d-flex ml-2 align-items-center">
      {showButton ? (
        <StyledButton colorScheme="teal" variant="link" onClick={handleClick}>
          {formatMessage(localProfileMessages.ProfileAccountAdminCard.sendEmail)}
        </StyledButton>
      ) : (
        <StyledText>{formatMessage(localProfileMessages.ProfileAccountAdminCard.sendEmailAfter, { count })}</StyledText>
      )}
    </div>
  )
}

type ProfileAccountAdminCardProps = CardProps &
  FormComponentProps & {
    memberId: string
  }
const ProfileAccountAdminCard: React.VFC<ProfileAccountAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { id: appId, enabledModules, settings } = useApp()
  const apolloClient = useApolloClient()
  const { member } = useMember(memberId)
  const updateMember = useUpdateMember()
  const [usernameIsChanged, setUsernameIsChanged] = useState(false)
  const [emailIsChanged, setEmailIsChanged] = useState(false)

  const isYouTubeConnected = member?.youtubeChannelIds !== null
  const isVerifiedCurrentEmail = member?.verifiedEmails?.includes(member.email)

  const handleSubmit = () => {
    form.validateFields(async (error, values) => {
      if (error || !member) {
        return
      }

      const { data: dataEmail } = await apolloClient.query<hasura.GET_MEMBER_EMAIl, hasura.GET_MEMBER_EMAIlVariables>({
        query: GET_MEMBER_EMAIL,
        variables: { appId, email: values._email.trim().toLowerCase() },
        fetchPolicy: 'no-cache',
      })
      const { data: dataUsername } = await apolloClient.query<
        hasura.GET_MEMBER_USERNAME,
        hasura.GET_MEMBER_USERNAMEVariables
      >({
        query: GET_MEMBER_USERNAME,
        variables: { appId, username: values.username.trim().toLowerCase() },
        fetchPolicy: 'no-cache',
      })

      if (dataUsername.member.length >= 1 && usernameIsChanged) {
        message.error(formatMessage(commonMessages.text.usernameIsAlreadyExist))
        return
      }

      if (dataEmail.member.length >= 1 && emailIsChanged) {
        message.error(formatMessage(commonMessages.text.emailIsAlreadyExist))
        return
      }

      updateMember({
        variables: {
          memberId,
          email: values._email.trim().toLowerCase(),
          username: values.username,
          name: member.name,
          pictureUrl: member.pictureUrl,
          description: member.description,
        },
      })
        .then(() => {
          message.success(formatMessage(commonMessages.event.successfullySaved))
          setUsernameIsChanged(false)
          setEmailIsChanged(false)
        })
        .catch(err => message.error(err.message))
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(settingsMessages.title.profile)}
      </Typography.Title>

      <StyledForm
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 9 } }}
      >
        <Form.Item label={formatMessage(commonMessages.label.username)} style={{}}>
          {form.getFieldDecorator('username', {
            initialValue: member && member.username,
            getValueFromEvent: e => {
              member?.username === e.target.value ? setUsernameIsChanged(false) : setUsernameIsChanged(true)
              return e.target.value
            },
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.username),
              },
            ],
          })(<MigrationInput />)}
        </Form.Item>
        <StyledFormItem label={formatMessage(commonMessages.label.email)} className="d-flex">
          {form.getFieldDecorator('_email', {
            initialValue: member && member.email,
            getValueFromEvent: e => {
              member?.email === e.target.value ? setEmailIsChanged(false) : setEmailIsChanged(true)
              return e.target.value
            },
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.email),
              },
            ],
          })(
            <MigrationInput
              suffix={
                settings['feature.email_verification.enabled'] === '1' &&
                (isVerifiedCurrentEmail ? <CheckCircleIcon color="#4ed1b3" /> : <UnVerifiedSuffix />)
              }
              suffixWidth={
                settings['feature.email_verification.enabled'] === '1' && isVerifiedCurrentEmail ? undefined : 'auto'
              }
            />,
          )}
          {settings['feature.email_verification.enabled'] === '1' && !isVerifiedCurrentEmail && (
            <CountDownText email={form.getFieldValue('_email').trim().toLowerCase()} memberId={memberId} />
          )}
        </StyledFormItem>

        {enabledModules.social_connect && (
          <Form.Item label={formatMessage(profileMessages.form.label.socialConnect)}>
            <div className="d-flex align-items-center justify-content-between">
              <StyledSocialLogo className="flex-shrink-0 mr-3">
                <Icon as={YouTubeIcon} />
              </StyledSocialLogo>
              <StyledText className="flex-grow-1 mr-3">
                {isYouTubeConnected
                  ? formatMessage(profileMessages.form.message.socialConnected, { site: 'YouTube' })
                  : formatMessage(profileMessages.form.message.socialUnconnected, { site: 'YouTube' })}
              </StyledText>
              {!isYouTubeConnected && (
                <a
                  href={'https://accounts.google.com/o/oauth2/v2/auth?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{SCOPE}}&state={{STATE}}&response_type=token'
                    .replace('{{CLIENT_ID}}', `${settings['auth.google_client_id']}`)
                    .replace('{{REDIRECT_URI}}', `https://${window.location.hostname}/oauth2`)
                    .replace('{{SCOPE}}', 'https://www.googleapis.com/auth/youtubepartner-channel-audit')
                    .replace(
                      '{{STATE}}',
                      JSON.stringify({
                        provider: 'google',
                        redirect: window.location.pathname + window.location.search,
                      }),
                    )}
                >
                  <Button>{formatMessage(commonMessages.button.socialConnect)}</Button>
                </a>
              )}
            </div>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button variant="outline" className="mr-2" onClick={() => form.resetFields()}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" type="submit">
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfileAccountAdminCardProps>()(ProfileAccountAdminCard)
