import { Affix, Button, Card } from 'antd'
import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { usePublicMember } from '../../hooks/member'
import { useEnrolledProgramIds } from '../../hooks/program'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import ProgramPaymentButton from '../checkout/ProgramPaymentButton'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { AvatarImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'
import Responsive, { BREAK_POINT } from '../common/Responsive'

const ProgramInforCard = styled(Card)`
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
const StyledCountBlock = styled.div`
  text-align: center;

  > div {
    padding: 0 1.5rem;
    height: 2.5rem;
    padding-bottom: 0.25rem;
  }
  > div + div {
    border-left: 1px solid #ececec;
  }

  span:first-child {
    color: #585858;
    font-size: 24px;
    letter-spacing: 0.2px;
  }
  span:last-child {
    color: #9b9b9b;
    font-size: 14px;
    letter-spacing: 0.4px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 2rem;
  }
`
const StyledCountDownBlock = styled.div`
  margin-top: 15px;
  span {
    font-size: 14px;
  }
`

const ProgramInfoBlock: React.FC<{
  program: ProgramProps & {
    roles: ProgramRoleProps[]
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

  const isEnrolled = enrolledProgramIds.includes(program.id)
  const isOnSale = (program.soldAt?.getTime() || 0) > Date.now()

  return (
    <>
      <Responsive.Default>
        <ProgramInforCard>
          <ProgramContentCountBlock program={program} />
        </ProgramInforCard>
      </Responsive.Default>

      <Responsive.Desktop>
        <Affix offsetTop={40} target={() => document.getElementById('layout-content')}>
          <ProgramInforCard>
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
              <PriceLabel
                variant="inline"
                listPrice={program.listPrice || 0}
                salePrice={isOnSale ? program.salePrice || 0 : undefined}
              />
              {program.isCountdownTimerVisible && program?.soldAt && isOnSale && (
                <StyledCountDownBlock>
                  <CountDownTimeBlock expiredAt={program.soldAt} icon />
                </StyledCountDownBlock>
              )}
            </div>

            {isEnrolled ? (
              <Link to={`/programs/${program.id}/contents`}>
                <Button block>{formatMessage(commonMessages.button.enter)}</Button>
              </Link>
            ) : (
              <ProgramPaymentButton program={program} variant="multiline" />
            )}
          </ProgramInforCard>
        </Affix>
      </Responsive.Desktop>
    </>
  )
}

const ProgramContentCountBlock: React.FC<{
  program: ProgramProps & {
    contentSections: (ProgramContentSectionProps & {
      contents: ProgramContentProps[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const numProgramContents = sum(
    program.contentSections.map(programContentSection => programContentSection.contents.length),
  )

  const totalDuration = sum(
    program.contentSections?.map(programContentSection =>
      sum(programContentSection.contents.map(programContent => programContent.duration || 0) || []),
    ) || [],
  )

  return (
    <StyledCountBlock className="d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column justify-content-center">
        <span>{Math.floor(totalDuration / 60)}</span>
        <span>{formatMessage(commonMessages.unit.min)}</span>
      </div>
      <div className="d-flex flex-column justify-content-center">
        <span>
          {program.contentSections.filter(programContentSection => programContentSection.contents.length).length}
        </span>
        <span>{formatMessage(commonMessages.unit.chapter)}</span>
      </div>
      <div className="d-flex flex-column justify-content-center">
        <span>{numProgramContents}</span>
        <span>{formatMessage(commonMessages.unit.content)}</span>
      </div>
    </StyledCountBlock>
  )
}

export default ProgramInfoBlock
