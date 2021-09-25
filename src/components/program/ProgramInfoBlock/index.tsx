import { Button } from '@chakra-ui/react'
import { Affix, Card } from 'antd'
import { isEmpty } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { usePublicMember } from '../../../hooks/member'
import { useEnrolledProgramIds } from '../../../hooks/program'
import {
  ProgramContentProps,
  ProgramContentSectionProps,
  ProgramPlanProps,
  ProgramProps,
  ProgramRoleProps,
} from '../../../types/program'
import ProgramPaymentButton from '../../checkout/ProgramPaymentButton'
import CountDownTimeBlock from '../../common/CountDownTimeBlock'
import { AvatarImage } from '../../common/Image'
import PriceLabel from '../../common/PriceLabel'
import Responsive from '../../common/Responsive'
import ProgramContentCountBlock from './ProgramContentCountBlock'
import ProgramGroupBuyingInfo from './ProgramGroupBuyingInfo'

const ProgramInfoCard = styled(Card)`
  && {
    margin-bottom: 2.5rem;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 1rem;
  }
`
const StyledInstructorName = styled.div`
  margin-bottom: 28px;
  color: #585858;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`

const StyledCountDownBlock = styled.div`
  margin-top: 15px;
  span {
    font-size: 14px;
  }
`

const ProgramInfoBlock: React.VFC<{
  program: ProgramProps & {
    roles: ProgramRoleProps[]
    plans: ProgramPlanProps[]
    contentSections: (ProgramContentSectionProps & {
      contents: ProgramContentProps[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''
  const { member } = usePublicMember(instructorId)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const { enabledModules } = useApp()

  const isEnrolled = enrolledProgramIds.includes(program.id)
  const isOnSale = (program.soldAt?.getTime() || 0) > Date.now()

  return (
    <>
      <Responsive.Default>
        <ProgramInfoCard>
          <ProgramContentCountBlock program={program} />
        </ProgramInfoCard>
      </Responsive.Default>

      <Responsive.Desktop>
        <Affix offsetTop={40} target={() => document.getElementById('layout-content')}>
          <ProgramInfoCard>
            {member && (
              <>
                <Link to={`/creators/${member.id}?tabkey=introduction`}>
                  <AvatarImage src={member.pictureUrl || ''} size={96} className="my-3 mx-auto" />
                </Link>
                <Link to={`/creators/${member.id}?tabkey=introduction`}>
                  <StyledInstructorName>{member.name}</StyledInstructorName>
                </Link>
              </>
            )}

            <ProgramContentCountBlock program={program} />

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
      </Responsive.Desktop>
    </>
  )
}

export default ProgramInfoBlock
