import { useMutation } from '@apollo/react-hooks'
import { Button, ButtonGroup, useDisclosure, useToast } from '@chakra-ui/react'
import { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { defineMessages, useIntl } from 'react-intl'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn, handleError } from '../../helpers'
import { codeMessages, commonMessages } from '../../helpers/translation'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'
import CommonModal from '../common/CommonModal'
import MessageButton from '../common/MessageButton'
import StyledBraftEditor from '../common/StyledBraftEditor'

const messages = defineMessages({
  fillSuggest: { id: 'practice.label.fillSuggest', defaultMessage: '填寫建議' },
  suggest: { id: 'practice.text.suggest', defaultMessage: '留下你的建議...' },
  submitSuggest: { id: 'practice.ui.submitSuggest', defaultMessage: '送出建議' },
})
type SuggestionCreationModalProps = {
  threadId: string
  onRefetch?: () => void
}

const SuggestionCreationModal: React.FC<SuggestionCreationModalProps> = ({ threadId, onRefetch }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { currentMemberId, authToken, apiHost } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { control, handleSubmit } = useForm<{ suggest: EditorState }>()
  const [insertSuggestion] = useMutation<types.INSERT_SUGGESTION, types.INSERT_SUGGESTIONVariables>(INSERT_SUGGESTION)

  const handleSuggest = handleSubmit(({ suggest }) => {
    if (currentMemberId) {
      insertSuggestion({
        variables: {
          appId,
          memberId: currentMemberId,
          threadId,
          title: '',
          description: suggest?.toRAW(),
        },
      })
        .then(() => {
          onRefetch?.()
          toast({
            title: formatMessage(codeMessages.SUCCESS),
            status: 'success',
            duration: 1500,
            position: 'top',
          })
          onClose()
        })
        .catch(err => {
          handleError(err)
        })
    }
  })

  return (
    <CommonModal
      isOpen={isOpen}
      title={formatMessage(messages.fillSuggest)}
      renderTrigger={() => (
        <MessageButton memberId={currentMemberId || ''} text={formatMessage(messages.suggest)} onClick={onOpen} />
      )}
      onClose={onClose}
      renderFooter={() => (
        <ButtonGroup>
          <Button variant="outline" onClick={onClose}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" onClick={handleSuggest}>
            {formatMessage(messages.submitSuggest)}
          </Button>
        </ButtonGroup>
      )}
    >
      <Controller
        name="suggest"
        as={
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
          />
        }
        control={control}
      />
    </CommonModal>
  )
}

const INSERT_SUGGESTION = gql`
  mutation INSERT_SUGGESTION(
    $appId: String!
    $memberId: String!
    $threadId: String!
    $title: String
    $description: String
  ) {
    insert_issue(
      objects: { app_id: $appId, member_id: $memberId, thread_id: $threadId, title: $title, description: $description }
    ) {
      affected_rows
    }
  }
`

export default SuggestionCreationModal
