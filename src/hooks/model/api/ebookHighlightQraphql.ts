import { gql } from '@apollo/client'

export type Highlight = {
  id: any
  annotation: string | null
  text: string
  cfiRange: string
  color: string
  programContentId: string
  memberId: string
  chapter: string
}

export type SaveEbookHighlightRequestDto = {
  annotation: string | null
  epubCfi: string
  programContentId: string
  memberId: string
  highLightContent: string
  chapter: string
  color: string
}

export type DeleteEbookHighlightRequestDto = {
  id: string
}

export type GetEbookHighlightRequestDto = {
  programContentId: string
  memberId: string
}

export type UpdateEbookHighlightRequestDto = {
  id: string
  annotation?: string | null
  color?: string
}

const UPDATE_PRPGRAM_CONTENT_EBOOK_HIGHLIGHT = gql`
  mutation UpdateProgramContentEbookHighlight($id: uuid!, $annotation: String, $color: String) {
    update_program_content_ebook_highlight_by_pk(
      pk_columns: { id: $id }
      _set: { annotation: $annotation, color: $color }
    ) {
      id
      annotation
      chapter
      color
      epub_cfi
      highlight_content
      member_id
      created_at
      program_content_id
    }
  }
`

const INSERT_EBOOK_HIGHLIGHT_MUTATION = gql`
  mutation InsertProgramContentEbookHighlight(
    $annotation: String
    $chapter: String
    $color: String
    $epubCfi: String
    $highLightContent: String
    $memberId: String
    $programContentId: uuid!
  ) {
    insert_program_content_ebook_highlight(
      objects: {
        annotation: $annotation
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
        id
        annotation
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

const DELETE_EBOOK_HIGHLIGHT_MUTATION = gql`
  mutation DeleteProgramContentEbookHighlight($id: uuid!) {
    delete_program_content_ebook_highlight(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

const GET_EBOOK_HIGHLIGHT_QUERY = gql`
  query GetProgramContentEbookHighlight($programContentId: uuid!, $memberId: String!) {
    program_content_ebook_highlight(
      where: { program_content_id: { _eq: $programContentId }, member_id: { _eq: $memberId } }
    ) {
      annotation
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
): Promise<{ error: Error | null; result: boolean; data: Highlight | null }> => {
  try {
    const response = await dataSource.mutate({
      mutation: INSERT_EBOOK_HIGHLIGHT_MUTATION,
      variables: {
        annotation: dto.annotation,
        chapter: dto.chapter,
        color: dto.color,
        epubCfi: dto.epubCfi,
        highLightContent: dto.highLightContent,
        memberId: dto.memberId,
        programContentId: dto.programContentId,
      },
    })

    if (response.data.insert_program_content_ebook_highlight.affected_rows > 0) {
      return { error: null, result: true, data: response.data.insert_program_content_ebook_highlight.returning[0] }
    } else {
      return { error: new Error('Failed to insert ebook highlight'), result: false, data: null }
    }
  } catch (error: any) {
    console.error(error)
    return { error, result: false, data: null }
  }
}

export const deleteHighlight = async (
  dto: DeleteEbookHighlightRequestDto,
  dataSource: any,
): Promise<{ error: Error | null; result: boolean }> => {
  try {
    const response = await dataSource.mutate({
      mutation: DELETE_EBOOK_HIGHLIGHT_MUTATION,
      variables: {
        id: dto.id,
      },
    })
    return { error: null, result: response.data.delete_program_content_ebook_highlight.affected_rows > 0 }
  } catch (error: any) {
    console.error(error)
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
      const highlights: Highlight[] = response.data.program_content_ebook_highlight.map(
        (item: {
          annotation: string
          highlight_content: string
          epub_cfi: string
          color: string
          program_content_id: string
          member_id: string
          chapter: string
          id: string
          __typename: string
        }) => ({
          annotation: item.annotation,
          text: item.highlight_content,
          cfiRange: item.epub_cfi,
          color: item.color,
          programContentId: item.program_content_id,
          memberId: item.member_id,
          chapter: item.chapter,
          id: item.id,
        }),
      )

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

export const updateHighlight = async (
  dto: UpdateEbookHighlightRequestDto,
  dataSource: any,
): Promise<{ error: Error | null; result: boolean; data: Highlight | null }> => {
  try {
    const response = await dataSource.mutate({
      mutation: UPDATE_PRPGRAM_CONTENT_EBOOK_HIGHLIGHT,
      variables: {
        id: dto.id,
        annotation: dto.annotation,
        color: dto.color,
      },
    })

    if (response.data.update_program_content_ebook_highlight_by_pk) {
      return { error: null, result: true, data: response.data.update_program_content_ebook_highlight_by_pk }
    } else {
      return { error: new Error('Failed to update ebook highlight'), result: false, data: null }
    }
  } catch (error: any) {
    console.error(error)
    return { error, result: false, data: null }
  }
}
