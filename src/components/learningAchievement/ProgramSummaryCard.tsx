import { Spacer, Text } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as TotalProgramIcon } from '../../images/combined-shape.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  display: flex;
  height: 360px;
  width: auto%;
  flex-grow: 4;
  .ant-card-body {
    width: 100%;
  }
`

const TotalProgram = styled.div`
  height: 80px;
  padding: 8px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f4f4f4;
  width: 100%;
  color: var(--gray-darker);
`
const StyledProgramCategory = styled.div`
  width: 50%;
  height: 50px;
  padding: 8px;
  display: flex;
  border-radius: 8px;
  align-items: center;
  border: solid 1px var(--gray-light);
`

const StyledRowGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const StyledColGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  color: var(--gray-darker);
`

const TotalProgramImage = styled.div`
  position: absolute;
  bottom: 8px;
  z-index: 0;
`

const ProgramCategory: React.FC<{
  tagName: string
  tagCount: number
}> = ({ tagName, tagCount }) => {
  return (
    <StyledProgramCategory>
      <Text pl="3" fontSize="xs">
        {tagName}
      </Text>
      <Spacer />
      <Text pr="3" fontSize="xs" as="b">
        {tagCount}
      </Text>
    </StyledProgramCategory>
  )
}

type ProgramSummaryCardProps = Pick<LearnedStatistic, 'programCount' | 'programTagOptions'>

const ProgramSummaryCard: React.FC<ProgramSummaryCardProps> = ({ programCount, programTagOptions }) => {
  const { formatMessage } = useIntl()
  const tagCount = (tagName: '溝通表達' | '經營領導' | '心靈成長' | '職場專業' | '創業開店' | '健康家庭') =>
    programTagOptions?.find(data => data.tagName === tagName)?.count || 0
  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.ProgramSummaryCard.programInProgress)}
        </Text>
        <TotalProgram>
          <Text zIndex="1" fontSize="sm" pl="3">
            {formatMessage(learningAchievementMessages.ProgramSummaryCard.totalProgram)}
          </Text>
          <Spacer />
          <Text fontSize="3xl" as="b">
            {programCount}
          </Text>
          <Text zIndex="1" fontSize="sm" pr="3">
            &nbsp; {formatMessage(learningAchievementMessages.ProgramSummaryCard.programs)}
          </Text>
          <TotalProgramImage>
            <TotalProgramIcon />
          </TotalProgramImage>
        </TotalProgram>
        <StyledRowGrid>
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.communicationAndExpression)}
            tagCount={tagCount('溝通表達')}
          />
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.businessLeadership)}
            tagCount={tagCount('經營領導')}
          />
        </StyledRowGrid>
        <StyledRowGrid>
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.spiritualGrowth)}
            tagCount={tagCount('心靈成長')}
          />
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.professionalismInTheWorkplace)}
            tagCount={tagCount('職場專業')}
          />
        </StyledRowGrid>
        <StyledRowGrid>
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.entrepreneurshipAndStartingABusiness)}
            tagCount={tagCount('創業開店')}
          />
          <ProgramCategory
            tagName={formatMessage(learningAchievementMessages.ProgramSummaryCard.healthAndFamilyWellBeing)}
            tagCount={tagCount('健康家庭')}
          />
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default ProgramSummaryCard
