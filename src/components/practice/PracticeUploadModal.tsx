import { useMutation } from '@apollo/react-hooks'
import { QuestionIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { uploadFile } from '../../helpers/index'
import { commonMessages } from '../../helpers/translation'
import { useUploadAttachments } from '../../hooks/data'
import { useMutatePractice } from '../../hooks/practice'
import { PracticeProps } from '../../types/practice'
import CommonModal from '../common/CommonModal'
import FileUploader from '../common/FileUploader'
import ImageUploader from '../common/ImageUploader'

const messages = defineMessages({
  practice: { id: 'program.term.practice', defaultMessage: '作業' },
  uploadByMe: { id: 'program.ui.uploadByMe', defaultMessage: '我要上傳' },
  uploadPractice: { id: 'program.label.uploadPractice', defaultMessage: '上傳作業' },
  editPractice: { id: 'program.label.editPractice', defaultMessage: '編輯作業' },
  practiceAttachment: { id: 'program.label.practiceAttachment', defaultMessage: '作品附件' },
  practiceAttachmentHint: { id: 'program.label.practiceAttachmentHint', defaultMessage: '可供下載查看' },
  practiceAttachmentNotice: { id: 'program.label.practiceAttachmentNotice', defaultMessage: '檔案大小不超過 5GB' },
  cover: { id: 'program.label.cover', defaultMessage: '封面圖片' },
  coverNotice: { id: 'program.label.coverNotice', defaultMessage: '建議上傳圖片尺寸為 1600*900px' },
  fillTitleNotice: { id: 'program.text.fillTitleNotice', defaultMessage: '請填入標題' },
  fillDescriptionPlease: { id: 'program.text.fillDescriptionPlease', defaultMessage: '輸入內容描述...' },
})
const StyledInputWrapper = styled.div`
  && {
    input:focus {
      border: 1px solid ${props => props.theme['@primary-color']};
      box-shadow: none;
    }
  }
`
const StyledButton = styled(Button)`
  && {
    width: 100%;
  }
`

const PracticeUploadModal: React.VFC<{
  programContentId: string
  isCoverRequired: boolean
  practice?: PracticeProps | null
  onSubmit?: (values: { practiceId: string; title: string; description: EditorState }) => void
  onRefetch?: () => Promise<any>
  renderTrigger?: (onOpen: any) => React.ReactElement
}> = ({ programContentId, isCoverRequired, practice, onSubmit, onRefetch, renderTrigger }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { register, control, handleSubmit, errors } = useForm<{
    title: string
    description?: EditorState
  }>({
    defaultValues: {
      title: practice?.title,
      description: BraftEditor.createEditorState(practice?.description || ''),
    },
  })

  const { currentMemberId, authToken } = useAuth()
  const { id: appId } = useApp()
  const uploadAttachments = useUploadAttachments()
  const { insertPractice, updatePractice, updatePracticeHandler } = useMutatePractice(practice?.id || '')
  const [deleteAttachments] = useMutation<hasura.DELETE_ATTACHMENTS, hasura.DELETE_ATTACHMENTSVariables>(
    DELETE_ATTACHMENTS,
  )

  const [attachments, setAttachments] = useState<File[]>(practice?.attachments.map(attachment => attachment.data) || [])
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const variant = practice ? 'edit' : 'upload'

  const handleUpload = handleSubmit(async ({ title, description }) => {
    if (!currentMemberId) {
      return
    }
    setLoading(true)
    const path = `images/${appId}/practices`
    const practiceFolder = `https://${process.env.REACT_APP_S3_BUCKET}/${path}`

    try {
      if (variant === 'upload') {
        const { data } = await insertPractice({
          title,
          description: description?.toRAW(),
          memberId: currentMemberId,
          programContentId,
        })
        const newPracticeId = data?.insert_practice?.returning[0]?.id
        if (!newPracticeId) {
          return
        }

        if (attachments.length) {
          await uploadAttachments('Practice', newPracticeId, attachments)
        }
        if (coverImageFile) {
          await uploadFile(`${path}/${newPracticeId}`, coverImageFile, authToken)
        }

        await updatePracticeHandler({
          variables: {
            practiceId: newPracticeId,
            coverUrl: coverImageFile ? `${practiceFolder}/${newPracticeId}` : null,
            title,
            description: description?.toRAW(),
          },
        }).then(() => {
          toast({
            title: `${formatMessage(messages.practice)}${formatMessage(commonMessages.event.successfullyUpload)}`,
            status: 'success',
            duration: 1500,
            position: 'top',
          })
        })
        onSubmit?.({ practiceId: newPracticeId, title, description })
      } else if (variant === 'edit' && practice?.id) {
        const deletedAttachmentIds = practice.attachments
          .filter(practiceAttachment =>
            attachments.every(
              attachment =>
                attachment.name !== practiceAttachment.data.name &&
                attachment.lastModified !== practiceAttachment.data.lastModified,
            ),
          )
          .map(attachment => attachment.id)
        const newAttachments = attachments.filter(attachment =>
          practice.attachments.every(
            practiceAttachment =>
              practiceAttachment.data.name !== attachment.name &&
              practiceAttachment.data.lastModified !== attachment.lastModified,
          ),
        )

        await updatePractice({
          title,
          description: description?.toRAW(),
          coverUrl: coverImageFile ? `${practiceFolder}/${practice.id}?t=${Date.now()}` : practice.coverUrl,
        }).then(async () => {
          if (attachments.length) {
            await deleteAttachments({ variables: { attachmentIds: deletedAttachmentIds } })
            await uploadAttachments('Practice', practice.id, newAttachments)
          }
          if (coverImageFile) {
            await uploadFile(`${path}/${practice.id}`, coverImageFile, authToken)
          }

          toast({
            title: `${formatMessage(messages.practice)}${formatMessage(commonMessages.event.successfullyUpload)}`,
            status: 'success',
            duration: 1500,
            position: 'top',
          })
        })

        onSubmit?.({ practiceId: practice.id, title, description })
      }
      onRefetch?.()
      onClose()
    } catch (error) {
      handleError(error)
    }
    setLoading(false)
  })

  return (
    <>
      {renderTrigger?.(onOpen) || (
        <StyledButton variant="primary" onClick={onOpen}>
          {formatMessage(variant === 'upload' ? messages.uploadByMe : commonMessages.button.edit)}
        </StyledButton>
      )}
      <CommonModal
        isFullWidth
        title={formatMessage(variant === 'upload' ? messages.uploadPractice : messages.editPractice)}
        isOpen={isOpen}
        onClose={onClose}
        renderCloseButtonBlock={() => (
          <ButtonGroup>
            <Button onClick={onClose} variant="outline">
              {formatMessage(commonMessages.ui.cancel)}
            </Button>
            <Button onClick={handleUpload} isLoading={loading} variant="primary">
              {formatMessage(commonMessages.ui.upload)}
            </Button>
          </ButtonGroup>
        )}
      >
        <FormControl isRequired isInvalid={!!errors?.title?.message} className="my-4">
          <FormLabel>{formatMessage(commonMessages.label.title)}</FormLabel>
          <StyledInputWrapper>
            <Input
              name="title"
              ref={register({ required: formatMessage(messages.fillTitleNotice) })}
              variant="outline"
            />
          </StyledInputWrapper>
          <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
        </FormControl>
        <Controller
          name="description"
          as={<BraftEditor className="mb-4" placeholder={formatMessage(messages.fillDescriptionPlease)} />}
          control={control}
        />
        <div className="mb-4">
          <FormLabel>
            <span className="mr-1">
              {formatMessage(messages.practiceAttachment)}（{formatMessage(messages.practiceAttachmentHint)}）
            </span>
            <Tooltip label={formatMessage(messages.practiceAttachmentNotice)} placement="top" hasArrow>
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <FileUploader multiple showUploadList fileList={attachments} onChange={files => setAttachments(files)} />
        </div>
        <div className={isCoverRequired ? 'mb-4' : 'd-none'}>
          <FormLabel>
            <span className="mr-1">{formatMessage(messages.cover)}</span>
            <Tooltip label={formatMessage(messages.coverNotice)} placement="top" hasArrow>
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <ImageUploader imgUrl={practice?.coverUrl} file={coverImageFile} onChange={file => setCoverImageFile(file)} />
        </div>
      </CommonModal>
    </>
  )
}

const DELETE_ATTACHMENTS = gql`
  mutation DELETE_ATTACHMENTS($attachmentIds: [uuid!]!) {
    update_attachment(where: { id: { _in: $attachmentIds } }, _set: { is_deleted: true }) {
      affected_rows
    }
  }
`

export default PracticeUploadModal
