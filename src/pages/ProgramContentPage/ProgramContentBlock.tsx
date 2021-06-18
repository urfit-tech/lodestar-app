import { useQuery } from '@apollo/react-hooks'
import { Skeleton } from 'antd'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import { throttle } from 'lodash'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../../components/auth/AuthContext'
import { BraftContent } from '../../components/common/StyledBraftEditor'
import ExerciseBlock from '../../components/exercise/ExerciseBlock'
import PracticeDescriptionBlock from '../../components/practice/PracticeDescriptionBlock'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import { useApp } from '../../containers/common/AppContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program'
import { StyledContentBlock } from './index.styled'
import ProgramContentCreatorBlock from './ProgramContentCreatorBlock'
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
  const [exerciseId] = useQueryParam('exerciseId', StringParam)

  const instructor = program.roles.filter(role => role.name === 'instructor')[0]

  const { loadingLastExercise, lastExercise } = useLastExercise(programContentId, exerciseId)
  const [lastProgress, setLastProgress] = useState<number | null>(null)

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(program.contentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    const progress =
      programContentProgress.find(progress => progress.programContentId === programContentId)?.lastProgress || null
    if (lastProgress === null && progress !== undefined) {
      setLastProgress(progress)
    }
  }, [programContentProgress])

  useEffect(() => {
    if (!loadingProgramContent && programContentBodyType !== 'video' && insertProgress) {
      insertProgress(programContentId, {
        progress: 1,
        lastProgress: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProgramContent, programContentBodyType, programContentId])

  if (!programContent || !insertProgress || !refetchProgress || loadingLastExercise) {
    return <Skeleton active />
  }

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
              refetchProgress()
            }
            if (e.type === 'progress') {
              const video = e.target as HTMLVideoElement
              const currentProgress = Math.ceil((e.videoState.endedAt / video.duration) * 20) / 20 // every 5% as a tick
              throttle(() => {
                insertProgress(programContentId, {
                  progress:
                    currentProgress > 1 ? 1 : currentProgress > initialProgress ? currentProgress : initialProgress,
                  lastProgress: currentProgress,
                }).then(() => refetchProgress())
              }, 5000)
            } else {
              axios
                .post(
                  `https://${apiHost}/tasks/player-event-logs/`,
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
      {programContent.programContentBody?.type === 'exercise' && programContent.programContentBody.data?.questions && (
        <div className="mb-4">
          <ExerciseBlock
            id={programContent.programContentBody.id}
            programContentId={programContentId}
            title={programContent.title}
            nextProgramContentId={nextProgramContent?.id}
            isTaken={!!lastExercise}
            questions={
              programContent.programContentBody.data.questions
                .filter((question: any) => !!question.choices?.length)
                .map((question: any) => ({
                  id: question.id,
                  description: question.description || '',
                  answerDescription: question.answerDescription || '',
                  points: question.points || 0,
                  isMultipleAnswers: !!question.isMultipleAnswers,
                  gainedPoints: lastExercise?.answer?.find((v: any) => v.questionId === question.id)?.gainedPoints || 0,
                  choices:
                    question.choices?.map((choice: any) => ({
                      id: choice.id,
                      description: choice.description || '',
                      isCorrect: !!choice.isCorrect,
                      isSelected: !!lastExercise?.answer?.some(
                        (v: any) =>
                          v.questionId === question.id &&
                          v.choiceIds.some((choiceId: string) => choiceId === choice.id),
                      ),
                    })) || [],
                })) || []
            }
            isAvailableToGoBack={!!programContent.metadata?.isAvailableToGoBack}
            isAvailableToRetry={!!programContent.metadata?.isAvailableToRetry}
            passingScore={programContent.metadata?.passingScore || 0}
          />
        </div>
      )}

      <ProgramContentTabs program={program} programContent={programContent} />

      {programContent.programContentBody?.type !== 'practice' && (
        <ProgramContentCreatorBlock memberId={instructor.memberId} />
      )}
    </div>
  )
}

const useLastExercise = (programContentId: string, exerciseId?: string | null) => {
  const condition: hasura.GET_LAST_EXERCISEVariables['condition'] = {
    id: exerciseId ? { _eq: exerciseId } : undefined,
    program_content_id: { _eq: programContentId },
  }

  const { loading, error, data, refetch } = useQuery<hasura.GET_LAST_EXERCISE, hasura.GET_LAST_EXERCISEVariables>(
    gql`
      query GET_LAST_EXERCISE($condition: exercise_bool_exp!) {
        exercise(where: $condition, order_by: [{ created_at: desc }], limit: 1) {
          id
          answer
        }
      }
    `,
    {
      variables: { condition },
      fetchPolicy: 'no-cache',
    },
  )

  const lastExercise = data?.exercise?.[0]
    ? {
        id: data.exercise[0].id,
        answer: data.exercise[0].answer,
      }
    : null

  return {
    loadingLastExercise: loading,
    errorLastExercise: error,
    lastExercise,
    refetchLastExercise: refetch,
  }
}

export default ProgramContentBlock
