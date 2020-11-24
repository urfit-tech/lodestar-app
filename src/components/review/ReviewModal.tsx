import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn } from '../../helpers'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import EditIcon from '../../images/edit.svg'
import { useAuth } from '../auth/AuthContext'
import CommonModal from '../common/CommonModal'

const StyledHeaderIcon = styled.div`
  background: #f2fbfc;
  height: 52px;
  width: 52px;
  border-radius: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 0 1.5rem;
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
const StyledButton = styled(Button)`
  && {
    background: ${props => props.theme['@primary-color']};
    color: #ffffff;
    padding: 10px 45px;
    border-radius: 4px;
  }
`
const StyledFormControl = styled(FormControl)`
  height: 20px;
`
const ReviewModal: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, errors, register, handleSubmit, setError } = useForm({
    defaultValues: {
      title: '',
      content: BraftEditor.createEditorState(''),
      private: BraftEditor.createEditorState(''),
    },
  })
  const { id: appId } = useApp()
  const { authToken, currentMemberId, backendEndpoint } = useAuth()
  const [starScore, setStarScore] = useState(5)

  const toast = useToast()

  const validateTitle = (value: string) => {
    let error
    if (!value) {
      error = formatMessage(reviewMessages.validate.titleIsRequired)
    }
    return error || true
  }

  const handleSave = (data: { title: any; content: any }) => {
    console.log(data)
    if (data.content.isEmpty()) {
      setError('content', {
        message: formatMessage(reviewMessages.validate.contentIsRequired),
      })
      return
    }
  }

  return (
    <>
      <CommonModal
        title={formatMessage(reviewMessages.modal.fillReview)}
        isOpen={isOpen}
        onClose={onClose}
        renderHeaderIcon={() => (
          <StyledHeaderIcon>
            <Icon src={EditIcon} />
          </StyledHeaderIcon>
        )}
        renderTrigger={() => (
          <StyledButton colorScheme="primary" onClick={onOpen}>
            {formatMessage(reviewMessages.button.toReview)}
          </StyledButton>
        )}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <StyledDescription>{formatMessage(reviewMessages.text.reviewModalDescription)}</StyledDescription>
          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.score)}</StyledFormLabel>
          {/* <StyledStarInput type="range" id="star-1" name="star" min={0} max={5} step={0.5} defaultValue={0} />*/}

          <StyledFormLabel htmlFor="title">{formatMessage(reviewMessages.modal.title)}</StyledFormLabel>
          <Input id="title" name="title" ref={register({ validate: validateTitle })} />
          <StyledFormControl isInvalid={!!errors?.title} className="mt-1">
            <FormErrorMessage className="mt-1">{errors?.title?.message}</FormErrorMessage>
          </StyledFormControl>

          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.content)}</StyledFormLabel>
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
          <StyledFormControl isInvalid={!!errors?.content} className="mt-1">
            <FormErrorMessage className="mt-1">{errors?.content?.message}</FormErrorMessage>
          </StyledFormControl>

          <StyledFormLabel className="mt-4">{formatMessage(reviewMessages.modal.private)}</StyledFormLabel>
          <Controller
            name="private"
            as={
              <StyledEditor
                language="zh-hant"
                controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                media={{ uploadFn: createUploadFn(appId, authToken, backendEndpoint) }}
              />
            }
            control={control}
          />

          <ButtonGroup className="d-flex justify-content-end mt-4">
            <Button variant="outline" colorScheme="primary" onClick={onClose}>
              {formatMessage(commonMessages.button.cancel)}
            </Button>
            <Button variant="solid" colorScheme="primary" type="submit">
              {formatMessage(commonMessages.button.save)}
            </Button>
          </ButtonGroup>
        </form>
      </CommonModal>
    </>
  )
}

export default ReviewModal
