import { useQuery } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import { Divider, Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useEnrolledProgramIds } from '../../hooks/program'
import EmptyCover from '../../images/empty-cover.png'
import { CurrencyProps, PeriodType } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'

const messages = defineMessages({
  programPackageContent: { id: 'project.label.programPackageContent', defaultMessage: '課程內容' },
})

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
const StyledPlanTitle = styled.span`
  color: var(--gray-darker);
  line-height: 1.5rem;
  text-overflow: ellipsis;
`
const StyledCurrency = styled.span`
  color: var(--gray-darker);
  font-weight: bold;
`
const StyledProgramCollection = styled.div`
  height: 20rem;
  overflow: auto;
`
const StyledSubTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: var(--gray-darker);
`
const StyledPeriod = styled.span`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
`
const StyledProgramTitle = styled.div<{ disabled?: boolean }>`
  display: box;
  box-orient: vertical;
  line-clamp: 2;
  max-height: 3rem;
  overflow: hidden;
  color: var(--gray-darker);
  line-height: 1.5rem;
  text-overflow: ellipsis;
  opacity: ${props => props.disabled && 0.4};
`

const ProgramPackageCoinModal: React.VFC<
  ModalProps & {
    renderTrigger?: React.VFC<{
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    }>
    programPackageId: string
    periodAmount: number
    periodType: PeriodType
    projectPlanId: string
  }
> = ({ renderTrigger, programPackageId, periodAmount, periodType, projectPlanId, ...props }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMember, currentMemberId } = useAuth()
  const { programPackage } = useProgramPackageProgramCollection(programPackageId, periodAmount, periodType)
  const [visible, setVisible] = useState(false)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const { orderChecking, check, placeOrder, orderPlacing } = useCheck({
    productIds:
      programPackage?.programs
        .filter(program => program.plan && !enrolledProgramIds.includes(program.id))
        .map(program => `ProgramPlan_${program.plan?.id}`) || [],
    discountId: 'Coin',
    shipping: null,
    options:
      programPackage?.programs.reduce<{ [key: string]: any }>((accumulator, currentValue) => {
        if (!currentValue.plan) {
          return accumulator
        }

        return {
          ...accumulator,
          [`ProgramPlan_${currentValue.plan.id}`]: {
            parentProductId: `ProjectPlan_${projectPlanId}`,
            position: currentValue.position,
          },
        }
      }, {}) || {},
  })
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
        onCancel={() => setVisible(false)}
        {...props}
      >
        <StyledTitle className="mb-2">{programPackage?.title}</StyledTitle>
        <div className="d-flex align-items-center justify-content-between">
          <StyledPlanTitle>{programPackage?.programPackagePlan?.title}</StyledPlanTitle>
          <StyledCurrency>
            {programPackage?.programs.map(program => enrolledProgramIds.includes(program.id)).includes(false) && (
              <PriceLabel
                currencyId={programPackage?.programs[0]?.plan?.currency.id}
                listPrice={sum(
                  programPackage?.programs
                    .filter(program => !enrolledProgramIds.includes(program.id))
                    .map(program => program.plan?.listPrice || 0) || [],
                )}
              />
            )}
          </StyledCurrency>
        </div>
        <Divider className="my-3" />
        <div className="d-flex align-items-center justify-content-between mb-3">
          <StyledSubTitle>{formatMessage(messages.programPackageContent)}</StyledSubTitle>
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
        </div>
        <StyledProgramCollection className="mb-3">
          {programPackage?.programs.map(program => (
            <div key={program.id} className="d-flex align-items-center mb-2">
              <CustomRatioImage
                width="120px"
                ratio={9 / 16}
                src={program.coverUrl || EmptyCover}
                className="flex-shrink-0 mr-3"
                disabled={enrolledProgramIds.includes(program.id)}
              />
              <StyledProgramTitle className="flex-grow-1" disabled={enrolledProgramIds.includes(program.id)}>
                {program.title}
              </StyledProgramTitle>
            </div>
          ))}
        </StyledProgramCollection>

        <Button
          colorScheme="primary"
          isFullWidth
          isLoading={orderChecking || orderPlacing}
          isDisabled={
            orderChecking ||
            !isPaymentAvailable ||
            !programPackage?.programs.map(program => enrolledProgramIds.includes(program.id)).includes(false)
          }
          onClick={handlePay}
        >
          {programPackage?.programs.map(program => enrolledProgramIds.includes(program.id)).includes(false)
            ? formatMessage(commonMessages.button.useCoin)
            : '已使用代幣兌換'}
        </Button>
      </Modal>
    </>
  )
}

const useProgramPackageProgramCollection = (programPackageId: string, periodAmount: number, periodType: PeriodType) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION,
    hasura.GET_PROGRAM_PACKAGE_PROGRAM_COLLECTIONVariables
  >(
    gql`
      query GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION(
        $programPackageId: uuid!
        $periodAmount: numeric!
        $periodType: String!
      ) {
        program_package_by_pk(id: $programPackageId) {
          id
          title
          program_package_plans(
            where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }
            limit: 1
          ) {
            id
            title
          }
          program_package_programs(order_by: { position: asc }) {
            id
            position
            program {
              id
              cover_url
              title
              program_plans(
                where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }
                limit: 1
              ) {
                id
                title
                currency {
                  id
                  label
                  unit
                  name
                }
                list_price
              }
            }
          }
        }
      }
    `,
    { variables: { programPackageId, periodAmount, periodType } },
  )

  const programPackage: {
    id: string
    title: string
    programPackagePlan: {
      id: string
      title: string
    } | null
    programs: {
      id: string
      coverUrl: string | null
      title: string
      plan: {
        id: string
        title: string
        listPrice: number
        currency: CurrencyProps
      } | null
      position: number
    }[]
  } | null =
    loading || error || !data || !data.program_package_by_pk
      ? null
      : {
          id: data.program_package_by_pk.id,
          title: data.program_package_by_pk.title,
          programPackagePlan: data.program_package_by_pk.program_package_plans[0]
            ? {
                id: data.program_package_by_pk.program_package_plans[0].id,
                title: data.program_package_by_pk.program_package_plans[0].title,
              }
            : null,
          programs: data.program_package_by_pk.program_package_programs.map(v => ({
            id: v.program.id,
            coverUrl: v.program.cover_url,
            title: v.program.title,
            plan: v.program.program_plans[0]
              ? {
                  id: v.program.program_plans[0].id,
                  title: v.program.program_plans[0].title || '',
                  listPrice: v.program.program_plans[0].list_price,
                  currency: {
                    id: v.program.program_plans[0].currency.id,
                    label: v.program.program_plans[0].currency.label,
                    unit: v.program.program_plans[0].currency.unit,
                    name: v.program.program_plans[0].currency.name,
                  },
                }
              : null,
            position: v.position,
          })),
        }

  return {
    loadingProgramPackage: loading,
    errorProgramPackage: error,
    programPackage,
    refetchProgramPackage: refetch,
  }
}

export default ProgramPackageCoinModal
