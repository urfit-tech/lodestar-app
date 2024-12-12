import { Button } from '@chakra-ui/react'
import { Form, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { createUploadFn } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import MemberAvatar from '../common/MemberAvatar'

export const StyledEditor = styled(BraftEditor)`
  .bf-content {
    height: initial;
  }
`
type MessageReplyCreationFormProps = FormComponentProps & {
  onSubmit?: (content: any) => Promise<any>
}
const MessageReplyCreationForm: React.VFC<MessageReplyCreationFormProps> = ({ onSubmit, form }) => {
  const { formatMessage } = useIntl()
  const [replying, setReplying] = useState(false)
  const { currentMemberId, authToken } = useAuth()
  const { id: appId } = useApp()

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error) {
        setReplying(true)
        onSubmit?.(values.content.toRAW())
          .then(() => {
            form.resetFields()
          })
          .catch(err => message.error(err.message))
          .finally(() => setReplying(false))
      }
    })
  }
  return (
    <Form
      onSubmit={e => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <div className="d-flex align-items-center mb-3">
        <MemberAvatar memberId={currentMemberId || ''} withName />
      </div>
      <Form.Item className="mb-1">
        {form.getFieldDecorator('content', {
          initialValue: BraftEditor.createEditorState(null),
          rules: [
            {
              required: true,
              message: formatMessage(issueMessages.message.enterReplyContent),
            },
          ],
        })(
          <StyledEditor
            style={{ border: '1px solid #cdcdcd', borderRadius: '4px' }}
            language="zh-hant"
            placeholder={formatMessage(issueMessages.form.placeholder.reply)}
            controls={['bold', 'italic', 'underline', 'separator', 'media']}
            media={{ uploadFn: createUploadFn(appId, authToken), accepts: { video: false, audio: false } }}
          />,
        )}
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button variant="primary" type="submit" loading={replying}>
          {formatMessage(commonMessages.button.reply)}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create<MessageReplyCreationFormProps>()(MessageReplyCreationForm)
