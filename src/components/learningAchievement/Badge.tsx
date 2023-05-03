import {
  Box,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { isMobile } from '../../helpers'
import learningAchievementMessages from './translation'

const BadgeLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  color: var(--gray-darker);
`
const BadgeImage = styled(Box)`
  position: relative;
  width: 80px;
  height: 80px;
`

const BadgeText = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BadgeCounter = styled(Box)`
  height: 20px;
  width: 30px;
  position: absolute;
  right: -10px;
  top: 12px;
  border-radius: 10px;
  background-color: #585858;
  border: solid 2px #fff;
  color: #fff;
  display: flex;
  align-items: center; 
  justify-content: center; /
`

const StyledButton = styled.button<{
  cursorPointer: boolean | undefined
}>`
  cursor: ${({ cursorPointer }) => (cursorPointer ? 'pointer' : 'auto')};
`

const Badge: React.FC<{
  src: string | undefined
  repeatable?: boolean | undefined
  withMins?: boolean | undefined
  withPercent?: boolean | undefined
  withDays?: boolean | undefined
  mins?: number | undefined
  percent?: number | undefined
  days?: number | undefined
  badgeLabel?: string | undefined
  startTime?: number | undefined
  endTime?: number | undefined
  badgeCollectedTime?: Date[] | undefined
  isCountable?: boolean
}> = ({
  src,
  repeatable,
  withPercent,
  withMins,
  withDays,
  mins,
  percent,
  days,
  badgeLabel,
  startTime,
  endTime,
  badgeCollectedTime,
  isCountable,
}) => {
  const { formatMessage } = useIntl()
  const cursorPointer = (): boolean | undefined => {
    return isCountable && !isEmpty(badgeCollectedTime)
  }
  return (
    <BadgeLayout>
      <Popover variant="responsive" trigger={isMobile ? 'click' : 'hover'}>
        <PopoverTrigger>
          <StyledButton cursorPointer={cursorPointer()}>
            <BadgeImage>
              <Image
                opacity={badgeCollectedTime?.length! > 0 ? 1 : 0.1}
                src={`https://static.kolable.com/images/cw/learning_achievement/${src}.png`}
              />
              {isCountable && badgeCollectedTime?.length! > 1 && (
                <BadgeCounter>
                  <Text fontSize="xs">{badgeCollectedTime?.length! > 99 ? '99+' : badgeCollectedTime?.length}</Text>
                </BadgeCounter>
              )}
            </BadgeImage>
          </StyledButton>
        </PopoverTrigger>
        {isCountable && badgeCollectedTime?.length! > 0 && (
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader border={0} pb={0}>
              <Box display="flex" alignItems="center">
                <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.badgeCount)}</Text>
                &nbsp;
                <Text fontSize="xs" color="#049d97">
                  {badgeCollectedTime?.length! > 99 ? '99+' : badgeCollectedTime?.length}
                </Text>
                &nbsp;
                <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.time)}</Text>
              </Box>
            </PopoverHeader>
            <PopoverBody maxHeight="100px" overflowY="auto">
              {badgeCollectedTime?.reverse()?.map((time, index) => {
                return (
                  <Text fontSize="xs">
                    {formatMessage(learningAchievementMessages.Badge.times, {
                      times: badgeCollectedTime.length - index,
                    })}
                    &nbsp;
                    {dayjs(time).format('YYYY-MM-DD')}
                  </Text>
                )
              })}
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>
      <BadgeText>
        {withDays ? (
          <>
            <Box display="flex" alignItems="center">
              <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.continued)}</Text>
              &nbsp;
              <Text as="b" fontSize="xl">
                {days}
              </Text>
              &nbsp;
              <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.days)}</Text>
            </Box>
            <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.learningMins, { mins: mins })}</Text>
          </>
        ) : (
          <>
            {repeatable && (
              <Text mb="2" as="b">
                {badgeLabel}
              </Text>
            )}
            {repeatable && (
              <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.cumulativeTimeLastWeek)}</Text>
            )}
            {withPercent && (
              <Text fontSize="xs">
                {formatMessage(learningAchievementMessages.Badge.completedSingleProgramPercent)}
              </Text>
            )}
            {withMins && (
              <Text fontSize="xs">{formatMessage(learningAchievementMessages.Badge.completedProgramMin)}</Text>
            )}
            <Box display="flex" alignItems="center" textAlign="center">
              <Text as="b" fontSize="xl">
                {mins!}
                {percent!}
              </Text>
              &nbsp;
              {withMins && <Text fontSize="sm">{formatMessage(learningAchievementMessages.Badge.minutes)}</Text>}
              {repeatable && <Text fontSize="sm">{formatMessage(learningAchievementMessages.Badge.minutes)}</Text>}
              {withPercent && <Text fontSize="sm">%</Text>}
            </Box>
          </>
        )}

        {src !== 'learning-achievement-weekend' && repeatable && (
          <Text fontSize="xs" maxW="70px" textAlign="center" color="var(--gray-dark)">
            {formatMessage(learningAchievementMessages.Badge.weeklyTime, { startTime: startTime, endTime: endTime })}
          </Text>
        )}
        {src === 'learning-achievement-weekend' && repeatable && (
          <Text fontSize="xs" maxW="70px" textAlign="center" color="var(--gray-dark)">
            {formatMessage(learningAchievementMessages.Badge.weekend)}
          </Text>
        )}
      </BadgeText>
    </BadgeLayout>
  )
}

export default Badge
