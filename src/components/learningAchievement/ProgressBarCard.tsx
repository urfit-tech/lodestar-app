import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as BarChartIcon } from '../../images/bar-chart.svg'
import { ReactComponent as Flag } from '../../images/flag.svg'
import AdminCard from '../../components/common/AdminCard'
import styled from 'styled-components'
import { Text, Progress, Box, Spacer } from '@chakra-ui/react'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  display: flex;
  align-items: center;

  .ant-card-body {
    width: 100%;
  }
  @media (min-width: ${BREAK_POINT}px) {
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
  width: 100%;
  gap: 20px;
  margin-bottom: 20px;
  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0px;
  }
`

const ProgressBarCard: React.FC = () => {
  const { formatMessage } = useIntl()
  const progressBarData = {
    bestRecord: 10,
    siteAverage: 10,
    siteBest: 24,
    consecutiveDays: 9,
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
            <Text zIndex="1" fontSize="sm">
              {formatMessage(learningAchievementMessages.ProgressBarCard.bestRecord)}
            </Text>
            <Spacer />
            <Text fontSize="3xl" as="b">
              {progressBarData.bestRecord}
            </Text>
            <Text zIndex="1" fontSize="sm">
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
                  right="-50px"
                  top="-40px"
                  w="100px"
                  as="b"
                  position="absolute"
                  textAlign="center"
                  fontSize="xs"
                  color="#049d96"
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
                  right="-50px"
                  bottom="-40px"
                  w="100px"
                  as="b"
                  position="absolute"
                  textAlign="center"
                  fontSize="xs"
                  color="#cc9318"
                >
                  {formatMessage(learningAchievementMessages.ProgressBarCard.siteAverage, {
                    days: progressBarData.siteAverage,
                  })}
                </Text>
              </PointerContainer>
            </Box>
            <Flag />
          </ProgressBarContainer>
          <Text as="b" textAlign="center" fontSize="xs" color="#585858" position="absolute" bottom="0" right="0">
            {formatMessage(learningAchievementMessages.ProgressBarCard.siteBest, { days: progressBarData.siteBest })}
          </Text>
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default ProgressBarCard
