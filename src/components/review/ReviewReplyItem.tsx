import { useQuery } from '@apollo/react-hooks'
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
import { useMutateReviewReply } from '../../hooks/review'
import { ReactComponent as MoreIcon } from '../../images/ellipsis.svg'
import types from '../../types'
import { ProductRoleName } from '../../types/general'
import { ProgramRoleName, ProgramRoleProps } from '../../types/program'
import { ReviewReplyItemProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import ProductRoleFormatter from '../common/ProductRoleFormatter'
import { BraftContent } from '../common/StyledBraftEditor'

const ReviewReplyContent = styled.div`
  padding: 16px;
  margin-left: 2.5rem;
  background: var(--gray-lighter);
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  p {
    line-height: 22px;
  }
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
    &.admin-tag {
      background: #585858;
    }
  }
`

const StyledFormControl = styled(FormControl)`
  height: 20px;
`
const StyledButtonCancel = styled(Button)`
  && {
    border-radius: 4px;
    color: ${props => props.theme['@primary-color']};
  }
`
const StyledButtonReply = styled(Button)`
  && {
    border-radius: 4px;
  }
`
const ReviewReplyItem: React.FC<ReviewReplyItemProps & { onRefetch?: () => void; targetId: string }> = ({
  id,
  reviewReplyMemberId,
  memberRole,
  content,
  createdAt,
  updatedAt,
  onRefetch,
  targetId,
}) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, currentMemberId, apiHost } = useAuth()
  const { control, errors, handleSubmit, setError } = useForm({
    defaultValues: {
      reply: BraftEditor.createEditorState(content || ''),
    },
  })
  const toast = useToast()
  const [replyEditing, setReplyEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { updateReviewReply, deleteReviewReply } = useMutateReviewReply()
  const { programRole } = useProgramRole(targetId)

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
          id,
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
          onRefetch?.()
        })
        .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
        .finally(() => {
          setIsSubmitting(false)
          setReplyEditing(false)
        })
  }
  const handleDelete = () => {
    currentMemberId &&
      deleteReviewReply({ variables: { id, memberId: currentMemberId, appId } })
        .then(() => {
          toast({
            title: formatMessage(commonMessages.event.successfullyDeleted),
            status: 'success',
            duration: 3000,
            isClosable: false,
            position: 'top',
          })
        })
        .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
        .finally(() => {
          setReplyEditing(false)
          onRefetch?.()
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
            programRole && programRole.some(v => v.memberId === reviewReplyMemberId) ? (
              programRole
                .filter(role => role.memberId === reviewReplyMemberId)
                .map(role =>
                  role.name === 'instructor' ? (
                    <StyledTag key={uuid()} size="md">
                      <ProductRoleFormatter value={role.name as ProductRoleName} />
                    </StyledTag>
                  ) : role.name === 'assistant' ? (
                    <StyledTag key={uuid()} size="md">
                      <ProductRoleFormatter value={role.name as ProductRoleName} />
                    </StyledTag>
                  ) : null,
                )
            ) : memberRole === 'app-owner' ? (
              <StyledTag key={uuid()} size="md" className="admin-tag">
                <ProductRoleFormatter value={memberRole as ProductRoleName} />
              </StyledTag>
            ) : null
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
                  media={{ uploadFn: createUploadFn(appId, authToken, apiHost) }}
                />
              }
              control={control}
            />
            <StyledFormControl isInvalid={!!errors?.reply} className="mt-1">
              <FormErrorMessage className="mt-1">{errors?.reply?.message}</FormErrorMessage>
            </StyledFormControl>
            <ButtonGroup mt={4} className="d-flex justify-content-end">
              <StyledButtonCancel type="reset" variant="ghost" onClick={() => setReplyEditing(false)}>
                {formatMessage(commonMessages.button.cancel)}
              </StyledButtonCancel>
              <StyledButtonReply type="submit" variant="primary" className="apply-btn" isLoading={isSubmitting}>
                {formatMessage(reviewMessages.button.reply)}
              </StyledButtonReply>
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

const useProgramRole = (targetId: string) => {
  const { loading, error, data } = useQuery<types.GET_PROGRAM_ROLE, types.GET_PROGRAM_ROLEVariables>(
    gql`
      query GET_PROGRAM_ROLE($targetId: uuid) {
        program_role(where: { program_id: { _eq: $targetId } }) {
          id
          name
          member_id
        }
      }
    `,
    {
      variables: {
        targetId,
      },
    },
  )

  const programRole: ProgramRoleProps[] =
    data?.program_role?.map(v => ({
      id: v.id,
      memberId: v.member_id,
      name: v.name as ProgramRoleName,
    })) || []

  return {
    loading,
    error,
    programRole,
  }
}

export default ReviewReplyItem
