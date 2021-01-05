import { Button, useToast } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { codeMessages, commonMessages, issueMessages } from '../../helpers/translation'
import MemberAvatar from './MemberAvatar'

export const StyledEditor = styled(BraftEditor)`
  .bf-content {
    height: initial;
  }
`

const messages = defineMessages({
  sendOut: { id: 'common.ui.sendOut', defaultMessage: '送出' },
})

const MessageReplyCreationForm: React.FC<{
  memberId: string
  onSubmit?: () => void
  onCancel?: () => void
}> = ({ memberId, onCancel }) => {
  const { formatMessage } = useIntl()
  const { control, handleSubmit } = useForm()
  const toast = useToast()

  const handleSendOut = handleSubmit(({ messageReply }) => {
    console.log(messageReply?.toRAW())

    toast({
      title: formatMessage(codeMessages.SUCCESS),
      status: 'success',
      duration: 1500,
      position: 'top',
    })
  })

  return (
    <div className="d-flex flex-column mb-3">
      <div className="mb-2">
        <MemberAvatar memberId={memberId} withName />
      </div>

      <Controller
        className="mb-2"
        name="messageReply"
        as={
          <StyledEditor
            style={{ border: '1px solid #cdcdcd', borderRadius: '4px' }}
            language="zh-hant"
            placeholder={formatMessage(issueMessages.form.placeholder.reply)}
            controls={['bold', 'italic', 'underline', 'separator', 'media']}
          />
        }
        control={control}
      />

      <div className="text-right">
        {onCancel && (
          <Button variant="ghost" onClick={() => onCancel()}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
        )}
        <Button variant="primary" onClick={handleSendOut}>
          {formatMessage(messages.sendOut)}
        </Button>
      </div>
    </div>
  )
}

export default MessageReplyCreationForm
