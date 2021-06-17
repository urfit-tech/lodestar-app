import { useMutation } from '@apollo/react-hooks'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import { MultiLineTruncationMixin } from '../../components/common'
import { Input } from '../../components/common/CommonForm'
import CommonModal from '../../components/common/CommonModal'
import { CustomRatioImage } from '../../components/common/Image'
import types from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useMemberValidation } from '../../hooks/common'
import EmptyCover from '../../images/empty-cover.png'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const messages = defineMessages({
  selfDeliver: { id: 'common.text.selfDeliver', defaultMessage: '不能發送給自己' },
  delivered: { id: 'common.text.delivered', defaultMessage: '已發送的電子郵件' },
})

const GroupBuyingDeliverModal: React.VFC<{
  partnerMemberIds: string[]
  orderId: string
  title: string
  onRefetch?: (() => void) | null
}> = ({ partnerMemberIds, orderId, title, onRefetch }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [email, setEmail] = useState('')
  const { currentMemberId } = useAuth()
  const { memberId, validateStatus } = useMemberValidation(email)
  const memberStatus =
    memberId === currentMemberId || partnerMemberIds.includes(memberId || '') ? 'error' : validateStatus

  const toast = useToast()
  const [updateOrder] = useMutation<types.UPDATE_ORDER, types.UPDATE_ORDERVariables>(gql`
    mutation UPDATE_ORDER($orderId: String!, $memberId: String!, $transferredAt: timestamptz!) {
      update_order_log_by_pk(
        pk_columns: { id: $orderId }
        _set: { member_id: $memberId, transferred_at: $transferredAt }
      ) {
        id
      }
    }
  `)

  const handleSubmit = () => {
    if (memberId) {
      updateOrder({
        variables: {
          orderId,
          memberId,
          transferredAt: new Date(),
        },
      })
        .then(() => {
          onRefetch?.()
          toast({
            title: formatMessage(commonMessages.status.sent),
            status: 'success',
            duration: 1500,
            position: 'top',
          })
        })
        .catch(handleError)
    }
  }

  return (
    <>
      <Button colorScheme="primary" isFullWidth onClick={onOpen}>
        {formatMessage(commonMessages.ui.sendNow)}
      </Button>
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        title={formatMessage(commonMessages.label.partnerChoose)}
        renderFooter={() => (
          <ButtonGroup>
            <Button variant="outline" onClick={onClose}>
              {formatMessage(commonMessages.ui.cancel)}
            </Button>
            <Button
              colorScheme="primary"
              isDisabled={
                memberId === currentMemberId ||
                partnerMemberIds.includes(memberId || '') ||
                [undefined, 'error', 'validating'].includes(validateStatus)
              }
              onClick={handleSubmit}
            >
              {formatMessage(commonMessages.ui.send)}
            </Button>
          </ButtonGroup>
        )}
        closeOnOverlayClick={false}
      >
        <StyledTitle className="mb-4">{title}</StyledTitle>
        <FormControl
          isInvalid={
            memberId === currentMemberId || partnerMemberIds.includes(memberId || '') || validateStatus === 'error'
          }
        >
          <FormLabel>{formatMessage(commonMessages.label.targetPartner)}</FormLabel>
          <Input
            type="email"
            status={memberStatus}
            placeholder={formatMessage(commonMessages.text.fillInEnrolledEmail)}
            onBlur={e => setEmail(e.target.value)}
          />
          <FormErrorMessage>
            {memberId === currentMemberId
              ? formatMessage(messages.selfDeliver)
              : partnerMemberIds.includes(memberId || '')
              ? formatMessage(messages.delivered)
              : validateStatus === 'error'
              ? formatMessage(commonMessages.text.notFoundMemberEmail)
              : undefined}
          </FormErrorMessage>
        </FormControl>
      </CommonModal>
    </>
  )
}

const StyledCard = styled.div`
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06); ;
`

const GroupBuyingDisplayCard: React.VFC<{
  partnerMemberIds: string[]
  orderId: string
  imgUrl: string
  title: string
  notTransferred: boolean
  onRefetch?: (() => void) | null
}> = ({ partnerMemberIds, orderId, imgUrl, title, notTransferred, onRefetch }) => {
  return (
    <StyledCard className="p-4">
      <CustomRatioImage className="mb-3" width="100%" ratio={9 / 16} src={imgUrl || EmptyCover} />
      <StyledTitle className="mb-4">{title}</StyledTitle>
      {notTransferred && (
        <GroupBuyingDeliverModal
          partnerMemberIds={partnerMemberIds}
          orderId={orderId}
          title={title}
          onRefetch={onRefetch}
        />
      )}
    </StyledCard>
  )
}

export default GroupBuyingDisplayCard
