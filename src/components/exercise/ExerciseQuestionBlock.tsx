import { Button, Icon } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { CommonLargeTextMixin, CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React, { memo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { ReactComponent as CheckCircleIcon } from '../../images/checked-circle.svg'
import { ReactComponent as ErrorCircleIcon } from '../../images/error-circle.svg'
import { ReactComponent as TickIcon } from '../../images/tick.svg'
import { ExerciseProps } from '../../types/program'

const messages = defineMessages({
  prevQuestion: { id: 'program.ui.prevQuestion', defaultMessage: '上一題' },
  nextQuestion: { id: 'program.ui.nextQuestion', defaultMessage: '下一題' },
  submit: { id: 'program.ui.submit', defaultMessage: '送出' },
  showResult: { id: 'program.ui.showResult', defaultMessage: '查看分數' },
  correctAnswer: { id: 'program.status.correctAnswer', defaultMessage: '答案正確' },
  errorAnswer: { id: 'program.status.errorAnswer', defaultMessage: '答案錯誤' },
  correct: { id: 'program.status.correct', defaultMessage: '正解' },
})

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

const ExerciseQuestionBlock: React.VFC<
  ExerciseProps & {
    showDetail: boolean
    onFinish?: () => void
    onNextStep?: () => void
    onChoiceSelect?: (questionId: string, choiceId: string) => void
  }
> = ({ questions, showDetail, isAvailableToGoBack, onChoiceSelect, onNextStep, onFinish }) => {
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const activeQuestion = questions[index]

  if (!activeQuestion) {
    return null
  }

  return (
    <>
      <StyledQuestionCount>
        {index + 1}/{questions.length}
      </StyledQuestionCount>

      <StyledQuestion className="mb-4">
        <BraftContent>{activeQuestion.description}</BraftContent>
      </StyledQuestion>

      <div className="mb-4">
        {activeQuestion.choices.map((choice, i, choices) => (
          <ExerciseQuestionButton
            key={choice.id}
            showDetail={showDetail}
            selectedCount={choices.filter(choice => choice.isSelected).length}
            isCorrect={choice.isCorrect}
            isSelected={!!choice.isSelected}
            onClick={() => onChoiceSelect?.(activeQuestion.id, choice.id)}
          >
            <BraftContent>{choice.description}</BraftContent>
          </ExerciseQuestionButton>
        ))}
      </div>

      {showDetail && (
        <StyledDetail className="mb-4">
          {activeQuestion.choices.every(choice => choice.isCorrect === choice.isSelected) ? (
            <span>
              <Icon className="mr-2" as={CheckCircleIcon} color="var(--success)" />
              <StyledDetailTitle>{formatMessage(messages.correctAnswer)}</StyledDetailTitle>
            </span>
          ) : (
            <span>
              <Icon className="mr-2" as={ErrorCircleIcon} color="var(--error)" />
              <StyledDetailTitle>{formatMessage(messages.errorAnswer)}</StyledDetailTitle>
            </span>
          )}
          <StyledDetailContent className="ml-4">
            {!BraftEditor.createEditorState(activeQuestion.answerDescription).isEmpty() && (
              <BraftContent>{activeQuestion.answerDescription}</BraftContent>
            )}
          </StyledDetailContent>
        </StyledDetail>
      )}

      <div className="text-center">
        {isAvailableToGoBack && 0 < index && (
          <Button onClick={() => setIndex(prev => prev - 1)} variant="outline" className="mr-2">
            {formatMessage(messages.prevQuestion)}
          </Button>
        )}

        {index < questions.length - 1 && (
          <Button
            variant="primary"
            disabled={activeQuestion.choices.every(v => !v.isSelected)}
            onClick={() => setIndex(prev => prev + 1)}
          >
            {formatMessage(messages.nextQuestion)}
          </Button>
        )}

        {index === questions.length - 1 && (
          <Button
            variant="primary"
            disabled={activeQuestion.choices.every(v => !v.isSelected)}
            onClick={showDetail ? onNextStep : onFinish}
          >
            {showDetail ? formatMessage(messages.showResult) : formatMessage(messages.submit)}
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
          <span className="correct">{isCorrect && formatMessage(messages.correct)}</span>
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
