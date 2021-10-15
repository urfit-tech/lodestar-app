import { Button } from '@chakra-ui/react'
import { Dropdown, Icon, Menu, message, Tag } from 'antd'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { createUploadFn, rgba } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { useMutateIssueReply } from '../../hooks/issue'
import { ProductRoleName } from '../../types/general'
import { ProgramRole } from '../../types/program'
import MemberAvatar from '../common/MemberAvatar'
import ProductRoleFormatter from '../common/ProductRoleFormatter'
import { BraftContent } from '../common/StyledBraftEditor'
import { StyledEditor } from './IssueReplyCreationBlock'

const IssueReplyContentBlock = styled.div`
  padding: 1rem;
  background: #f7f8f8;
  border-radius: 0.5rem;
  transition: background-color 1s ease-in-out;
`
const StyledIssueReplyItem = styled.div`
  transition: background-color 1s ease-in-out;

  &.focus {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  }
  &.focus ${IssueReplyContentBlock} {
    background: none;
  }
`
const StyledAction = styled.span<{ reacted?: boolean }>`
  padding: 0;
  color: ${props => (props.reacted ? props.theme['@primary-color'] : props.theme['@text-color-secondary'])};
  cursor: pointer;
`
const StyledTag = styled(Tag)`
  border: 0;
`

const IssueReplyItem: React.VFC<{
  programRoles: ProgramRole[]
  issueReplyId: string
  content: string
  reactedMemberIds: string[]
  createdAt: Date
  memberId: string
  onRefetch?: () => void
}> = ({ programRoles, issueReplyId, content, reactedMemberIds, createdAt, memberId, onRefetch }) => {
  const { formatMessage } = useIntl()
  const [qIssueReplyId] = useQueryParam('issueReplyId', StringParam)
  const theme = useAppTheme()
  const { currentMemberId, authToken } = useAuth()
  const { id: appId } = useApp()

  const { insertIssueReplyReaction, deleteIssueReply, updateIssueReply, deleteIssueReplyReaction } =
    useMutateIssueReply(issueReplyId)

  const [editing, setEditing] = useState(false)
  const [focus, setFocus] = useState(qIssueReplyId === issueReplyId)
  const [contentState, setContentState] = useState(BraftEditor.createEditorState(content))
  const [reacted, setReacted] = useState(false)

  const otherReactedMemberIds = reactedMemberIds.filter(id => id !== currentMemberId).length

  useEffect(() => {
    if (currentMemberId && reactedMemberIds.includes(currentMemberId)) {
      setReacted(true)
    }
  }, [currentMemberId, reactedMemberIds])

  const toggleReaction = async (reacted: boolean) => {
    reacted ? await deleteIssueReplyReaction() : await insertIssueReplyReaction()
    onRefetch?.()
  }

  return (
    <StyledIssueReplyItem
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
        <div className="d-flex align-items-center">
          <MemberAvatar
            memberId={memberId}
            renderText={() =>
              programRoles &&
              programRoles
                .filter(role => role.memberId === memberId)
                .map(role =>
                  role.name === 'instructor' ? (
                    <StyledTag key={role.id} color={theme.colors.primary[500]} className="ml-2 mr-0">
                      <ProductRoleFormatter value={role.name as ProductRoleName} />
                    </StyledTag>
                  ) : role.name === 'assistant' ? (
                    <StyledTag key={role.id} color={theme['@processing-color']} className="ml-2 mr-0">
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
                  {formatMessage(issueMessages.dropdown.content.edit)}
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    window.confirm(formatMessage(issueMessages.dropdown.content.unrecoverable)) &&
                    deleteIssueReply().then(() => onRefetch?.())
                  }
                >
                  {formatMessage(issueMessages.dropdown.content.delete)}
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Icon type="more" />
          </Dropdown>
        )}
      </div>

      <IssueReplyContentBlock>
        <div className="mb-3">
          {editing ? (
            <>
              <StyledEditor
                value={contentState}
                onChange={value => setContentState(value)}
                controls={['bold', 'italic', 'underline', 'separator', 'media']}
                media={{ uploadFn: createUploadFn(appId, authToken) }}
              />
              <div>
                <Button variant="outline" className="mr-2" onClick={() => setEditing(false)}>
                  {formatMessage(commonMessages.ui.cancel)}
                </Button>
                <Button
                  colorScheme="primary"
                  onClick={() =>
                    updateIssueReply({
                      variables: { issueReplyId, content: contentState.toRAW() },
                    })
                      .then(() => {
                        onRefetch?.()
                        setEditing(false)
                      })
                      .catch(err => message.error(formatMessage(issueMessages.messageError.update)))
                  }
                >
                  {formatMessage(commonMessages.button.save)}
                </Button>
              </div>
            </>
          ) : (
            <BraftContent>{content}</BraftContent>
          )}
        </div>

        <div>
          <StyledAction
            onClick={() => {
              setReacted(!reacted)
              toggleReaction(reacted)
            }}
            reacted={reacted}
          >
            <Icon className="mr-1" type="heart" theme={reacted ? 'filled' : 'outlined'} />
            <span>{reacted ? otherReactedMemberIds + 1 : otherReactedMemberIds}</span>
          </StyledAction>
        </div>
      </IssueReplyContentBlock>
    </StyledIssueReplyItem>
  )
}

export default IssueReplyItem
