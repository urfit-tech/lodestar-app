import { adjust, includes } from 'ramda'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutateExercise } from '../../hooks/program'
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

const ExerciseBlock: React.FC<{
  programContentId: string
  title: string
  exercises: {
    id: string
    question: string
    detail: string
    score: number
    options: {
      id: string
      answer: string
      isAnswer: boolean
      isSelected: boolean
    }[]
  }[]
  passingScore: number
  allowReAnswer?: boolean
  allowGoBack?: boolean
  nextProgramContentId?: string
  isTaken?: boolean
}> = ({
  programContentId,
  title,
  exercises: defaultExercises,
  passingScore,
  allowReAnswer,
  allowGoBack,
  nextProgramContentId,
  isTaken,
}) => {
  const { currentMemberId } = useAuth()
  const { insertExercise } = useMutateExercise()
  const [status, setStatus] = useState<'answering' | 'result' | 'review'>(isTaken ? 'result' : 'answering')
  const [exercises, setExercises] = useState(defaultExercises)

  let exerciseStatus

  if (includes(status, ['answering', 'review'])) {
    exerciseStatus = (
      <ExerciseQuestionBlock
        allowGoBack={allowGoBack}
        showDetail={status === 'review'}
        exercises={exercises}
        onOptionSelect={
          status === 'answering'
            ? (currentIndex, newOptions) =>
                setExercises(
                  adjust(
                    currentIndex,
                    exercise => ({
                      ...exercise,
                      options: newOptions,
                    }),
                    exercises,
                  ),
                )
            : undefined
        }
        onFinish={() => {
          insertExercise({
            variables: {
              data: {
                member_id: currentMemberId,
                program_content_id: programContentId,
                answer: exercises.map(exercise => ({
                  questionId: exercise.id,
                  choiceIds: exercise.options.filter(option => option.isSelected).map(option => option.id),
                  points: exercise.score,
                })),
              },
            },
          }).catch(() => {})
          setStatus('result')
        }}
      />
    )
  }

  if (status === 'result') {
    exerciseStatus = (
      <ExerciseResultBlock
        exercises={exercises}
        passingScore={passingScore}
        nextProgramContentId={nextProgramContentId}
        allowReAnswer={allowReAnswer}
        onReAnswer={() => {
          setExercises(
            defaultExercises.map(v => ({
              ...v,
              options: v.options.map(w => ({
                ...w,
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
    <AdminCard>
      <StyledTitle className="mb-4">{title}</StyledTitle>
      {exerciseStatus}
    </AdminCard>
  )
}

export default ExerciseBlock
