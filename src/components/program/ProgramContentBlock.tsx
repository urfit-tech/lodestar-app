import { useQuery } from '@apollo/react-hooks'
import { Skeleton, Tabs } from 'antd'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useApp } from '../../containers/common/AppContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { productMessages, programMessages } from '../../helpers/translation'
import { usePublicMember } from '../../hooks/member'
import { useProgramContent, useProgramContentMaterial } from '../../hooks/program'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import CreatorCard from '../common/CreatorCard'
import { BraftContent } from '../common/StyledBraftEditor'
import ExerciseBlock from '../exercise/ExerciseBlock'
import IssueThreadBlock from '../issue/IssueThreadBlock'
import PracticeDescriptionBlock from '../practice/PracticeDescriptionBlock'
import PracticeDisplayedCollection from '../practice/PracticeDisplayedCollection'
import ProgramContentMaterialBlock from './ProgramContentMaterialBlock'
import ProgramContentPlayer from './ProgramContentPlayer'

const StyledContentBlock = styled.div`
  padding: 1.25rem;
  background-color: white;
`
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

  const { loadingProgramContentMaterials, programContentMaterials } = useProgramContentMaterial(programContentId)
  const instructor = program.roles.filter(role => role.name === 'instructor')[0]
  const { loadingMember, member } = usePublicMember(instructor?.memberId || '')
  const { loadingLastExercise, lastExercise } = useLastExercise(programContentId, exerciseId)

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(program.contentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    if (!loadingProgramContent && programContentBodyType !== 'video' && insertProgress) {
      insertProgress(programContentId, {
        progress: 1,
        lastProgress: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProgramContent, programContentBodyType, programContentId])

  if (!programContent || !insertProgress || !refetchProgress || loadingProgramContentMaterials || loadingLastExercise) {
    return <Skeleton active />
  }

  return (
    <div id="program_content_block" className="pt-4 p-sm-4">
      {!programContent.programContentBody && formatMessage(productMessages.program.content.unpurchased)}

      {programContent.programContentBody?.type === 'video' && (
        <ProgramContentPlayer
          programContentId={programContent.id}
          programContentBody={programContent.programContentBody}
          nextProgramContent={nextProgramContent}
          lastProgress={
            programContentProgress.find(progress => progress.programContentId === programContentId)?.lastProgress || 0
          }
          onProgress={({ played }) => {
            const currentProgress = Math.ceil(played * 20) / 20 // every 5% as a tick
            insertProgress(programContentId, {
              progress: currentProgress > 1 ? 1 : currentProgress > initialProgress ? currentProgress : initialProgress,
              lastProgress: played,
            }).then(() => refetchProgress())
          }}
          onEventTrigger={data => {
            axios
              .post(
                `https://${apiHost}/tasks/player-event-logs/`,
                {
                  programContentId,
                  data,
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
          }}
          onEnded={() => {
            setTimeout(() => {
              insertProgress(programContentId, {
                progress: 1,
                lastProgress: 1,
              })
            }, 3000)
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

      {(program.isIssuesOpen ||
        (enabledModules.practice && programContent.programContentBody?.type === 'practice') ||
        programContent.materials.length !== 0) && (
        <StyledContentBlock className="mb-3">
          <Tabs
            defaultActiveKey={
              enabledModules.practice && programContent.programContentBody?.type === 'practice'
                ? 'practice'
                : programContentMaterials?.length !== 0
                ? 'material'
                : 'issue'
            }
          >
            {program.isIssuesOpen && (
              <Tabs.TabPane tab={formatMessage(programMessages.label.discussion)} key="issue" className="py-3">
                <IssueThreadBlock
                  programRoles={program.roles || []}
                  threadId={`/programs/${program.id}/contents/${programContentId}`}
                />
              </Tabs.TabPane>
            )}
            {enabledModules.practice && programContent.programContentBody?.type === 'practice' && (
              <Tabs.TabPane tab={formatMessage(programMessages.label.practiceUpload)} key="practice" className="p-4">
                <PracticeDisplayedCollection
                  isPrivate={programContent.metadata?.private || false}
                  programContentId={programContent.id}
                />
              </Tabs.TabPane>
            )}
            {programContent.materials.length !== 0 && (
              <Tabs.TabPane key="material" tab={formatMessage(programMessages.tab.downloadMaterials)} className="py-3">
                {<ProgramContentMaterialBlock programContentId={programContentId} />}
              </Tabs.TabPane>
            )}
          </Tabs>
        </StyledContentBlock>
      )}

      {programContent.programContentBody?.type !== 'practice' && (
        <StyledContentBlock>
          {loadingMember ? (
            <Skeleton active avatar />
          ) : member ? (
            <CreatorCard
              id={member.id}
              avatarUrl={member.pictureUrl}
              title={member.name || member.username}
              labels={[{ id: 'instructor', name: 'instructor' }]}
              jobTitle={member.title}
              description={member.abstract}
              withProgram
              withPodcast
              withAppointment
              withBlog
            />
          ) : null}
        </StyledContentBlock>
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
