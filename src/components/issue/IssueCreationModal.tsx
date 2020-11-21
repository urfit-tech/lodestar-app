import { useMutation } from '@apollo/react-hooks'
import { Button, Form, Icon, Input, message, Modal, Typography } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ModalProps } from 'antd/lib/modal'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import StyledBraftEditor from '../common/StyledBraftEditor'

const StyledButton = styled(Button)`
  height: initial;
  font-size: 14px;
`

type IssueCreationModalProps = ModalProps &
  FormComponentProps & {
    threadId: string
    memberId: string
    onSubmit?: () => void
  }
const IssueCreationModal: React.FC<IssueCreationModalProps> = ({
  threadId,
  form,
  memberId,
  onSubmit,
  ...modalProps
}) => {
  const { formatMessage } = useIntl()
  const { authToken, backendEndpoint } = useAuth()
  const { id: appId } = useApp()
  const [insertIssue] = useMutation<types.INSERT_ISSUE, types.INSERT_ISSUEVariables>(INSERT_ISSUE)

  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error) {
        insertIssue({
          variables: {
            appId,
            memberId,
            threadId,
            title: values.title,
            description: values.description.toRAW(),
          },
        })
          .then(() => {
            form.resetFields()
            onSubmit && onSubmit()
            setModalVisible(false)
          })
          .catch(err => message.error(err.message))
          .finally(() => setLoading(false))
      }
    })
  }

  return (
    <>
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
          <Form.Item label={formatMessage(issueMessages.form.label.title)}>
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
                media={{ uploadFn: createUploadFn(appId, authToken, backendEndpoint) }}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>

      <StyledButton
        block
        className="d-flex justify-content-between align-items-center mb-5 p-4"
        onClick={() => setModalVisible(true)}
      >
        <span className="d-flex align-items-center">
          <span className="mr-2">{memberId && <MemberAvatar memberId={memberId} />}</span>
          <span className="ml-1">{formatMessage(commonMessages.button.leaveQuestion)}</span>
        </span>
        <Icon type="edit" />
      </StyledButton>
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
