import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { flatten } from 'ramda'
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
  }[]
  refetchProgress?: () => void
  insertProgress?: (
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
  const [insertProgramContentProgress] = useMutation<
    hasura.INSERT_PROGRAM_CONTENT_PROGRESS,
    hasura.INSERT_PROGRAM_CONTENT_PROGRESSVariables
  >(gql`
    mutation INSERT_PROGRAM_CONTENT_PROGRESS(
      $memberId: String!
      $programContentId: uuid!
      $progress: numeric!
      $lastProgress: numeric!
    ) {
      insert_program_content_progress(
        objects: {
          member_id: $memberId
          program_content_id: $programContentId
          progress: $progress
          last_progress: $lastProgress
        }
        on_conflict: {
          constraint: program_content_progress_member_id_program_content_id_key
          update_columns: [progress, last_progress]
        }
      ) {
        affected_rows
      }
    }
  `)

  const insertProgress: ProgressProps['insertProgress'] = (programContentId, { progress, lastProgress }) =>
    insertProgramContentProgress({
      variables: {
        memberId,
        programContentId,
        progress,
        lastProgress,
      },
    })

  return insertProgress
}

export const useProgramContentProgress = (programId: string, memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_CONTENT_PROGRESS,
    hasura.GET_PROGRAM_CONTENT_PROGRESSVariables
  >(
    gql`
      query GET_PROGRAM_CONTENT_PROGRESS($programId: uuid!, $memberId: String!) {
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
            }
          }
        }
      }
    `,
    { variables: { programId, memberId } },
  )

  const programContentProgress: ProgressProps['programContentProgress'] = useMemo(
    () =>
      loading || error || !data
        ? undefined
        : flatten(
            data.program_content_body.map(contentBody =>
              contentBody.program_contents.map(content => {
                return {
                  programContentBodyType: contentBody.type,
                  programContentId: content.id,
                  programContentSectionId: content.content_section_id,
                  progress: content.program_content_progress[0]?.progress || 0,
                  lastProgress: content.program_content_progress[0]?.last_progress || 0,
                }
              }),
            ),
          ),
    [data, error, loading],
  )

  return {
    loadingProgress: loading,
    errorProgress: error,
    programContentProgress,
    refetchProgress: refetch,
  }
}
