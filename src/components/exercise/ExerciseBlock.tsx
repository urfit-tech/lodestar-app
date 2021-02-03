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
  nextProgramContentId: string
  exercises: {
    isMultipleChoice: boolean
    question: string
    detail: string
    options: {
      answer: string
      isAnswer: boolean
    }[]
  }[]
  passingScore: number
  allowReAnswer?: boolean
}> = ({ exercises, allowReAnswer, passingScore, nextProgramContentId, title }) => {
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

  let exerciseStatus

  if (['answering', 'review'].includes(status)) {
    exerciseStatus = (
      <ExerciseQuestionBlock
        allowReAnswer={allowReAnswer}
        showDetail={status === 'review'}
        questionList={questionList}
        onSetAnswer={status === 'answering' ? setQuestionList : undefined}
        onSetStatusResult={() => setStatus('result')}
      />
    )
  }

  if (status === 'result') {
    exerciseStatus = (
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
      {exerciseStatus}
    </AdminCard>
  )
}

export default ExerciseBlock
