import { useApolloClient } from '@apollo/client'
import {
  createHighlight,
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

  return {
    saveHighlightData,
    fetchHighlightsData,
  }
}
