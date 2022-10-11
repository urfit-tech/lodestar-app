import { Button, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { CommonLargeTextMixin, CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { durationFullFormatter } from 'lodestar-app-element/src/helpers'
import moment from 'moment'
import { sum } from 'ramda'
import React, { memo, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { ReactComponent as CheckCircleIcon } from '../../images/checked-circle.svg'
import { ReactComponent as ErrorCircleIcon } from '../../images/error-circle.svg'
import { ReactComponent as TickIcon } from '../../images/tick.svg'
import { Exam, ExercisePublic, Question } from '../../types/exam'
import examMessages from './translation'

const StyledTableContainer = styled.div`
  margin-bottom: 24px;
  padding: 10px 10px 0;
  border-radius: 4px;
  border: solid 1px #ececec;
`
const StyledTh = styled(Th)`
  && {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }
`
const StyledTbody = styled(Tbody)`
  && {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }
`
const StyledQuestionCount = styled.span`
  ${CommonTextMixin}
`
const StyledQuestion = styled.div`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledDetail = styled.div`
  padding: 24px;
  border-radius: 4px;
  background-color: var(--gray-lighter);
`
const StyledDetailTitle = styled.h4`
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledDetailContent = styled.div`
  ${CommonLargeTextMixin}
`
const StyledQuestionsContainer = styled.div`
  margin-bottom: 1.5rem;
  &&.layout_grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`
const StyledBraftContentContainer = styled.div<{ font?: string }>`
  && {
    font-family: ${props => (props.font === 'zhuyin' ? 'BpmfGenSenRounded' : 'inherit')};
    font-size: ${props => (props.font === 'zhuyin' ? '32px' : '16px')};
  }
`

const ExamQuestionBlock: React.VFC<
  Pick<Exam, 'isAvailableToGoBack'> & {
    questions: Question[]
    showDetail: boolean
    exercisePublic: Pick<
      ExercisePublic,
      | 'exerciseId'
      | 'programContentId'
      | 'startedAt'
      | 'endedAt'
      | 'questionId'
      | 'questionPoints'
      | 'gainedPoints'
      | 'isCorrect'
      | 'questionStartedAt'
      | 'questionEndedAt'
      | 'duration'
    >[]
    specificExercise: ExercisePublic[]
    exerciseAmount: number
    onFinish?: (isFinal: boolean) => void
    onNextStep?: () => void
    onChoiceSelect?: (questionId: string, choiceId: string) => void
    onQuestionFinish?: (questionId: string, endedAt: Date) => void
  }
> = ({
  isAvailableToGoBack,
  questions,
  showDetail,
  exercisePublic,
  specificExercise,
  exerciseAmount,
  onChoiceSelect,
  onQuestionFinish,
  onNextStep,
  onFinish,
}) => {
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const activeQuestion = questions[index]

  const detailTable: {
    head: {
      columns: {
        label: string
        hidden?: boolean
      }[]
    }
    body: {
      rows: {
        columns: string[]
        hidden?: boolean
      }[]
    }
  } = {
    head: {
      columns: [
        { label: formatMessage(examMessages['*'].item) },
        { label: formatMessage(examMessages['*'].personalPerformance) },
        { label: formatMessage(examMessages['*'].overallAverage) },
      ],
    },
    body: {
      rows: [
        {
          columns: [
            formatMessage(examMessages.ExamQuestionBlock.spendTime),
            specificExercise.find((v: ExercisePublic) => v.questionId === activeQuestion.id)?.choiceIds.length === 0
              ? formatMessage(examMessages.ExamQuestionBlock.unanswered)
              : specificExercise.find((v: ExercisePublic) => v.questionId === activeQuestion.id)?.questionEndedAt &&
                specificExercise.find((v: ExercisePublic) => v.questionId === activeQuestion.id)?.questionStartedAt
              ? durationFullFormatter(
                  ((specificExercise
                    .find((v: ExercisePublic) => v.questionId === activeQuestion.id)
                    ?.questionEndedAt?.getTime() || 0) -
                    (specificExercise
                      .find((v: ExercisePublic) => v.questionId === activeQuestion.id)
                      ?.questionStartedAt?.getTime() || 0)) /
                    1000,
                )
              : formatMessage(examMessages.ExamQuestionBlock.unansweredTime),
            durationFullFormatter(
              sum(exercisePublic.filter(v => v.questionId === activeQuestion.id).map(v => v.duration) || 0) /
                exercisePublic.filter(v => v.questionId === activeQuestion.id).length,
            ),
          ],
        },
        {
          columns: [
            formatMessage(examMessages.ExamQuestionBlock.averageCorrectRate),
            '',
            `${(
              (exercisePublic.filter(v => v.questionId === activeQuestion.id).filter(w => w.isCorrect).length /
                exerciseAmount) *
              100
            ).toFixed(2)}%`,
          ],
        },
      ],
    },
  }

  if (!activeQuestion) {
    return null
  }

  return (
    <>
      <StyledQuestionCount>
        {index + 1}/{questions.length}
      </StyledQuestionCount>

      <StyledQuestion className="mb-4">
        <StyledBraftContentContainer font={activeQuestion.font}>
          <BraftContent>{activeQuestion.subject}</BraftContent>
        </StyledBraftContentContainer>
      </StyledQuestion>

      <StyledQuestionsContainer className={activeQuestion.layout === 'grid' ? 'layout_grid' : ''}>
        {activeQuestion.questionOptions?.map((choice, i, choices) => (
          <ExamQuestionButton
            key={choice.id}
            showDetail={showDetail}
            selectedCount={choices.filter(choice => choice.isSelected).length}
            isCorrect={!!choice.isAnswer}
            isSelected={!!choice.isSelected}
            onClick={() => onChoiceSelect?.(activeQuestion.id, choice.id)}
          >
            <StyledBraftContentContainer font={activeQuestion.font}>
              <BraftContent>{choice.value}</BraftContent>
            </StyledBraftContentContainer>
          </ExamQuestionButton>
        ))}
      </StyledQuestionsContainer>

      {showDetail && (
        <StyledDetail className="mb-4">
          {activeQuestion.questionOptions?.every(choice => choice.isAnswer === choice.isSelected) ? (
            <span>
              <Icon className="mr-2" as={CheckCircleIcon} color="var(--success)" />
              <StyledDetailTitle>{formatMessage(examMessages.ExamQuestionBlock.correctAnswer)}</StyledDetailTitle>
            </span>
          ) : (
            <span>
              <Icon className="mr-2" as={ErrorCircleIcon} color="var(--error)" />
              <StyledDetailTitle>{formatMessage(examMessages.ExamQuestionBlock.errorAnswer)}</StyledDetailTitle>
            </span>
          )}
          <StyledDetailContent className="ml-4">
            {!BraftEditor.createEditorState(activeQuestion.explanation).isEmpty() && (
              <StyledBraftContentContainer font={activeQuestion.font}>
                <BraftContent>{activeQuestion.explanation}</BraftContent>
              </StyledBraftContentContainer>
            )}
          </StyledDetailContent>
        </StyledDetail>
      )}
      {showDetail && detailTable.body.rows.some(body => !body.hidden) && (
        <StyledTableContainer>
          <Table>
            <Thead>
              <Tr>
                {detailTable.head.columns
                  .filter(column => !column.hidden)
                  .map(column => (
                    <StyledTh key={column.label}>{column.label}</StyledTh>
                  ))}
              </Tr>
            </Thead>
            <StyledTbody>
              {detailTable.body.rows
                .filter(row => !row.hidden)
                .map((row, rowIndex, rows) => (
                  <Tr key={row.columns.join('')}>
                    {row.columns
                      .filter((_column, columnIndex) => !detailTable.head.columns[columnIndex]?.hidden)
                      .map((column, index) => (
                        <Td
                          key={`td_${index}`}
                          style={{
                            ...(rowIndex + 1 === rows.length
                              ? {
                                  borderBottom: 'none',
                                }
                              : {}),
                          }}
                        >
                          {column}
                        </Td>
                      ))}
                  </Tr>
                ))}
            </StyledTbody>
          </Table>
        </StyledTableContainer>
      )}
      <div className="text-center">
        {isAvailableToGoBack && 0 < index && (
          <Button onClick={() => setIndex(prev => prev - 1)} variant="outline" className="mr-2">
            {formatMessage(examMessages.ExamQuestionBlock.prevQuestion)}
          </Button>
        )}

        {index < questions.length - 1 && (
          <Button
            variant="primary"
            disabled={showDetail ? false : activeQuestion.questionOptions?.every(v => !v.isSelected)}
            onClick={() => {
              const finishedAt = moment()
              !showDetail && onQuestionFinish?.(activeQuestion.id, finishedAt.toDate())
              !showDetail && onFinish?.(false)
              setIndex(prev => prev + 1)
            }}
          >
            {formatMessage(examMessages.ExamQuestionBlock.nextQuestion)}
          </Button>
        )}

        {index === questions.length - 1 && (
          <Button
            variant="primary"
            disabled={showDetail ? false : activeQuestion.questionOptions?.every(v => !v.isSelected)}
            onClick={() => (showDetail ? onNextStep?.() : onFinish?.(true))}
          >
            {showDetail
              ? formatMessage(examMessages.ExamQuestionBlock.showResult)
              : formatMessage(examMessages.ExamQuestionBlock.submit)}
          </Button>
        )}
      </div>
    </>
  )
}

const StyledButton = styled(Button)<{ $isActive: boolean; $isCorrect: boolean; $isError: boolean }>`
  &&& {
    width: 100%;
    height: unset;
    padding-top: 8px;
    padding-bottom: 8px;
    background: white;
    border: ${props => props.$isActive && `1px solid var(--gray-darker)`};

    .chakra-button__icon {
      display: inline-flex;
    }

    ${props =>
      props.$isCorrect &&
      css`
        border: 1px solid var(--success);
        .correct {
          color: var(--success);
        }
      `}

    ${props =>
      props.$isError &&
      css`
        border: 1px solid var(--error);
        .correct {
          color: var(--error);
        }
      `}
  }
`

const ExamQuestionButton: React.FC<{
  showDetail: boolean
  isSelected: boolean
  isCorrect: boolean
  selectedCount: number
  onClick: () => void
}> = memo(
  ({ showDetail, isSelected, isCorrect, onClick, children }) => {
    const { formatMessage } = useIntl()
    if (showDetail) {
      return (
        <StyledButton
          variant="outline"
          className="d-flex justify-content-between mb-3"
          $isActive={isSelected}
          $isCorrect={isCorrect && isCorrect === isSelected}
          $isError={isCorrect && isCorrect !== isSelected}
        >
          <span>{children}</span>
          <span className="correct">{isCorrect && formatMessage(examMessages.ExamQuestionBlock.correct)}</span>
        </StyledButton>
      )
    }

    return (
      <StyledButton
        variant="outline"
        className="justify-content-between mb-3"
        onClick={onClick}
        $isActive={isSelected}
        rightIcon={isSelected && <Icon as={TickIcon} />}
      >
        {children}
      </StyledButton>
    )
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected && prevProps.selectedCount === nextProps.selectedCount,
)
export default ExamQuestionBlock
