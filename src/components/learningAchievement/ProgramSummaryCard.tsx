import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as TotalProgramIcon } from '../../images/combined-shape.svg'
import AdminCard from '../../components/common/AdminCard'
import styled from 'styled-components'
import { Spacer, Text } from '@chakra-ui/react'
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

const programSummaryData = {
  programCount: 5,
}

const ProgramCategory: React.FC<{
  tagName: string | undefined
  tagCount: number | undefined
}> = ({ tagName, tagCount }) => {
  return (
    <StyledProgramCategory>
      <Text fontSize="xs">{tagName}</Text>
      <Spacer />
      <Text fontSize="xs" as="b">
        {tagCount}
      </Text>
    </StyledProgramCategory>
  )
}

const ProgramSummaryCard: React.FC = () => {
  const { formatMessage } = useIntl()
  const { programCount } = programSummaryData
  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.ProgramSummaryCard.programInProgress)}
        </Text>
        <TotalProgram>
          <Text zIndex="1" fontSize="sm">
            {formatMessage(learningAchievementMessages.ProgramSummaryCard.totalProgram)}
          </Text>
          <Spacer />
          <Text fontSize="3xl" as="b">
            {programCount}
          </Text>
          <Text zIndex="1" fontSize="sm">
            {' '}
            &nbsp; {formatMessage(learningAchievementMessages.ProgramSummaryCard.programs)}
          </Text>
          <TotalProgramImage>
            <TotalProgramIcon />
          </TotalProgramImage>
        </TotalProgram>
        <StyledRowGrid>
          <ProgramCategory tagName="Tag" tagCount={123} />
          <ProgramCategory tagName="Tag" tagCount={123} />
        </StyledRowGrid>
        <StyledRowGrid>
          <ProgramCategory tagName="Tag" tagCount={123} />
          <ProgramCategory tagName="Tag" tagCount={123} />
        </StyledRowGrid>
        <StyledRowGrid>
          <ProgramCategory tagName="Tag" tagCount={123} />
          <ProgramCategory tagName="Tag" tagCount={123} />
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default ProgramSummaryCard
