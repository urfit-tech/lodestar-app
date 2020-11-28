import { useMutation } from '@apollo/react-hooks'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  useToast,
} from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn } from '../../helpers'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import { ReactComponent as MoreIcon } from '../../images/ellipsis.svg'
import types from '../../types'
import { ProgramRoleName } from '../../types/program'
import { ReviewReplyItemProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import ProgramRoleFormatter from '../common/ProgramRoleFormatter'
import { BraftContent } from '../common/StyledBraftEditor'
import { StyledButton } from './ReviewItem'

const ReviewReplyContent = styled.div`
  padding: 16px;
  margin-left: 2.5rem;
  background: var(--gray-lighter);
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledEditor = styled(BraftEditor)`
  .bf-controlbar {
    box-shadow: initial;
  }
  .bf-content {
    border: 1px solid #cdcdcd;
    border-radius: 4px;
    height: initial;
  }
`
const StyledTag = styled(Tag)`
  && {
    margin-left: 12px;
    border-radius: 11px;
    font-size: 12px;
    padding: 2px 8px;
    letter-spacing: 0.58px;
    color: #ffffff;
    background: ${props => props.theme['@primary-color']};
  }
`

const StyledFormControl = styled(FormControl)`
  height: 20px;
`
const ReviewReplyItem: React.FC<ReviewReplyItemProps & { onRefetch?: () => void }> = ({
  reviewReplyId,
  reviewReplyMemberId,
  content,
  createdAt,
  updatedAt,
  labelRole,
  onRefetch,
}) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, currentMemberId, backendEndpoint } = useAuth()
  const { control, errors, handleSubmit, setError } = useForm({
    defaultValues: {
      reply: BraftEditor.createEditorState(content) || BraftEditor.createEditorState(''),
    },
  })
  const toast = useToast()
  const [replyEditing, setReplyEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [updateReviewReply] = useMutation<types.UPDATE_REVIEW_REPLY, types.UPDATE_REVIEW_REPLYVariables>(
    UPDATE_REVIEW_REPLY,
  )
  const [deleteReviewReply] = useMutation<types.DELETE_REVIEW_REPLY, types.DELETE_REVIEW_REPLYVariables>(
    DELETE_REVIEW_REPLY,
  )

  const handleSave = (data: { reply: any }) => {
    if (data.reply.isEmpty()) {
      setError('reply', {
        message: formatMessage(reviewMessages.validate.contentIsRequired),
      })
      return
    }
    setIsSubmitting(true)
    currentMemberId &&
      updateReviewReply({
        variables: {
          reviewReplyId,
          memberId: currentMemberId,
          content: data.reply.toRAW(),
          appId,
          updateAt: new Date(),
        },
      })
        .then(() => {
          toast({
            title: formatMessage(commonMessages.event.successfullyEdited),
            status: 'success',
            duration: 3000,
            isClosable: false,
            position: 'top',
            render: () => <Box bg="white" color="black" />,
          })
        })
        .catch(error => console.log(error))
        .finally(() => {
          setIsSubmitting(false)
          setReplyEditing(false)
          onRefetch && onRefetch()
        })
  }
  const handleDelete = () => {
    currentMemberId &&
      deleteReviewReply({ variables: { reviewReplyId, memberId: currentMemberId, appId } })
        .then(() => {
          toast({
            title: formatMessage(commonMessages.event.successfullyDeleted),
            status: 'success',
            duration: 3000,
            isClosable: false,
            position: 'top',
          })
        })
        .catch(error => console.log(error))
        .finally(() => {
          setReplyEditing(false)
          onRefetch && onRefetch()
        })
  }

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar
          memberId={reviewReplyMemberId || ''}
          withName
          size={28}
          renderText={() =>
            labelRole &&
            labelRole
              .filter(role => role.memberId === reviewReplyMemberId)
              .map(role =>
                role.name === 'instructor' ? (
                  <StyledTag key={uuid()} size="md">
                    <ProgramRoleFormatter value={role.name as ProgramRoleName} />
                  </StyledTag>
                ) : role.name === 'assistant' ? (
                  <StyledTag key={uuid()} size="md">
                    <ProgramRoleFormatter value={role.name as ProgramRoleName} />
                  </StyledTag>
                ) : role.name === 'app-owner' ? (
                  <StyledTag key={uuid()} size="md">
                    <ProgramRoleFormatter value={role.name as ProgramRoleName} />
                  </StyledTag>
                ) : null,
              )
          }
        />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
          {updatedAt && updatedAt > createdAt && (
            <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
          )}
        </span>
        {currentMemberId === reviewReplyMemberId && (
          <Menu placement="bottom-end">
            <MenuButton>
              <Icon as={MoreIcon} />
            </MenuButton>
            <MenuList minWidth="110px">
              <MenuItem
                onClick={() => {
                  setReplyEditing(true)
                }}
              >
                {formatMessage(commonMessages.button.edit)}
              </MenuItem>
              <MenuItem onClick={() => handleDelete()}>{formatMessage(commonMessages.button.delete)}</MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
      {replyEditing ? (
        <ReviewReplyContent className="mt-2">
          <form onSubmit={handleSubmit(handleSave)}>
            <Controller
              name="reply"
              as={
                <StyledEditor
                  language="zh-hant"
                  controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                  media={{ uploadFn: createUploadFn(appId, authToken, backendEndpoint) }}
                />
              }
              control={control}
            />
            <StyledFormControl isInvalid={!!errors?.reply} className="mt-1">
              <FormErrorMessage className="mt-1">{errors?.reply?.message}</FormErrorMessage>
            </StyledFormControl>
            <ButtonGroup mt={4} className="d-flex justify-content-end">
              <StyledButton type="reset" variant="ghost" onClick={() => setReplyEditing(false)}>
                {formatMessage(commonMessages.button.cancel)}
              </StyledButton>
              <Button type="submit" colorScheme="primary" className="apply-btn" isLoading={isSubmitting}>
                {formatMessage(reviewMessages.button.reply)}
              </Button>
            </ButtonGroup>
          </form>
        </ReviewReplyContent>
      ) : (
        <ReviewReplyContent className="mt-2">
          <BraftContent>{content}</BraftContent>
        </ReviewReplyContent>
      )}
    </div>
  )
}

const UPDATE_REVIEW_REPLY = gql`
  mutation UPDATE_REVIEW_REPLY(
    $reviewReplyId: uuid!
    $memberId: String
    $content: String
    $appId: String!
    $updateAt: timestamptz
  ) {
    update_review_reply(
      where: { id: { _eq: $reviewReplyId }, member_id: { _eq: $memberId }, member: { app_id: { _eq: $appId } } }
      _set: { content: $content, updated_at: $updateAt }
    ) {
      affected_rows
    }
  }
`

const DELETE_REVIEW_REPLY = gql`
  mutation DELETE_REVIEW_REPLY($reviewReplyId: uuid!, $memberId: String, $appId: String) {
    delete_review_reply(
      where: { id: { _eq: $reviewReplyId }, member_id: { _eq: $memberId }, member: { app_id: { _eq: $appId } } }
    ) {
      affected_rows
    }
  }
`

export default ReviewReplyItem
