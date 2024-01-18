import { Skeleton } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import ExamBlock from '../../components/exam/ExamBlock'
import ExerciseBlock from '../../components/exercise/ExerciseBlock'
import { useExam, useExercisePublic, useSpecificExercise } from '../../hooks/exam'
import { ProgramContent, ProgramContentAttachmentProps, ProgramContentBodyProps } from '../../types/program'

const ProgramContentExerciseBlock: React.VFC<{
  programContent: Omit<ProgramContent, 'ebook'> & {
    programContentBody: ProgramContentBodyProps | null
    attachments: ProgramContentAttachmentProps[]
  }
  nextProgramContentId?: string
}> = ({ programContent, nextProgramContentId }) => {
  const [exerciseId] = useQueryParam('exerciseId', StringParam)
  const { currentMemberId } = useAuth()

  //specific or currentMember's exercise
  const { loadingSpecificExercise, specificExercise, refetchSpecificExercise, isTaken, exerciseAnswerer } =
    useSpecificExercise(programContent.id, currentMemberId || '', exerciseId)

  const {
    loading: loadingExercisePublic,
    exercisePublic,
    totalDuration,
    averageGainedPoints,
    exerciseAmount,
    refetch: refetchExercisePublic,
  } = useExercisePublic(programContent.id)

  const {
    loadingExamId,
    errorExamId,
    loadingExam,
    errorExam,
    exam,
    refetch: refetchExam,
  } = useExam(programContent.id, specificExercise)

  const contentType = programContent.contentType

  if (loadingSpecificExercise || loadingExercisePublic || loadingExamId || loadingExam) {
    return <Skeleton active />
  }

  if (contentType === 'exercise' && !programContent.programContentBody?.data?.questions)
    return <>exercise doesn't have any question</>

  // TODO
  /*
    migrate exercise to exam in future
  */
  if (contentType === 'exercise' && programContent.programContentBody) {
    return (
      <ExerciseBlock
        id={programContent.programContentBody.id}
        programContentId={programContent.id}
        title={programContent.title}
        nextProgramContentId={nextProgramContentId}
        isTaken={isTaken}
        isAnswerer={currentMemberId === exerciseAnswerer}
        questions={
          programContent.programContentBody.data.questions
            .filter((question: any) => !!question.choices?.length)
            .map((question: any) => ({
              id: question.id,
              description: question.description || '',
              answerDescription: question.answerDescription || '',
              points: question.points || 0,
              layout: question.layout,
              font: question.font,
              isMultipleAnswers: !!question.isMultipleAnswers,
              gainedPoints: specificExercise.find(v => v.questionId === question.id)?.gainedPoints || 0,
              choices:
                question.choices?.map((choice: any) => ({
                  id: choice.id,
                  description: choice.description || '',
                  isCorrect: !!choice.isCorrect,
                  isSelected: !!specificExercise.some(
                    (v: any) => v.questionId === question.id && v.choiceIds === choice.id,
                  ),
                })) || [],
            })) || []
        }
        isAvailableToGoBack={!!programContent.metadata?.isAvailableToGoBack}
        isAvailableToRetry={!!programContent.metadata?.isAvailableToRetry}
        isAvailableAnnounceScore={programContent.metadata?.isAvailableAnnounceScore ?? true}
        passingScore={programContent.metadata?.passingScore || 0}
        timeLimitUnit={programContent.metadata?.timeLimitUnit}
        timeLimitAmount={programContent.metadata?.timeLimitAmount}
        startedAt={
          programContent.metadata?.startedAt && moment(programContent.metadata?.startedAt).isValid()
            ? moment(programContent.metadata?.startedAt).toDate()
            : undefined
        }
        endedAt={
          programContent.metadata?.endedAt && moment(programContent.metadata?.endedAt).isValid()
            ? moment(programContent.metadata?.endedAt).toDate()
            : undefined
        }
      />
    )
  } else {
    // contentType is exam
    return (
      <ExamBlock
        errorExam={errorExam}
        errorExamId={errorExamId}
        exam={exam}
        programContentId={programContent.id}
        nextProgramContentId={nextProgramContentId}
        title={programContent.title}
        isTaken={isTaken}
        isAnswerer={currentMemberId === exerciseAnswerer}
        exercisePublic={exercisePublic}
        specificExercise={specificExercise}
        totalDuration={totalDuration}
        averageGainedPoints={averageGainedPoints}
        exerciseAmount={exerciseAmount}
        onRefetchExam={refetchExam}
        onRefetchSpecificExercise={refetchSpecificExercise}
        onRefetchExercisePublic={refetchExercisePublic}
      />
    )
  }
}

export default ProgramContentExerciseBlock
