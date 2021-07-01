import { SkeletonText } from '@chakra-ui/react'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import { throttle } from 'lodash'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import { BraftContent } from '../../components/common/StyledBraftEditor'
import PracticeDescriptionBlock from '../../components/practice/PracticeDescriptionBlock'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import { useApp } from '../../containers/common/AppContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import { productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program'
import { StyledContentBlock } from './index.styled'
import ProgramContentCreatorBlock from './ProgramContentCreatorBlock'
import ProgramContentExerciseBlock from './ProgramContentExerciseBlock'
import ProgramContentTabs from './ProgramContentTabs'

const StyledTitle = styled.h3`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e8e8;
  font-size: 20px;
`

const ProgramContentBlock: React.VFC<{
  program: ProgramProps & {
    roles: ProgramRoleProps[]
    contentSections: (ProgramContentSectionProps & { contents: ProgramContentProps[] })[]
  }
  programContentId: string
}> = ({ program, programContentId }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { apiHost, authToken } = useAuth()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { loadingProgramContent, programContent } = useProgramContent(programContentId)

  const instructor = program.roles.filter(role => role.name === 'instructor')[0]

  const [lastProgress, setLastProgress] = useState<number | null>(null)

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(program.contentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    const progress = programContentProgress.find(
      progress => progress.programContentId === programContentId,
    )?.lastProgress

    setLastProgress(progress || 0)
  }, [programContentId, programContentProgress])

  useEffect(() => {
    if (!loadingProgramContent && programContentBodyType !== 'video' && insertProgress) {
      insertProgress(programContentId, {
        progress: 1,
        lastProgress: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProgramContent, programContentBodyType, programContentId])

  if (loadingProgramContent || !programContent || !insertProgress || !refetchProgress) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  const insertProgramProgress = throttle((progress: number) => {
    const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick

    insertProgress(programContentId, {
      progress: currentProgress > 1 ? 1 : currentProgress > initialProgress ? currentProgress : initialProgress,
      lastProgress: progress,
    })
  }, 5000)

  return (
    <div id="program_content_block" className="pt-4 p-sm-4">
      {!programContent.programContentBody && formatMessage(productMessages.program.content.unpurchased)}

      {programContent.programContentBody?.type === 'video' && (
        <ProgramContentPlayer
          key={programContent.id}
          programContentBody={programContent.programContentBody}
          nextProgramContent={nextProgramContent}
          lastProgress={lastProgress || 0}
          onVideoEvent={e => {
            if (e.type === 'ended') {
              insertProgramProgress(1)
              refetchProgress()
            }
            if (e.type === 'progress') {
              const video = e.target as HTMLVideoElement
              insertProgramProgress(e.videoState.endedAt / video.duration)
            } else {
              axios
                .post(
                  `//${apiHost}/tasks/player-event-logs/`,
                  {
                    programContentId,
                    data: e.videoState,
                  },
                  { headers: { authorization: `Bearer ${authToken}` } },
                )
                .then(({ data: { code, result } }) => {
                  if (code === 'SUCCESS') {
                    return
                  }
                  // return message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
                })
                .catch(() => {})
            }
          }}
        />
      )}

      {!includes(programContent.programContentBody?.type, ['practice', 'exercise']) && (
        <StyledContentBlock className="mb-3">
          <StyledTitle className="mb-4 text-center">{programContent.title}</StyledTitle>

          {programContent.programContentBody &&
            !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
              <BraftContent>{programContent.programContentBody.description}</BraftContent>
            )}
        </StyledContentBlock>
      )}

      {enabledModules.practice && programContent.programContentBody?.type === 'practice' && (
        <div className="mb-4">
          <PracticeDescriptionBlock
            programContentId={programContentId}
            isCoverRequired={!!programContent.metadata?.isCoverRequired}
            title={programContent.title}
            description={programContent.programContentBody?.description || ''}
            duration={programContent.duration || 0}
            score={programContent.metadata?.difficulty || 0}
            attachments={programContent.attachments || []}
          />
        </div>
      )}

      {enabledModules.exercise && programContent.programContentBody?.type === 'exercise' && (
        <ProgramContentExerciseBlock programContent={programContent} nextProgramContentId={nextProgramContent?.id} />
      )}

      <ProgramContentTabs program={program} programContent={programContent} />

      {programContent.programContentBody?.type !== 'practice' && (
        <ProgramContentCreatorBlock memberId={instructor.memberId} />
      )}
    </div>
  )
}

export default ProgramContentBlock
