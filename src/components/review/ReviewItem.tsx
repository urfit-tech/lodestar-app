import { useMutation } from '@apollo/react-hooks'
import { Button, ButtonGroup, Icon, IconButton, useToast } from '@chakra-ui/react'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import hasura from '../../hasura'
import { createUploadFn } from '../../helpers'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'
import { ReviewProps } from '../../types/review'
import { AuthModalContext } from '../auth/AuthModal'
import MemberAvatar from '../common/MemberAvatar'
import StarRating from '../common/StarRating'
import { BraftContent } from '../common/StyledBraftEditor'
import ReviewReplyItem from './ReviewReplyItem'

const ReviewContentBlock = styled.div`
  padding-left: 48px;
`
const StyledTitle = styled.div`
  font-weight: bold;
  color: var(--gray-darker);
`
const StyledButtonReply = styled(Button)`
  &&& {
    color: ${props => props.theme['@primary-color']};
  }
`
const ReviewPrivateBlock = styled.div`
  padding: 12px;
  font-size: 14px;
  letter-spacing: 0.4px;
  border: solid 1px var(--gray-light);
  border-radius: 4px;
  color: var(--gray-darker);
  p {
    line-height: 22px;
  }
`
const ReviewPrivateTitle = styled.div`
  color: var(--gray-dark);
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
const StyledButton = styled(Button)`
  && {
    border-radius: 4px;
  }
`

const ReviewItem: React.VFC<
  ReviewProps & {
    isLiked?: boolean
    likedCount: number
    onRefetch?: () => void
    targetId: string
  }
> = ({
  isLiked,
  likedCount,
  isAdmin,
  id,
  memberId,
  score,
  title,
  content,
  createdAt,
  updatedAt,
  privateContent,
  reviewReplies,
  onRefetch,
  targetId,
}) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const { handleSubmit, control, reset } = useForm<{ replyContent: EditorState }>({
    defaultValues: {
      replyContent: BraftEditor.createEditorState((reviewReplies.length !== 0 && reviewReplies[0].content) || ''),
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyEditing, setReplyEditing] = useState(false)

  const [insertReviewReply] = useMutation<hasura.INSERT_REVIEW_REPLY, hasura.INSERT_REVIEW_REPLYVariables>(
    INSERT_REVIEW_REPLY,
  )

  const toast = useToast()

  const handleSave = handleSubmit(({ replyContent }) => {
    setIsSubmitting(true)
    insertReviewReply({
      variables: {
        reviewId: id,
        memberId: currentMemberId,
        content: replyContent.toRAW(),
      },
    })
      .then(() => {
        toast({
          title: formatMessage(reviewMessages.event.isSubmitReview),
          status: 'success',
          duration: 3000,
          isClosable: false,
          position: 'top',
        })
        onRefetch?.()
      })
      .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
      .finally(() => {
        setIsSubmitting(false)
        setReplyEditing(false)
      })
  })

  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar memberId={memberId || ''} withName size={36} />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
          {updatedAt && updatedAt > createdAt && (
            <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
          )}
        </span>

        <LikeButton isLiked={isLiked || false} likedCount={likedCount} reviewId={id} onRefetch={onRefetch} />
      </div>
      <ReviewContentBlock>
        <StarRating score={score} max={5} size="16px" />
        <StyledTitle className="mt-3 mb-2">{title}</StyledTitle>
        <BraftContent>{content}</BraftContent>

        {privateContent && !BraftEditor.createEditorState(privateContent).isEmpty() && (
          <ReviewPrivateBlock className="mt-3">
            <ReviewPrivateTitle className="mb-2">私下給老師的訊息</ReviewPrivateTitle>
            <BraftContent>{privateContent}</BraftContent>
          </ReviewPrivateBlock>
        )}

        {isAdmin && reviewReplies.length === 0 && (
          <>
            <StyledButtonReply className="mt-2" variant="ghost" onClick={() => setReplyEditing(true)}>
              {formatMessage(reviewMessages.button.reply)}
            </StyledButtonReply>
            {replyEditing && (
              <>
                <div className="d-flex align-items-center justify-content-start mt-4">
                  <MemberAvatar memberId={currentMemberId || ''} withName size={36} />
                </div>
                <form onSubmit={handleSave}>
                  <Controller
                    name="replyContent"
                    as={
                      <StyledEditor
                        language="zh-hant"
                        controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                        media={{ uploadFn: createUploadFn(appId, authToken) }}
                      />
                    }
                    control={control}
                  />
                  <ButtonGroup mt={4} className="d-flex justify-content-end">
                    <StyledButton
                      type="reset"
                      variant="ghost"
                      onClick={() => {
                        setReplyEditing(false)
                        reset()
                      }}
                    >
                      {formatMessage(commonMessages.ui.cancel)}
                    </StyledButton>
                    <StyledButton isLoading={isSubmitting} type="submit" variant="primary" className="apply-btn">
                      {formatMessage(reviewMessages.button.reply)}
                    </StyledButton>
                  </ButtonGroup>
                </form>
              </>
            )}
          </>
        )}
        <div>
          {reviewReplies?.map(v => (
            <ReviewReplyItem
              key={v.id}
              id={v.id}
              reviewReplyMemberId={v.reviewReplyMemberId}
              memberRole={v.memberRole}
              content={v.content}
              createdAt={v.createdAt}
              updatedAt={v.updatedAt}
              onRefetch={onRefetch}
              targetId={targetId}
            />
          ))}
        </div>
      </ReviewContentBlock>
    </>
  )
}

const INSERT_REVIEW_REPLY = gql`
  mutation INSERT_REVIEW_REPLY($reviewId: uuid, $memberId: String, $content: String) {
    insert_review_reply(objects: { review_id: $reviewId, member_id: $memberId, content: $content }) {
      affected_rows
    }
  }
`

const StyledIconButton = styled(IconButton)<{ isActive?: boolean }>`
  &&& {
    border: 1px solid ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray)')};
    color: ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray-dark)')};
    border-radius: 50%;
    background: white;
  }
`

const StyledLikedCount = styled.span<{ isActive?: boolean }>`
  color: var(--gray-dark);
  font-size: 12px;
  font-weight: 500;

  ${props =>
    props.isActive &&
    css`
      color: ${props.theme['@primary-color']};
      text-shadow: 0 0 3px ${props.theme['@primary-color']}33;
    `}
`
const StyledIcon = styled(Icon)`
  margin-top: 2px;
`

const LikeButton: React.VFC<{
  reviewId: string
  isLiked: boolean
  likedCount: number
  onRefetch?: () => void
}> = ({ isLiked, likedCount, reviewId, onRefetch }) => {
  const { currentMemberId } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const [insertReviewReaction] = useMutation<hasura.INSERT_REVIEW_REACTION, hasura.INSERT_REVIEW_REACTIONVariables>(
    gql`
      mutation INSERT_REVIEW_REACTION($reviewId: uuid!, $memberId: String!) {
        insert_review_reaction(objects: { member_id: $memberId, review_id: $reviewId }) {
          affected_rows
        }
      }
    `,
  )
  const [deleteReviewReaction] = useMutation<hasura.DELETE_REVIEW_REACTION, hasura.DELETE_REVIEW_REACTIONVariables>(
    gql`
      mutation DELETE_REVIEW_REACTION($reviewId: uuid!, $memberId: String!) {
        delete_review_reaction(where: { member_id: { _eq: $memberId }, review_id: { _eq: $reviewId } }) {
          affected_rows
        }
      }
    `,
  )

  const handleLikeStatus = async () => {
    if (currentMemberId === null) return
    if (isLiked) {
      await deleteReviewReaction({
        variables: {
          reviewId,
          memberId: currentMemberId,
        },
      })
    } else {
      await insertReviewReaction({
        variables: {
          reviewId,
          memberId: currentMemberId,
        },
      })
    }

    await onRefetch?.()
  }

  return (
    <div>
      <StyledIconButton
        onClick={() => (currentMemberId ? handleLikeStatus() : setVisible?.(true))}
        variant="ghost"
        isActive={isLiked}
        icon={<StyledIcon as={isLiked ? HeartFillIcon : HeartIcon} />}
        className="mr-2"
      />
      <StyledLikedCount isActive={isLiked}>{likedCount}</StyledLikedCount>
    </div>
  )
}

export default ReviewItem
