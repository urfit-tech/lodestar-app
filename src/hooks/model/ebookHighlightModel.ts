import { useApolloClient } from '@apollo/client'
import {
  createHighlight,
  DeleteEbookHighlightRequestDto,
  deleteHighlight,
  GetEbookHighlightRequestDto,
  getEbookHighlights,
  Highlight,
  SaveEbookHighlightRequestDto,
} from './api/ebookHighlightQraphql'

export const useEbookHighlightModel = () => {
  const apolloClient = useApolloClient()
  const saveHighlightData = async (dto: SaveEbookHighlightRequestDto): Promise<Highlight | null> => {
    const { error, result, data } = await createHighlight(dto, apolloClient)
    if (error) {
      throw error
    }

    if (result && data) {
      return data
    }

    return null
  }

  const fetchHighlightsData = async (dto: GetEbookHighlightRequestDto): Promise<Highlight[]> => {
    const { error, data } = await getEbookHighlights(dto, apolloClient)
    if (error) {
      throw error
    }
    return data || []
  }

  const deleteHighlightData = async (dto: DeleteEbookHighlightRequestDto): Promise<boolean> => {
    const { error, result } = await deleteHighlight(dto, apolloClient)
    if (error) {
      throw error
    }
    return result
  }

  return {
    saveHighlightData,
    fetchHighlightsData,
    deleteHighlightData,
  }
}
