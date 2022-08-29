import { Button } from '@chakra-ui/react'
import moment from 'moment'
import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Exam, ExamTimeUnit } from '../../types/program'
import examMessages from './translation'

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

const ExamIntroBlock: React.VFC<
  Pick<
    Exam,
    | 'point'
    | 'passingScore'
    | 'timeLimitUnit'
    | 'timeLimitAmount'
    | 'isAvailableToRetry'
    | 'isAvailableToGoBack'
    | 'isAvailableAnnounceScore'
  > & {
    startedAt: Date
    endedAt: Date
    questions: any
    showDetail?: boolean
    onStart?: () => void
  }
> = ({
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
  const fullScore = sum(questions.map((question: { points: any }) => question.points))
  const now = moment()

  const introRows = [
    {
      key: 'duration',
      label: formatMessage(examMessages.ExamIntroBlock.duration),
      value: `${moment(startedAt).format('YYYY-MM-DD HH:mm')} ~ ${moment(endedAt).format('YYYY-MM-DD HH:mm')}`,
      hidden: !startedAt && !endedAt,
    },
    {
      key: 'fullScore',
      label: formatMessage(examMessages.ExamIntroBlock.fullScore),
      value: fullScore,
      hidden: !isAvailableAnnounceScore,
    },
    {
      key: 'passingScore',
      label: formatMessage(examMessages.ExamIntroBlock.pass),
      value: passingScore,
      hidden: !isAvailableAnnounceScore,
    },
    {
      key: '',
      label: formatMessage(examMessages.ExamIntroBlock.timeLimit),
      value:
        timeLimitUnit && timeLimitAmount ? (
          <TimeLimitContent unit={timeLimitUnit} amount={Number(timeLimitAmount)} />
        ) : (
          <>無限時</>
        ),
    },
    {
      key: 'retest',
      label: formatMessage(examMessages.ExamIntroBlock.retest),
      value: isAvailableToRetry
        ? formatMessage(examMessages.ExamIntroBlock.unlimited)
        : formatMessage(examMessages.ExamIntroBlock.limitOnce),
    },
    {
      key: 'questionsCount',
      label: formatMessage(examMessages.ExamIntroBlock.questionsCount),
      value: formatMessage(examMessages.ExamIntroBlock.questionsCountContent, {
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
            ? formatMessage(examMessages.ExamIntroBlock.unStarted)
            : endedAt && now.isAfter(endedAt)
            ? formatMessage(examMessages.ExamIntroBlock.expired)
            : formatMessage(examMessages.ExamIntroBlock.start)}
        </StyledButton>
      </div>
    </>
  )
}

const TimeLimitContent: React.VFC<{
  unit?: ExamTimeUnit
  amount?: number
}> = ({ unit, amount = 0 }) => {
  const { formatMessage } = useIntl()
  let unitText = ''

  if (!unit && !amount) {
    return <>{formatMessage(examMessages.ExamIntroBlock.unlimited)}</>
  }

  switch (unit) {
    case 'minute':
      unitText = formatMessage(examMessages.ExamIntroBlock.min)
      break
    case 'hour':
      unitText = formatMessage(examMessages.ExamIntroBlock.hour)
      break
    case 'day':
      unitText = formatMessage(examMessages.ExamIntroBlock.day)
      break
    default:
      unitText = formatMessage(examMessages.ExamIntroBlock.unknownUnit)
      break
  }
  return (
    <>
      {formatMessage(examMessages.ExamIntroBlock.timeLimitContent, {
        unit: unitText,
        amount,
      })}
    </>
  )
}

export default ExamIntroBlock
