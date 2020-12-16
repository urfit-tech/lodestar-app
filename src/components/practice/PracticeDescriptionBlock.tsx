import BraftEditor from 'braft-editor'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
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
const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
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

  @media (min-width: ${BREAK_POINT}) {
    flex-direction: row;
  }
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
      <div>
        <StyledTitle>{formatMessage(messages.practice)}</StyledTitle>
        <StyledEvaluation>
          <span className="">{formatMessage(messages.estimateTime, { duration: 30 })}</span>
          <span>{formatMessage(messages.difficulty)}</span>
          <StarRating score={score || 0} />
        </StyledEvaluation>
      </div>
      <StyledPracticeTitle>{title}</StyledPracticeTitle>
      {!BraftEditor.createEditorState(description).isEmpty() && <BraftContent>{description}</BraftContent>}
      <PracticeUploadModal />
    </StyledBlock>
  )
}

export default PracticeDescriptionBlock
