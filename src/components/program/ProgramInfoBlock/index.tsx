import { Button } from '@chakra-ui/react'
import { Affix } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { isEmpty } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { useEnrolledProgramIds } from '../../../hooks/program'
import { Category } from '../../../types/general'
import { Program, ProgramContent, ProgramContentSection, ProgramPlan, ProgramRole } from '../../../types/program'
import ProgramPaymentButton from '../../checkout/ProgramPaymentButton'
import CountDownTimeBlock from '../../common/CountDownTimeBlock'
import PriceLabel from '../../common/PriceLabel'
import Responsive from '../../common/Responsive'
import ProgramContentCountBlock from './ProgramContentCountBlock'
import ProgramGroupBuyingInfo from './ProgramGroupBuyingInfo'
import ProgramInfoCard, { StyledProgramInfoCard } from './ProgramInfoCard'
import ProgramPlanPaymentButton from './ProgramPlanPaymentButton'

const StyledCountDownBlock = styled.div`
  margin-top: 15px;
  span {
    font-size: 14px;
  }
`

const ProgramInfoBlock: React.VFC<
  (
    | {
        variant: 'perpetual'
        programPlan?: never
      }
    | {
        variant: 'subscription'
        programPlan: ProgramPlan
      }
  ) & {
    program: Program & {
      roles: ProgramRole[]
      categories: Category[]
      plans: ProgramPlan[]
      contentSections: (ProgramContentSection & {
        contents: ProgramContent[]
      })[]
    }
  }
> = ({ variant, program, programPlan }) => {
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''
  const isOnSale = (program.soldAt?.getTime() || 0) > Date.now()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const isEnrolled = enrolledProgramIds.includes(program.id)

  return (
    <>
      <Responsive.Default>
        <StyledProgramInfoCard>
          <ProgramContentCountBlock program={program} />
        </StyledProgramInfoCard>
      </Responsive.Default>

      <Responsive.Desktop>
        {variant === 'perpetual' ? (
          <Affix offsetTop={40} target={() => document.getElementById('layout-content')}>
            <ProgramInfoCard instructorId={instructorId} program={program}>
              <div className="text-center mb-3">
                {isEmpty(program.plans.filter(v => v.publishedAt)) && (
                  <PriceLabel
                    variant="inline"
                    listPrice={program.listPrice || 0}
                    salePrice={isOnSale ? program.salePrice || 0 : undefined}
                  />
                )}
                {program.isCountdownTimerVisible && program?.soldAt && isOnSale && (
                  <StyledCountDownBlock>
                    <CountDownTimeBlock expiredAt={program.soldAt} icon />
                  </StyledCountDownBlock>
                )}
              </div>

              {isEnrolled ? (
                <Link to={`/programs/${program.id}/contents`}>
                  <Button variant="outline" colorScheme="primary" isFullWidth>
                    {formatMessage(commonMessages.button.enter)}
                  </Button>
                </Link>
              ) : enabledModules.group_buying && program.plans.filter(v => v.publishedAt).length > 0 ? (
                <ProgramGroupBuyingInfo
                  isOnSale={isOnSale}
                  program={program}
                  programPlans={program.plans.filter(v => v.publishedAt)}
                />
              ) : (
                <ProgramPaymentButton program={program} variant="multiline" />
              )}
            </ProgramInfoCard>
          </Affix>
        ) : variant === 'subscription' && programPlan ? (
          <ProgramInfoCard instructorId={instructorId} program={program}>
            <div className="text-center mb-3">
              <PriceLabel
                variant="inline"
                listPrice={programPlan.listPrice || 0}
                salePrice={isOnSale ? programPlan.salePrice || 0 : undefined}
              />
            </div>

            {isEnrolled ? (
              <Link to={`/programs/${program.id}/contents`}>
                <Button variant="outline" colorScheme="primary" isFullWidth>
                  {formatMessage(commonMessages.button.enter)}
                </Button>
              </Link>
            ) : (
              <ProgramPlanPaymentButton programPlan={programPlan} />
            )}
          </ProgramInfoCard>
        ) : null}
      </Responsive.Desktop>
    </>
  )
}

export default ProgramInfoBlock
