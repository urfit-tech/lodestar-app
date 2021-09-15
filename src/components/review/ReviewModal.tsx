import { useMutation } from '@apollo/react-hooks'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import { omit } from 'ramda'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AiOutlineEdit as EditIcon } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-star-rating-component'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import hasura from '../../hasura'
import { createUploadFn, rgba } from '../../helpers'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import { ReactComponent as StarGrayIcon } from '../../images/star-gray.svg'
import { ReactComponent as StarIcon } from '../../images/star.svg'
import { MemberReviewProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
import CommonModal from '../common/CommonModal'

const StyledHeaderIcon = styled.div`
  background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  height: 52px;
  width: 52px;
  border-radius: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 0 1.5rem;
`
const StyledInputTitle = styled(Input)`
  && {
    border: 1px solid #cdcdcd;
    border-radius: 4px;
    :hover {
      border: 1px solid #cdcdcd;
    }
    :focus {
      border: 1px solid #cdcdcd;
      box-shadow: none;
    }
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledFormLabel = styled(FormLabel)`
  color: var(--gray-darker);
  font-size: 14px;
  letter-spacing: 0.4px;
  line-height: 24px;
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
const ReactStarsWrapper = styled(ReactStars)`
  svg {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
`
const StyledButtonReview = styled(Button)<{ reviewed?: string }>`
  && {
    padding: 10px 45px;
    border-radius: 4px;
  }
`
const StyledFormControl = styled(FormControl)`
  height: 20px;
`
const StyledButtonModal = styled(Button)`
  && {
    border-radius: 4px;
  }
`

const ReviewModal: React.VFC<{
  path: string
  memberReviews: MemberReviewProps[]
  onRefetchReviewMemberItem?: () => void
  onRefetchReviewAggregate: () => void
  onRefetchCurrentMemberReview: () => void
}> = ({ path, memberReviews, onRefetchReviewMemberItem, onRefetchReviewAggregate, onRefetchCurrentMemberReview }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id: appId } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { programId } = useParams<{ programId: string }>()
  const [insertReview] = useMutation<hasura.INSERT_REVIEW, hasura.INSERT_REVIEWVariables>(INSERT_REVIEW)
  const [updateReview] = useMutation<hasura.UPDATE_REVIEW, hasura.UPDATE_REVIEWVariables>(UPDATE_REVIEW)
  const toast = useToast()

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
  } = useForm<{
    title: string
    starRating: number
    content: EditorState
    privateContent?: EditorState
  }>({
    defaultValues: {
      title: (memberReviews && memberReviews[0]?.title) || '',
      starRating: memberReviews && memberReviews[0]?.score ? memberReviews[0]?.score : 5,
      content: BraftEditor.createEditorState((memberReviews && memberReviews[0]?.content) || ''),
      privateContent: BraftEditor.createEditorState((memberReviews && memberReviews[0]?.privateContent) || ''),
    },
  })

  const validateTitle = (value: string) => !!value || formatMessage(reviewMessages.validate.titleIsRequired)

  const handleSave = handleSubmit(({ starRating, title, content, privateContent }) => {
    if (content.isEmpty()) {
      setError('content', {
        message: formatMessage(reviewMessages.validate.contentIsRequired),
      })
      return
    }
    setIsSubmitting(true)
    if (memberReviews && memberReviews[0]) {
      updateReview({
        variables: {
          reviewId: memberReviews[0]?.id,
          path,
          memberId: memberReviews[0]?.memberId,
          score: starRating,
          title,
          content: content.toRAW(),
          privateContent: privateContent.toRAW(),
          appId: appId,
          updateAt: new Date(),
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
          reset()
          onRefetchReviewMemberItem?.()
          onRefetchReviewAggregate?.()
          onRefetchCurrentMemberReview?.()
          window.location.replace(`/programs/${programId}?moveToBlock=customer-review`)
        })
        .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
        .finally(() => {
          setIsSubmitting(false)
          onClose()
        })
    } else {
      insertReview({
        variables: {
          path,
          memberId: currentMemberId,
          score: starRating,
          title,
          content: content.toRAW(),
          privateContent: privateContent.toRAW(),
          appId: appId,
        },
      })
        .then(() => {
          toast({
            title: formatMessage(commonMessages.event.successfullySaved),
            status: 'success',
            duration: 3000,
            isClosable: false,
            position: 'top',
          })
          reset()
          onRefetchReviewMemberItem?.()
          onRefetchReviewAggregate?.()
          window.location.replace(`/programs/${programId}?moveToBlock=customer-review`)
        })
        .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
        .finally(() => {
          setIsSubmitting(false)
          onClose()
        })
    }
  })

  return (
    <>
      <StyledButtonReview
        variant={memberReviews && memberReviews.length !== 0 ? 'outline' : 'primary'}
        reviewed={(!!(memberReviews !== null && memberReviews.length !== 0)).toString()}
        onClick={onOpen}
      >
        {memberReviews && memberReviews.length !== 0
          ? formatMessage(reviewMessages.button.editReview)
          : formatMessage(reviewMessages.button.toReview)}
      </StyledButtonReview>
      <CommonModal
        title={formatMessage(reviewMessages.modal.fillReview)}
        isOpen={isOpen}
        onClose={onClose}
        renderHeaderIcon={() => (
          <StyledHeaderIcon>
            <Icon as={EditIcon} color="primary.500" w="24px" h="24px" />
          </StyledHeaderIcon>
        )}
      >
        <form onSubmit={handleSave}>
          <StyledDescription>{formatMessage(reviewMessages.text.reviewModalDescription)}</StyledDescription>
          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.score)}</StyledFormLabel>
          <Controller
            name="starRating"
            render={({ field }) => (
              <ReactStarsWrapper
                {...omit(['value'], field)}
                name="starRating"
                value={memberReviews && memberReviews[0]?.score ? memberReviews[0]?.score : 5}
                onStarClick={rating => setValue('starRating', rating)}
                onStarHover={rating => setValue('starRating', rating)}
                renderStarIcon={(nextValue, prevValue) => (nextValue > prevValue ? <StarGrayIcon /> : <StarIcon />)}
              />
            )}
            control={control}
          />

          <StyledFormLabel className="mt-4" htmlFor="title">
            {formatMessage(reviewMessages.modal.title)}
          </StyledFormLabel>
          <StyledInputTitle id="title" {...register('title', { validate: validateTitle })} autoComplete="off" />
          <StyledFormControl isInvalid={!!errors?.title} className="mt-1">
            <FormErrorMessage className="mt-1">{errors?.title?.message}</FormErrorMessage>
          </StyledFormControl>

          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.content)}</StyledFormLabel>
          <Controller
            name="content"
            render={({ field }) => (
              <StyledEditor
                {...omit(['value'], field)}
                defaultValue={BraftEditor.createEditorState((memberReviews && memberReviews[0]?.content) || '')}
                language="zh-hant"
                controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                media={{ uploadFn: createUploadFn(appId, authToken) }}
              />
            )}
            control={control}
          />
          <StyledFormControl isInvalid={!!errors?.content} className="mt-1">
            <FormErrorMessage className="mt-1">{errors?.content?.message}</FormErrorMessage>
          </StyledFormControl>

          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.private)}</StyledFormLabel>
          <Controller
            name="privateContent"
            render={({ field: { value: defaultValue, ...field } }) => (
              <StyledEditor
                {...omit(['value'], field)}
                defaultValue={BraftEditor.createEditorState((memberReviews && memberReviews[0]?.privateContent) || '')}
                language="zh-hant"
                controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                media={{ uploadFn: createUploadFn(appId, authToken) }}
              />
            )}
            control={control}
          />

          <ButtonGroup className="d-flex justify-content-end mt-4 mb-4">
            <StyledButtonModal variant="outline" onClick={onClose}>
              {formatMessage(commonMessages.ui.cancel)}
            </StyledButtonModal>
            <StyledButtonModal variant="primary" type="submit" isLoading={isSubmitting}>
              {formatMessage(commonMessages.button.save)}
            </StyledButtonModal>
          </ButtonGroup>
        </form>
      </CommonModal>
    </>
  )
}

const INSERT_REVIEW = gql`
  mutation INSERT_REVIEW(
    $path: String!
    $memberId: String
    $score: numeric
    $title: String!
    $content: String
    $privateContent: String
    $appId: String!
  ) {
    insert_review(
      objects: {
        path: $path
        member_id: $memberId
        score: $score
        title: $title
        content: $content
        private_content: $privateContent
        app_id: $appId
      }
    ) {
      affected_rows
    }
  }
`
const UPDATE_REVIEW = gql`
  mutation UPDATE_REVIEW(
    $reviewId: uuid!
    $path: String!
    $memberId: String
    $score: numeric
    $title: String!
    $content: String
    $privateContent: String
    $appId: String!
    $updateAt: timestamptz
  ) {
    update_review(
      where: { id: { _eq: $reviewId }, path: { _eq: $path }, member_id: { _eq: $memberId }, app_id: { _eq: $appId } }
      _set: { score: $score, title: $title, content: $content, private_content: $privateContent, updated_at: $updateAt }
    ) {
      affected_rows
    }
  }
`

export default ReviewModal
