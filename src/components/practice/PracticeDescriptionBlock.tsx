import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Menu, MenuButton, MenuItem, MenuList, Skeleton, Spinner, useToast } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { CommonLargeTitleMixin, CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { downloadFile, getFileDownloadableLink } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { usePractice } from '../../hooks/practice'
import { ProgramContentAttachmentProps } from '../../types/program'
import { BREAK_POINT } from '../common/Responsive'
import StarRating from '../common/StarRating'
import { BraftContent } from '../common/StyledBraftEditor'
import PracticeUploadModal from './PracticeUploadModal'

const messages = defineMessages({
  practice: { id: 'program.label.practice', defaultMessage: '作業練習' },
  estimateTime: { id: 'program.text.estimateTime', defaultMessage: '預估實作 {duration} 分鐘' },
  difficulty: { id: 'program.term.difficulty', defaultMessage: '難易度' },
  downloadMaterial: { id: 'program.ui.downloadMaterial', defaultMessage: '下載素材' },
  viewOwnPractice: { id: 'program.ui.viewOwnPractice', defaultMessage: '查看我的作業' },
})

const StyledBlock = styled.div`
  padding: 1.5rem;
  background-color: white;
`
const StyledInfo = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledTitle = styled.h2`
  ${CommonTitleMixin}
  line-height: 1;
`
const StyledPracticeTitle = styled.h3`
  ${CommonLargeTitleMixin}
  line-height: 1;
`
const StyledEvaluation = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
  }
`
const StyledPractice = styled.div`
  padding: 0 clamp(12px, 2vw, 32px);
`
const StyledEvaluationText = css`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  height: 22px;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`
const StyledEstimateTime = styled.div`
  ${StyledEvaluationText}
  margin-right: 12px;
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
const StyledButton = styled(Button)`
  && {
    width: 100%;
  }
`

const PracticeDescriptionBlock: React.VFC<{
  programContentId: string
  title: string
  description: string | null
  duration?: number
  score?: number
  isCoverRequired: boolean
  attachments?: ProgramContentAttachmentProps[]
}> = ({ programContentId, title, description, duration, score, isCoverRequired, attachments }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const toast = useToast()
  const { currentMemberId, authToken } = useAuth()
  const { loadingPractice, practice, refetchPractice } = usePractice({ memberId: currentMemberId, programContentId })
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  if (loadingPractice) {
    return <Skeleton />
  }

  const handleDownload = async (fileIndex: number) => {
    setIsDownloading(true)
    if (!attachments) return
    const file = attachments[fileIndex]
    const fileKey = `attachments/${file.id}`
    try {
      const fileLink = file.data?.url || (await getFileDownloadableLink(fileKey, authToken))
      const fileRequest = new Request(fileLink)
      const response = await fetch(fileRequest)
      if (response.url) {
        await downloadFile(file.data?.name || 'untitled', { url: response.url })
      }
    } catch (error) {
      toast({
        title: formatMessage(commonMessages.status.readingFail),
        status: 'error',
        duration: 1500,
        position: 'top',
      })
    }
    setIsDownloading(false)
  }

  return (
    <StyledBlock>
      <StyledInfo className="mb-3">
        <StyledTitle className="mb-2">{formatMessage(messages.practice)}</StyledTitle>
        <StyledEvaluation>
          <StyledEstimateTime>{formatMessage(messages.estimateTime, { duration: duration || 0 })}</StyledEstimateTime>
          <StyledDifficulty className="d-flex align-items-center">
            <div className="mr-2">{formatMessage(messages.difficulty)}</div>
            <StarRating score={score || 0} max={5} size="20px" />
          </StyledDifficulty>
        </StyledEvaluation>
      </StyledInfo>

      <StyledPractice className="mb-4">
        <StyledPracticeTitle className="mb-3">{title}</StyledPracticeTitle>
        {!BraftEditor.createEditorState(description).isEmpty() && <BraftContent>{description}</BraftContent>}
        {!!attachments?.length && (
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={isDownloading ? <Spinner size="sm" /> : <ChevronDownIcon />}
              className="mt-3"
            >
              {formatMessage(messages.downloadMaterial)}
            </MenuButton>
            <MenuList>
              {attachments?.map((attachment, index) => (
                <MenuItem key={attachment.id} onClick={() => handleDownload(index)}>
                  {attachment.data.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </StyledPractice>

      {practice ? (
        <StyledButton
          onClick={() => {
            history.push(`/practices/${practice.id}`)
          }}
          variant="outline"
        >
          {formatMessage(messages.viewOwnPractice)}
        </StyledButton>
      ) : (
        <PracticeUploadModal
          programContentId={programContentId}
          isCoverRequired={isCoverRequired}
          onRefetch={refetchPractice}
          onSubmit={({ practiceId }) => {
            window.location.assign(`/practices/${practiceId}`)
          }}
        />
      )}
    </StyledBlock>
  )
}

export default PracticeDescriptionBlock
