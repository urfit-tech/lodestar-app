import { Box, Progress, Spacer, Text } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as BarChartIcon } from '../../images/bar-chart.svg'
import { ReactComponent as Flag } from '../../images/flag.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  .ant-card-body {
    width: 100%;
  }
  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 0px;
    height: 200px;
  }
`
const StyledRowGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;
  position: relative;
  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    align-items: center;
  }
`
const StyledColGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 10px;
`
const PointerContainer = styled.div<{
  value: number
}>`
  width: ${({ value }) => (value > 0 ? value : 1)}%;
  display: flex;
  flex-direction: row-reverse;
  position: relative;
`

const TopPointer = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #049d96;
  transform: rotate(-180deg);
`
const BottomPointer = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #cc9318;
`

const ConsecutiveDays = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 4px;
  background-color: #e5f5f4;
  position: relative;
  height: 80px;
  margin-bottom: 20px;
  padding: 8px;
  color: #049d96;
  @media (min-width: ${BREAK_POINT}px) {
    width: 40%;
    margin-bottom: 0px;
  }
`
const EmbeddedImage = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
`
const ProgressBarContainer = styled(Box)`
  display: flex;
  padding: 20px 0px 20px 30px;
  width: 100%;
  gap: 20px;
  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0px;
    padding: 0px 0px 0px 30px;
  }
`

type ProgressBarCardProps = Pick<LearnedStatistic, 'consecutiveDayOptions'>

const ProgressBarCard: React.FC<ProgressBarCardProps> = ({ consecutiveDayOptions }) => {
  const { formatMessage } = useIntl()
  const progressBarData = {
    bestRecord: consecutiveDayOptions.personalMaxConsecutiveDay,
    siteAverage: consecutiveDayOptions.allMemberAvgConsecutiveDay,
    siteBest: consecutiveDayOptions.allMemberMaxConsecutiveDay,
    consecutiveDays: consecutiveDayOptions.personalConsecutiveDay,
  }

  const calculateProgessBarPercentage = () => {
    const { consecutiveDays, siteBest, siteAverage } = progressBarData

    const site: number = siteBest ? (siteAverage / siteBest) * 100 : 0
    const member: number = siteBest ? (consecutiveDays / siteBest) * 100 : 0
    return { site, member }
  }

  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.ProgressBarCard.learningMarathon)}
        </Text>
        <StyledRowGrid>
          <ConsecutiveDays>
            <Text zIndex="1" fontSize="sm" pl="4">
              {formatMessage(learningAchievementMessages.ProgressBarCard.bestRecord)}
            </Text>
            <Spacer />
            <Text fontSize="3xl" as="b">
              {progressBarData.bestRecord}
            </Text>
            <Text zIndex="1" fontSize="sm" pr="4">
              &nbsp; {formatMessage(learningAchievementMessages.ProgressBarCard.days)}
            </Text>
            <EmbeddedImage>
              <BarChartIcon />
            </EmbeddedImage>
          </ConsecutiveDays>
          <ProgressBarContainer>
            <Box w="100%">
              <PointerContainer value={calculateProgessBarPercentage().member}>
                <Text
                  right="-45px"
                  top="-40px"
                  w="100px"
                  as="b"
                  position="absolute"
                  textAlign="center"
                  fontSize="xs"
                  color="#049d96"
                  whiteSpace="pre-line"
                >
                  {formatMessage(learningAchievementMessages.ProgressBarCard.currently, {
                    days: progressBarData.consecutiveDays,
                  })}
                </Text>
                <TopPointer />
              </PointerContainer>
              <Progress borderRadius={7} value={calculateProgessBarPercentage().member} />
              <PointerContainer value={calculateProgessBarPercentage().site}>
                <BottomPointer />
                <Text
                  right="-45px"
                  bottom="-40px"
                  w="100px"
                  as="b"
                  position="absolute"
                  textAlign="center"
                  fontSize="xs"
                  color="#cc9318"
                  whiteSpace="pre-line"
                >
                  {formatMessage(learningAchievementMessages.ProgressBarCard.siteAverage, {
                    days: progressBarData.siteAverage,
                  })}
                </Text>
              </PointerContainer>
            </Box>
            <Flag />
          </ProgressBarContainer>
          <Text
            as="b"
            textAlign="end"
            fontSize="xs"
            color="#585858"
            position="absolute"
            bottom="-20px"
            right="0"
            whiteSpace="pre-line"
          >
            {formatMessage(learningAchievementMessages.ProgressBarCard.siteBest, { days: progressBarData.siteBest })}
          </Text>
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default ProgressBarCard
