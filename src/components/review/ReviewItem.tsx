import { Button, ButtonGroup } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn } from '../../helpers'
import { reviewMessages } from '../../helpers/translation'
import StarGrayIcon from '../../images/star-gray.svg'
import StarIcon from '../../images/star.svg'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import { ReviewsProps } from './ReviewCollectionBlock'
import ReviewReplyItem from './ReviewReplyItem'

const ReviewContentBlock = styled.div`
  padding-left: 48px;
`
const StyledTitle = styled.div`
  font-weight: bold;
  color: var(--gray-darker);
`
const StyledContent = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: var(--gray-darker);
`
const StyledButton = styled(Button)`
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
`
const ReviewPrivateTitle = styled.div`
  color: var(--gray-dark);
`
const ReviewPrivateContent = styled.div`
  color: var(--gray-darker);
`
const ReviewReplyEditorWrapper = styled.div`
  border: solid 1px var(--gray);
  border-radius: 4px;
  padding: 12px;
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

const ReviewItem: React.FC<ReviewsProps> = ({
  memberId,
  score,
  title,
  content,
  createdAt,
  updatedAt,
  reviewReplies,
}) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, currentMemberId, backendEndpoint } = useAuth()
  const { handleSubmit, control, errors, register } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyEditing, setReplyEditing] = useState(false)

  const starAmount = (score: number) => {
    let starLists = []
    for (let i = 0; i < score; i++) {
      starLists.push(<Icon key={uuid()} style={{ marginRight: '2px' }} src={StarIcon} />)
    }
    if (starLists.length < 5) {
      for (let i = starLists.length; i < 5; i++) {
        starLists.push(<Icon key={uuid()} style={{ marginRight: '2px' }} src={StarGrayIcon} />)
      }
    }
    return <div className="d-flex mb-3">{starLists}</div>
  }

  const onSubmit = (value: any) => {
    setIsSubmitting(true)
    setTimeout(() => {
      alert(JSON.stringify(value, null, 2))
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar memberId={memberId || ''} withName size={36} />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
          {updatedAt && updatedAt > createdAt && (
            <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
          )}
        </span>
      </div>
      <ReviewContentBlock>
        {starAmount(score)}
        <StyledTitle className="mb-2">{title}</StyledTitle>
        <StyledContent>{content}</StyledContent>
        <ReviewPrivateBlock className="mt-3">
          <ReviewPrivateTitle className="mb-2">私下給老師的訊息</ReviewPrivateTitle>
          <ReviewPrivateContent>悄悄話內容</ReviewPrivateContent>
        </ReviewPrivateBlock>

        {reviewReplies.length === 0 && (
          <>
            <StyledButton className="mt-2" variant="ghost" onClick={() => setReplyEditing(true)}>
              回覆
            </StyledButton>
            {replyEditing && (
              <>
                <div className="d-flex align-items-center justify-content-start mt-4">
                  <MemberAvatar memberId={memberId || ''} withName size={36} />
                  <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
                    <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
                    {updatedAt && updatedAt > createdAt && (
                      <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
                    )}
                  </span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="content"
                    as={
                      <StyledEditor
                        language="zh-hant"
                        controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                        media={{ uploadFn: createUploadFn(appId, authToken, backendEndpoint) }}
                      />
                    }
                    control={control}
                  />
                  <ButtonGroup mt={4} className="d-flex justify-content-end">
                    <StyledButton type="reset" variant="ghost" onClick={() => setReplyEditing(false)}>
                      取消
                    </StyledButton>
                    <Button isLoading={isSubmitting} type="submit" colorScheme="primary" className="apply-btn">
                      回覆
                    </Button>
                  </ButtonGroup>
                </form>
              </>
            )}
          </>
        )}
        <div>
          {reviewReplies?.map(v => (
            <ReviewReplyItem
              key={v.reviewReplyId}
              reviewId={v.reviewId}
              memberId={v.memberId}
              memberRole={v.memberRole}
              content={v.content}
              createdAt={v.createdAt}
              updatedAt={v.updatedAt}
            />
          ))}
        </div>
      </ReviewContentBlock>
    </div>
  )
}

export default ReviewItem
