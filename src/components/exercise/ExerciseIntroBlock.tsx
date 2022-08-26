import { Button } from '@chakra-ui/react'
import moment from 'moment'
import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ExerciseProps } from '../../types/program'
import exerciseMessages from './translation'

const StyledLabel = styled.h4`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledContent = styled.h4`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledButton = styled(Button)`
  && {
    border-radius: 4px;
    width: 178px;
  }
`

const ExerciseIntroBlock: React.VFC<
  ExerciseProps & {
    showDetail?: boolean
    onStart?: () => void
  }
> = ({
  id,
  questions,
  passingScore,
  startedAt,
  endedAt,
  timeLimitUnit,
  timeLimitAmount,
  isAvailableAnnounceScore,
  isAvailableToRetry,
  onStart,
}) => {
  const { formatMessage } = useIntl()
  const fullScore = sum(questions.map(question => question.points))
  const now = moment()

  const introRows = [
    {
      key: 'duration',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.duration),
      value: `${moment(startedAt).format('YYYY-MM-DD HH:mm')} ~ ${moment(endedAt).format('YYYY-MM-DD HH:mm')}`,
      hidden: !startedAt && !endedAt,
    },
    {
      key: 'fullScore',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.fullScore),
      value: fullScore,
      hidden: !isAvailableAnnounceScore,
    },
    {
      key: 'passingScore',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.pass),
      value: passingScore,
      hidden: !isAvailableAnnounceScore,
    },
    {
      key: '',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.timeLimit),
      value: <TimeLimitContent unit={timeLimitUnit} amount={timeLimitAmount} />,
    },
    {
      key: 'retest',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.retest),
      value: isAvailableToRetry
        ? formatMessage(exerciseMessages.ExerciseIntroBlock.unlimited)
        : formatMessage(exerciseMessages.ExerciseIntroBlock.limitOnce),
    },
    {
      key: 'questionsCount',
      label: formatMessage(exerciseMessages.ExerciseIntroBlock.questionsCount),
      value: formatMessage(exerciseMessages.ExerciseIntroBlock.questionsCountContent, {
        count: questions.length,
      }),
    },
  ]

  return (
    <>
      <div className="mb-4">
        {introRows
          .filter(row => !row.hidden)
          .map(row => (
            <div className="d-flex align-items-center mb-3" key={row.key}>
              <StyledLabel className={startedAt && endedAt ? 'col-4' : 'col-6'} style={{ textAlign: 'end' }}>
                {row.label}
              </StyledLabel>
              <StyledContent>{row.value}</StyledContent>
            </div>
          ))}
      </div>

      <div className="text-center">
        <StyledButton
          variant="primary"
          disabled={
            Boolean(startedAt) && Boolean(endedAt)
              ? !now.isBetween(startedAt, endedAt)
              : Boolean(startedAt)
              ? now.isBefore(startedAt)
              : Boolean(endedAt)
              ? now.isAfter(endedAt)
              : false
          }
          onClick={onStart}
        >
          {startedAt && now.isBefore(startedAt)
            ? formatMessage(exerciseMessages.ExerciseIntroBlock.unStarted)
            : endedAt && now.isAfter(endedAt)
            ? formatMessage(exerciseMessages.ExerciseIntroBlock.expired)
            : formatMessage(exerciseMessages.ExerciseIntroBlock.start)}
        </StyledButton>
      </div>
    </>
  )
}

const TimeLimitContent: React.VFC<{
  unit?: 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y' | string
  amount?: number
}> = ({ unit, amount = 0 }) => {
  const { formatMessage } = useIntl()
  let unitText = ''

  if (!unit && !amount) {
    return <>{formatMessage(exerciseMessages.ExerciseIntroBlock.unlimited)}</>
  }

  switch (unit) {
    case 's':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.sec)
      break
    case 'm':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.min)
      break
    case 'h':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.hour)
      break
    case 'd':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.day)
      break
    case 'W':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.week)
      break
    case 'M':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.month)
      break
    case 'y':
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.year)
      break
    default:
      unitText = formatMessage(exerciseMessages.ExerciseIntroBlock.unknownUnit)
      break
  }
  return (
    <>
      {formatMessage(exerciseMessages.ExerciseIntroBlock.timeLimitContent, {
        unit: unitText,
        amount,
      })}
    </>
  )
}

export default ExerciseIntroBlock
