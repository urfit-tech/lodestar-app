import { gql, useMutation } from '@apollo/client'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Divider } from 'antd'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Input } from '../../components/common/CommonForm'
import CommonModal from '../../components/common/CommonModal'
import types from '../../hasura'
import { getRedeemLink, handleError } from '../../helpers'
import { codeMessages, commonMessages } from '../../helpers/translation'
import { useMemberValidation } from '../../hooks/common'
import voucherMessages from './translation'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledDivider = styled(Divider)`
  && {
    padding: 0.5rem;

    .ant-divider-inner-text {
      color: #9b9b9b;
      font-size: 12px;
    }
  }
`

const VoucherDeliverModal: React.VFC<{
  title: string
  voucherId: string
  onRefetch?: (() => void) | null
}> = ({ title, voucherId, onRefetch }) => {
  const toast = useToast()
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentMemberId, authToken } = useAuth()
  const [email, setEmail] = useState('')
  const [redeemLinkChecking, setRedeemLinkChecking] = useState(false)
  const [redeemLink, setRedeemLink] = useState('')

  const { memberId, validateStatus } = useMemberValidation(email)
  const memberStatus = memberId === currentMemberId ? 'error' : validateStatus

  const [updateVoucherMember] = useMutation<types.UPDATE_VOUCHER_MEMBER, types.UPDATE_VOUCHER_MEMBERVariables>(gql`
    mutation UPDATE_VOUCHER_MEMBER($voucherId: uuid!, $memberId: String!) {
      update_voucher_by_pk(pk_columns: { id: $voucherId }, _set: { member_id: $memberId }) {
        id
      }
    }
  `)

  useEffect(() => {
    if (!voucherId || !isOpen) {
      return
    }
    setRedeemLinkChecking(true)
    getRedeemLink('Voucher', voucherId, authToken)
      .then(({ data: { code, message, result } }) => {
        if (code === 'SUCCESS') {
          setRedeemLink(result.link)
        } else {
          throw new Error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
        }
      })
      .catch(handleError)
      .finally(() => setRedeemLinkChecking(false))
  }, [authToken, voucherId, isOpen, formatMessage])

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
          setEmail('')
        })
        .catch(handleError)
    }
  }

  return (
    <>
      <Button className="mr-2" variant="outline" onClick={onOpen}>
        {formatMessage(voucherMessages.VoucherDeliverModal.transfer)}
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
        <FormControl mb="5">
          <FormLabel>{formatMessage(voucherMessages.VoucherDeliverModal.giftLink)}</FormLabel>
          <InputGroup>
            <Input type="link" value={redeemLink} isReadOnly />
            <InputRightElement
              width="4.5rem"
              style={{
                backgroundColor: '#fff',
              }}
            >
              <Button
                variant="outline"
                isDisabled={!redeemLink}
                isLoading={redeemLinkChecking}
                style={{
                  borderTopRightRadius: '0.375rem',
                  borderBottomRightRadius: '0.375rem',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(redeemLink).then(() =>
                    toast({
                      title: 'copied',
                      status: 'success',
                      duration: 1500,
                      position: 'top',
                    }),
                  )
                }}
              >
                {formatMessage(voucherMessages.VoucherDeliverModal.copyLink)}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <StyledDivider>{formatMessage(commonMessages.defaults.or)}</StyledDivider>
        <FormControl isInvalid={memberId === currentMemberId || validateStatus === 'error'}>
          <FormLabel>{formatMessage(commonMessages.label.targetPartner)}</FormLabel>
          <Input
            type="email"
            status={memberStatus}
            defaultValue={email}
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
