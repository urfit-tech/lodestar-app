import { Button, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { CommonLargeTextMixin, CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React, { memo, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { durationFullFormatter } from '../../helpers'
import { ReactComponent as CheckCircleIcon } from '../../images/checked-circle.svg'
import { ReactComponent as ErrorCircleIcon } from '../../images/error-circle.svg'
import { ReactComponent as TickIcon } from '../../images/tick.svg'
import { ExerciseProps } from '../../types/program'
import exerciseMessages from './translation'

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

const ExerciseQuestionBlock: React.VFC<
  ExerciseProps & {
    showDetail: boolean
    timeSpent?: number
    onFinish?: () => void
    onNextStep?: () => void
    onChoiceSelect?: (questionId: string, choiceId: string) => void
  }
> = ({ questions, showDetail, timeSpent, isAvailableToGoBack, onChoiceSelect, onNextStep, onFinish }) => {
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const activeQuestion = questions[index]

  if (!activeQuestion) {
    return null
  }

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
        { label: formatMessage(exerciseMessages['*'].item) },
        { label: formatMessage(exerciseMessages['*'].personalPerformance) },
        { label: formatMessage(exerciseMessages['*'].overallAverage), hidden: true },
      ],
    },
    body: {
      rows: [
        {
          columns: [
            formatMessage(exerciseMessages.ExerciseQuestionBlock.spendTime),
            `${durationFullFormatter((timeSpent || 0) / 1000 / questions.length)}`,
            '23.64 秒',
          ],
          hidden: !Boolean(timeSpent),
        },
        {
          columns: [formatMessage(exerciseMessages.ExerciseQuestionBlock.averageCorrectRate), '', `80%`],
          hidden: true,
        },
      ],
    },
  }

  return (
    <>
      <StyledQuestionCount>
        {index + 1}/{questions.length}
      </StyledQuestionCount>

      <StyledQuestion className="mb-4">
        <StyledBraftContentContainer font={activeQuestion.font}>
          <BraftContent>{activeQuestion.description}</BraftContent>
        </StyledBraftContentContainer>
      </StyledQuestion>

      <StyledQuestionsContainer className={activeQuestion.layout === 'grid' ? 'layout_grid' : ''}>
        {activeQuestion.choices.map((choice, i, choices) => (
          <ExerciseQuestionButton
            key={choice.id}
            showDetail={showDetail}
            selectedCount={choices.filter(choice => choice.isSelected).length}
            isCorrect={choice.isCorrect}
            isSelected={!!choice.isSelected}
            onClick={() => onChoiceSelect?.(activeQuestion.id, choice.id)}
          >
            <StyledBraftContentContainer font={activeQuestion.font}>
              <BraftContent>{choice.description}</BraftContent>
            </StyledBraftContentContainer>
          </ExerciseQuestionButton>
        ))}
      </StyledQuestionsContainer>

      {showDetail && (
        <StyledDetail className="mb-4">
          {activeQuestion.choices.every(choice => choice.isCorrect === choice.isSelected) ? (
            <span>
              <Icon className="mr-2" as={CheckCircleIcon} color="var(--success)" />
              <StyledDetailTitle>
                {formatMessage(exerciseMessages.ExerciseQuestionBlock.correctAnswer)}
              </StyledDetailTitle>
            </span>
          ) : (
            <span>
              <Icon className="mr-2" as={ErrorCircleIcon} color="var(--error)" />
              <StyledDetailTitle>{formatMessage(exerciseMessages.ExerciseQuestionBlock.errorAnswer)}</StyledDetailTitle>
            </span>
          )}
          <StyledDetailContent className="ml-4">
            {!BraftEditor.createEditorState(activeQuestion.answerDescription).isEmpty() && (
              <StyledBraftContentContainer font={activeQuestion.font}>
                <BraftContent>{activeQuestion.answerDescription}</BraftContent>
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
                      .filter((_column, columnIndex) => !detailTable.head.columns[columnIndex].hidden)
                      .map(column => (
                        <Td
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
            {formatMessage(exerciseMessages.ExerciseQuestionBlock.prevQuestion)}
          </Button>
        )}

        {index < questions.length - 1 && (
          <Button
            variant="primary"
            disabled={activeQuestion.choices.every(v => !v.isSelected)}
            onClick={() => setIndex(prev => prev + 1)}
          >
            {formatMessage(exerciseMessages.ExerciseQuestionBlock.nextQuestion)}
          </Button>
        )}

        {index === questions.length - 1 && (
          <Button
            variant="primary"
            disabled={activeQuestion.choices.every(v => !v.isSelected)}
            onClick={showDetail ? onNextStep : onFinish}
          >
            {showDetail
              ? formatMessage(exerciseMessages.ExerciseQuestionBlock.showResult)
              : formatMessage(exerciseMessages.ExerciseQuestionBlock.submit)}
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

const ExerciseQuestionButton: React.FC<{
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
          <span className="correct">{isCorrect && formatMessage(exerciseMessages.ExerciseQuestionBlock.correct)}</span>
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
export default ExerciseQuestionBlock
