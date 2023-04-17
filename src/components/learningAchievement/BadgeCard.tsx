import React from 'react'
import { useIntl } from 'react-intl'
import AdminCard from '../common/AdminCard'
import styled from 'styled-components'
import { Text, Divider } from '@chakra-ui/react'
import Badge from './Badge'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  display: flex;
  .ant-card-body {
    width: 100%;
  }
`
const StyledRowGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 60px 50px;
  position: relative;
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: space-around;
    flex-direction: row;
  }
`

const StyledColGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`
const RemindText = styled(Text)`
  position: absolute;
  bottom: -2%;
  text-align: center;
  @media (min-width: ${BREAK_POINT}px) {
    right: 8%;
    text-align: end;
  }
`
const BadgeCard: React.FC = () => {
  const { formatMessage } = useIntl()
  const badgeCollectedTime = [new Date(), new Date(), new Date()]
  return (
    <StyledCard>
      <Text as="b" fontSize="lg">
        {formatMessage(learningAchievementMessages.BadgeCard.badges)}
      </Text>
      <StyledColGrid>
        <StyledRowGrid>
          <Badge src="learning-achievement-30min" withMins mins={30} badgeCollectedTime={[]} />
          <Badge src="learning-achievement-80-percent" withPercent percent={80} badgeCollectedTime={[]} />
          <Badge src="learning-achievement-200min" withMins mins={200} badgeCollectedTime={[]} />
          <Badge src="learning-achievement-7-days" withDays days={7} mins={10} badgeCollectedTime={[]} />
          <Badge src="learning-achievement-14-days" withDays days={14} mins={10} badgeCollectedTime={[]} />
          <Badge src="learning-achievement-21-days" withDays days={21} mins={10} badgeCollectedTime={[]} />
          <RemindText fontSize="xs">
            {formatMessage(learningAchievementMessages.BadgeCard.updateEveryDay, { time: 9 })}
          </RemindText>
        </StyledRowGrid>
        {/* <hr /> */}
        <Divider width="85%" />
        <StyledRowGrid>
          <Badge
            src="learning-achievement-morning"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].morning)}
            startTime={7}
            endTime={11}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <Badge
            src="learning-achievement-noon"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].noon)}
            startTime={12}
            endTime={14}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <Badge
            src="learning-achievement-afternoon"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].afternoon)}
            startTime={15}
            endTime={18}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <Badge
            src="learning-achievement-evening"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].evening)}
            startTime={19}
            endTime={23}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <Badge
            src="learning-achievement-midnight"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].midnight)}
            startTime={0}
            endTime={6}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <Badge
            src="learning-achievement-weekend"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].weekend)}
            mins={10}
            badgeCollectedTime={badgeCollectedTime}
          />
          <RemindText fontSize="xs">
            {formatMessage(learningAchievementMessages.BadgeCard.updateEveryWeek)}
            <br />
            {formatMessage(learningAchievementMessages.BadgeCard.rule)}
          </RemindText>
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export default BadgeCard
