import { Button } from '@chakra-ui/react'
import { Dropdown, Icon, Menu, Tag } from 'antd'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { createUploadFn, rgba } from '../../helpers'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { ProductRoleName } from '../../types/general'
import { ProgramRoleName } from '../../types/program'
import MemberAvatar from './MemberAvatar'
import { StyledEditor } from './MessageReplyCreationForm'
import ProductRoleFormatter from './ProductRoleFormatter'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'

const MessageReplyContentBlock = styled.div`
  padding: 1rem;
  background: #f7f8f8;
  border-radius: 0.5rem;
  transition: background-color 1s ease-in-out;
`
const StyledMessageReplyItem = styled.div`
  transition: background-color 1s ease-in-out;

  &.focus {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  }
  &.focus ${MessageReplyContentBlock} {
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

const MessageReplyItem: React.FC<{
  content: string
  createdAt: Date
  memberId: string
  roleName: ProgramRoleName
  onRefetch?: () => void
}> = ({ content, createdAt, memberId, roleName, onRefetch }) => {
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  const { currentMemberId, authToken } = useAuth()
  const { id: appId } = useApp()

  const [editing, setEditing] = useState(false)
  const [contentState, setContentState] = useState(BraftEditor.createEditorState(content))
  const [reacted, setReacted] = useState(false)

  return (
    <StyledMessageReplyItem>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <MemberAvatar
            memberId={memberId}
            renderText={() =>
              roleName === 'instructor' ? (
                <StyledTag color={theme.colors.primary[500]} className="ml-2 mr-0">
                  <ProductRoleFormatter value={roleName as ProductRoleName} />
                </StyledTag>
              ) : roleName === 'assistant' ? (
                <StyledTag color={theme['@processing-color']} className="ml-2 mr-0">
                  <ProductRoleFormatter value={roleName as ProductRoleName} />
                </StyledTag>
              ) : null
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
                <Menu.Item onClick={() => window.confirm(formatMessage(issueMessages.dropdown.content.unrecoverable))}>
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

      <MessageReplyContentBlock>
        <div className="mb-3">
          {editing ? (
            <>
              <StyledEditor
                value={contentState}
                onChange={value => setContentState(value)}
                controls={['bold', 'italic', 'underline', 'separator', 'media']}
                media={{
                  uploadFn: createUploadFn(appId, authToken),
                  accepts: { video: false, audio: false },
                  externals: { image: true, video: false, audio: false, embed: true },
                }}
              />
              <div>
                <Button variant="outline" className="mr-2" onClick={() => setEditing(false)}>
                  {formatMessage(commonMessages.ui.cancel)}
                </Button>
                <Button colorScheme="primary">{formatMessage(commonMessages.button.save)}</Button>
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
            }}
            reacted={reacted}
          >
            <Icon className="mr-1" type="heart" theme={reacted ? 'filled' : 'outlined'} />
            <span>{1234}</span>
          </StyledAction>
        </div>
      </MessageReplyContentBlock>
    </StyledMessageReplyItem>
  )
}

export default MessageReplyItem
