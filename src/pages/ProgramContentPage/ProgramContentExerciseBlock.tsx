import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import ExerciseBlock from '../../components/exercise/ExerciseBlock'
import hasura from '../../hasura'
import {
  ProgramContent,
  ProgramContentAttachmentProps,
  ProgramContentBodyProps,
  ProgramContentMaterialProps,
} from '../../types/program'

const ProgramContentExerciseBlock: React.VFC<{
  programContent: ProgramContent & {
    programContentBody: ProgramContentBodyProps | null
    materials: ProgramContentMaterialProps[]
    attachments: ProgramContentAttachmentProps[]
  }
  nextProgramContentId?: string
}> = ({ programContent, nextProgramContentId }) => {
  const [exerciseId] = useQueryParam('exerciseId', StringParam)
  const { currentMemberId } = useAuth()
  const { loadingLastExercise, lastExercise } = useLastExercise(programContent.id, currentMemberId || '', exerciseId)

  if (loadingLastExercise || !programContent.programContentBody?.data?.questions) {
    return null
  }

  return (
    <ExerciseBlock
      // TODO
      /*  
          below data which from programContent metadata 
          will be replaced from exam data
      */
      id={programContent.programContentBody.id}
      programContentId={programContent.id}
      title={programContent.title}
      nextProgramContentId={nextProgramContentId}
      isTaken={!!lastExercise}
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
            gainedPoints: lastExercise?.answer?.find((v: any) => v.questionId === question.id)?.gainedPoints || 0,
            choices:
              question.choices?.map((choice: any) => ({
                id: choice.id,
                description: choice.description || '',
                isCorrect: !!choice.isCorrect,
                isSelected: !!lastExercise?.answer?.some(
                  (v: any) =>
                    v.questionId === question.id && v.choiceIds.some((choiceId: string) => choiceId === choice.id),
                ),
              })) || [],
          })) || []
      }
      isAvailableToGoBack={!!programContent.metadata?.isAvailableToGoBack}
      isAvailableToRetry={!!programContent.metadata?.isAvailableToRetry}
      isAvailableAnnounceScore={programContent.metadata?.isAvailableAnnounceScore ?? true}
      passingScore={programContent.metadata?.passingScore || 0}
      isAnswerer={currentMemberId === lastExercise?.memberId}
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
}

const useLastExercise = (programContentId: string, memberId: string, exerciseId?: string | null) => {
  const condition: hasura.GET_LAST_EXERCISEVariables['condition'] = {
    id: exerciseId ? { _eq: exerciseId } : undefined,
    program_content_id: { _eq: programContentId },
    member_id: exerciseId ? undefined : { _eq: memberId },
  }

  const { loading, error, data, refetch } = useQuery<hasura.GET_LAST_EXERCISE, hasura.GET_LAST_EXERCISEVariables>(
    gql`
      query GET_LAST_EXERCISE($condition: exercise_bool_exp!) {
        exercise(where: $condition, order_by: [{ created_at: desc }], limit: 1) {
          id
          answer
          member_id
        }
      }
    `,
    {
      variables: { condition },
      fetchPolicy: 'no-cache',
    },
  )

  const lastExercise = data?.exercise?.[0]
    ? {
        id: data.exercise[0].id,
        answer: data.exercise[0].answer,
        memberId: data.exercise[0].member_id,
      }
    : null

  return {
    loadingLastExercise: loading,
    errorLastExercise: error,
    lastExercise,
    refetchLastExercise: refetch,
  }
}

export default ProgramContentExerciseBlock
