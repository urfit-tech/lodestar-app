import BraftEditor from 'braft-editor'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'
import StarRating from '../common/StarRating'
import { BraftContent } from '../common/StyledBraftEditor'
import PracticeUploadModal from './PracticeUploadModal'

const messages = defineMessages({
  practice: { id: 'program.label.practice', defaultMessage: '作業練習' },
  estimateTime: { id: 'program.text.estimateTime', defaultMessage: '預估實作 {duration} 分鐘' },
  difficulty: { id: 'program.term.difficulty', defaultMessage: '難易度' },
})

const StyledBlock = styled.div`
  padding: 1.25rem;
  background-color: white;
`
const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledPracticeTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: var(--gray-darker);
`
const StyledEvaluation = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
  }
`
const StyledEvaluationText = css`
  margin-right: 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  height: 22px;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`
const StyledEstimateTime = styled.div`
  ${StyledEvaluationText}
  margin-bottom: 8px;

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0;
    border-right: 1px solid var(--gray);
    padding-right: 12px;
  }
`
const StyledDifficulty = styled.div`
  ${StyledEvaluationText}
`

const PracticeDescriptionBlock: React.FC<{
  title: string
  description: string | null
  duration?: number
  score?: number
}> = ({ title, description, duration, score }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledBlock>
      <StyledInfo className="mb-3">
        <StyledTitle className="mb-2">{formatMessage(messages.practice)}</StyledTitle>
        <StyledEvaluation>
          <StyledEstimateTime>{formatMessage(messages.estimateTime, { duration: duration || 30 })}</StyledEstimateTime>
          <StyledDifficulty className="d-flex align-items-center">
            <div className="mr-2">{formatMessage(messages.difficulty)}</div>
            <StarRating score={score || 0} boxSize="20px" />
          </StyledDifficulty>
        </StyledEvaluation>
      </StyledInfo>
      <StyledPracticeTitle>{title}</StyledPracticeTitle>
      {!BraftEditor.createEditorState(description).isEmpty() && <BraftContent>{description}</BraftContent>}
      <PracticeUploadModal />
    </StyledBlock>
  )
}

export default PracticeDescriptionBlock
