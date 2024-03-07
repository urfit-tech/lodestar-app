import { gql, useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'

type Highlight = {
  text: string
  cfiRange: string
  color: string
  programContentId: string
  memberId: string
  chapter: string
  isNew?: boolean
}

type SaveEbookHighlightRequestDto = {
  epubCfi: string
  programContentId: string
  memberId: string
  highLightContent: string
  chapter: string
  color: string
}

type GetEbookHighlightRequestDto = {
  programContentId: string
  memberId: string
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

const GET_EBOOK_HIGHLIGHT_QUERY = gql`
  query GetProgramContentEbookHighlight($programContentId: uuid!, $memberId: String!) {
    program_content_ebook_highlight(
      where: { program_content_id: { _eq: $programContentId }, member_id: { _eq: $memberId } }
    ) {
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
`

const create = async (
  dto: SaveEbookHighlightRequestDto,
  dataSource: any,
): Promise<{ error: Error | null; result: boolean }> => {
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

const get = async (
  dto: GetEbookHighlightRequestDto,
  dataSource: any,
): Promise<{ error: Error | null; result: boolean; data?: Highlight[] }> => {
  try {
    const response = await dataSource.query({
      query: GET_EBOOK_HIGHLIGHT_QUERY,
      variables: {
        programContentId: dto.programContentId,
        memberId: dto.memberId,
      },
    })

    console.log(response.data)

    if (response.data.program_content_ebook_highlight.length > 0) {
      const highlights: Highlight[] = response.data.program_content_ebook_highlight.map(item => ({
        text: item.highlight_content,
        cfiRange: item.epub_cfi,
        color: item.color,
        programContentId: item.program_content_id,
        memberId: item.member_id,
        chapter: item.chapter,
      }))

      console.log(highlights)
      return { error: null, result: true, data: highlights }
    } else {
      return { error: new Error('No ebook highlights found'), result: false }
    }
  } catch (error) {
    // Check if the error is an instance of Error, if not convert it to an Error object
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    return { error: errorInstance, result: false }
  }
}

export const useEbookHighlight = () => {
  const [error, setError] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const apolloClient = useApolloClient()

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
        const highlightData: SaveEbookHighlightRequestDto = {
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
          setHighlights(prevHighlights => [
            ...prevHighlights,
            {
              text: highlightContent,
              cfiRange,
              color,
              programContentId,
              memberId,
              chapter,
              isNew: true,
            },
          ])
          const selection = contents.window.getSelection()
          selection?.removeAllRanges()
        }
      }
    },
    [apolloClient],
  )

  const getHighLightData = useCallback(
    async (dto: GetEbookHighlightRequestDto) => {
      const { error, result, data } = await get(dto, apolloClient)

      console.log({ error, result, data })
      if (result && data) {
        setHighlights(data.map(item => ({ ...item, isNew: true })))
      } else if (error) {
        setError(error.message)
      }
    },
    [apolloClient],
  )

  const markHighlightAsMarked = useCallback((index: number) => {
    setHighlights(prevHighlights =>
      prevHighlights.map((highlight, idx) => (idx === index ? { ...highlight, isNew: false } : highlight)),
    )
  }, [])

  return {
    error,
    highlights,
    saveHighlight,
    getHighLightData,
    markHighlightAsMarked,
  }
}
