import { gql, useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'

type EbookHighlightRequestDto = {
  epubCfi: string
  programContentId: string
  memberId: string
  highLightContent: string
  chapter: string
  color: string
}

type ITextSelection = {
  text: string
  cfiRange: string
  color: string
  programContentId: string
  memberId: string
  chapter: string
}

const INSERT_EBOOK_HIGHLIGHT_MUTATION = gql`
  mutation InsertProgramContentEbookHighlight(
    $chapter: String
    $color: String
    $epubCfi: String
    $highLightContent: String
    $memberId: String
    $programContentId: uuid!
  ) {
    insert_program_content_ebook_highlight(
      objects: {
        chapter: $chapter
        color: $color
        epub_cfi: $epubCfi
        highlight_content: $highLightContent
        member_id: $memberId
        program_content_id: $programContentId
      }
    ) {
      affected_rows
      returning {
        chapter
        color
        epub_cfi
        highlight_content
        member_id
        created_at
        id
        program_content_id
      }
    }
  }
`

async function create(
  dto: EbookHighlightRequestDto,
  dataSource: any,
): Promise<{ error: Error | null; result: boolean }> {
  try {
    const response = await dataSource.mutate({
      mutation: INSERT_EBOOK_HIGHLIGHT_MUTATION,
      variables: dto,
    })

    if (response.data.insert_program_content_ebook_highlight.affected_rows > 0) {
      return { error: null, result: true }
    } else {
      return { error: new Error('Failed to insert ebook highlight'), result: false }
    }
  } catch (error: any) {
    return { error, result: false }
  }
}

export const useEbookHighlight = () => {
  const [error, setError] = useState<string | null>(null)
  const [selections, setSelections] = useState<ITextSelection[]>([])
  const apolloClient = useApolloClient()

  const setRenderSelection = useCallback(
    (
      range: any,
      cfiRange: string,
      contents: any,
      color: string = 'rgba(255, 190, 30, 0.5)',
      programContentId: string,
      memberId: string,
      chapter: string,
    ) => {
      if (range) {
        const rangeText = range.toString()
        setSelections(list => [
          ...list,
          {
            text: rangeText,
            cfiRange,
            color,
            programContentId: programContentId,
            memberId: memberId,
            chapter,
          },
        ])
        const selection = contents.window.getSelection()
        selection?.removeAllRanges()
      }
    },
    [],
  )

  const saveHighlight = useCallback(
    async (
      range: Range,
      cfiRange: string,
      contents: any,
      color: string = 'rgba(255, 190, 30, 0.5)',
      programContentId: string,
      memberId: string,
      chapter: string,
    ) => {
      if (range) {
        const highlightContent = range.toString()
        const highlightData: EbookHighlightRequestDto = {
          epubCfi: cfiRange,
          programContentId,
          memberId,
          highLightContent: highlightContent,
          chapter,
          color,
        }

        const { error, result } = await create(highlightData, apolloClient)
        if (error) {
          setError(error.message)
        } else {
          setRenderSelection(range, cfiRange, contents, color, programContentId, memberId, chapter)
        }
      }
    },
    [apolloClient, setRenderSelection],
  )

  return {
    error,
    selections,
    setRenderSelection,
    saveHighlight,
  }
}
