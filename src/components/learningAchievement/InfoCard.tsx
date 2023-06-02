import { Avatar, Box, Center, Divider, Tag, Text } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as EditIcon } from '../../images/edit.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'
import { useVoucherProgramByPlan, useVoucherProgramByPackage, useVoucherTargets } from './VoucherProgramCard'

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

const StyledTagBlock = styled.div`
  display: flex;
  justify-content: center;
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: start;
  }
`

type InfoCardProps = Pick<LearnedStatistic, 'avgProgramProgressPercent'> & {
  achievementCount: number
  achievementTag: string | null
  memberName: string
  memberPictureUrl: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  avgProgramProgressPercent,
  achievementCount,
  achievementTag,
  memberName,
  memberPictureUrl,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { settings } = useApp()
  const { currentMemberId } = useAuth()
  const voucherProgramLevel = JSON.parse(settings['custom']).voucherProgramLevel // this setting is for cw！ if need to change, modify in db
  const { voucherProgramPlan, voucherProgramPackagePlan } = useVoucherTargets(
    currentMemberId || '',
    voucherProgramLevel,
  )
  const { voucherProgramByPlan } = useVoucherProgramByPlan(voucherProgramPlan)
  const { voucherProgramByPackage } = useVoucherProgramByPackage(voucherProgramPackagePlan)
  const voucherPrograms = [...voucherProgramByPlan, ...voucherProgramByPackage]
  const pushToProfile = (): void => {
    history.push('/settings/profile')
  }

  return (
    <StyledCard>
      <InfoBox>
        <Box>
          <Center>
            <Avatar size="xl" src={memberPictureUrl} />
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
            <StyledTagBlock>
              <Tag size="lg" mt="2" borderRadius="full" variant="solid" backgroundColor="#049d96">
                {achievementTag}
              </Tag>
            </StyledTagBlock>
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
            {voucherPrograms.length}
            {formatMessage(learningAchievementMessages.InfoCard.lesson)}
          </Text>
          <Text fontSize="xs">{formatMessage(learningAchievementMessages.InfoCard.totalVoucherProgram)}</Text>
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
