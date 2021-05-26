import { useMutation } from '@apollo/react-hooks'
import { Form, Input, message, Modal, Typography } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ModalProps } from 'antd/lib/modal'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useApp } from '../../containers/common/AppContext'
import hasura from '../../hasura'
import { createUploadFn } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { useAuth } from '../auth/AuthContext'
import MessageButton from '../common/MessageButton'
import StyledBraftEditor from '../common/StyledBraftEditor'

type IssueCreationModalProps = ModalProps &
  FormComponentProps & {
    threadId: string
    onRefetch?: () => void
  }
const IssueCreationModal: React.VFC<IssueCreationModalProps> = ({ threadId, form, onRefetch, ...modalProps }) => {
  const { formatMessage } = useIntl()
  const { authToken, apiHost, currentMemberId } = useAuth()
  const { id: appId } = useApp()
  const [insertIssue] = useMutation<hasura.INSERT_ISSUE, hasura.INSERT_ISSUEVariables>(INSERT_ISSUE)

  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error && currentMemberId) {
        insertIssue({
          variables: {
            appId,
            memberId: currentMemberId,
            threadId,
            title: values.title,
            description: values.description.toRAW(),
          },
        })
          .then(() => {
            form.resetFields()
            onRefetch?.()
            setModalVisible(false)
          })
          .catch(err => message.error(err.message))
          .finally(() => setLoading(false))
      }
    })
  }

  if (!currentMemberId) {
    return null
  }

  return (
    <>
      <MessageButton
        onClick={() => setModalVisible(true)}
        memberId={currentMemberId}
        text={formatMessage(commonMessages.button.leaveQuestion)}
      />

      <Modal
        okText={formatMessage(issueMessages.modal.text.ok)}
        style={{ top: 12 }}
        onOk={handleSubmit}
        confirmLoading={loading}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        {...modalProps}
      >
        <Typography.Title level={4}>{formatMessage(issueMessages.form.title.fillQuestion)}</Typography.Title>
        <Form>
          <Form.Item label={formatMessage(commonMessages.label.title)}>
            {form.getFieldDecorator('title', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: formatMessage(issueMessages.form.message.title),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label={formatMessage(issueMessages.form.label.question)}>
            {form.getFieldDecorator('description', {
              initialValue: BraftEditor.createEditorState(null),
              rules: [
                {
                  validator: (rule, value: EditorState, callback) => {
                    value.isEmpty() ? callback(formatMessage(issueMessages.form.validator.enterQuestion)) : callback()
                  },
                },
              ],
            })(
              <StyledBraftEditor
                language="zh-hant"
                controls={[
                  'bold',
                  'italic',
                  'underline',
                  {
                    key: 'remove-styles',
                    title: formatMessage(commonMessages.editor.title.clearStyles),
                  },
                  'separator',
                  'media',
                ]}
                contentClassName="short-bf-content"
                media={{ uploadFn: createUploadFn(appId, authToken, apiHost) }}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const INSERT_ISSUE = gql`
  mutation INSERT_ISSUE($appId: String!, $memberId: String!, $threadId: String!, $title: String, $description: String) {
    insert_issue(
      objects: { app_id: $appId, member_id: $memberId, thread_id: $threadId, title: $title, description: $description }
    ) {
      affected_rows
    }
  }
`

export default Form.create<IssueCreationModalProps>()(IssueCreationModal)
