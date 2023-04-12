import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { flatten, sum } from 'ramda'
import { useMemo } from 'react'
import { Exam, ExamTimeUnit, ExercisePublic, Question } from '../types/exam'
import hasura from './../hasura'

export const useExam = (programContentId: string, latestExercise: ExercisePublic[]) => {
  const {
    loading: loadingExamId,
    error: errorExamId,
    data: programContentBodyData,
    refetch,
  } = useQuery<hasura.GET_EXAM_ID, hasura.GET_EXAM_IDVariables>(
    gql`
      query GET_EXAM_ID($programContentId: uuid!) {
        program_content_body(where: { program_contents: { id: { _eq: $programContentId } }, type: { _eq: "exam" } }) {
          target
        }
      }
    `,
    { variables: { programContentId } },
  )
  const examId = programContentBodyData?.program_content_body[0]?.target

  const {
    loading: loadingExam,
    error: errorExam,
    data,
  } = useQuery<hasura.GET_EXAM, hasura.GET_EXAMVariables>(
    gql`
      query GET_EXAM($examId: uuid!) {
        exam_by_pk(id: $examId) {
          id
          point
          passing_score
          examinable_unit
          examinable_amount
          examinable_started_at
          examinable_ended_at
          time_limit_unit
          time_limit_amount
          is_available_to_retry
          is_available_to_go_back
          is_available_announce_score
          exam_question_group {
            id
            question_group {
              id
              title
              questions(order_by: { position: asc }) {
                id
                type
                subject
                layout
                font
                explanation
                question_options(order_by: { position: asc }) {
                  id
                  value
                  is_answer
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        examId,
      },
    },
  )

  const exam: Pick<
    Exam,
    | 'id'
    | 'point'
    | 'passingScore'
    | 'examinableUnit'
    | 'examinableAmount'
    | 'examinableStartedAt'
    | 'examinableEndedAt'
    | 'timeLimitUnit'
    | 'timeLimitAmount'
    | 'isAvailableToRetry'
    | 'isAvailableToGoBack'
    | 'isAvailableAnnounceScore'
  > & {
    questions: Question[]
  } = {
    id: data?.exam_by_pk?.id,
    point: Number(data?.exam_by_pk?.point),
    passingScore: Number(data?.exam_by_pk?.passing_score),
    examinableUnit: data?.exam_by_pk?.examinable_unit?.toString() as ExamTimeUnit,
    examinableAmount: Number(data?.exam_by_pk?.examinable_amount),
    examinableStartedAt: data?.exam_by_pk?.examinable_started_at
      ? new Date(data.exam_by_pk.examinable_started_at)
      : null,
    examinableEndedAt: data?.exam_by_pk?.examinable_ended_at ? new Date(data.exam_by_pk.examinable_ended_at) : null,
    timeLimitUnit: data?.exam_by_pk?.time_limit_unit as ExamTimeUnit,
    timeLimitAmount: Number(data?.exam_by_pk?.time_limit_amount),
    isAvailableToRetry: Boolean(data?.exam_by_pk?.is_available_to_retry),
    isAvailableToGoBack: Boolean(data?.exam_by_pk?.is_available_to_go_back),
    isAvailableAnnounceScore: Boolean(data?.exam_by_pk?.is_available_announce_score),
    questions: flatten(
      data?.exam_by_pk?.exam_question_group.map(
        v =>
          v.question_group?.questions.map(w => ({
            id: w.id,
            type: w.type,
            subject: w.subject,
            layout: w.layout,
            font: w.font,
            explanation: w.explanation,
            gainedPoints: Number(latestExercise?.find(v => v.questionId === w.id)?.gainedPoints || 0),
            startedAt: latestExercise?.find(v => v.questionId === w.id)?.startedAt || null,
            endedAt: latestExercise?.find(v => v.questionId === w.id)?.endedAt || null,
            questionOptions:
              w.question_options.map(x => {
                return {
                  id: x.id,
                  value: x.value,
                  isAnswer: Boolean(x.is_answer),
                  isSelected: Boolean(latestExercise.find(v => v.questionId === w.id)?.choiceIds.includes(x.id)),
                }
              }) || [],
          })) || [],
      ) || [],
    ),
  }

  return {
    loadingExam,
    loadingExamId,
    errorExamId,
    errorExam,
    examId,
    exam,
    refetch,
  }
}

export const useExamMemberTimeLimit = (examId: string, memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_EXAM_MEMBER_TIME_LIMIT,
    hasura.GET_EXAM_MEMBER_TIME_LIMITVariables
  >(
    gql`
      query GET_EXAM_MEMBER_TIME_LIMIT($examId: uuid!, $memberId: String!) {
        exam_member_time_limit(where: { exam_id: { _eq: $examId }, member_id: { _eq: $memberId } }) {
          member_id
          expired_at
        }
      }
    `,
    {
      variables: {
        examId,
        memberId,
      },
    },
  )

  const extraExpiredAt = data?.exam_member_time_limit?.[0] ? new Date(data?.exam_member_time_limit[0].expired_at) : null

  return {
    loading,
    error,
    extraExpiredAt,
  }
}
export const useExamExaminableTimeLimit = (programContentId: string, memberId: string) => {
  const { loading, error, data } = useQuery<hasura.GET_CONTENT_DELIVERED_AT, hasura.GET_CONTENT_DELIVERED_ATVariables>(
    gql`
      query GET_CONTENT_DELIVERED_AT($programContentId: uuid!, $memberId: String!) {
        program_content_enrollment(
          where: { program_content_id: { _eq: $programContentId }, member_id: { _eq: $memberId } }
          order_by: { product_delivered_at: desc_nulls_last }
        ) {
          product_delivered_at
        }
      }
    `,
    {
      variables: {
        programContentId,
        memberId,
      },
    },
  )

  const productDeliveredAt = data?.program_content_enrollment
    ? new Date(data?.program_content_enrollment?.[0].product_delivered_at)
    : null

  return {
    loading,
    error,
    productDeliveredAt,
  }
}

export const useExamExercise = (programContentId: string, memberId: string, exerciseId?: string | null) => {
  const condition: hasura.GET_EXAM_EXERCISEVariables['condition'] = {
    id: exerciseId ? { _eq: exerciseId } : undefined,
    program_content_id: { _eq: programContentId },
    member_id: exerciseId ? undefined : { _eq: memberId },
    answer: { _is_null: false },
  }
  const { loading, error, data, refetch } = useQuery<hasura.GET_EXAM_EXERCISE, hasura.GET_EXAM_EXERCISEVariables>(
    gql`
      query GET_EXAM_EXERCISE($condition: exercise_bool_exp!) {
        exercise(where: $condition, order_by: { created_at: desc }, limit: 1) {
          id
          exercise_publics {
            exercise_id
            question_points
            question_id
            question_started_at
            gained_points
          }
          exam {
            id
            passing_score
          }
        }
      }
    `,
    { variables: { condition } },
  )

  const latestExerciseData = data?.exercise?.[0]

  const currentExamExerciseData: { passingScore: number; gainedPointsTotal: number } | null = useMemo(() => {
    if (latestExerciseData)
      return {
        passingScore: latestExerciseData?.exam?.passing_score || 0,
        gainedPointsTotal:
          latestExerciseData?.exercise_publics?.reduce((acc, item) => {
            return acc + Number(item?.gained_points)
          }, 0) || 0,
      }

    return null
  }, [latestExerciseData])

  return {
    currentExamExerciseData,
    refetchCurrentExamData: refetch,
    loadingCurrentExamData: loading,
    errorCurrentExamData: error,
  }
}
export const useExercisePublic = (programContentId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_EXERCISE_PUBLIC, hasura.GET_EXERCISE_PUBLICVariables>(
    gql`
      query GET_EXERCISE_PUBLIC($programContentId: uuid!) {
        exercise_public(where: { program_content_id: { _eq: $programContentId } }) {
          exercise_id
          program_content_id
          member_id
          started_at
          ended_at
          question_id
          question_points
          gained_points
          is_correct
          question_started_at
          question_ended_at
          duration
          choice_ids
        }
        exercise_public_aggregate(where: { program_content_id: { _eq: $programContentId } }) {
          aggregate {
            sum {
              duration
            }
            exerciseAmount: count(columns: exercise_id, distinct: true)
          }
        }
      }
    `,
    { variables: { programContentId } },
  )

  const exercisePublic: ExercisePublic[] =
    data?.exercise_public.map(v => ({
      exerciseId: v.exercise_id.toString(),
      programContentId: v.program_content_id.toString(),
      memberId: v.member_id?.toString(),
      startedAt: v.started_at ? new Date(v.started_at) : null,
      endedAt: v.ended_at ? new Date(v.ended_at) : null,
      questionId: v.question_id?.toString(),
      questionPoints: Number(v.question_points),
      gainedPoints: Number(v.gained_points),
      isCorrect: v.is_correct?.toString() === 'true',
      questionStartedAt: v.question_started_at ? new Date(v.question_started_at) : null,
      questionEndedAt: v.question_ended_at ? new Date(v.question_ended_at) : null,
      duration: Number(v.duration),
      choiceIds: v?.choice_ids ? v.choice_ids.split(',') : [],
    })) || []

  const totalDuration: number = Number(data?.exercise_public_aggregate.aggregate?.sum?.duration) || 0
  const averageGainedPoints: number =
    data?.exercise_public && data?.exercise_public_aggregate.aggregate?.exerciseAmount
      ? Number(
          (
            sum(data.exercise_public.map(v => Number(v.gained_points)) || []) /
            data.exercise_public_aggregate.aggregate.exerciseAmount
          ).toFixed(2),
        )
      : 0
  const exerciseAmount: number = Number(data?.exercise_public_aggregate.aggregate?.exerciseAmount)

  return {
    loading,
    error,
    exercisePublic,
    totalDuration,
    averageGainedPoints,
    exerciseAmount,
    refetch,
  }
}
export const useSpecificExercise = (programContentId: string, memberId: string, exerciseId?: string | null) => {
  const condition: hasura.GET_SPECIFIC_EXERCISEVariables['condition'] = {
    id: exerciseId ? { _eq: exerciseId } : undefined,
    program_content_id: { _eq: programContentId },
    member_id: exerciseId ? undefined : { _eq: memberId },
    answer: { _is_null: false },
  }

  const { loading, error, data, refetch } = useQuery<
    hasura.GET_SPECIFIC_EXERCISE,
    hasura.GET_SPECIFIC_EXERCISEVariables
  >(
    gql`
      query GET_SPECIFIC_EXERCISE($condition: exercise_bool_exp!) {
        exercise(where: $condition, order_by: [{ created_at: desc }], limit: 1) {
          id
          answer
          member_id
          started_at
          ended_at
        }
      }
    `,
    {
      variables: { condition },
      fetchPolicy: 'no-cache',
    },
  )

  const specificExercise: ExercisePublic[] =
    data?.exercise?.[0]?.answer?.map((v: any) => ({
      exerciseId: data.exercise?.[0].id,
      programContentId: programContentId,
      startedAt: data.exercise?.[0]?.started_at ? new Date(data.exercise[0].started_at) : null,
      endedAt: data.exercise?.[0]?.ended_at ? new Date(data.exercise[0].ended_at) : null,
      questionId: v?.questionId.toString(),
      questionPoints: Number(v?.questionPoints),
      gainedPoints: Number(v?.gainedPoints),
      isCorrect: Boolean(v?.gainedPoints === v?.questionPoints),
      questionStartedAt: v?.startedAt ? new Date(v.startedAt) : null,
      questionEndedAt: v?.endedAt ? new Date(v.endedAt) : null,
      duration:
        data.exercise?.[0]?.ended_at && data.exercise[0]?.ended_at
          ? new Date(data.exercise?.[0].ended_at).getTime() - new Date(data.exercise[0].started_at).getTime()
          : 0,
      choiceIds: v.choiceIds,
    })) || []

  const isTaken = data?.exercise.length !== 0
  const exerciseAnswerer = data?.exercise?.[0]?.member_id

  return {
    loadingSpecificExercise: loading,
    errorSpecificExercise: error,
    isTaken,
    exerciseAnswerer,
    specificExercise,
    refetchSpecificExercise: refetch,
  }
}
