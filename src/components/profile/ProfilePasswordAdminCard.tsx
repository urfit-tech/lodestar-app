import { Button, Form, Input, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import React, { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import { handleError } from '../../helpers'
import {
  codeMessages,
  commonMessages,
  productMessages,
  profileMessages,
  settingsMessages,
} from '../../helpers/translation'
import { useAuth } from '../auth/AuthContext'
import AdminCard from '../common/AdminCard'
import { StyledForm } from '../layout'

type ProfilePasswordAdminCardProps = CardProps & FormComponentProps & { memberId: string }
const ProfilePasswordAdminCard: React.FC<ProfilePasswordAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken, apiHost } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        setLoading(true)
        axios
          .post(
            `${window.location.protocol}//${apiHost}/auth/change-password`,
            {
              password: values.password,
              newPassword: values.newPassword,
            },
            {
              headers: { authorization: `Bearer ${authToken}` },
            },
          )
          .then(({ data: { code } }) => {
            if (code === 'SUCCESS') {
              message.success(formatMessage(commonMessages.message.success.passwordUpdate))
            } else {
              message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
            }
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      }
    })
  }
  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(productMessages.program.title.changePassword)}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.currentPassword)}>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage(profileMessages.form.message.currentPassword),
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.newPassword)}>
          {form.getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: formatMessage(settingsMessages.profile.form.message.newPassword),
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.confirmation)}>
          {form.getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: formatMessage(settingsMessages.profile.form.message.confirmation),
              },
              {
                validator: (rule, value, callback) => {
                  if (value && form.getFieldValue('newPassword') !== value) {
                    callback(new Error(formatMessage(settingsMessages.profile.form.validator.password)))
                  }
                  callback()
                },
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button className="mr-2" onClick={() => form.resetFields()}>
            {formatMessage(commonMessages.button.cancel)}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfilePasswordAdminCardProps>()(ProfilePasswordAdminCard)
