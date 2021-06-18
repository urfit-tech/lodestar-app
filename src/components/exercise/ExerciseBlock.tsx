import { sum } from 'ramda'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMutateExercise } from '../../hooks/program'
import { ExerciseProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import AdminCard from '../common/AdminCard'
import ExerciseQuestionBlock from './ExerciseQuestionBlock'
import ExerciseResultBlock from './ExerciseResultBlock'

const StyledTitle = styled.h3`
  height: 27px;
  font-family: NotoSansCJKtc;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: var(--gray-darker);
`

const ExerciseBlock: React.VFC<
  ExerciseProps & {
    programContentId: string
    title: string
    nextProgramContentId?: string
    isTaken?: boolean
  }
> = ({
  id,
  questions: defaultQuestions,
  passingScore,
  isAvailableToGoBack,
  isAvailableToRetry,
  programContentId,
  title,
  nextProgramContentId,
  isTaken,
}) => {
  const { currentMemberId } = useAuth()
  const { insertExercise } = useMutateExercise()
  const [status, setStatus] = useState<'answering' | 'result' | 'review'>(isTaken ? 'result' : 'answering')
  const [questions, setQuestions] = useState(defaultQuestions)

  useEffect(() => {
    setStatus(isTaken ? 'result' : 'answering')
  }, [isTaken])

  let exerciseStatus

  if (['answering', 'review'].includes(status)) {
    exerciseStatus = (
      <ExerciseQuestionBlock
        id={id}
        isAvailableToGoBack={isAvailableToGoBack}
        isAvailableToRetry={isAvailableToRetry}
        passingScore={passingScore}
        questions={questions}
        showDetail={status === 'review'}
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
        onFinish={() => {
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
              },
            },
          })
            .then(() => setStatus('result'))
            .catch(() => {})
        }}
      />
    )
  }

  if (status === 'result') {
    exerciseStatus = (
      <ExerciseResultBlock
        id={id}
        isAvailableToGoBack={isAvailableToGoBack}
        isAvailableToRetry={isAvailableToRetry}
        passingScore={passingScore}
        questions={questions}
        nextProgramContentId={nextProgramContentId}
        onReAnswer={() => {
          setQuestions(
            defaultQuestions.map(question => ({
              ...question,
              choices: question.choices.map(choice => ({
                ...choice,
                isSelected: false,
              })),
            })),
          )
          setStatus('answering')
        }}
        onReview={() => setStatus('review')}
      />
    )
  }

  return (
    <AdminCard className="mb-4">
      <StyledTitle className="mb-4">{title}</StyledTitle>
      {exerciseStatus}
    </AdminCard>
  )
}

export default ExerciseBlock
