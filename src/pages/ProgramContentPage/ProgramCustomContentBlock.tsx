import { LockIcon } from '@chakra-ui/icons'
import { SkeletonText } from '@chakra-ui/react'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten, includes } from 'ramda'
import React, { ReactElement, useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import { ProgressContext } from '../../contexts/ProgressContext'
import { productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ProgramContent, ProgramContentSection } from '../../types/program'
import { useHasProgramContentPermission } from './ProgramContentBlock'

const StyledUnPurchased = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 16px;
  font-weight: bold;
`

const StyledTitle = styled.h3`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e8e8;
  font-size: 20px;
`

const StyledContentBlock = styled.div`
  padding: 24px;
  background-color: #fff;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 40px;
  }
`

const StyledProgramContentBlock = styled.div`
  padding: 1.5rem;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 2rem 16rem;
  }
`

const ProgramCustomContentBlock: React.VFC<{
  programId: string
  programContentSections: (ProgramContentSection & { contents: ProgramContent[] })[]
  programContentId: string
  editors?: string[]
  children?: ReactElement
}> = ({ programId, programContentSections, programContentId, editors, children }) => {
  const { formatMessage } = useIntl()
  const { loading: loadingApp } = useApp()
  const { authToken, permissions, currentMemberId } = useAuth()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { loadingProgramContent, programContent } = useProgramContent(programContentId)
  const { hasProgramContentPermission } = useHasProgramContentPermission(programId, programContentId)
  const endedAtRef = useRef(0)

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress?.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(programContentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    if (
      loadingProgramContent ||
      programContentBodyType === 'video' ||
      !insertProgress ||
      !refetchProgress ||
      initialProgress === 1
    ) {
      return
    }

    insertProgress(programContentId, {
      progress: 1,
      lastProgress: 1,
    }).then(() => refetchProgress())
  }, [
    initialProgress,
    insertProgress,
    loadingProgramContent,
    programContentBodyType,
    programContentId,
    refetchProgress,
  ])

  if (loadingApp || loadingProgramContent || !programContent || !insertProgress || !refetchProgress) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }
  const insertProgramProgress = async (progress: number) => {
    try {
      const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
      return await insertProgress(programContentId, {
        progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
        lastProgress: progress,
      })
    } catch (error) {
      console.error(`Failed to insert program progress`, error)
    }
  }

  const insertPlayerEventLog = async (data: { playbackRate: number; startedAt: number; endedAt: number }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
        {
          programContentId,
          data,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
    } catch (error) {
      console.error(`Failed to insert player event log`, error)
    }
  }

  return (
    <StyledProgramContentBlock id="program_customize_content_block">
      {((programContent.contentType === 'video' &&
        (permissions.PROGRAM_ADMIN
          ? false
          : currentMemberId && permissions.PROGRAM_NORMAL
          ? !editors?.includes(currentMemberId)
          : !hasProgramContentPermission)) ||
        (programContent.contentType !== 'video' && !programContent.programContentBody)) && (
        <StyledUnPurchased className="p-2 text-center">
          <LockIcon className="mr-2" />
          {formatMessage(productMessages.program.content.unPurchased)}
        </StyledUnPurchased>
      )}

      {programContent.contentType === 'video' &&
        (hasProgramContentPermission ||
          permissions.PROGRAM_ADMIN ||
          (permissions.PROGRAM_NORMAL && currentMemberId && editors?.includes(currentMemberId))) && (
          <ProgramContentPlayer
            key={programContent.id}
            programContentId={programContentId}
            nextProgramContent={nextProgramContent}
            onVideoEvent={e => {
              if (Math.abs(e.videoState.endedAt - endedAtRef.current) >= 5) {
                insertPlayerEventLog({ ...e.videoState, startedAt: endedAtRef.current || e.videoState.startedAt })
                if (e.type === 'progress') {
                  insertProgramProgress(e.progress)
                }

                endedAtRef.current = e.videoState.endedAt
              }
              if (e.type === 'ended') {
                insertPlayerEventLog({ ...e.videoState, startedAt: endedAtRef.current || e.videoState.startedAt })
                insertProgramProgress(1)?.then(() => refetchProgress())
              }
            }}
          />
        )}

      {!includes(programContent.programContentBody?.type, ['practice', 'exercise']) && (
        <StyledContentBlock className="mb-3">
          <StyledTitle className="mb-4 text-left">{programContent.title}</StyledTitle>

          {programContent.programContentBody &&
            !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
              <BraftContent>{programContent.programContentBody.description}</BraftContent>
            )}
        </StyledContentBlock>
      )}
      {children}
    </StyledProgramContentBlock>
  )
}

export default ProgramCustomContentBlock
