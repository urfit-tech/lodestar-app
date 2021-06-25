import { Button } from '@chakra-ui/react'
import { Dropdown, Form, Icon, Input, Menu, message, Tag, Typography } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { ThemeContext } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn, rgba } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { useMutateIssue } from '../../hooks/issue'
import { ProductRoleName } from '../../types/general'
import { ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import ProductRoleFormatter from '../common/ProductRoleFormatter'
import { BraftContent } from '../common/StyledBraftEditor'
import IssueReplyCollectionBlock from './IssueReplyCollectionBlock'
import { StyledEditor } from './IssueReplyCreationBlock'

const StyledIssueItem = styled.div`
  position: relative;
  background: none;
  transition: background-color 1s ease-in-out;

  &.focus {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  }
`
const IssueContentBlock = styled.div`
  padding-left: 48px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`
const StyledAction = styled.span<{ reacted?: boolean }>`
  padding: 0;
  color: ${props => (props.reacted ? props.theme['@primary-color'] : props.theme['@text-color-secondary'])};
  cursor: pointer;
`
const IssueState = styled(Typography.Text)`
  text-align: right;
  font-size: 12px;
  line-height: 44px;
`
const StyledTag = styled(Tag)<{ variant?: string }>`
  &.ant-tag-has-color {
    ${props => (props.variant && props.variant === 'assistant' ? `color: ${props.theme['@primary-color']};` : '')}
  }
`

type IssueItemProps = FormComponentProps & {
  programRoles: ProgramRoleProps[]
  issueId: string
  title: string
  description: string
  reactedMemberIds: string[]
  numReplies: number
  createdAt: Date
  memberId: string
  solvedAt: Date
  onRefetch?: () => void
  defaultRepliesVisible?: boolean
  showSolvedCheckbox?: boolean
}
const IssueItem: React.VFC<IssueItemProps> = ({
  form,
  programRoles,
  issueId,
  title,
  description,
  reactedMemberIds,
  numReplies,
  createdAt,
  memberId,
  solvedAt,
  onRefetch,
  defaultRepliesVisible,
  showSolvedCheckbox,
}) => {
  const { formatMessage } = useIntl()
  const [qIssueId] = useQueryParam('issueId', StringParam)
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const { currentMemberId, authToken, apiHost } = useAuth()
  const { id: appId } = useApp()
  const theme = useContext(ThemeContext)

  const { deleteIssue, updateIssue, insertIssueReaction, deleteIssueReaction } = useMutateIssue(issueId)

  const [editing, setEditing] = useState(false)
  const [focus, setFocus] = useState(!qIssueReplyId && qIssueId === issueId)
  const [repliesVisible, setRepliesVisible] = useState(defaultRepliesVisible)
  const [reacted, setReacted] = useState(false)

  const otherReactedMemberIds = reactedMemberIds.filter(id => id !== currentMemberId).length

  useEffect(() => {
    if (currentMemberId && reactedMemberIds.includes(currentMemberId)) {
      setReacted(true)
    } else {
      setReacted(false)
    }
  }, [currentMemberId, reactedMemberIds])

  const toggleReaction = async (reacted: boolean) => {
    reacted ? await deleteIssueReaction() : await insertIssueReaction()

    onRefetch?.()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        updateIssue({
          title: values.title,
          description: values.description.toRAW(),
        })
          .then(() => {
            setEditing(false)
            onRefetch?.()
          })
          .catch(err => message.error(formatMessage(issueMessages.messageError.question)))
      }
    })
  }

  return (
    <StyledIssueItem
      className={focus ? 'focus' : ''}
      ref={ref => {
        if (ref && focus) {
          ref.scrollIntoView()
          setTimeout(() => {
            setFocus(false)
          }, 1000)
        }
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center justify-content-center">
          <MemberAvatar
            memberId={memberId}
            renderText={() =>
              programRoles &&
              programRoles
                .filter(role => role.memberId === memberId)
                .map(role =>
                  role.name === 'instructor' ? (
                    <StyledTag key={role.id} color={theme['@primary-color']} className="ml-2 mr-0">
                      <ProductRoleFormatter value={role.name as ProductRoleName} />
                    </StyledTag>
                  ) : role.name === 'assistant' ? (
                    <StyledTag
                      key={role.id}
                      color={theme['@processing-color']}
                      className="ml-2 mr-0"
                      variant="assistant"
                    >
                      <ProductRoleFormatter value={role.name as ProductRoleName} />
                    </StyledTag>
                  ) : null,
                )
            }
            withName
          />
          <span className="ml-2" style={{ fontSize: '12px', color: '#9b9b9b' }}>
            {moment(createdAt).fromNow()}
          </span>
        </div>

        {memberId === currentMemberId && !editing && (
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu>
                <Menu.Item onClick={() => setEditing(true)}>
                  {formatMessage(issueMessages.dropdown.content.editQuestion)}
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    window.confirm(formatMessage(issueMessages.dropdown.content.confirmMessage)) &&
                    deleteIssue().then(() => onRefetch?.())
                  }
                >
                  {formatMessage(issueMessages.dropdown.content.delete)}
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    updateIssue({
                      title,
                      description,
                      solvedAt: solvedAt ? undefined : new Date(),
                    }).then(() => onRefetch?.())
                  }
                >
                  {formatMessage(issueMessages.content.markAs)}
                  {solvedAt
                    ? formatMessage(issueMessages.dropdown.content.unsolved)
                    : formatMessage(issueMessages.dropdown.content.solved)}
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Icon type="more" />
          </Dropdown>
        )}
      </div>

      <IssueContentBlock>
        {editing ? (
          <Form onSubmit={handleSubmit}>
            <Form.Item>{form.getFieldDecorator('title', { initialValue: title })(<Input />)}</Form.Item>
            <Form.Item>
              {form.getFieldDecorator('description', {
                initialValue: BraftEditor.createEditorState(description),
              })(
                <StyledEditor
                  controls={['bold', 'italic', 'underline', 'separator', 'media']}
                  media={{ uploadFn: createUploadFn(appId, authToken, apiHost) }}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button variant="outline" className="mr-2" onClick={() => setEditing(false)}>
                {formatMessage(commonMessages.ui.cancel)}
              </Button>
              <Button variant="primary" type="submit">
                {formatMessage(commonMessages.button.save)}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <Typography.Text strong className="mb-2" style={{ fontSize: '16px' }}>
              {title}
            </Typography.Text>
            <div style={{ fontSize: '14px' }}>
              <BraftContent>{description}</BraftContent>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <StyledAction
              className="mr-3"
              onClick={() => {
                setReacted(!reacted)
                toggleReaction(reacted)
              }}
              reacted={reacted}
            >
              <Icon type="heart" theme={reacted ? 'filled' : 'outlined'} className="mr-1" />
              <span>{reacted ? otherReactedMemberIds + 1 : otherReactedMemberIds}</span>
            </StyledAction>
            <StyledAction onClick={() => setRepliesVisible(!repliesVisible)}>
              <Icon type="message" className="mr-1" />
              <span>{numReplies}</span>
            </StyledAction>
          </div>
          <div>
            {!showSolvedCheckbox && (
              <IssueState type="secondary">
                {solvedAt
                  ? formatMessage(issueMessages.dropdown.content.solved)
                  : formatMessage(issueMessages.dropdown.content.unsolved)}
              </IssueState>
            )}
          </div>
        </div>

        {repliesVisible && <IssueReplyCollectionBlock programRoles={programRoles} issueId={issueId} />}
      </IssueContentBlock>
    </StyledIssueItem>
  )
}

export default Form.create<IssueItemProps>()(IssueItem)
