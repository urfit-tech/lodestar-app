import { Button, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { ReactComponent as TickIcon } from '../../images/tick.svg'
import { CommonTextMixin } from '../common'

const messages = defineMessages({
  prevQuestion: { id: 'program.ui.prevQuestion', defaultMessage: '上一題' },
  nextQuestion: { id: 'program.ui.nextQuestion', defaultMessage: '下一題' },
  submit: { id: 'program.ui.submit', defaultMessage: '送出' },
  showResult: { id: 'program.ui.showResult', defaultMessage: '查看分數' },
})

const StyledQuestionCount = styled.span`
  ${CommonTextMixin}
`

const StyledQuestionBlock = styled.div<{ isVisible: boolean }>`
  display: ${props => (props.isVisible ? 'block' : 'none')};
`
const StyledQuestion = styled.div`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledButton = styled(Button)<{ isActive: boolean }>`
  &&& {
    background: white;
    border: ${props => props.isActive && `1px solid var(--gray-darker)`};
    width: 100%;
  }
`
const StyledDetail = styled.div`
  padding: 24px;
  border-radius: 4px;
  background-color: var(--gray-lighter);
`

const ExerciseQuestionBlock: React.FC<{
  allowReAnswer: boolean
  showDetail: boolean
  questions: {
    options: {
      answer: string
      isAnswer: boolean
      isSelected: boolean
    }[]
    isMultipleChoice: boolean
    question: string
    detail: string
  }[]
  onSetAnswer: React.Dispatch<
    React.SetStateAction<
      {
        options: {
          answer: string
          isAnswer: boolean
          isSelected: boolean
        }[]
        isMultipleChoice: boolean
        question: string
        detail: string
      }[]
    >
  >
  onSetStatusResult: () => void
}> = ({ allowReAnswer, questions, showDetail, onSetAnswer, onSetStatusResult }) => {
  const [no, setNo] = useState(1)
  const { formatMessage } = useIntl()

  return (
    <>
      {questions.map((v, i) => (
        <StyledQuestionBlock isVisible={no === i + 1}>
          <StyledQuestionCount>
            {no}/{questions.length}
          </StyledQuestionCount>

          <StyledQuestion className="mb-4">{v.question}</StyledQuestion>

          <div className="mb-4">
            {v.options.map((w, j) => (
              <StyledButton
                isActive={w.isSelected}
                rightIcon={w.isSelected ? <Icon as={TickIcon} /> : undefined}
                onClick={() => {
                  const newAnswers = questions.map((question, index) =>
                    index === i
                      ? {
                          ...question,
                          options: question.options
                            .map(option =>
                              question.isMultipleChoice
                                ? option
                                : {
                                    ...option,
                                    isSelected: false,
                                  },
                            )
                            .map((option, index) =>
                              index === j
                                ? {
                                    ...option,
                                    isSelected: !option.isSelected,
                                  }
                                : option,
                            ),
                        }
                      : question,
                  )

                  onSetAnswer(newAnswers)
                }}
                variant="outline"
                className="d-flex justify-content-between mb-3"
              >
                {w.answer}
              </StyledButton>
            ))}
          </div>

          {showDetail && (
            <StyledDetail className="mb-4">
              {v.options.filter(w => w.isAnswer !== w.isSelected).length ? 'true' : 'false'}
              {v.detail}
            </StyledDetail>
          )}

          <div className="text-center">
            {allowReAnswer && 1 < no && (
              <Button onClick={() => setNo(prev => prev - 1)} variant="outline" className="mr-2">
                {formatMessage(messages.prevQuestion)}
              </Button>
            )}
            {no < questions.length && (
              <Button
                onClick={() => setNo(prev => prev + 1)}
                disabled={!v.options.filter(w => w.isSelected).length && !showDetail}
                variant="primary"
              >
                {formatMessage(messages.nextQuestion)}
              </Button>
            )}
            {no === questions.length && (
              <Button
                onClick={() => onSetStatusResult()}
                variant="primary"
                disabled={!v.options.filter(w => w.isSelected).length}
              >
                {showDetail ? formatMessage(messages.showResult) : formatMessage(messages.submit)}
              </Button>
            )}
          </div>
        </StyledQuestionBlock>
      ))}
    </>
  )
}

export default ExerciseQuestionBlock
