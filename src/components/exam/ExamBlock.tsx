import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment, { DurationInputArg2, Moment } from 'moment'
import { flatten, sum } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { useProgramContentExamId } from '../../hooks/program'
import { ReactComponent as routeErrorIcon } from '../../images/404.svg'
import { Exam, ExamTimeUnit } from '../../types/program'
import AdminCard from '../common/AdminCard'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'
import ExamIntroBlock from './ExamIntroBlock'
import ExamQuestionBlock from './ExamQuestionBlock'
import ExamResultBlock from './ExamResultBlock'
import examMessages from './translation'

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

const ExamBlock: React.VFC<{
  programContentId: string
  nextProgramContentId?: string
  title: string
  isTaken: boolean
  isAnswerer: boolean
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
    // point 分數
    // gainedPoints: number => exam point
    // 購買後多久內可以測試
    // examinableUnit
    // examinableAmount
  }[]
}> = ({ programContentId, nextProgramContentId, title, isTaken, isAnswerer, questions: defaultQuestions }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { examId } = useProgramContentExamId(programContentId)
  const { memberExamTimeLimit, deleteMemberExamTimeLimit } = useMemberExamTimeLimit(examId)
  const [status, setStatus] = useState<'intro' | 'answering' | 'result' | 'review' | 'error'>(
    isTaken ? 'result' : 'intro',
  )
  // insert in exercise, if member start to answer
  const [questions, setQuestions] = useState(defaultQuestions)
  const exerciseBeganAt = useRef<Moment | null>(null)
  const exerciseFinishedAt = useRef<Moment | null>(null)
  const { loading: loadingExam, error, exam } = useExam('')

  useEffect(() => {
    setStatus(isTaken ? 'result' : 'intro')
  }, [isTaken])

  useEffect(() => {
    if (!loadingExam) error && setStatus('error')
  }, [error, loadingExam])

  let examStatus

  // 計算測驗期間
  const examinableTime = () => {}

  const handleStart = () => {
    // insertMemberExamTimeLimit(timeLimitUnit, timeLimitAmount)
    // .then(() => memberExamTimeLimit.refetch())
    // .then(() => {
    //   setStatus('answering')
    //   exerciseBeganAt.current = moment()
    // })
    exerciseFinishedAt.current = null
  }

  const handleFinish = () => {
    if (exerciseBeganAt.current && !exerciseFinishedAt.current) {
      exerciseFinishedAt.current = moment()
    }
    // TODO: change to update exercise
    // insertExercise({
    //   variables: {
    //     data: {
    //       member_id: currentMemberId,
    //       program_content_id: programContentId,
    //       answer: questions.map(question => ({
    //         questionId: question.id,
    //         questionPoints: question.points,
    //         choiceIds: question.choices.filter(choice => choice.isSelected).map(choice => choice.id),
    //         gainedPoints: question.gainedPoints || 0,
    //       })),
    //       exam_id: examId,
    //     },
    //   },
    // })
    //   .then(() => setStatus('result'))
    //   .then(() => deleteMemberExamTimeLimit())
    //   .catch(() => {})
  }

  if (status === 'intro') {
    examStatus = (
      <ExamIntroBlock
        // 測驗期間
        // FIXME: change to real limit time
        // examinableUnit={undefined}
        // examinableAmount={undefined}
        // examinableStartedAt={undefined}
        // examinableEndedAt={undefined}
        startedAt={new Date()}
        endedAt={new Date()}
        isAvailableToGoBack={exam.isAvailableToGoBack}
        isAvailableToRetry={exam.isAvailableToRetry}
        isAvailableAnnounceScore={exam.isAvailableAnnounceScore}
        passingScore={exam.passingScore}
        point={exam.point}
        timeLimitUnit={exam.timeLimitUnit}
        timeLimitAmount={exam.timeLimitAmount}
        questions={[]}
        onStart={handleStart}
      />
    )
  }

  if (['answering', 'review'].includes(status)) {
    examStatus = (
      <ExamQuestionBlock
        isAvailableToGoBack={exam.isAvailableToGoBack}
        passingScore={exam.passingScore}
        questions={[]}
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
    examStatus = (
      // TODO: can named ExamBlock or keep ExamResultBlock
      <ExamResultBlock
        nextProgramContentId={nextProgramContentId}
        isAvailableToRetry={exam.isAvailableToRetry}
        isAvailableAnnounceScore={exam.isAvailableAnnounceScore}
        passingScore={exam.passingScore}
        timeLimitUnit={exam.timeLimitUnit}
        timeLimitAmount={exam.timeLimitAmount}
        questions={questions}
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
    examStatus = (
      <div className="text-center">
        <Icon as={routeErrorIcon} className="mb-4 mx-auto" style={{ width: '100px', height: '100px' }} />
        <StyledTitle>{formatMessage(examMessages.ExamBlock.notFound)}</StyledTitle>
        <StyledDescription>{formatMessage(examMessages.ExamBlock.examNoLongerExists)}</StyledDescription>
      </div>
    )
  }

  return (
    <StyledAdminCard className="mb-4">
      <div className="d-flex justify-content-between">
        <StyledTitle className="mb-4">{title}</StyledTitle>
        <div>
          {status === 'answering' && exam.timeLimitUnit && exam.timeLimitAmount && (
            // TODO: member_time_limit 學生是否有個別延期
            // TODO: time_limit_unit, time_limit_amount 為測驗答題時間
            <CountDownTimeBlock
              // FIXME: 計算正確過期日
              expiredAt={new Date()}
              text={formatMessage(examMessages.ExamBlock.countdown)}
            />
          )}
        </div>
      </div>
      {examStatus}
    </StyledAdminCard>
  )
}

const useExam = (programContentId: string) => {
  const { data: programContentBodyData } = useQuery<hasura.GET_EXAM_ID, hasura.GET_EXAM_IDVariables>(
    gql`
      query GET_EXAM_ID($programContentId: uuid!) {
        program_content_body(where: { program_contents: { id: { _eq: $programContentId } }, type: { _eq: "exam" } }) {
          target
        }
      }
    `,
    { variables: { programContentId } },
  )
  const examId = programContentBodyData?.program_content_body[0].target
  const { loading, error, data } = useQuery<hasura.GET_EXAM, hasura.GET_EXAMVariables>(
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
    questionList: any[]
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
    questionList: flatten(
      data?.exam_by_pk?.exam_question_group.map(v =>
        v.question_group?.questions.map(w => ({
          id: w.id,
          type: w.type,
          subject: w.subject,
          layout: w.layout,
          font: w.font,
          explanation: w.explanation,
          questionOptions: w.question_options.map(x => ({
            id: x.id,
            value: x.value,
            isAnswer: x.is_answer,
          })),
        })),
      ) || [],
    ),
  }
  console.log(exam.questionList)
  return {
    loading,
    error,
    exam,
  }
}

const useMemberExamTimeLimit = (id: string | null) => {
  const [timeLimit, setTimeLimit] = useState<Date | null>(null)
  // TODO: get member exam time limit from query
  // const { loading, error, data, refetch } = useQuery<
  //   hasura.GET_MEMBER_EXAM_TIME_LIMIT,
  //   hasura.GET_MEMBER_EXAM_TIME_LIMITVariables
  // >(
  //   gql`
  //     query GET_MEMBER_EXAM_TIME_LIMIT($id: uuid!) {
  //          ...
  //     }
  //   `,
  //   { variables: { id }, fetchPolicy: 'no-cache' },
  // )

  // TODO: insert member exam time limit mutation
  // const [insertMemberExamTimeLimit] = useMutation<
  //   hasura.INSERT_MEMBER_EXAM_TIME_LIMIT,
  //   hasura.INSERT_MEMBER_EXAM_TIME_LIMITVariables
  // >(gql`
  //   mutation INSERT_MEMBER_EXAM_TIME_LIMIT {
  // ...
  // `)

  // TODO: remove when query enabled
  const memberExamTimeLimit = () => {
    const timeLimitISOString = localStorage.getItem(`kolable.exam.timeLimit.${id}`)
    if (timeLimitISOString) {
      setTimeLimit(moment(timeLimitISOString).toDate())
    }
  }

  // TODO: removed when insert mutation enabled
  const insertMemberExamTimeLimit = async (unit: string, amount: number) => {
    try {
      localStorage.setItem(
        `kolable.exam.timeLimit.${id}`,
        moment()
          .add(amount, unit as DurationInputArg2)
          .toISOString(),
      )
    } catch (error) {}
  }

  // TODO: removed when delete mutation enabled
  const deleteMemberExamTimeLimit = () => {
    try {
      localStorage.removeItem(`kolable.exam.timeLimit.${id}`)
    } catch (error) {}
  }

  return {
    memberExamTimeLimit: {
      loading: false,
      error: false,
      data: timeLimit,
      refetch: () => memberExamTimeLimit(),
    },
    insertMemberExamTimeLimit,
    deleteMemberExamTimeLimit,
  }
}

export default ExamBlock
