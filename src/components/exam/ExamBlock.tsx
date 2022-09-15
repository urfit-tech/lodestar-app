import { Icon } from '@chakra-ui/icons'
import { Spinner } from '@chakra-ui/react'
import { ApolloError } from 'apollo-client/errors/ApolloError'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import moment, { Moment } from 'moment'
import { sum } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useExamExaminableTimeLimit, useExamMemberTimeLimit } from '../../hooks/exam'
import { useMutateExercise } from '../../hooks/program'
import { ReactComponent as routeErrorIcon } from '../../images/404.svg'
import { Exam, ExercisePublic, Question } from '../../types/exam'
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
  margin-bottom: 22px;
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
  errorExam?: ApolloError
  errorExamId?: ApolloError
  exam: Pick<
    Exam,
    | 'id'
    | 'point'
    | 'passingScore'
    | 'examinableAmount'
    | 'examinableUnit'
    | 'examinableStartedAt'
    | 'examinableEndedAt'
    | 'timeLimitAmount'
    | 'timeLimitUnit'
    | 'isAvailableAnnounceScore'
    | 'isAvailableToGoBack'
    | 'isAvailableToRetry'
  > & { questions: Question[] }
  programContentId: string
  nextProgramContentId?: string
  title: string
  isTaken: boolean
  isAnswerer: boolean
  exercisePublic: ExercisePublic[]
  specificExercise: ExercisePublic[]
  totalDuration: number
  averageGainedPoints: number
  exerciseAmount: number
  onRefetchSpecificExercise?: () => void
  onRefetchExercisePublic?: () => void
}> = ({
  errorExam,
  errorExamId,
  exam,
  programContentId,
  nextProgramContentId,
  title,
  isTaken,
  isAnswerer,
  exercisePublic,
  specificExercise,
  totalDuration,
  averageGainedPoints,
  exerciseAmount,
  onRefetchSpecificExercise,
  onRefetchExercisePublic,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const examBeganAt = useRef<Moment | null>(null)
  const examFinishedAt = useRef<Moment | null>(null)

  const [currentExerciseId, setCurrentExerciseId] = useState<string>()
  const [starting, setStarting] = useState(false)
  const [questions, setQuestions] = useState(exam.questions)
  const [status, setStatus] = useState<'intro' | 'answering' | 'result' | 'review' | 'error'>(
    isTaken ? 'result' : 'intro',
  )

  const { insertExercise, updateExercise } = useMutateExercise()
  const {
    loading: loadingExtraExpiredAt,
    error: errorExtraExpiredAt,
    extraExpiredAt,
  } = useExamMemberTimeLimit(exam.id, currentMemberId || '')
  const {
    loading: loadingProductDeliveredAt,
    error: errorProductDeliveredAt,
    productDeliveredAt,
  } = useExamExaminableTimeLimit(programContentId, currentMemberId || '')

  useEffect(() => {
    if (errorExamId || errorExam || errorExtraExpiredAt || errorProductDeliveredAt) {
      process.env.NODE_ENV === 'development' && console.log({ errorExam, errorExamId })
      setStatus('error')
    }
  }, [errorExam, errorExamId, errorExtraExpiredAt, errorProductDeliveredAt])

  useEffect(() => {
    setStatus(isTaken ? 'result' : 'intro')
  }, [isTaken])

  let examStatus
  let exerciseId: string

  const examinableTime = extraExpiredAt
    ? { startedAt: null, endedAt: extraExpiredAt }
    : exam.examinableUnit && exam.examinableAmount && productDeliveredAt
    ? {
        startedAt: null,
        endedAt: moment(productDeliveredAt).add(exam.examinableAmount, exam.examinableUnit).toDate(),
      }
    : exam.examinableStartedAt && exam.examinableEndedAt
    ? { startedAt: exam.examinableStartedAt, endedAt: exam.examinableEndedAt }
    : { startedAt: null, endedAt: null }

  const handleStart = () => {
    const beganAt = moment()
    setStarting(true)
    insertExercise({
      variables: {
        data: {
          member_id: currentMemberId,
          program_content_id: programContentId,
          exam_id: exam.id,
          started_at: beganAt,
          answer: [],
        },
      },
    })
      .then(res => {
        exerciseId = res.data?.insert_exercise_one?.id
        setCurrentExerciseId(exerciseId)
        setStatus('answering')
      })
      .catch(error => handleError(error))
      .finally(() => setStarting(false))
    examBeganAt.current = beganAt
    examFinishedAt.current = null
  }

  const handleFinish = (isFinal: boolean) => {
    const finishedAt = moment()

    if (examBeganAt.current && !examFinishedAt.current) {
      examFinishedAt.current = finishedAt
    }

    const choiceIds = questions.map(question =>
      question.questionOptions?.filter(choice => choice.isSelected).map(choice => choice.id),
    )

    updateExercise({
      variables: {
        exerciseId: currentExerciseId,
        answer: questions.map((question, index) => ({
          questionId: question.id,
          questionPoints: exam.point,
          choiceIds: choiceIds[index],
          gainedPoints: question.gainedPoints,
          startedAt:
            choiceIds[index]?.length === 0
              ? finishedAt
              : index === 0
              ? examBeganAt.current
              : questions[index - 1]?.endedAt,
          endedAt:
            choiceIds[index]?.length === 0
              ? finishedAt
              : index === questions.length - 1
              ? finishedAt
              : question.endedAt,
        })),
        endedAt: finishedAt,
      },
    })
      .then(() => {
        onRefetchSpecificExercise?.()
        onRefetchExercisePublic?.()
        isFinal && setStatus('result')
      })
      .catch(error => handleError(error))
  }

  if (loadingExtraExpiredAt || loadingProductDeliveredAt)
    return (
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    )

  if (status === 'intro') {
    examStatus = (
      <ExamIntroBlock
        startedAt={examinableTime.startedAt}
        endedAt={examinableTime.endedAt}
        isAvailableToGoBack={exam.isAvailableToGoBack}
        isAvailableToRetry={exam.isAvailableToRetry}
        isAvailableAnnounceScore={exam.isAvailableAnnounceScore}
        passingScore={exam.passingScore}
        point={exam.point}
        questions={exam.questions}
        timeLimitUnit={exam.timeLimitUnit}
        timeLimitAmount={exam.timeLimitAmount}
        onStart={handleStart}
        loading={starting}
      />
    )
  }

  if (['answering', 'review'].includes(status)) {
    examStatus = (
      <ExamQuestionBlock
        isAvailableToGoBack={exam.isAvailableToGoBack}
        questions={questions}
        showDetail={status === 'review'}
        exercisePublic={exercisePublic}
        specificExercise={specificExercise}
        exerciseAmount={exerciseAmount}
        onChoiceSelect={(questionId, choiceId) => {
          if (status !== 'answering') {
            return
          }
          const question = questions.find(question => question.id === questionId)
          if (!question) {
            return
          }
          const isMultipleAnswers =
            (
              question.questionOptions?.filter(
                (option, index) => question.questionOptions?.indexOf(option) !== index,
              ) || []
            ).length >= 2
          const newChoices =
            question.questionOptions?.map(questionOption => {
              return questionOption.id === choiceId
                ? {
                    ...questionOption,
                    isSelected: isMultipleAnswers ? !questionOption.isSelected : true,
                  }
                : {
                    ...questionOption,
                    isSelected: isMultipleAnswers ? questionOption.isSelected : false,
                  }
            }) || []
          const gainedPoints = Math.max(
            (isMultipleAnswers
              ? sum(newChoices.map(choice => (choice.isAnswer === choice.isSelected ? 1 : -1))) / newChoices.length
              : newChoices?.every(choice => choice.isAnswer === choice.isSelected)
              ? 1
              : 0) * exam.point,
            0,
          )
          setQuestions(
            questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    questionOptions: newChoices,
                    gainedPoints,
                  }
                : question,
            ),
          )
        }}
        onQuestionFinish={(questionId, endedAt) =>
          setQuestions(
            questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    endedAt,
                  }
                : question,
            ),
          )
        }
        onFinish={handleFinish}
        onNextStep={() => setStatus('result')}
      />
    )
  }

  if (status === 'result') {
    examStatus = (
      // TODO: can named ExerciseBlock or keep ExamResultBlock
      <ExamResultBlock
        nextProgramContentId={nextProgramContentId}
        isAvailableToRetry={exam.isAvailableToRetry}
        isAvailableAnnounceScore={exam.isAvailableAnnounceScore}
        passingScore={exam.passingScore}
        timeLimitUnit={exam.timeLimitUnit}
        timeLimitAmount={exam.timeLimitAmount}
        questions={questions}
        point={exam.point}
        totalDuration={totalDuration}
        averageGainedPoints={averageGainedPoints}
        timeSpent={
          examBeganAt.current && examFinishedAt.current
            ? examFinishedAt.current.diff(examBeganAt.current) / 1000
            : specificExercise?.[0]?.startedAt && specificExercise?.[0]?.endedAt
            ? (specificExercise[0].endedAt.getTime() - specificExercise[0].startedAt.getTime()) / 1000
            : undefined
        }
        onReAnswer={() => {
          if (!isAnswerer) return
          setQuestions(
            exam.questions.map(question => ({
              ...question,
              questionOptions: question.questionOptions?.map(questionOption => ({
                ...questionOption,
                isSelected: false,
              })),
            })),
          )
          setStatus('intro')
        }}
        onReview={() => {
          onRefetchExercisePublic?.()
          setStatus('review')
        }}
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
        <StyledTitle>{title}</StyledTitle>
        <div>
          {status === 'answering' && exam.timeLimitUnit && exam.timeLimitAmount && (
            <CountDownTimeBlock
              renderIcon={() => <Icon as={AiOutlineClockCircle} className="mr-2" />}
              expiredAt={moment().add(exam.timeLimitAmount, exam.timeLimitUnit).toDate()}
              text={formatMessage(examMessages.ExamBlock.countdown)}
            />
          )}
        </div>
      </div>
      {examStatus}
    </StyledAdminCard>
  )
}

export default ExamBlock
