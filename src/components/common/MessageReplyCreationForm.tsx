import { useApolloClient } from '@apollo/client'
import { Button } from '@chakra-ui/react'
import { Form, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { createUploadFn } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import MemberAvatar from '../common/MemberAvatar'
import {
  getTheNextReplyNotFromAuthorOfIssue,
  Issue,
  IssueReply,
  pollUntilTheNextReplyNotFromAuthorOfIssueUpdated,
  RefetchIssueReply,
} from '../issue/issueHelper'

export const StyledEditor = styled(BraftEditor)`
  .bf-content {
    height: initial;
  }
`
type MessageReplyCreationFormProps = FormComponentProps & {
  issue: Issue
  onRefetch: RefetchIssueReply
  onSubmit?: (content: any) => Promise<{ data: hasura.INSERT_ISSUE_REPLY }>
  replyEditorDisabled: boolean
}
const MessageReplyCreationForm: React.FC<MessageReplyCreationFormProps> = ({
  issue,
  onRefetch,
  onSubmit,
  form,
  replyEditorDisabled,
}) => {
  const { formatMessage } = useIntl()
  const [replying, setReplying] = useState(false)
  const { currentMemberId, authToken } = useAuth()
  const { id: appId } = useApp()
  const { settings } = useApp()
  const { id: issueId, memberId } = issue
  const apolloClient = useApolloClient()

  const conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated = (issueReplyId: string) => {
    if (settings['program_issue.prompt_reply'] && onRefetch) {
      const getTargetReply = (issueReplies: IssueReply[]) =>
        getTheNextReplyNotFromAuthorOfIssue(memberId)(issueReplies)(issueReplyId)
      const cond = (now: Date) => (issueReplies: IssueReply[]) =>
        !getTargetReply(issueReplies) || (getTargetReply(issueReplies)?.updatedAt ?? 0) < now
      pollUntilTheNextReplyNotFromAuthorOfIssueUpdated(apolloClient)(issueId)(cond)(onRefetch)
    }
  }

  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error) {
        setReplying(true)
        onSubmit?.(values.content.toRAW())
          .then(res => {
            form.resetFields()
            onRefetch?.()
            conditionallyPollUntilTheNextReplyNotFromAuthorOfIssueUpdated(
              res.data.insert_issue_reply?.returning?.[0]?.id,
            )
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
            media={{
              uploadFn: createUploadFn(appId, authToken),
              accepts: { video: false, audio: false },
              externals: { image: true, video: false, audio: false, embed: true },
            }}
            readOnly={replyEditorDisabled}
          />,
        )}
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button variant="primary" type="submit" loading={replying} disabled={replyEditorDisabled}>
          {formatMessage(commonMessages.button.reply)}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create<MessageReplyCreationFormProps>()(MessageReplyCreationForm)
