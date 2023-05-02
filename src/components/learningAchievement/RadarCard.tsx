import { Box, Text, VStack } from '@chakra-ui/react'
import { Chart as ChartJS, Filler, LineElement, PointElement, RadialLinearScale, Tooltip } from 'chart.js'
import React, { ReactElement } from 'react'
import { Radar } from 'react-chartjs-2'
import { MessageDescriptor, useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as EyeIcon } from '../../images/eye-white.svg'
import { ReactComponent as FileIcon } from '../../images/file-check.svg'
import { ReactComponent as TimeIcon } from '../../images/time.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const StyledCard = styled(AdminCard)`
  .ant-card-body {
    width: 100%;
  }
  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    flex-grow: 6;
    height: 360px;
    align-items: center;
  }
`
const RadarBox = styled(Box)`
  height: 100%;
  width: 100%;
  max-width: 360px;
  max-height: 360px;
`

const StyledLearningCategory = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: #fff9e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px 0px 20px;
  position: relative;
  color: #cc9318;
  height: 80px;
  @media (min-width: ${BREAK_POINT}px) {
    max-width: 300px;
  }
`

const StyledRowGrid = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 20px;
    align-items: center;
  }
`

const StyledColGrid = styled.div`
  width: 100%;
  display: grid;
`
const StyledVStack = styled(VStack)`
  width: 100%;
  @media (min-width: ${BREAK_POINT}px) {
    width: 50%;
  }
`

const EmbeddedImage = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  z-index: 0;
`

const LearningCategory: React.FC<{
  children: ReactElement
  value: number
  title: MessageDescriptor
  unit: MessageDescriptor
  message: MessageDescriptor
}> = ({ children, value, title, unit, message }) => {
  const { formatMessage } = useIntl()
  return (
    <StyledLearningCategory>
      <Text zIndex={1} fontSize="sm">
        {formatMessage(title)}
      </Text>
      <EmbeddedImage>{children}</EmbeddedImage>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="end">
          <Text as="b" fontSize="3xl">
            {value}
          </Text>
          &nbsp;
          <Text fontSize="sm">{formatMessage(unit)}</Text>
        </Box>
        <Text fontSize="sm">{formatMessage(message)}</Text>
      </Box>
    </StyledLearningCategory>
  )
}

type RadarCardProps = Pick<
  LearnedStatistic,
  | 'programCount'
  | 'totalProgramContentCount'
  | 'totalProgramTime'
  | 'progressProgramContentCount'
  | 'progressProgramTime'
  | 'progressProgramCount'
>

const RadarCard: React.FC<RadarCardProps> = ({
  programCount,
  totalProgramContentCount,
  totalProgramTime,
  progressProgramContentCount,
  progressProgramTime,
  progressProgramCount,
}) => {
  const { formatMessage } = useIntl()
  const RadarData = {
    explore: progressProgramContentCount,
    continuance: progressProgramCount,
    concentrate: progressProgramTime,
  }
  const chartOptions = {
    layout: {
      padding: 0,
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 10,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let unit: string = ''
            let value: number = 0
            switch (context.label) {
              case formatMessage(learningAchievementMessages.RadarCard.explore):
                value = RadarData.explore
                unit = formatMessage(learningAchievementMessages.RadarCard.lessons)
                break
              case formatMessage(learningAchievementMessages.RadarCard.continuance):
                unit = formatMessage(learningAchievementMessages.RadarCard.programs)
                value = RadarData.continuance
                break
              case formatMessage(learningAchievementMessages.RadarCard.concentrate):
                unit = formatMessage(learningAchievementMessages.RadarCard.hours)
                value = RadarData.concentrate
                break
              default:
                return
            }
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.r !== null) {
              label += value
              label += unit
            }
            return label
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 2,
          display: false,
        },

        pointLabels: {
          font: { size: 16, weight: 'bold' },
        },
      },
    },
  }
  const chartData = {
    labels: [
      formatMessage(learningAchievementMessages.RadarCard.explore),
      formatMessage(learningAchievementMessages.RadarCard.continuance),
      formatMessage(learningAchievementMessages.RadarCard.concentrate),
    ],
    datasets: [
      {
        data: [
          RadarData.explore / totalProgramContentCount,
          RadarData.continuance / programCount,
          RadarData.concentrate / totalProgramTime,
        ],
        backgroundColor: 'rgba(255, 249, 225, 0.5)',
        borderColor: '#eeb944',
        borderWidth: 1,
      },
    ],
  }

  return (
    <StyledCard>
      <StyledColGrid>
        <StyledRowGrid>
          <StyledVStack spacing={2} alignItems="start">
            <Text as="b" alignContent="left" mb="2" w="100%" fontSize="lg">
              {formatMessage(learningAchievementMessages.RadarCard.learningData)}
            </Text>
            <LearningCategory
              title={learningAchievementMessages.RadarCard.explore}
              unit={learningAchievementMessages.RadarCard.lessons}
              message={learningAchievementMessages.RadarCard.lessonsCompleted}
              value={RadarData.explore}
            >
              <EyeIcon />
            </LearningCategory>
            <LearningCategory
              title={learningAchievementMessages.RadarCard.continuance}
              unit={learningAchievementMessages.RadarCard.programs}
              message={learningAchievementMessages.RadarCard.programsCompleted}
              value={RadarData.continuance}
            >
              <FileIcon />
            </LearningCategory>
            <LearningCategory
              title={learningAchievementMessages.RadarCard.concentrate}
              unit={learningAchievementMessages.RadarCard.hours}
              message={learningAchievementMessages.RadarCard.totalHours}
              value={RadarData.concentrate}
            >
              <TimeIcon />
            </LearningCategory>
          </StyledVStack>
          <Box w="100%" justifyContent="center" display="flex">
            <RadarBox>
              <Radar data={chartData} options={chartOptions} />
            </RadarBox>
          </Box>
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default RadarCard
