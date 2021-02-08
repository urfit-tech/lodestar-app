import { adjust, includes } from 'ramda'
import React, { useState } from 'react'
import styled from 'styled-components'
import AdminCard from '../common/AdminCard'
import ExerciseQuestionBlock from './ExerciseQuestionBlock'
import ExerciseResultBlock from './ExerciseResultBlock'

const StyledTitle = styled.h3`
  width: 76px;
  height: 27px;
  font-family: NotoSansCJKtc;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: var(--gray-darker);
`

const ExerciseBlock: React.FC<{
  title: string
  exercises: {
    question: string
    detail: string
    options: {
      answer: string
      isAnswer: boolean
      isSelected: boolean
    }[]
    score: number
  }[]
  passingScore: number
  allowReAnswer?: boolean
  nextProgramContentId?: string
}> = ({ exercises: defaultExercises, allowReAnswer, passingScore, nextProgramContentId, title }) => {
  const [status, setStatus] = useState<'answering' | 'result' | 'review'>('answering')
  const [exercises, setExercises] = useState(defaultExercises)

  let exerciseStatus

  if (includes(status, ['answering', 'review'])) {
    exerciseStatus = (
      <ExerciseQuestionBlock
        allowReAnswer={allowReAnswer}
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
        onFinish={() => setStatus('result')}
      />
    )
  }

  if (status === 'result') {
    exerciseStatus = (
      <ExerciseResultBlock
        exercises={exercises}
        passingScore={passingScore}
        nextProgramContentId={nextProgramContentId}
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
