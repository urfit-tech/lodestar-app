import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button, ButtonGroup, FormControl, FormErrorMessage, Icon, useDisclosure, useToast } from '@chakra-ui/react'
import { Button as AntdButton } from 'antd'
import BraftEditor, { EditorState } from 'braft-editor'
import gql from 'graphql-tag'
import { CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import hasura from '../../hasura'
import { createUploadFn } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as IconEmail } from '../../images/email-o.svg'
import { OrderContact } from '../../types/merchandise'
import CommonModal from '../common/CommonModal'
import { AvatarImage } from '../common/Image'
import { BraftContent } from '../common/StyledBraftEditor'

const messages = defineMessages({
  contactMessage: { id: 'merchandise.ui.contactMessage', defaultMessage: '聯絡訊息' },
  fillMessageContent: { id: 'merchandise.text.fillMessageContent', defaultMessage: '請填寫訊息內容' },
  emptyContactMessage: { id: 'error.form.contactMessage', defaultMessage: '請輸入訊息' },
})

const StyledButton = styled(Button)<{ isMark?: boolean }>`
  position: relative;

  ${props =>
    props.isMark &&
    css`
      &::after {
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        width: 6px;
        height: 6px;
        background-color: var(--error);
        content: '';
      }
    `}
`

const StyledEditor = styled(BraftEditor)<{ isInvalid: boolean }>`
  .bf-controlbar {
    box-shadow: initial;
  }
  .bf-content {
    border: 1px solid ${props => (props.isInvalid ? 'var(--error)' : 'var(--gray)')};
    border-radius: 4px;
    height: initial;
  }
`

const StyledFormErrorMessage = styled(FormErrorMessage)`
  && {
    color: var(--error);
  }
`

const StyledFormControl = styled(FormControl)`
  height: 20px;
`

const StyledContactBlock = styled.div`
  &:nth-child(n + 1):not(:last-child) {
    border-bottom: 1px solid var(--gray-light);
  }
`

const StyledMemberInfo = styled.div`
  ${CommonTextMixin}
  line-height: 36px;
`

const MerchandiseContactBlock: React.VFC<{
  avatarUrl: string | null
  name: string
  createdAt: Date
  message: string
}> = ({ avatarUrl, name, createdAt, message }) => {
  return (
    <StyledContactBlock className="d-flex align-items-between mt-4">
      <AvatarImage src={avatarUrl} className="flex-shrink-0 mr-3" size="36px" shape="circle" />
      <div className="flex-grow-1 mb-4">
        <StyledMemberInfo className="mb-3">
          <span className="mr-2">{name}</span>
          <span>{moment(createdAt).fromNow()}</span>
        </StyledMemberInfo>
        <BraftContent>{message}</BraftContent>
      </div>
    </StyledContactBlock>
  )
}

const MerchandiseOrderContactModal: React.VFC<{ orderId: string }> = ({ orderId }) => {
  const { id: appId } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const { loading, error, orderContacts, isUnread, refetch, insertOrderContact, updateOrderContactReadAt } =
    useOrderContact(orderId, currentMemberId || '')

  const { formatMessage } = useIntl()
  const { control, handleSubmit, setValue, errors, setError } = useForm<{
    message: EditorState
  }>({
    defaultValues: { message: BraftEditor.createEditorState('') },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSave = handleSubmit(({ message }) => {
    if (message.isEmpty()) {
      setError('message', {
        message: formatMessage(messages.emptyContactMessage),
      })
      return
    }
    insertOrderContact(message.toRAW())
      .then(() => {
        toast({
          title: formatMessage(commonMessages.event.successfullySaved),
          status: 'success',
          duration: 3000,
          isClosable: false,
          position: 'top',
        })
        // reset
        setValue('message', BraftEditor.createEditorState(''))
        refetch()
      })
      .catch(error => console.log(error))
  })

  return (
    <>
      <StyledButton
        isLoading={loading || error}
        isMark={isUnread}
        leftIcon={<Icon as={IconEmail} />}
        variant="ghost"
        colorScheme="white"
        onClick={() => {
          onOpen()
          updateOrderContactReadAt(new Date())
            .then(() => refetch())
            .catch(err => console.error(err))
        }}
      >
        {formatMessage(messages.contactMessage)}
      </StyledButton>
      <CommonModal title={formatMessage(messages.contactMessage)} isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSave}>
          <Controller
            name="message"
            as={
              <StyledEditor
                isInvalid={!!errors?.message}
                language="zh-hant"
                controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                media={{ uploadFn: createUploadFn(appId, authToken) }}
                placeholder={formatMessage(messages.fillMessageContent)}
              />
            }
            control={control}
          />
          <StyledFormControl isInvalid={!!errors?.message} className="mt-1">
            <StyledFormErrorMessage className="mt-1">{errors?.message?.message}</StyledFormErrorMessage>
          </StyledFormControl>
          <ButtonGroup className="d-flex justify-content-end mb-4">
            <AntdButton onClick={onClose}>{formatMessage(commonMessages.ui.cancel)}</AntdButton>
            <AntdButton type="primary" htmlType="submit">
              {formatMessage(commonMessages.button.save)}
            </AntdButton>
          </ButtonGroup>
        </form>
        <div>
          {orderContacts.map(v => (
            <MerchandiseContactBlock
              key={v.id}
              avatarUrl={v.member.pictureUrl}
              name={v.member.name}
              createdAt={v.createdAt}
              message={v.message}
            />
          ))}
        </div>
      </CommonModal>
    </>
  )
}

const useOrderContact = (orderId: string, memberId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ORDER_CONTACT, hasura.GET_ORDER_CONTACTVariables>(
    GET_ORDER_CONTACT,
    {
      variables: {
        orderId,
        memberId,
      },
    },
  )

  const orderContacts: OrderContact[] =
    loading || error || !data
      ? []
      : data.order_contact.map(v => ({
          id: v.id,
          message: v.message,
          createdAt: v.created_at,
          member: {
            id: v.member?.id || '',
            name: v.member?.name || '',
            pictureUrl: v.member?.picture_url || '',
          },
        }))

  const latestCreatedAt = new Date(data?.order_contact_aggregate.aggregate?.max?.created_at || 0)
  const latestReadAt = new Date(data?.order_contact_aggregate.aggregate?.max?.read_at || 0)

  const isUnread = latestCreatedAt.getTime() > latestReadAt.getTime()

  const [insertOrderContactHandler] = useMutation<hasura.INSERT_ORDER_CONTACT, hasura.INSERT_ORDER_CONTACTVariables>(
    INSERT_ORDER_CONTACT,
  )
  const insertOrderContact = (message: string) =>
    insertOrderContactHandler({
      variables: {
        orderId,
        memberId,
        message,
      },
    })

  const [updateOrderContactHandler] = useMutation<
    hasura.UPDATE_ORDER_CONTACT_READ_AT,
    hasura.UPDATE_ORDER_CONTACT_READ_ATVariables
  >(UPDATE_ORDER_CONTACT_READ_AT)

  const updateOrderContactReadAt = (readAt: Date) =>
    updateOrderContactHandler({
      variables: {
        orderId,
        memberId,
        readAt,
      },
    })

  return {
    loading,
    error,
    orderContacts,
    isUnread,
    refetch,
    insertOrderContact,
    updateOrderContactReadAt,
  }
}

const GET_ORDER_CONTACT = gql`
  query GET_ORDER_CONTACT($orderId: String!, $memberId: String!) {
    order_contact(where: { order_id: { _eq: $orderId } }, order_by: { created_at: desc }) {
      id
      message
      created_at
      read_at
      member {
        id
        name
        picture_url
      }
    }
    order_contact_aggregate(where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId } }) {
      aggregate {
        max {
          created_at
          read_at
        }
      }
    }
  }
`

const INSERT_ORDER_CONTACT = gql`
  mutation INSERT_ORDER_CONTACT($orderId: String!, $memberId: String!, $message: String!) {
    insert_order_contact(objects: { order_id: $orderId, member_id: $memberId, message: $message }) {
      affected_rows
    }
  }
`

const UPDATE_ORDER_CONTACT_READ_AT = gql`
  mutation UPDATE_ORDER_CONTACT_READ_AT($orderId: String!, $memberId: String!, $readAt: timestamptz!) {
    update_order_contact(
      _set: { read_at: $readAt }
      where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId }, read_at: { _is_null: true } }
    ) {
      affected_rows
    }
  }
`
export default MerchandiseOrderContactModal
