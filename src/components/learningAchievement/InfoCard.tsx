import { Avatar, Box, Center, Divider, Tag, Text } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as EditIcon } from '../../images/edit.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  .ant-card-body {
    align-items: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    @media (min-width: ${BREAK_POINT}px) {
      height: 160px;
      flex-direction: row;
    }
  }
`

const InfoBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
  justify-content: center;
  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
    justify-content: start;
  }
`
const CustomerNameBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: start;
    padding-left: 0px;
  }
`

const BadgeProgressBox = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: end;
  }
`

type InfoCardProps = Pick<LearnedStatistic, 'avgProgramProgressPercent'> & {
  achievementCount: number
  achievementTag: string | null
  memberName: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  avgProgramProgressPercent,
  achievementCount,
  achievementTag,
  memberName,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()

  const pushToProfile = (): void => {
    history.push('/settings/profile')
  }

  return (
    <StyledCard>
      <InfoBox>
        <Box>
          <Center>
            <Avatar size="xl" />
          </Center>
        </Box>
        <Box m="2">
          <CustomerNameBox>
            <Text color="var(--gray-darker)" fontSize="20px" as="b">
              {memberName}
            </Text>
            <EditIcon onClick={pushToProfile} />
          </CustomerNameBox>
          {achievementTag && (
            <Tag size="lg" mt="2" borderRadius="full" variant="solid" backgroundColor="#049d96">
              {achievementTag}
            </Tag>
          )}
        </Box>
      </InfoBox>
      <BadgeProgressBox>
        <Box textAlign="center">
          <Text fontSize="lg" as="b">
            {achievementCount}
            {formatMessage(learningAchievementMessages.InfoCard.peices)}
          </Text>
          <Text fontSize="xs">{formatMessage(learningAchievementMessages.InfoCard.badgesCollected)}</Text>
        </Box>
        <Center height="50px" width="20px">
          <Divider orientation="vertical" />
        </Center>
        <Box textAlign="center">
          <Text fontSize="lg" as="b">
            {avgProgramProgressPercent}%
          </Text>
          <Text fontSize="xs">{formatMessage(learningAchievementMessages.InfoCard.totalProgramProgress)}</Text>
        </Box>
      </BadgeProgressBox>
    </StyledCard>
  )
}

export default InfoCard
