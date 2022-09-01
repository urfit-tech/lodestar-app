import { CheckIcon, Icon } from '@chakra-ui/icons'
import { Button, CircularProgress, CircularProgressLabel, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { CommonLargeTextMixin, CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import moment, { DurationInputArg2 } from 'moment'
import { sum } from 'ramda'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { durationFullFormatter } from '../../helpers'
import { ExerciseProps } from '../../types/program'
import exerciseMessages from './translation'

const messages = defineMessages({
  yourExerciseResult: { id: 'program.label.yourExerciseResult', defaultMessage: '你的測驗成果' },
  score: { id: 'program.label.score', defaultMessage: '{score}分' },
  passExercise: { id: 'program.text.passExercise', defaultMessage: '恭喜！通過測驗' },
  failExercise: { id: 'program.text.failExercise', defaultMessage: '未通過測驗' },
  answerCorrectly: { id: 'program.text.answerCorrectly', defaultMessage: '答對 {correctCount} 題，共 {total} 題' },
  maxScore: { id: 'program.text.maxScore', defaultMessage: '此測驗滿分為 {maxScore} 分' },
  passingScore: { id: 'program.text.passScore', defaultMessage: '及格分數 {passingScore} 分' },
  nextCourse: { id: 'program.ui.nextCourse', defaultMessage: '繼續課程' },
  showDetail: { id: 'program.ui.showDetail', defaultMessage: '查看解答' },
  restartExercise: { id: 'program.ui.restartExercise', defaultMessage: '重新測驗' },
  finishedExercise: { id: 'program.ui.finishedExercise', defaultMessage: '已完成作答' },
})

const StyledTableContainer = styled.div`
  margin-bottom: 24px;
  padding: 10px 10px 0;
  border-radius: 4px;
  border: solid 1px #ececec;
`
const StyledTh = styled(Th)`
  && {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }
`
const StyledTbody = styled(Tbody)`
  && {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }
`
const StyledButton = styled(Button)`
  && {
    border-radius: 4px;
    width: 178px;
  }
`
const StyledResultTitle = styled.h2`
  ${CommonLargeTextMixin}
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledTitle = styled.h3`
  ${CommonTitleMixin}
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: var(--gray-darker);

}
`
const StyledPassingScore = styled.p`
  ${CommonLargeTextMixin}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledCircularProgress = styled(CircularProgress)`
  line-height: ${props => props.size};
  height: ${props => props.size};
`
const StyledCircularProgressLabel = styled(CircularProgressLabel)`
  && {
    font-size: 22px;
  }
`
const StyledSuccessIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: auto;
  margin-bottom: 24px;
  border: 1px solid transparent;
  border-radius: 50%;
  text-align: center;
  padding: 16px;
  line-height: 40px;
  background-color: #ddfcf1;
  color: var(--success);
`
const StyledErrorText = styled.span`
  color: var(--error);
}
`

const ExerciseResultBlock: React.VFC<
  ExerciseProps & {
    timeSpent?: number
    nextProgramContentId?: string
    onReAnswer?: () => void
    onReview?: () => void
  }
> = ({
  questions,
  passingScore,
  isAvailableToRetry,
  isAvailableAnnounceScore,
  nextProgramContentId,
  isAnswerer,
  timeLimitAmount,
  timeLimitUnit,
  timeSpent,
  onReAnswer,
  onReview,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const {
    params: { programContentId: currentContentId },
    url,
  } = useRouteMatch<{ programContentId: string }>()
  const totalPoints = sum(questions.map(question => question.points))
  const score = sum(questions.map(question => question.gainedPoints || 0))

  const resultTable: {
    head: {
      columns: {
        label: string
        hidden?: boolean
      }[]
    }
    body: {
      rows: {
        columns: (string | React.ReactElement)[]
        hidden?: boolean
      }[]
    }
  } = {
    head: {
      columns: [
        { label: formatMessage(exerciseMessages['*'].item) },
        { label: formatMessage(exerciseMessages['*'].personalPerformance) },
        { label: formatMessage(exerciseMessages['*'].overallAverage), hidden: true },
      ],
    },
    body: {
      rows: [
        {
          columns: [
            formatMessage(exerciseMessages.ExerciseResultBlock.score),
            `${score} / ${totalPoints} ${formatMessage(exerciseMessages['*'].score)}`,
            `${score} / ${totalPoints} ${formatMessage(exerciseMessages['*'].score)}`,
          ],
          hidden: !isAvailableAnnounceScore,
        },
        {
          columns: [
            formatMessage(exerciseMessages.ExerciseResultBlock.averageAnswerTime),
            `${durationFullFormatter((timeSpent || 0) / 1000 / questions.length)}`,
            `${durationFullFormatter((timeSpent || 0) / 1000 / questions.length)}`,
          ],
          hidden: !Boolean(timeSpent),
        },
        {
          columns: [
            formatMessage(exerciseMessages.ExerciseResultBlock.totalTimeSpent),
            timeSpent &&
            timeLimitAmount &&
            timeLimitUnit &&
            moment.duration(timeLimitAmount, timeLimitUnit as DurationInputArg2).asMilliseconds() &&
            timeSpent > moment.duration(timeLimitAmount, timeLimitUnit as DurationInputArg2).asMilliseconds() ? (
              <StyledErrorText>{durationFullFormatter((timeSpent || 0) / 1000)}</StyledErrorText>
            ) : (
              `${durationFullFormatter((timeSpent || 0) / 1000)}`
            ),
            `${durationFullFormatter((timeSpent || 0) / 1000)}`,
          ],
          hidden: !Boolean(timeSpent),
        },
      ],
    },
  }

  return (
    <div className="d-flex flex-column align-items-center ">
      {isAvailableAnnounceScore ? (
        <div className="mb-4 text-center">
          <StyledResultTitle className="mb-2">{formatMessage(messages.yourExerciseResult)}</StyledResultTitle>
          <StyledCircularProgress
            className="mb-3"
            value={(score / totalPoints) * 100}
            size="120px"
            color={score >= passingScore ? 'var(--success)' : 'var(--warning)'}
          >
            <StyledCircularProgressLabel>
              {formatMessage(messages.score, { score: Math.floor(score * 10) / 10 })}
            </StyledCircularProgressLabel>
          </StyledCircularProgress>
          {Boolean(passingScore) && (
            <>
              <StyledTitle>
                {score >= passingScore ? formatMessage(messages.passExercise) : formatMessage(messages.failExercise)}
              </StyledTitle>
              <StyledPassingScore>
                {formatMessage(exerciseMessages.ExerciseResultBlock.passingScore, { passingScore })}
              </StyledPassingScore>
            </>
          )}
        </div>
      ) : (
        <div className="mb-4 text-center">
          <StyledSuccessIconWrapper>
            <Icon as={CheckIcon} w={8} h={8} />
          </StyledSuccessIconWrapper>
          <StyledTitle style={{ fontSize: '20px' }}>{formatMessage(messages.finishedExercise)}</StyledTitle>
        </div>
      )}
      {resultTable.body.rows.some(body => !body.hidden) && (
        <StyledTableContainer>
          <Table>
            <Thead>
              <Tr>
                {resultTable.head.columns
                  .filter(column => !column.hidden)
                  .map(column => (
                    <StyledTh key={column.label}>{column.label}</StyledTh>
                  ))}
              </Tr>
            </Thead>
            <StyledTbody>
              {resultTable.body.rows
                .filter(row => !row.hidden)
                .map((row, rowIndex, rows) => (
                  <Tr key={row.columns.join('')}>
                    {row.columns
                      .filter((_column, columnIndex) => !resultTable.head.columns[columnIndex].hidden)
                      .map(column => (
                        <Td
                          style={{
                            ...(rowIndex + 1 === rows.length
                              ? {
                                  borderBottom: 'none',
                                }
                              : {}),
                          }}
                        >
                          {column}
                        </Td>
                      ))}
                  </Tr>
                ))}
            </StyledTbody>
          </Table>
        </StyledTableContainer>
      )}
      <div className="d-flex flex-column">
        {nextProgramContentId && (
          <StyledButton
            onClick={() => history.push(url.replace(currentContentId, nextProgramContentId))}
            className="mb-2"
            variant="primary"
          >
            {formatMessage(messages.nextCourse)}
          </StyledButton>
        )}
        <StyledButton onClick={onReview} className="mb-2" variant="outline">
          {formatMessage(messages.showDetail)}
        </StyledButton>
        {isAvailableToRetry && (
          <StyledButton onClick={onReAnswer} variant="outline" disabled={!isAnswerer}>
            {formatMessage(messages.restartExercise)}
          </StyledButton>
        )}
      </div>
    </div>
  )
}

export default ExerciseResultBlock
