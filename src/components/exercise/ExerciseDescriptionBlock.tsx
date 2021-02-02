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

const ExerciseDescriptionBlock: React.FC<{
  title: string
  allowReAnswer: boolean
  exercises: {
    isMultipleChoice: boolean
    question: string
    options: {
      answer: string
      isAnswer: boolean
    }[]
    detail: string
  }[]
  passingScore: number
  nextProgramContentId: string
}> = ({ title, allowReAnswer, exercises, passingScore, nextProgramContentId }) => {
  const [status, setStatus] = useState<'answering' | 'result' | 'review'>('answering')
  const [questionList, setQuestionList] = useState(
    exercises.map(v => ({
      ...v,
      options: v.options.map(w => ({
        ...w,
        isSelected: false,
      })),
    })),
  )

  let exercise

  if (['answering', 'review'].includes(status)) {
    exercise = (
      <ExerciseQuestionBlock
        allowReAnswer={allowReAnswer}
        showDetail={status === 'review'}
        questions={questionList}
        onSetAnswer={status === 'answering' ? setQuestionList : undefined}
        onSetStatusResult={() => setStatus('result')}
      />
    )
  }

  if (status === 'result') {
    exercise = (
      <ExerciseResultBlock
        questionList={questionList}
        passingScore={passingScore}
        nextProgramContentId={nextProgramContentId}
        onSetStatusAnswering={() => {
          setStatus('answering')
          setQuestionList(
            exercises.map(v => ({
              ...v,
              options: v.options.map(w => ({
                ...w,
                isSelected: false,
              })),
            })),
          )
        }}
        onSetStatusReview={() => {
          setStatus('review')
        }}
      />
    )
  }

  return (
    <AdminCard>
      <StyledTitle className="mb-4">{title}</StyledTitle>
      {exercise}
    </AdminCard>
  )
}

export default ExerciseDescriptionBlock
