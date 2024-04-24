import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BREAK_POINT } from '../../../components/common/Responsive'
import { commonMessages } from '../../../helpers/translation'
import { ReactComponent as CalendarIcon } from '../../../images/calendar-alt-v-2-o.svg'
import { ReactComponent as TimeoverIcon } from '../../../images/icon-timeover-alt-o.svg'
import { ReactComponent as ListCheckIcon } from '../../../images/list-check-o.svg'
import { ReactComponent as ListIcon } from '../../../images/list-o-program.svg'
import { Category } from '../../../types/general'
import { Program, ProgramContent, ProgramContentSection, ProgramPlan, ProgramRole } from '../../../types/program'

const StyledCountBlock = styled.div`
  text-align: center;
  width: 100%;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-around;
  }
`
const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #009d96;
`

const Content = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #4a4a4a;
`

const SecondaryProgramInfoCard: React.FC<{
  program: Program & {
    roles: ProgramRole[]
    categories: Category[]
    plans: ProgramPlan[]
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()

  const totalDuration = sum(
    program.contentSections?.map(programContentSection =>
      sum(programContentSection.contents.map(programContent => programContent.duration || 0) || []),
    ) || [],
  )

  return (
    <StyledCountBlock className="mb-5">
      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <CalendarIcon />
        <Title>預計開課</Title>
        <Content>
          {Math.floor(totalDuration / 60)}
          {formatMessage(commonMessages.unit.min)}
        </Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <TimeoverIcon />
        <Title>預計時長</Title>
        <Content>
          {Math.floor(totalDuration / 60)}
          {formatMessage(commonMessages.unit.min)}
        </Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <ListIcon />
        <Title>預計章節</Title>
        <Content>
          {program.contentSections.filter(programContentSection => programContentSection.contents.length).length}
          {formatMessage(commonMessages.unit.chapter)}
        </Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <ListCheckIcon />
        <Title>全數上架</Title>
        <Content>
          {Math.floor(totalDuration / 60)}
          {formatMessage(commonMessages.unit.min)}
        </Content>
      </div>
    </StyledCountBlock>
  )
}

export default SecondaryProgramInfoCard
