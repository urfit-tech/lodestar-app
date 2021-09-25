import { Button } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledProgramIds } from '../../hooks/program'
import { ProgramPlanProps, ProgramProps } from '../../types/program'
import ProgramPaymentButton from '../checkout/ProgramPaymentButton'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import PriceLabel from '../common/PriceLabel'
import ProgramGroupBuyingInfo from './ProgramInfoBlock/ProgramGroupBuyingInfo'

const StyledWrapper = styled.div`
  background: white;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
`
const StyledCountDownBlock = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
  span {
    font-size: 14px;
  }
`

const ProgramPerpetualPlanCard: React.VFC<{
  memberId: string
  program: ProgramProps & {
    plans: ProgramPlanProps[]
  }
}> = ({ memberId, program }) => {
  const { enrolledProgramIds } = useEnrolledProgramIds(memberId)
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()

  const isEnrolled = enrolledProgramIds.includes(program.id)
  const isOnSale = (program.soldAt?.getTime() || 0) > Date.now()

  return (
    <StyledWrapper className="py-2">
      <div className="container">
        {isEnrolled ? (
          <Link to={`/programs/${program.id}/contents`}>
            <Button colorScheme="primary" isFullWidth>
              {formatMessage(commonMessages.button.enter)}
            </Button>
          </Link>
        ) : enabledModules.group_buying && program.plans.filter(v => v.publishedAt).length > 0 ? (
          <ProgramGroupBuyingInfo
            isOnSale={isOnSale}
            program={program}
            programPlans={program.plans.filter(v => v.publishedAt)}
            hideProgramPlanPrice
          />
        ) : (
          <>
            <div className="text-center mb-2">
              <PriceLabel
                variant="inline"
                listPrice={program.listPrice || 0}
                salePrice={isOnSale ? program.salePrice : undefined}
              />
              {program.isCountdownTimerVisible && program?.soldAt && isOnSale && (
                <StyledCountDownBlock>
                  <CountDownTimeBlock expiredAt={program.soldAt} icon />
                </StyledCountDownBlock>
              )}
            </div>
            <ProgramPaymentButton program={program} />
          </>
        )}
      </div>
    </StyledWrapper>
  )
}

export default ProgramPerpetualPlanCard
