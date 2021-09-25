import { Button } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
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
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'

type ProfilePasswordAdminCardProps = CardProps & FormComponentProps & { memberId: string }
const ProfilePasswordAdminCard: React.VFC<ProfilePasswordAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        setLoading(true)
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/change-password`,
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
          })(<MigrationInput type="password" />)}
        </Form.Item>
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.newPassword)}>
          {form.getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: formatMessage(settingsMessages.profile.form.message.newPassword),
              },
            ],
          })(<MigrationInput type="password" />)}
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
          })(<MigrationInput type="password" />)}
        </Form.Item>
        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button variant="outline" className="mr-2" onClick={() => form.resetFields()}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfilePasswordAdminCardProps>()(ProfilePasswordAdminCard)
