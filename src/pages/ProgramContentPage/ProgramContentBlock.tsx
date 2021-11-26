import { useQuery } from '@apollo/react-hooks'
import { LockIcon } from '@chakra-ui/icons'
import { SkeletonText } from '@chakra-ui/react'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import { throttle } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BraftContent } from '../../components/common/StyledBraftEditor'
import PracticeDescriptionBlock from '../../components/practice/PracticeDescriptionBlock'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ProgramContent, ProgramContentSection, ProgramRole } from '../../types/program'
import { StyledContentBlock } from './index.styled'
import ProgramContentCreatorBlock from './ProgramContentCreatorBlock'
import ProgramContentExerciseBlock from './ProgramContentExerciseBlock'
import ProgramContentTabs from './ProgramContentTabs'

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

const ProgramContentBlock: React.VFC<{
  programId: string
  programRoles: ProgramRole[]
  programContentSections: (ProgramContentSection & { contents: ProgramContent[] })[]
  programContentId: string
  issueEnabled?: boolean
}> = ({ programId, programRoles, programContentSections, programContentId, issueEnabled }) => {
  const { formatMessage } = useIntl()
  const { loading: loadingApp, enabledModules } = useApp()
  const { authToken } = useAuth()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { loadingProgramContent, programContent } = useProgramContent(programContentId)
  const hasProgramContentPermission = useHasProgramContentPermission(programContentId)

  const instructor = programRoles.filter(role => role.name === 'instructor')[0]

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
    })
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
  const insertProgramProgress = throttle(async (progress: number) => {
    const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
    return await insertProgress(programContentId, {
      progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
      lastProgress: progress,
    }).catch(() => {})
  }, 5000)

  return (
    <div id="program_content_block" className="pt-4 p-sm-4">
      {((programContent.contentType === 'video' && !hasProgramContentPermission) ||
        (programContent.contentType !== 'video' && !programContent.programContentBody)) && (
        <StyledUnPurchased className="p-2 text-center">
          <LockIcon className="mr-2" />
          {formatMessage(productMessages.program.content.unPurchased)}
        </StyledUnPurchased>
      )}

      {programContent.contentType === 'video' && hasProgramContentPermission && (
        <ProgramContentPlayer
          key={programContent.id}
          programContentId={programContentId}
          nextProgramContent={nextProgramContent}
          onVideoEvent={e => {
            if (e.type === 'progress') {
              insertProgramProgress(e.progress)
            } else {
              axios
                .post(
                  `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
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
                })
                .catch(() => {})
              if (e.type === 'ended') {
                insertProgramProgress(1)?.then(() => refetchProgress())
              }
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

      <ProgramContentTabs
        programId={programId}
        programRoles={programRoles}
        programContent={programContent}
        issueEnabled={issueEnabled}
      />

      {programContent.programContentBody?.type !== 'practice' && (
        <ProgramContentCreatorBlock memberId={instructor.memberId} />
      )}
    </div>
  )
}

const useHasProgramContentPermission: (id: string) => boolean = id => {
  const { currentMemberId } = useAuth()
  const { data } = useQuery<hasura.GET_PROGRAM_CONTENT_PERMISSION, hasura.GET_PROGRAM_CONTENT_PERMISSIONVariables>(
    gql`
      query GET_PROGRAM_CONTENT_PERMISSION($id: uuid!, $currentMemberId: String!) {
        program_content_enrollment(where: { program_content_id: { _eq: $id }, member_id: { _eq: $currentMemberId } }) {
          program_content_id
        }
      }
    `,
    {
      variables: {
        id,
        currentMemberId: currentMemberId || '',
      },
    },
  )

  return !!data?.program_content_enrollment?.length
}

export default ProgramContentBlock
