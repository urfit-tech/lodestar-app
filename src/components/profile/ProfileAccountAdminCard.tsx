import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { Form, Input, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { commonMessages, profileMessages, settingsMessages } from '../../helpers/translation'
import { useMember, useUpdateMember } from '../../hooks/member'
import { ReactComponent as YouTubeIcon } from '../../images/youtube-icon.svg'
import AdminCard from '../common/AdminCard'
import { StyledForm } from '../layout'

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
`

type ProfileAccountAdminCardProps = CardProps &
  FormComponentProps & {
    memberId: string
  }
const ProfileAccountAdminCard: React.VFC<ProfileAccountAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { enabledModules, settings } = useApp()
  const { member } = useMember(memberId)
  const updateMember = useUpdateMember()

  const isYouTubeConnected = member?.youtubeChannelIds !== null

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (error || !member) {
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
        .then(() => message.success(formatMessage(commonMessages.event.successfullySaved)))
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
        <Form.Item label={formatMessage(commonMessages.label.username)}>
          {form.getFieldDecorator('username', {
            initialValue: member && member.username,
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.username),
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={formatMessage(commonMessages.label.email)}>
          {form.getFieldDecorator('_email', {
            initialValue: member && member.email,
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.email),
              },
            ],
          })(<Input />)}
        </Form.Item>

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
                        redirect: window.location.pathname,
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
