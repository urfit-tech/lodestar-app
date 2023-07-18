import { gql, useQuery } from '@apollo/client'
import { Button, Divider, Icon, Input, Spinner, Text } from '@chakra-ui/react'
import { Checkbox, message, Modal } from 'antd'
import axios from 'axios'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import ProductItem from '../../components/common/ProductItem'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { fetchCurrentGeolocation } from '../../hooks/util'
import { ReactComponent as EmptyBoxIcon } from '../../images/icons-empty-box.svg'
import voucherMessages from './translation'

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
  white-space: pre-wrap;
`
const StyledNotice = styled.div`
  margin-bottom: 2rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const VoucherExchangeModal: React.VFC<{
  voucherId: string
  voucherPlanId: string
  productQuantityLimit: number
  description: string | null
  productIds: string[]
  disabledProductIds: string[]
  loading: boolean
  onLoading?: (status: boolean) => void
  onRefetch?: () => void
}> = ({
  voucherId,
  voucherPlanId,
  productQuantityLimit,
  description,
  productIds,
  disabledProductIds,
  loading,
  onLoading,
  onRefetch,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken } = useAuth()
  const [visible, setVisible] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [hasPinCode, setHasPinCode] = useState(false)
  const [pinCode, setPinCode] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)

  // check the validity of product which type is ActivityTicket
  // session ended_at and ticket buy
  const {
    loading: loadingValidityCheck,
    error,
    data: validActivityTicketIds,
  } = useQuery<hasura.GET_VALID_ACTIVITY_TICKET>(GET_VALID_ACTIVITY_TICKET, {
    variables: {
      activityTicketIds: productIds.filter(v => v.split('_')[0] === 'ActivityTicket').map(v => v.split('_')[1]),
    },
  })

  const validProductIds: string[] = productIds.filter(v =>
    v.split('_')[0] === 'ActivityTicket'
      ? validActivityTicketIds?.activity_ticket_enrollment_count.find(w => w.activity_ticket_id === v.split('_')[1])
      : v,
  )

  const exchangeVoucher = async (selectedProductIds: string[], voucherId: string) => {
    onLoading?.(true)
    setExchanging(true)

    const { ip, country, countryCode } = await fetchCurrentGeolocation()
    message.info(formatMessage(voucherMessages.VoucherExchangeModal.exchangingInfo))
    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/order/create`,
        {
          paymentModel: { type: 'perpetual' },
          discountId: `Voucher_${voucherId}`,
          productIds: selectedProductIds,
          invoice: {},
          geolocation: { ip: ip || '', country: country || '', countryCode: countryCode || '' },
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(res => {
        if (res.data.code.split('_')[0] === 'E') {
          message.error(formatMessage(voucherMessages.VoucherExchangeModal.exchangingError))
        } else {
          message.success(formatMessage(voucherMessages.VoucherExchangeModal.exchangeVoucher))
          onRefetch?.()
        }
      })
      .catch(error => handleError(error))
      .finally(() => {
        onLoading?.(false)
        setExchanging(false)
        setVisible(false)
        setHasPinCode(false)
        setSelectedProductIds([])
      })
  }

  const handleExchange = async (voucherPlanId: string) => {
    onLoading?.(true)
    setExchanging(true)

    if (!currentMemberId) {
      return
    }

    await axios
      .get(`${process.env.REACT_APP_API_BASE_ROOT}/voucher/pin-code/${voucherPlanId}`, {
        headers: { authorization: `Bearer ${authToken}` },
      })
      .then(res => {
        if (res.data.result.hasPinCode) {
          setHasPinCode(res.data.result.hasPinCode)
          onLoading?.(false)
          setExchanging(false)
          return
        } else {
          exchangeVoucher(selectedProductIds, voucherId)
        }
      })
      .catch(error => handleError(error))
  }

  const handleExchangeWithPinCode = async (voucherPlanId: string, pinCode: string | null) => {
    onLoading?.(true)
    setExchanging(true)

    if (!pinCode) {
      return message.info(formatMessage(voucherMessages.VoucherExchangeModal.pleaseEnterPinCode))
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/voucher/pin-code/${voucherPlanId}`,
        {
          pinCode,
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(res => {
        if (res.data.result.pinCodeCorrect) {
          exchangeVoucher(selectedProductIds, voucherId)
        } else {
          onLoading?.(false)
          setExchanging(false)
          return message.error(formatMessage(voucherMessages.VoucherExchangeModal.errorPinCode))
        }
      })
      .catch(error => handleError(error))
  }

  return (
    <>
      <Button
        isLoading={loading}
        loadingText={formatMessage(voucherMessages.VoucherExchangeModal.exchanging)}
        colorScheme="primary"
        onClick={() => setVisible(true)}
      >
        {formatMessage(voucherMessages.VoucherExchangeModal.useNow)}
      </Button>

      <Modal
        centered
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={() => {
          onLoading?.(false)
          setExchanging(false)
          setVisible(false)
        }}
      >
        {hasPinCode ? (
          <>
            <StyledTitle className="mb-4">
              {formatMessage(voucherMessages.VoucherExchangeModal.pleaseEnterPinCode)}
            </StyledTitle>

            <Text className="mb-2">{formatMessage(voucherMessages.VoucherExchangeModal.pinCode)}：</Text>
            <Input
              className="mb-3"
              pinCode={pinCode}
              onChange={e => setPinCode(e.target.value)}
              disabled={loading || exchanging}
            />
            <div className="text-right">
              <Button
                className="mr-2"
                onClick={() => {
                  setVisible(false)
                  setHasPinCode(false)
                  setSelectedProductIds([])
                }}
              >
                {formatMessage(voucherMessages['*'].cancel)}
              </Button>
              <Button
                colorScheme="primary"
                isLoading={loading}
                isDisabled={selectedProductIds.length === 0 || selectedProductIds.length > productQuantityLimit}
                onClick={() => handleExchangeWithPinCode(voucherPlanId, pinCode)}
              >
                {formatMessage(voucherMessages['*'].send)}
              </Button>
            </div>
          </>
        ) : validProductIds.length === 0 ? (
          <div className="d-flex flex-column align-items-center p-5">
            <Icon as={EmptyBoxIcon} className="mb-4" w="90px" h="90px" />
            <StyledNotice className="d-flex flex-column align-items-center">
              <div>{formatMessage(voucherMessages.VoucherExchangeModal.emptyNoticeText)}</div>
              <div>{formatMessage(voucherMessages.VoucherExchangeModal.emptyNoticeText2)}</div>
            </StyledNotice>
            <div>
              <Button
                w="145px"
                color="var(--gray-darker)"
                fontSize="16px"
                lineHeight="24px"
                borderRadius="4px"
                border="solid 1px var(--gray)"
                variant="outline"
                onClick={() => setVisible(false)}
              >
                {formatMessage(voucherMessages['*'].close)}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <StyledTitle className="mb-2">
              {formatMessage(voucherMessages.VoucherExchangeModal.productQuantityLimitText, {
                productQuantityLimit: productQuantityLimit,
              })}
            </StyledTitle>
            <StyledDescription className="mb-2">{description}</StyledDescription>
            <StyledNotice>{formatMessage(voucherMessages.VoucherExchangeModal.notice)}</StyledNotice>

            {loadingValidityCheck ? (
              <Spinner />
            ) : error ? (
              <>something went wrong.</>
            ) : (
              validProductIds.map(productId => (
                <div key={productId}>
                  <div className="d-flex align-items-center justify-content-start">
                    <Checkbox
                      className="mr-4"
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedProductIds([...selectedProductIds, productId])
                        } else {
                          setSelectedProductIds(selectedProductIds.filter(id => id !== productId))
                        }
                      }}
                      disabled={
                        disabledProductIds.includes(productId) ||
                        (!selectedProductIds.includes(productId) && selectedProductIds.length >= productQuantityLimit)
                      }
                    />
                    <ProductItem id={productId} />
                  </div>

                  <Divider className="my-4" />
                </div>
              ))
            )}

            <div className="text-right">
              <Button
                className="mr-2"
                onClick={() => {
                  setExchanging(false)
                  setVisible(false)
                  setSelectedProductIds([])
                }}
              >
                {formatMessage(voucherMessages['*'].cancel)}
              </Button>
              <Button
                colorScheme="primary"
                isLoading={loading || exchanging || loadingValidityCheck}
                isDisabled={selectedProductIds.length === 0 || selectedProductIds.length > productQuantityLimit}
                onClick={() => handleExchange(voucherPlanId)}
              >
                {formatMessage(voucherMessages.VoucherExchangeModal.exchange)}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

const GET_VALID_ACTIVITY_TICKET = gql`
  query GET_VALID_ACTIVITY_TICKET($activityTicketIds: [uuid!]) {
    activity_ticket_enrollment_count(
      where: {
        buyable_quantity: { _gt: "0" }
        activity_ticket_id: { _in: $activityTicketIds }
        activity_ticket: { activity_session_tickets: { activity_session: { ended_at: { _gt: "now()" } } } }
      }
    ) {
      buyable_quantity
      activity_ticket_id
    }
  }
`

export default VoucherExchangeModal
