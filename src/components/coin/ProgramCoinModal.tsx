import { Button } from '@chakra-ui/react'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { handleError } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useEnrolledProgramIds, useProgram } from '../../hooks/program'
import EmptyCover from '../../images/empty-cover.png'
import { PeriodType } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'

const StyledBody = styled.div`
  padding: 2rem;
`
const StyledTitle = styled.div`
  display: box;
  box-orient: vertical;
  line-clamp: 2;
  max-height: 3rem;
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5rem;
  text-overflow: ellipsis;
`
const StyledPeriod = styled.span`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
`
const StyledCurrency = styled.span`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
`

const ProgramCoinModal: React.FC<
  ModalProps & {
    renderTrigger?: React.FC<{
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    }>
    programId: string
    periodAmount: number
    periodType: PeriodType
    projectPlanId: string
  }
> = ({ renderTrigger, programId, periodAmount, periodType, projectPlanId, ...props }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMember, currentMemberId } = useAuth()
  const { program } = useProgram(programId)
  const [visible, setVisible] = useState(false)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const isEnrolled = enrolledProgramIds.includes(programId)
  const targetProgramPlan = program?.plans.find(
    programPlan => programPlan.periodAmount === periodAmount && programPlan.periodType === periodType,
  )

  const { orderChecking, check, placeOrder, orderPlacing } = useCheck(
    targetProgramPlan ? [`ProgramPlan_${targetProgramPlan.id}`] : [],
    'Coin',
    null,
    targetProgramPlan
      ? { [`ProgramPlan_${targetProgramPlan.id}`]: { parentProductId: `ProjectPlan_${projectPlanId}` } }
      : {},
  )
  const isPaymentAvailable =
    !orderChecking &&
    sum(check.orderProducts.map(orderProduct => orderProduct.price)) ===
      sum(check.orderDiscounts.map(orderDiscount => orderDiscount.price))

  const handlePay = () => {
    placeOrder('perpetual', {
      name: currentMember?.name || currentMember?.username || '',
      phone: '',
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
        footer={null}
        centered
        destroyOnClose
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisible(false)}
        {...props}
      >
        <CustomRatioImage width="100%" ratio={9 / 16} src={program?.coverUrl || EmptyCover} />
        <StyledBody>
          <StyledTitle className="mb-3">{program?.title}</StyledTitle>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <StyledPeriod>
              {formatMessage(productMessages.programPackage.label.availableForLimitTime, {
                amount: periodAmount,
                unit:
                  periodType === 'D'
                    ? formatMessage(commonMessages.unit.day)
                    : periodType === 'W'
                    ? formatMessage(commonMessages.unit.week)
                    : periodType === 'M'
                    ? formatMessage(commonMessages.unit.monthWithQuantifier)
                    : periodType === 'Y'
                    ? formatMessage(commonMessages.unit.year)
                    : formatMessage(commonMessages.unit.unknown),
              })}
            </StyledPeriod>
            {targetProgramPlan?.listPrice && (
              <StyledCurrency>
                <PriceLabel listPrice={targetProgramPlan.listPrice} currencyId={targetProgramPlan.currency.id} />
              </StyledCurrency>
            )}
          </div>
          <Button
            colorScheme="primary"
            isFullWidth
            isDisabled={orderChecking || !isPaymentAvailable || isEnrolled}
            isLoading={orderChecking || orderPlacing}
            onClick={handlePay}
          >
            {isEnrolled ? '已使用代幣兌換' : formatMessage(commonMessages.button.useCoin)}
          </Button>
        </StyledBody>
      </Modal>
    </>
  )
}

export default ProgramCoinModal
