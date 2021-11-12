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
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { Input } from '../../components/common/CommonForm'
import CommonModal from '../../components/common/CommonModal'
import types from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useMemberValidation } from '../../hooks/common'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const messages = defineMessages({
  transfer: { id: 'common.text.transfer', defaultMessage: '轉贈' },
})

const VoucherDeliverModal: React.VFC<{
  title: string
  voucherId: string
  onRefetch?: (() => void) | null
}> = ({ title, voucherId, onRefetch }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [email, setEmail] = useState('')
  const { currentMemberId } = useAuth()
  const { memberId, validateStatus } = useMemberValidation(email)
  const memberStatus = memberId === currentMemberId ? 'error' : validateStatus

  const toast = useToast()
  const [updateVoucherMember] = useMutation<types.UPDATE_VOUCHER_MEMBER, types.UPDATE_VOUCHER_MEMBERVariables>(gql`
    mutation UPDATE_VOUCHER_MEMBER($voucherId: uuid!, $memberId: String!) {
      update_voucher_by_pk(pk_columns: { id: $voucherId }, _set: { member_id: $memberId }) {
        id
      }
    }
  `)

  const handleSubmit = () => {
    if (memberId) {
      updateVoucherMember({
        variables: {
          voucherId,
          memberId,
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
          onClose()
        })
        .catch(handleError)
    }
  }

  return (
    <>
      <Button className="mr-2" variant="outline" onClick={onOpen}>
        {formatMessage(messages.transfer)}
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
              isDisabled={memberId === currentMemberId || [undefined, 'error', 'validating'].includes(validateStatus)}
              onClick={handleSubmit}
            >
              {formatMessage(commonMessages.ui.send)}
            </Button>
          </ButtonGroup>
        )}
        closeOnOverlayClick={false}
      >
        <StyledTitle className="mb-4">{title}</StyledTitle>
        <FormControl isInvalid={memberId === currentMemberId || validateStatus === 'error'}>
          <FormLabel>{formatMessage(commonMessages.label.targetPartner)}</FormLabel>
          <Input
            type="email"
            status={memberStatus}
            placeholder={formatMessage(commonMessages.text.fillInEnrolledEmail)}
            onBlur={e => setEmail(e.target.value)}
          />
          <FormErrorMessage>
            {memberId === currentMemberId
              ? formatMessage(commonMessages.text.selfDeliver)
              : validateStatus === 'error'
              ? formatMessage(commonMessages.text.notFoundMemberEmail)
              : undefined}
          </FormErrorMessage>
        </FormControl>
      </CommonModal>
    </>
  )
}

export default VoucherDeliverModal
