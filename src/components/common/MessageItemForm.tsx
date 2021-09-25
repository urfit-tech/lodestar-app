import { Button } from '@chakra-ui/react'
import { Form, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor, { EditorState } from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { createUploadFn } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { StyledEditor } from './MessageReplyCreationForm'

type MessageItemFormProps = FormComponentProps & {
  description: string
  title?: string
  onSubmit?: (values: { description: EditorState; title?: string }) => Promise<any>
  onEditing?: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageItemForm: React.VFC<MessageItemFormProps> = ({ title, description, form, onSubmit, onEditing }) => {
  const { authToken } = useAuth()
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const handleSubmit = () =>
    form.validateFieldsAndScroll((error, { title, description }) => {
      if (!error) {
        onSubmit?.({ title, description })
      }
    })

  return (
    <Form
      onSubmit={e => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      {title && <Form.Item>{form.getFieldDecorator('title', { initialValue: title })(<Input />)}</Form.Item>}
      <Form.Item>
        {form.getFieldDecorator('description', {
          initialValue: BraftEditor.createEditorState(description),
        })(
          <StyledEditor
            controls={['bold', 'italic', 'underline', 'separator', 'media']}
            media={{ uploadFn: createUploadFn(appId, authToken) }}
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button variant="outline" className="mr-2" onClick={() => onEditing?.(false)}>
          {formatMessage(commonMessages.ui.cancel)}
        </Button>
        <Button variant="primary" type="submit">
          {formatMessage(commonMessages.button.save)}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create<MessageItemFormProps>()(MessageItemForm)
