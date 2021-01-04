import { Dropdown, Icon, Typography } from 'antd'
import { EditorState } from 'braft-editor'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BraftContent } from '../common/StyledBraftEditor'
import MessageItemForm from './MessageItemForm'

const StyledMessageContentBlock = styled.div`
  padding-left: 48px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
`

const MessageItemContent: React.FC<{
  description: string
  title?: string
  onSubmit?: (values: { title?: string; description: EditorState }) => Promise<any>
  renderEdit?: (setEditing: React.Dispatch<React.SetStateAction<boolean>>) => JSX.Element
}> = ({ renderEdit, title, description, onSubmit, children }) => {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <div>
        {renderEdit && (
          <Dropdown placement="bottomRight" overlay={renderEdit(setEditing)} trigger={['click']}>
            <StyledIcon type="more" />
          </Dropdown>
        )}

        <StyledMessageContentBlock>
          <Typography.Text strong className="mb-2" style={{ fontSize: '16px' }}>
            {title}
          </Typography.Text>
          <div style={{ fontSize: '14px' }}>
            <BraftContent>{description}</BraftContent>
          </div>
          {children}
        </StyledMessageContentBlock>
      </div>
    )
  }

  return (
    <StyledMessageContentBlock>
      <MessageItemForm
        title={title}
        description={description}
        onSubmit={
          onSubmit
            ? ({ description, title }) => onSubmit({ description, title }).then(() => setEditing(false))
            : undefined
        }
        onEditing={setEditing}
      />
      {children}
    </StyledMessageContentBlock>
  )
}

export default MessageItemContent
