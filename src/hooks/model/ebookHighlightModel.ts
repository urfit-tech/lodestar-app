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
  const saveHighlightData = async (dto: SaveEbookHighlightRequestDto): Promise<void> => {
    console.log('saveHighlightData', dto)
    const { error } = await createHighlight(dto, apolloClient)
    if (error) {
      throw error
    }
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
