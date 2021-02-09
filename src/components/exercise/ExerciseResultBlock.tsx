import { Button, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { sum } from 'ramda'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { CommonLargeTextMixin, CommonTextMixin, CommonTitleMixin } from '../common'

const messages = defineMessages({
  yourExerciseResult: { id: 'program.label.yourExerciseResult', defaultMessage: '你的測驗成果' },
  score: { id: 'program.label.score', defaultMessage: '{score}分' },
  passExercise: { id: 'program.text.passExercise', defaultMessage: '恭喜！通過測驗' },
  failExercise: { id: 'program.text.failExercise', defaultMessage: '未通過測驗' },
  answerCorrectly: { id: 'program.text.answerCorrectly', defaultMessage: '答對 {correctCount} 題，共 {total} 題' },
  maxScore: { id: 'program.text.maxScore', defaultMessage: '此測驗滿分為 {maxScore} 分' },
  passingScore: { id: 'program.text.passScore', defaultMessage: '需獲得 {passingScore} 分才能通過測驗' },
  nextCourse: { id: 'program.ui.nextCourse', defaultMessage: '繼續課程' },
  showDetail: { id: 'program.ui.showDetail', defaultMessage: '查看解答' },
  restartExercise: { id: 'program.ui.restartExercise', defaultMessage: '重新測驗' },
})

const StyledButton = styled(Button)`
  && {
    border-radius: 4px;
    width: 178px;
  }
`

const StyledResultTitle = styled.h2`
  ${CommonLargeTextMixin}
  line-height: 1;
`
const StyledTitle = styled.h3`
  ${CommonTitleMixin}
`
const StyledAnswer = styled.p`
  ${CommonTextMixin}
`
const StyledPassingScore = styled.p`
  ${CommonLargeTextMixin}
`
const StyledCircularProgress = styled(CircularProgress)`
  line-height: 1;
`
const StyledCircularProgressLabel = styled(CircularProgressLabel)`
  && {
    font-size: 22px;
  }
`

const ExerciseResultBlock: React.FC<{
  exercises: {
    question: string
    options: {
      answer: string
      isAnswer: boolean
      isSelected: boolean
    }[]
    detail: string
    score: number
  }[]
  passingScore: number
  nextProgramContentId?: string
  onReAnswer?: () => void
  onReview?: () => void
}> = ({ exercises, passingScore, nextProgramContentId, onReAnswer, onReview }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const {
    params: { programContentId: currentContentId },
    url,
  } = useRouteMatch<{ programContentId: string }>()
  const totalScore = sum(exercises.map(v => v.score))
  const score = Math.floor(
    sum(exercises.map(v => (v.options.filter(w => w.isAnswer === w.isSelected).length / v.options.length) * v.score)),
  )
  const correctCount = exercises.filter(
    v => v.options.filter(w => w.isSelected === w.isAnswer).length === v.options.length,
  ).length

  return (
    <div className="d-flex flex-column align-items-center ">
      <StyledResultTitle className="mb-2">{formatMessage(messages.yourExerciseResult)}</StyledResultTitle>
      <StyledCircularProgress
        className="mb-3"
        value={(score / totalScore) * 100}
        size="120px"
        color={score >= passingScore ? 'var(--success)' : 'var(--warning)'}
      >
        <StyledCircularProgressLabel>{formatMessage(messages.score, { score })}</StyledCircularProgressLabel>
      </StyledCircularProgress>
      <div className="mb-4 text-center">
        <StyledTitle>
          {score >= passingScore ? formatMessage(messages.passExercise) : formatMessage(messages.failExercise)}
        </StyledTitle>
        <StyledAnswer>
          {formatMessage(messages.answerCorrectly, { correctCount, total: exercises.length })}
        </StyledAnswer>

        <StyledPassingScore className="mt-3">
          {score < passingScore
            ? formatMessage(messages.passingScore, { passingScore })
            : formatMessage(messages.maxScore, { maxScore: totalScore })}
        </StyledPassingScore>
      </div>
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
        <StyledButton onClick={onReAnswer} variant="outline">
          {formatMessage(messages.restartExercise)}
        </StyledButton>
      </div>
    </div>
  )
}

export default ExerciseResultBlock
