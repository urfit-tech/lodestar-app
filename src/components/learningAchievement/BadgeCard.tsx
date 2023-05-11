import { gql, useQuery } from '@apollo/client'
import { Box, Divider, Spacer, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { checkLearningSystem } from '../../helpers/learning'
import { MemberAchievement } from '../../pages/member/LearningAchievementPage'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'
import Badge from './Badge'
import learningAchievementMessages from './translation'

dayjs.extend(utc)
dayjs.extend(timezone)

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

type BadgeCardProps = { memberAchievement: MemberAchievement[] }

const BadgeCard: React.FC<BadgeCardProps> = ({ memberAchievement }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { memberId } = useParams<{ memberId: string }>()
  const { settings } = useApp()
  const { data } = useMemberLearnedLog(memberId || currentMemberId || '')

  return (
    <StyledCard>
      <Box display="flex" alignItems="center">
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.BadgeCard.badges)}
        </Text>
        <Spacer />
        <Text as="b" fontSize="xs" color="var(--gray-dark)">
          {formatMessage(learningAchievementMessages['*'].dataCountSince, {
            time: checkLearningSystem(settings['custom']).startTime,
          })}
        </Text>
      </Box>
      <StyledColGrid>
        <StyledRowGrid>
          <Badge
            src="learning-achievement-30min"
            withMins
            mins={30}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '您已啟程').map(a => a.createdAt)}
          />
          <Badge
            src="learning-achievement-80-percent"
            withPercent
            percent={80}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '您好專注').map(a => a.createdAt)}
          />
          <Badge
            src="learning-achievement-200min"
            withMins
            mins={200}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '您真好學').map(a => a.createdAt)}
          />
          <Badge
            src="learning-achievement-7-days"
            withDays
            days={7}
            mins={10}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '7天持續學習').map(a => a.createdAt)}
          />
          <Badge
            src="learning-achievement-14-days"
            withDays
            days={14}
            mins={10}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '14天持續學習').map(a => a.createdAt)}
          />
          <Badge
            src="learning-achievement-21-days"
            withDays
            days={21}
            mins={10}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '21天持續學習').map(a => a.createdAt)}
          />
          <RemindText fontSize="xs">
            {formatMessage(learningAchievementMessages.BadgeCard.updateEveryDay, {
              time: memberAchievement[memberAchievement.length]?.updatedHour || 6,
            })}
          </RemindText>
        </StyledRowGrid>
        <Divider width="85%" />
        <StyledRowGrid>
          <Badge
            src="learning-achievement-morning"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].morning)}
            startTime={7}
            endTime={11}
            mins={data.find(d => d.key === 'learning-achievement-morning')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '晨型高效能').map(a => a.createdAt)}
            isCountable
          />
          <Badge
            src="learning-achievement-noon"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].noon)}
            startTime={12}
            endTime={14}
            mins={data.find(d => d.key === 'learning-achievement-noon')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '午休不浪費').map(a => a.createdAt)}
            isCountable
          />
          <Badge
            src="learning-achievement-afternoon"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].afternoon)}
            startTime={15}
            endTime={18}
            mins={data.find(d => d.key === 'learning-achievement-afternoon')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '午茶配著學').map(a => a.createdAt)}
            isCountable
          />
          <Badge
            src="learning-achievement-evening"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].evening)}
            startTime={19}
            endTime={23}
            mins={data.find(d => d.key === 'learning-achievement-evening')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '晚自習充電').map(a => a.createdAt)}
            isCountable
          />
          <Badge
            src="learning-achievement-midnight"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].midnight)}
            startTime={0}
            endTime={6}
            mins={data.find(d => d.key === 'learning-achievement-midnight')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '夜貓好專注').map(a => a.createdAt)}
            isCountable
          />
          <Badge
            src="learning-achievement-weekend"
            repeatable
            badgeLabel={formatMessage(learningAchievementMessages['*'].weekend)}
            mins={data.find(d => d.key === 'learning-achievement-weekend')?.value || 0}
            badgeCollectedTime={memberAchievement.filter(a => a.name === '週末學不厭').map(a => a.createdAt)}
            isCountable
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

const useMemberLearnedLog = (memberId: string) => {
  const today = dayjs().tz('Asia/Taipei')
  const day = today.day()
  const lastMonday = today
    .subtract(7 + ((day + 6) % 7), 'day')
    .startOf('day')
    .toISOString()
  const thisMonday = today
    .subtract(day - (day === 0 ? -6 : 1), 'day')
    .startOf('day')
    .toISOString()

  const { data, loading, error } = useQuery<
    hasura.GET_LAST_WEEK_MEMBER_LEARNED_LOG,
    hasura.GET_LAST_WEEK_MEMBER_LEARNED_LOGVariables
  >(
    gql`
      query GET_LAST_WEEK_MEMBER_LEARNED_LOG($memberId: String!, $lastMonday: timestamptz!, $thisMonday: timestamptz!) {
        member_learned_log(
          where: {
            _and: [
              { member_id: { _eq: $memberId } }
              { period: { _gte: $lastMonday } }
              { period: { _lt: $thisMonday } }
            ]
          }
        ) {
          period
          duration
        }
      }
    `,
    {
      variables: {
        memberId,
        lastMonday,
        thisMonday,
      },
    },
  )

  const dayOfPeriod = (period: Date) => {
    return dayjs(new Date(period)).tz('Asia/Taipei').day()
  }
  const hourOfPeriod = (period: Date) => {
    return dayjs(new Date(period)).tz('Asia/Taipei').hour()
  }

  // fix it
  const durationByAchievement = [
    {
      key: 'learning-achievement-morning',
      value:
        data &&
        data.member_learned_log.filter(
          log =>
            dayOfPeriod(log.period) !== 0 &&
            dayOfPeriod(log.period) !== 6 &&
            hourOfPeriod(log.period) >= 7 &&
            hourOfPeriod(log.period) <= 11,
        ).length > 0
          ? Math.round(
              data?.member_learned_log
                .filter(
                  log =>
                    dayOfPeriod(log.period) !== 0 &&
                    dayOfPeriod(log.period) !== 6 &&
                    hourOfPeriod(log.period) >= 7 &&
                    hourOfPeriod(log.period) <= 11,
                )
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
    {
      key: 'learning-achievement-noon',
      value:
        data &&
        data.member_learned_log.filter(
          log =>
            dayOfPeriod(log.period) !== 0 &&
            dayOfPeriod(log.period) !== 6 &&
            hourOfPeriod(log.period) >= 12 &&
            hourOfPeriod(log.period) <= 14,
        ).length > 0
          ? Math.round(
              data.member_learned_log
                .filter(
                  log =>
                    dayOfPeriod(log.period) !== 0 &&
                    dayOfPeriod(log.period) !== 6 &&
                    hourOfPeriod(log.period) >= 12 &&
                    hourOfPeriod(log.period) <= 14,
                )
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
    {
      key: 'learning-achievement-afternoon',
      value:
        data &&
        data.member_learned_log.filter(
          log =>
            dayOfPeriod(log.period) !== 0 &&
            dayOfPeriod(log.period) !== 6 &&
            hourOfPeriod(log.period) >= 15 &&
            hourOfPeriod(log.period) <= 18,
        ).length > 0
          ? Math.round(
              data.member_learned_log
                .filter(
                  log =>
                    dayOfPeriod(log.period) !== 0 &&
                    dayOfPeriod(log.period) !== 6 &&
                    hourOfPeriod(log.period) >= 15 &&
                    hourOfPeriod(log.period) <= 18,
                )
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
    {
      key: 'learning-achievement-evening',
      value:
        data &&
        data.member_learned_log.filter(
          log =>
            dayOfPeriod(log.period) !== 0 &&
            dayOfPeriod(log.period) !== 6 &&
            hourOfPeriod(log.period) >= 19 &&
            hourOfPeriod(log.period) <= 23,
        ).length > 0
          ? Math.round(
              data.member_learned_log
                .filter(
                  log =>
                    dayOfPeriod(log.period) !== 0 &&
                    dayOfPeriod(log.period) !== 6 &&
                    hourOfPeriod(log.period) >= 19 &&
                    hourOfPeriod(log.period) <= 23,
                )
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
    {
      key: 'learning-achievement-midnight',
      value:
        data &&
        data.member_learned_log.filter(
          log =>
            dayOfPeriod(log.period) !== 0 &&
            dayOfPeriod(log.period) !== 6 &&
            hourOfPeriod(log.period) >= 0 &&
            hourOfPeriod(log.period) <= 6,
        ).length > 0
          ? Math.round(
              data.member_learned_log
                .filter(
                  log =>
                    dayOfPeriod(log.period) !== 0 &&
                    dayOfPeriod(log.period) !== 6 &&
                    hourOfPeriod(log.period) >= 0 &&
                    hourOfPeriod(log.period) <= 6,
                )
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
    {
      key: 'learning-achievement-weekend',
      value:
        data &&
        data.member_learned_log.filter(log => dayOfPeriod(log.period) === 0 || dayOfPeriod(log.period) === 6).length > 0
          ? Math.round(
              data.member_learned_log
                .filter(log => dayOfPeriod(log.period) === 0 || dayOfPeriod(log.period) === 6)
                .map(log => log.duration)
                .reduce((a, b) => a + b) / 60,
            )
          : 0,
    },
  ]

  return { data: durationByAchievement, loading, error }
}

export default BadgeCard
