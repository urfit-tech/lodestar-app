import { Icon } from '@chakra-ui/icons'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import moment, { Moment } from 'moment'
import { sum } from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useMutateExercise, useProgramContentExamId } from '../../hooks/program'
import { ReactComponent as routeErrorIcon } from '../../images/404.svg'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'
import ExerciseIntroBlock from './ExerciseIntroBlock'
import ExerciseQuestionBlock from './ExerciseQuestionBlock'
import ExerciseResultBlock from './ExerciseResultBlock'
import exerciseMessages from './translation'

const StyledAdminCard = styled(AdminCard)`
  @media (min-width: ${BREAK_POINT}px) {
    max-width: 680px;
    margin: auto;
  }
`
const StyledTitle = styled.h3`
  height: 27px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: var(--gray-darker);
`
const StyledDescription = styled.div`
  margin: 8px 0 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`

const ExerciseBlock: React.VFC<{
  id: string
  programContentId: string
  title: string
  nextProgramContentId?: string
  isTaken?: boolean
  isAnswerer?: boolean
  isAvailableToGoBack: boolean
  isAvailableToRetry: boolean
  isAvailableAnnounceScore?: boolean
  passingScore: number
  questions: {
    id: string
    points: number
    description: string | null
    answerDescription: string | null
    isMultipleAnswers: boolean
    layout?: 'column' | 'grid'
    font?: string
    choices: {
      id: string
      description: string | null
      isCorrect: boolean
      isSelected: boolean
    }[]
    gainedPoints: number
  }[]
  startedAt?: Date // exam
  endedAt?: Date
  timeLimitUnit?: string
  timeLimitAmount?: number
}> = ({
  id,
  questions: defaultQuestions,
  passingScore,
  isAvailableToGoBack,
  isAvailableToRetry,
  isAvailableAnnounceScore,
  programContentId,
  startedAt,
  endedAt,
  timeLimitUnit,
  timeLimitAmount,
  title,
  nextProgramContentId,
  isTaken,
  isAnswerer,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { insertExercise } = useMutateExercise()
  const { examId } = useProgramContentExamId(programContentId)
  const exerciseBeganAt = useRef<Moment | null>(null)
  const exerciseFinishedAt = useRef<Moment | null>(null)
  const [status, setStatus] = useState<'intro' | 'answering' | 'result' | 'review' | 'error'>(
    isTaken ? 'result' : 'intro',
  )
  const [questions, setQuestions] = useState(defaultQuestions)

  useEffect(() => {
    setStatus(isTaken ? 'result' : 'intro')
  }, [isTaken])

  let exerciseStatus

  const handleStart = () => {
    setStatus('answering')
    exerciseBeganAt.current = moment()
    exerciseFinishedAt.current = null
  }

  const handleFinish = () => {
    if (exerciseBeganAt.current && !exerciseFinishedAt.current) {
      exerciseFinishedAt.current = moment()
    }
    insertExercise({
      variables: {
        data: {
          member_id: currentMemberId,
          program_content_id: programContentId,
          answer: questions.map(question => ({
            questionId: question.id,
            questionPoints: question.points,
            choiceIds: question.choices.filter(choice => choice.isSelected).map(choice => choice.id),
            gainedPoints: question.gainedPoints || 0,
          })),
          exam_id: examId,
        },
      },
    })
      .then(() => setStatus('result'))
      .catch(error => handleError(error))
  }

  if (status === 'intro') {
    exerciseStatus = (
      <ExerciseIntroBlock
        id={id}
        startedAt={startedAt}
        endedAt={endedAt}
        isAvailableToGoBack={isAvailableToGoBack}
        isAvailableToRetry={isAvailableToRetry}
        isAvailableAnnounceScore={isAvailableAnnounceScore}
        passingScore={passingScore}
        timeLimitUnit={timeLimitUnit}
        timeLimitAmount={timeLimitAmount}
        questions={questions}
        onStart={handleStart}
      />
    )
  }

  if (['answering', 'review'].includes(status)) {
    exerciseStatus = (
      <ExerciseQuestionBlock
        isAvailableToGoBack={isAvailableToGoBack}
        passingScore={passingScore}
        questions={questions}
        showDetail={status === 'review'}
        timeSpent={
          exerciseBeganAt.current && exerciseFinishedAt.current
            ? exerciseFinishedAt.current.diff(exerciseBeganAt.current)
            : undefined
        }
        onChoiceSelect={(questionId, choiceId) => {
          if (status !== 'answering') {
            return
          }
          const question = questions.find(question => question.id === questionId)
          if (!question) {
            return
          }
          const newChoices = question.choices.map(choice =>
            choice.id === choiceId
              ? {
                  ...choice,
                  isSelected: question.isMultipleAnswers ? !choice.isSelected : true,
                }
              : {
                  ...choice,
                  isSelected: question.isMultipleAnswers ? choice.isSelected : false,
                },
          )
          const gainedPoints = Math.max(
            (question.isMultipleAnswers
              ? sum(newChoices.map(choice => (choice.isCorrect === choice.isSelected ? 1 : -1))) / newChoices.length
              : newChoices.every(choice => choice.isCorrect === choice.isSelected)
              ? 1
              : 0) * question.points,
            0,
          )

          setQuestions(
            questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    choices: newChoices,
                    gainedPoints,
                  }
                : question,
            ),
          )
        }}
        onFinish={handleFinish}
        onNextStep={() => setStatus('result')}
      />
    )
  }

  if (status === 'result') {
    exerciseStatus = (
      <ExerciseResultBlock
        id={id}
        isAvailableToGoBack={isAvailableToGoBack}
        isAvailableToRetry={isAvailableToRetry}
        isAvailableAnnounceScore={isAvailableAnnounceScore}
        passingScore={passingScore}
        questions={questions}
        nextProgramContentId={nextProgramContentId}
        timeLimitUnit={timeLimitUnit}
        timeLimitAmount={timeLimitAmount}
        timeSpent={
          exerciseBeganAt.current && exerciseFinishedAt.current
            ? exerciseFinishedAt.current.diff(exerciseBeganAt.current)
            : undefined
        }
        onReAnswer={() => {
          if (!isAnswerer) return
          setQuestions(
            defaultQuestions.map(question => ({
              ...question,
              choices: question.choices.map(choice => ({
                ...choice,
                isSelected: false,
              })),
            })),
          )
          setStatus('intro')
        }}
        onReview={() => setStatus('review')}
        isAnswerer={isAnswerer}
      />
    )
  }

  if (status === 'error') {
    exerciseStatus = (
      <div className="text-center">
        <Icon as={routeErrorIcon} className="mb-4 mx-auto" style={{ width: '100px', height: '100px' }} />
        <StyledTitle>{formatMessage(exerciseMessages.ExerciseBlock.notFound)}</StyledTitle>
        <StyledDescription>{formatMessage(exerciseMessages.ExerciseBlock.exerciseNoLongerExists)}</StyledDescription>
      </div>
    )
  }

  return (
    <StyledAdminCard className="mb-4">
      <div className="d-flex justify-content-between">
        <StyledTitle className="mb-4">{title}</StyledTitle>
      </div>
      {exerciseStatus}
    </StyledAdminCard>
  )
}

export default ExerciseBlock
