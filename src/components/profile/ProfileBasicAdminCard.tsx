import { Button } from '@chakra-ui/react'
import { Form, Input, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { commonMessages, profileMessages } from '../../helpers/translation'
import { useMember, useUpdateMember } from '../../hooks/member'
import AdminCard from '../common/AdminCard'
import { AvatarImage } from '../common/Image'
import SingleUploader from '../common/SingleUploader'
import { StyledForm } from '../layout'

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-children {
    display: flex;
    align-items: center;
  }

  .ant-upload.ant-upload-select-picture-card {
    border: none;
    background: none;
  }
`

type ProfileBasicAdminCardProps = CardProps &
  FormComponentProps & {
    memberId: string
  }
const ProfileBasicAdminCard: React.VFC<ProfileBasicAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { id: appId } = useApp()
  const { member } = useMember(memberId)
  const updateMember = useUpdateMember()
  const { formatMessage } = useIntl()

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error && member) {
        updateMember({
          variables: {
            memberId,
            email: member.email.trim().toLowerCase(),
            username: member.username,
            name: values.name,
            pictureUrl: values.picture
              ? `https://${process.env.REACT_APP_S3_BUCKET}/avatars/${appId}/${memberId}`
              : member.pictureUrl,
            description: values.description,
          },
        })
          .then(() => {
            message.success(formatMessage(commonMessages.event.successfullySaved))
            window.location.reload(true)
          })
          .catch(err => message.error(err.message))
      }
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(profileMessages.title.basicInfo)}
      </Typography.Title>
      <StyledForm
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
      >
        <StyledFormItem label={formatMessage(profileMessages.form.label.avatar)}>
          <div className="mr-3">
            <AvatarImage src={(member && member.pictureUrl) || ''} size={128} />
          </div>
          {form.getFieldDecorator('picture')(
            <SingleUploader
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              path={`avatars/${appId}/${memberId}`}
              onSuccess={handleSubmit}
              isPublic={true}
            />,
          )}
        </StyledFormItem>
        <Form.Item label={formatMessage(profileMessages.form.label.name)}>
          {form.getFieldDecorator('name', {
            initialValue: member && member.name,
            rules: [
              {
                required: true,
                message: formatMessage(profileMessages.form.message.enterName),
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={formatMessage(profileMessages.form.message.intro)}>
          {form.getFieldDecorator('description', {
            initialValue: member && member.description,
          })(<Input.TextArea rows={5} />)}
        </Form.Item>
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

export default Form.create<ProfileBasicAdminCardProps>()(ProfileBasicAdminCard)
