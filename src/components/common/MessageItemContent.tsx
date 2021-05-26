import { Dropdown, Icon, Typography } from 'antd'
import { EditorState } from 'braft-editor'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { BraftContent } from '../common/StyledBraftEditor'
import MessageItemForm from './MessageItemForm'

const StyledMessageContentBlock = styled.div<{ firstLayer?: boolean }>`
  ${props =>
    props.firstLayer
      ? css`
          padding-left: 48px;

          @media (max-width: 768px) {
            padding-left: 0;
          }
        `
      : css`
          padding: 1rem;
          background: #f7f8f8;
          border-radius: 0.5rem;
        `}
`

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
`

const MessageItemContent: React.FC<{
  description: string
  title?: string
  firstLayer?: boolean
  onSubmit?: (values: { title?: string; description: EditorState }) => Promise<any>
  renderEdit?: (setEditing: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactElement
}> = ({ renderEdit, firstLayer, title, description, onSubmit, children }) => {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <div>
        {renderEdit && (
          <Dropdown placement="bottomRight" overlay={renderEdit(setEditing)} trigger={['click']}>
            <StyledIcon type="more" />
          </Dropdown>
        )}

        <StyledMessageContentBlock firstLayer={firstLayer}>
          <Typography.Text strong className="mb-2" style={{ fontSize: '16px' }}>
            {title}
          </Typography.Text>
          <div style={{ fontSize: '14px' }} className="mb-3">
            <BraftContent>{description}</BraftContent>
          </div>
          {children}
        </StyledMessageContentBlock>
      </div>
    )
  }

  return (
    <StyledMessageContentBlock firstLayer={firstLayer}>
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
