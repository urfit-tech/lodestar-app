import { gql } from '@apollo/client'

export type Highlight = {
  text: string
  cfiRange: string
  color: string
  programContentId: string
  memberId: string
  chapter: string
  isNew?: boolean
}

export type SaveEbookHighlightRequestDto = {
  epubCfi: string
  programContentId: string
  memberId: string
  highLightContent: string
  chapter: string
  color: string
}

export type GetEbookHighlightRequestDto = {
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

export const createHighlight = async (
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

export const getEbookHighlights = async (
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

    if (response.data.program_content_ebook_highlight.length > 0) {
      console.log(response.data.program_content_ebook_highlight)
      const highlights: Highlight[] = response.data.program_content_ebook_highlight.map(
        (item: {
          highlight_content: string
          epub_cfi: string
          color: string
          program_content_id: string
          member_id: string
          chapter: string
          __typename: string
        }) => ({
          text: item.highlight_content,
          cfiRange: item.epub_cfi,
          color: item.color,
          programContentId: item.program_content_id,
          memberId: item.member_id,
          chapter: item.chapter,
        }),
      )

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
