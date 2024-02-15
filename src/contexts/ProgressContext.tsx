import { gql, useMutation, useQuery } from '@apollo/client'
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
    updatedAt: Date | undefined
    programContentEbookTocId?: string
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
            program_content_ebook {
              id
              program_content_ebook_tocs {
                id
                program_content_ebook_toc_progress_list(where: { member_id: { _eq: $memberId } }) {
                  id
                  latest_progress
                  finished_at
                }
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
        contentBody.program_contents.map(content =>
          contentBody.type === 'ebook'
            ? content.program_content_ebook?.program_content_ebook_tocs.map(toc => ({
                programContentEbookTocId: content.program_content_ebook?.program_content_ebook_tocs[0]?.id || undefined,
                programContentBodyType: contentBody.type || null,
                programContentId: content.id,
                programContentSectionId: content.content_section_id,
                progress: toc.program_content_ebook_toc_progress_list[0]?.finished_at ? 1 : 0,
                lastProgress: toc.program_content_ebook_toc_progress_list[0]?.latest_progress || 0,
                updatedAt: content.program_content_progress[0]?.updated_at || undefined,
              })) || []
            : {
                programContentBodyType: contentBody.type || null,
                programContentId: content.id,
                programContentSectionId: content.content_section_id,
                progress: content.program_content_progress[0]?.progress || 0,
                lastProgress: content.program_content_progress[0]?.last_progress || 0,
                updatedAt: content.program_content_progress[0]?.updated_at || undefined,
              },
        ),
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
