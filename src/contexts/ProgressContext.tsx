import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten, sum } from 'ramda'
import React, { createContext, useMemo } from 'react'
import hasura from '../hasura'

type ProgressProps = {
  loadingProgress?: boolean
  programContentProgress?: {
    programContentBodyType: string | null
    programContentId: string
    programContentSectionId: string
    progress: number
    lastProgress: number
    updatedAt: Date | undefined
  }[]
  refetchProgress?: () => void
  insertProgress?: (
    programId: string,
    programContentId: string,
    options: {
      progress: number
      lastProgress: number
    },
  ) => Promise<any>
}

export const ProgressContext = createContext<ProgressProps>({})

export const ProgressProvider: React.FC<{
  programId: string
  memberId: string
}> = ({ programId, memberId, children }) => {
  const { loadingProgress, programContentProgress, refetchProgress } = useProgramContentProgress(programId, memberId)
  const insertProgress = useInsertProgress(memberId)

  return (
    <ProgressContext.Provider
      value={{
        loadingProgress,
        programContentProgress,
        refetchProgress,
        insertProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export const useInsertProgress = (memberId: string) => {
  const { authToken } = useAuth()
  const insertProgress: ProgressProps['insertProgress'] = async (
    programId,
    programContentId,
    { progress, lastProgress },
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/programs/${programId}/content/${programContentId}/track-process`,
        {
          progress,
          lastProgress,
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      return response.data
    } catch (error) {
      console.error('Failed to insert progress:', error)
      throw error
    }
  }

  return insertProgress
}

export const useProgramContentProgress = (programId: string, memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramContentProgress,
    hasura.GetProgramContentProgressVariables
  >(
    gql`
      query GetProgramContentProgress($programId: uuid!, $memberId: String!) {
        program_content_body(
          where: { program_contents: { program_content_section: { program_id: { _eq: $programId } } } }
        ) {
          type
          program_contents(where: { published_at: { _is_null: false } }, order_by: { published_at: desc }) {
            id
            content_section_id
            program_content_progress(where: { member_id: { _eq: $memberId } }) {
              id
              progress
              last_progress
              updated_at
            }
            program_content_ebook_toc {
              id
              program_content_ebook_toc_progress_list(where: { member_id: { _eq: $memberId } }) {
                id
                latest_progress
                finished_at
              }
            }
            practices(where: { member_id: { _eq: $memberId }, is_deleted: { _eq: false } }) {
              id
              program_content_id
            }
            exercises(order_by: { created_at: desc }) {
              id
              program_content_id
              exercise_publics(where: { member_id: { _eq: $memberId } }) {
                exercise_id
                question_points
                question_id
                question_started_at
                gained_points
              }
              exam {
                id
                passing_score
              }
            }
          }
        }
      }
    `,
    { skip: !programId || !memberId, variables: { programId, memberId } },
  )

  const programContentProgress: ProgressProps['programContentProgress'] = useMemo(() => {
    return flatten(
      data?.program_content_body.map(contentBody =>
        contentBody.program_contents.map(content => {
          const extendProgramType = ['exercise', 'exam', 'ebook', 'practice']
          const passingScore = content.exercises?.[0]?.exam?.passing_score || 0
          const gainedPointsTotal = Math.max(
            ...content.exercises.map(exercise =>
              exercise.exercise_publics.reduce((acc, cur) => acc + Number(cur.gained_points), 0),
            ),
          )

          let progress =
            contentBody.type === 'exercise' || contentBody.type === 'exam'
              ? content.exercises.length <= 0
                ? 0
                : gainedPointsTotal >= passingScore
                ? 1
                : 0.5
              : contentBody.type === 'ebook'
              ? sum(
                  content.program_content_ebook_toc.map(toc =>
                    toc.program_content_ebook_toc_progress_list[0]?.finished_at ? 1 : 0,
                  ),
                ) / content.program_content_ebook_toc.length
              : contentBody.type === 'practice'
              ? content.practices.length > 0
                ? 1
                : 0
              : 0

          return {
            programContentBodyType: contentBody.type || null,
            programContentId: content.id,
            programContentSectionId: content.content_section_id,
            progress: extendProgramType.includes(contentBody.type || '')
              ? progress || 0
              : content.program_content_progress[0]?.progress || 0,
            lastProgress: extendProgramType.includes(contentBody.type || '')
              ? progress
              : content.program_content_progress[0]?.last_progress || 0,
            updatedAt: content.program_content_progress[0]?.updated_at || undefined,
          }
        }),
      ) || [],
    )
  }, [data])

  return {
    loadingProgress: loading,
    errorProgress: error,
    programContentProgress,
    refetchProgress: refetch,
  }
}
