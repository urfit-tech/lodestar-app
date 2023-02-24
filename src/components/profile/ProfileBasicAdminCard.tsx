import { Button, Textarea } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import StyledBraftEditor from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { braftLanguageFn, createUploadFn, uploadFile } from '../../helpers'
import { commonMessages, profileMessages } from '../../helpers/translation'
import { useMember, useUpdateMember } from '../../hooks/member'
import AdminCard from '../common/AdminCard'
import ImageUploader from '../common/ImageUploader'
import MigrationInput from '../common/MigrationInput'

export const StyledForm = styled(Form)`
  .ant-row {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .ant-row {
      flex-direction: row;
    }
  }
`

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

const StyledUploadWarning = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  height: 100%;
`

type ProfileBasicAdminCardProps = CardProps &
  FormComponentProps & {
    memberId: string
  }

const ProfileBasicAdminCard: React.VFC<ProfileBasicAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const { member, refetchMember } = useMember(memberId)
  const updateMember = useUpdateMember()
  const { formatMessage } = useIntl()
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    const avatarId = uuid()
    form.validateFields(async (error, values) => {
      if (!error && member) {
        if (avatarImageFile) {
          await uploadFile(`avatars/${appId}/${memberId}/${avatarId}`, avatarImageFile, authToken)
        }
        await updateMember({
          variables: {
            memberId,
            email: member.email.trim().toLowerCase(),
            username: member.username,
            name: values.name,
            pictureUrl: avatarImageFile
              ? `https://${process.env.REACT_APP_S3_BUCKET}/avatars/${appId}/${memberId}/${avatarId}`
              : member.pictureUrl,
            title: values.title,
            abstract: values.abstract,
            description: values.description.toRAW(),
          },
        })
          .then(() => {
            message.success(formatMessage(commonMessages.event.successfullySaved))
            refetchMember?.()
            setAvatarImageFile(null)
          })
          .catch(err => message.error(err.message))
          .finally(() => setLoading(false))
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
          {member && (
            <>
              <ImageUploader
                imgUrl={member.pictureUrl}
                file={avatarImageFile}
                customStyle={{ shape: 'circle', width: '128px', ratio: 1 }}
                customButtonStyle={{ width: '80%' }}
                onChange={file => setAvatarImageFile(file)}
              />
              {avatarImageFile && <StyledUploadWarning className="ml-2">* 尚未上傳</StyledUploadWarning>}
            </>
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
          })(<MigrationInput />)}
        </Form.Item>
        <Form.Item label={formatMessage(profileMessages.form.message.title)}>
          {form.getFieldDecorator('title', {
            initialValue: member && member.title,
          })(<MigrationInput />)}
        </Form.Item>
        <Form.Item label={formatMessage(profileMessages.form.message.abstract)}>
          {form.getFieldDecorator('abstract', {
            initialValue: member && member.abstract,
            rules: [{ max: 100 }],
          })(<Textarea rows={2} placeholder={formatMessage(profileMessages.form.message.abstractPlaceHolder)} />)}
        </Form.Item>
        <Form.Item label={formatMessage(profileMessages.form.message.intro)} wrapperCol={{ md: { span: 20 } }}>
          {form.getFieldDecorator('description', {
            initialValue: member && BraftEditor.createEditorState(member.description),
          })(
            <StyledBraftEditor
              language={braftLanguageFn}
              controls={[
                'headings',
                'font-size',
                'line-height',
                'text-color',
                'bold',
                'italic',
                'underline',
                'strike-through',
                'remove-styles',
                'separator',
                'text-align',
                'separator',
                'list-ol',
                'list-ul',
                'blockquote',
                'code',
                'separator',
                'media',
                'link',
                'hr',
                'separator',
                'fullscreen',
              ]}
              media={{ uploadFn: createUploadFn(appId, authToken) }}
              placeholder={formatMessage(profileMessages.form.message.introPlaceHolder)}
            />,
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => {
              setAvatarImageFile(null)
              form.resetFields()
            }}
          >
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" type="submit" isLoading={loading} _hover={{}}>
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfileBasicAdminCardProps>()(ProfileBasicAdminCard)
