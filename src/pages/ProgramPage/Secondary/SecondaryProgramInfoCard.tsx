import dayjs from 'dayjs'
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
import { colors } from './style'

const StyledCountBlock = styled.div`
  text-align: center;
  width: 100%;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    justify-content: space-around;
  }
`
const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.teal};
`

const Content = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray3};
`

const layoutTemplateConfigMap: Record<string, string> = {
  expectedSections: '2d668b9d-9fd5-47a4-9fef-b24184287233',
  completeRelease: 'e687ae28-27f0-4f92-aa23-3194704b6d8b',
  expectedStartDate: '45ed6a40-bcb1-d478-88b6-a16ef3db1c92',
  expectedDuration: 'f3150ae5-9937-7244-f98b-2cb9401736d4',
}

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
  const expectedStartDate = program.moduleData?.[layoutTemplateConfigMap.expectedStartDate]
  const completeRelease = program.moduleData?.[layoutTemplateConfigMap.completeRelease]
  const expectedDuration = program.moduleData?.[layoutTemplateConfigMap.expectedDuration]
  const expectedSections = program.moduleData?.[layoutTemplateConfigMap.expectedSections]

  return (
    <StyledCountBlock>
      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <CalendarIcon />
        <Title data-testid="expectedStartDate">預計開課</Title>
        <Content>{expectedStartDate ? dayjs(expectedStartDate).format('YYYY/MM/DD') : '-'}</Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <TimeoverIcon />
        <Title>預計時長</Title>
        <Content>
          {expectedDuration ? (
            <>
              {expectedDuration}
              {formatMessage(commonMessages.unit.minute)}
            </>
          ) : (
            '-'
          )}
        </Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <ListIcon />
        <Title>預計章節</Title>
        <Content>
          {expectedSections ? (
            <>
              {expectedSections}
              {formatMessage(commonMessages.unit.chapter)}
            </>
          ) : (
            '-'
          )}
        </Content>
      </div>

      <div className="d-flex text-center flex-column align-items-center justify-content-center">
        <ListCheckIcon />
        <Title>全數上架</Title>
        <Content>{completeRelease ? dayjs(completeRelease).format('YYYY/MM/DD') : '-'}</Content>
      </div>
    </StyledCountBlock>
  )
}

export default SecondaryProgramInfoCard
