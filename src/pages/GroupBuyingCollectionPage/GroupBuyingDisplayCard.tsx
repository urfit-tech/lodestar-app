import { useMutation } from '@apollo/client'
import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import gql from 'graphql-tag'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Input } from '../../components/common/CommonForm'
import CommonModal from '../../components/common/CommonModal'
import { CustomRatioImage } from '../../components/common/Image'
import types from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useMemberValidation } from '../../hooks/common'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

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
              ? formatMessage(commonMessages.text.selfDeliver)
              : partnerMemberIds.includes(memberId || '')
              ? formatMessage(commonMessages.text.delivered)
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
  background: white;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06); ;
`
const StyledCardMeta = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const GroupBuyingDisplayCard: React.VFC<{
  partnerMemberIds: string[]
  orderId: string
  imgUrl: string
  title: string
  transferredAt: Date | null
  sentByCurrentMember: boolean
  memberEmail: string | null
  onRefetch?: (() => void) | null
}> = ({ partnerMemberIds, orderId, imgUrl, title, transferredAt, sentByCurrentMember, memberEmail, onRefetch }) => {
  const { formatMessage } = useIntl()
  return (
    <StyledCard className="p-4">
      <CustomRatioImage className="mb-3" width="100%" ratio={9 / 16} src={imgUrl || EmptyCover} />
      <StyledTitle>{title}</StyledTitle>
      {transferredAt ? (
        <>
          <Divider className="my-3" />
          <StyledCardMeta>
            <div className="d-flex">
              <Icon as={UserOIcon} className="my-auto mr-1" />
              <span>
                {sentByCurrentMember
                  ? formatMessage(commonMessages.label.target)
                  : formatMessage(commonMessages.label.from)}
                {memberEmail}
              </span>
            </div>
            <div className="d-flex">
              <Icon as={CalendarAltOIcon} className="my-auto  mr-1" />
              <span>
                {formatMessage(commonMessages.label.date)}
                {moment(transferredAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
          </StyledCardMeta>
        </>
      ) : (
        <div className="mt-3">
          <GroupBuyingDeliverModal
            partnerMemberIds={partnerMemberIds}
            orderId={orderId}
            title={title}
            onRefetch={onRefetch}
          />
        </div>
      )}
    </StyledCard>
  )
}

export default GroupBuyingDisplayCard
