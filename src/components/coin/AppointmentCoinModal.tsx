import { Button, Divider, SkeletonText } from '@chakra-ui/react'
import { Form, Input } from 'antd'
import Modal, { ModalProps } from 'antd/lib/modal'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { validationRegExp } from 'lodestar-app-element/src/helpers'
import moment from 'moment'
import { sum } from 'ramda'
import React, { useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { dateRangeFormatter, handleError } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { useAppointmentPlan } from '../../hooks/appointment'
import { useCheck } from '../../hooks/checkout'
import DefaultAvatar from '../../images/avatar.svg'
import { AppointmentPeriod } from '../../types/appointment'
import AppointmentPeriodCollection from '../appointment/AppointmentPeriodCollection'
import DiscountSelectionCard from '../checkout/DiscountSelectionCard'
import { CustomRatioImage } from '../common/Image'

const messages = defineMessages({
  periodDurationAtMost: { id: 'appointment.text.periodDurationAtMost', defaultMessage: '諮詢一次 {duration} 分鐘為限' },
  makeAppointment: { id: 'appointment.ui.makeAppointment', defaultMessage: '預約諮詢' },
  phonePlaceholder: { id: 'appointment.text.phonePlaceholder', defaultMessage: '填寫手機以便發送簡訊通知' },
  selectDiscount: { id: 'appointment.label.selectDiscount', defaultMessage: '使用折扣' },
  contactInformation: { id: 'appointment.label.contactInformation', defaultMessage: '聯絡資訊' },
})

const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
`
const StyledPlanTitle = styled.div`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
`
const StyledSubTitle = styled.div`
  color: var(--gray-darker);
  font-weight: bold;
`
const StyledMeta = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
`
const StyledBody = styled.div`
  max-height: 30rem;
  overflow: auto;
`
const StyledPeriod = styled.div`
  color: ${props => props.theme['@primary-color']};
`

const AppointmentCoinModal: React.VFC<
  ModalProps & {
    renderTrigger?: React.VFC<{
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    }>
    appointmentPlanId: string
  }
> = ({ renderTrigger, appointmentPlanId, onCancel, ...props }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMember } = useAuth()
  const { loadingAppointmentPlan, appointmentPlan } = useAppointmentPlan(appointmentPlanId)

  const phoneInputRef = useRef<Input | null>(null)
  const [visible, setVisible] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<AppointmentPeriod | null>(null)
  const [discountId, setDiscountId] = useState<string | null>(null)

  const { orderChecking, check, placeOrder, orderPlacing } = useCheck({
    productIds: [`AppointmentPlan_${appointmentPlanId}`],
    discountId: discountId && discountId.split('_')[1] ? discountId : 'Coin',
    shipping: null,
    options: {
      [`AppointmentPlan_${appointmentPlanId}`]: { startedAt: selectedPeriod?.startedAt },
    },
  })
  const isPaymentAvailable =
    !orderChecking &&
    sum(check.orderProducts.map(orderProduct => orderProduct.price)) ===
      sum(check.orderDiscounts.map(orderDiscount => orderDiscount.price))

  const handlePay = () => {
    const phone = phoneInputRef.current?.input.value || ''
    if (!validationRegExp.phone.test(phone)) {
      return
    }

    placeOrder('perpetual', {
      name: currentMember?.name || currentMember?.username || '',
      phone,
      email: currentMember?.email || '',
    })
      .then(taskId => {
        history.push(`/tasks/order/${taskId}`)
      })
      .catch(handleError)
  }

  return (
    <>
      {renderTrigger && renderTrigger({ setVisible })}

      <Modal
        width="24rem"
        title={null}
        footer={null}
        centered
        destroyOnClose
        visible={visible}
        {...props}
        onCancel={e => {
          setSelectedPeriod(null)
          setVisible(false)
          onCancel && onCancel(e)
        }}
      >
        {loadingAppointmentPlan || !appointmentPlan ? (
          <SkeletonText mt="1" noOfLines={4} spacing="4" />
        ) : (
          <>
            <div className="d-flex align-self-start mb-4">
              <div className="flex-shrink-0">
                <CustomRatioImage
                  width="5rem"
                  ratio={1}
                  src={appointmentPlan.creator.avatarUrl || DefaultAvatar}
                  shape="circle"
                  className="mr-3"
                />
              </div>
              <div className="flex-grow-1">
                <StyledTitle className="mb-1">{appointmentPlan.creator.name}</StyledTitle>
                <div className="mb-1">{appointmentPlan.creator.abstract}</div>
                <StyledMeta>
                  {formatMessage(messages.periodDurationAtMost, { duration: appointmentPlan.duration })}
                </StyledMeta>
              </div>
            </div>
            <StyledPlanTitle className="d-flex align-items-center justify-content-between">
              <div>{appointmentPlan.title}</div>
              <PriceLabel listPrice={appointmentPlan.price} currencyId={appointmentPlan.currency.id} />
            </StyledPlanTitle>

            <Divider className="my-3" />

            <StyledBody>
              {selectedPeriod ? (
                <>
                  <StyledPeriod className="mb-4">
                    {dateRangeFormatter({
                      startedAt: selectedPeriod.startedAt,
                      endedAt: selectedPeriod.endedAt,
                    })}
                  </StyledPeriod>

                  <div className="mb-3">
                    <StyledSubTitle>{formatMessage(messages.selectDiscount)}</StyledSubTitle>
                    <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
                  </div>

                  <StyledSubTitle>{formatMessage(messages.contactInformation)}</StyledSubTitle>
                  <Form.Item
                    label={formatMessage(checkoutMessages.form.message.phone)}
                    required
                    colon={false}
                    className="mb-3"
                  >
                    <Input ref={phoneInputRef} placeholder={formatMessage(messages.phonePlaceholder)} />
                  </Form.Item>

                  <Button
                    colorScheme="primary"
                    isFullWidth
                    isDisabled={orderChecking || !isPaymentAvailable}
                    isLoading={orderChecking || orderPlacing}
                    onClick={handlePay}
                  >
                    {formatMessage(messages.makeAppointment)}
                  </Button>
                </>
              ) : (
                <AppointmentPeriodCollection
                  appointmentPeriods={appointmentPlan.periods.filter(
                    period => moment(period.startedAt) > moment().endOf('isoWeek'),
                  )}
                  onClick={period => setSelectedPeriod(period)}
                />
              )}
            </StyledBody>
          </>
        )}
      </Modal>
    </>
  )
}

export default AppointmentCoinModal
