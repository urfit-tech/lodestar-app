import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as EditIcon } from '../../images/edit.svg'
import AdminCard from '../../components/common/AdminCard'
import styled from 'styled-components'
import { Avatar, Divider, Center, Tag, Box, Text } from '@chakra-ui/react'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'
import { useHistory } from 'react-router'
import { isEmpty } from 'lodash'

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
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: start;
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

const infoData = {
  user: '王大明',
  medalCount: 9,
  totalProgramProgress: 5,
}

const InfoCard: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { user, medalCount, totalProgramProgress } = infoData

  const pushToProfile = (): void => {
    history.push('/settings/profile')
  }

  const getLearningAchievementTag = (): string => {
    const tag: string = 'noon'
    switch (tag) {
      case 'morning':
        return formatMessage(learningAchievementMessages['*'].morning) + '學習者'
      case 'noon':
        return formatMessage(learningAchievementMessages['*'].noon) + '學習者'
      case 'afternoon':
        return formatMessage(learningAchievementMessages['*'].afternoon) + '學習者'
      case 'evening':
        return formatMessage(learningAchievementMessages['*'].evening) + '學習者'
      case 'midnight':
        return formatMessage(learningAchievementMessages['*'].midnight) + '學習者'
      case 'weekend':
        return formatMessage(learningAchievementMessages['*'].weekend) + '學習者'
      default:
        return ''
    }
  }

  return (
    <StyledCard>
      <InfoBox>
        <Box>
          <Center>
            <Avatar size="xl" />
          </Center>
        </Box>
        <Box m='2'>
          <CustomerNameBox>
            <Text color='var(--gray-darker)' fontSize='20px' as='b'>{user}</Text>
            <EditIcon onClick={pushToProfile} />
          </CustomerNameBox>
          {!isEmpty(getLearningAchievementTag()) && (
            <Tag size="lg" mt='2' borderRadius="full" variant="solid" backgroundColor="#049d96">
              {getLearningAchievementTag()}
            </Tag>
          )}
        </Box>
      </InfoBox>
      <BadgeProgressBox>
        <Box textAlign="center">
          <Text fontSize="lg" as="b">
            {medalCount}
            {formatMessage(learningAchievementMessages.InfoCard.peices)}
          </Text>
          <Text fontSize="xs">{formatMessage(learningAchievementMessages.InfoCard.badgesCollected)}</Text>
        </Box>
        <Center height="50px" width="20px">
          <Divider orientation="vertical" />
        </Center>
        <Box textAlign="center">
          <Text fontSize="lg" as="b">
            {totalProgramProgress}%
          </Text>
          <Text fontSize="xs">{formatMessage(learningAchievementMessages.InfoCard.totalProgramProgress)}</Text>
        </Box>
      </BadgeProgressBox>
    </StyledCard>
  )
}

export default InfoCard
