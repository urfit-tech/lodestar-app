import { useCallback, useState } from 'react'
import {
  DeleteEbookHighlightRequestDto,
  Highlight,
  SaveEbookHighlightRequestDto,
  UpdateEbookHighlightRequestDto,
} from './model/api/ebookHighlightQraphql'
import { useEbookHighlightModel } from './model/ebookHighlightModel'

type GetEbookHighlightRequestDto = {
  programContentId: string
  memberId: string
}

interface SaveHighlightParams {
  annotation: string | null
  range: Range
  cfiRange: string
  contents: any
  color: string
  programContentId: string
  memberId: string
  chapter: string
}

export const useEbookHighlight = () => {
  const [error, setError] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const { saveHighlightData, fetchHighlightsData, deleteHighlightData, updateHighlightData } = useEbookHighlightModel()

  const updateHighlight = useCallback(async (dto: UpdateEbookHighlightRequestDto) => {
    try {
      const data = await updateHighlightData(dto)
      if (data) {
        setHighlights(prevHighlights =>
          prevHighlights.map(highlight =>
            highlight.id === dto.id ? { ...highlight, color: data.color, annotation: data.annotation } : highlight,
          ),
        )
      } else {
        throw new Error('Update failed or returned no data')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during highlight update.')
    }
  }, [])

  const saveHighlight = useCallback(
    async ({
      annotation,
      range,
      cfiRange,
      contents,
      color = 'rgba(255, 190, 30, 0.5)',
      programContentId,
      memberId,
      chapter,
    }: SaveHighlightParams) => {
      if (range) {
        const highlightContent = range.toString()
        const highlightData: SaveEbookHighlightRequestDto = {
          annotation,
          epubCfi: cfiRange,
          programContentId,
          memberId,
          highLightContent: highlightContent,
          chapter,
          color,
        }

        try {
          const data = await saveHighlightData(highlightData)
          if (data) {
            setHighlights(prevHighlights => [
              ...prevHighlights,
              {
                id: data.id,
                annotation,
                text: highlightContent,
                cfiRange,
                color,
                programContentId,
                memberId,
                chapter,
                isNew: true,
                isDeleted: false,
              },
            ])
          }

          const selection = contents.window.getSelection()
          selection?.removeAllRanges()
        } catch (error: any) {
          setError(error.message)
        }
      }
    },
    [saveHighlightData],
  )

  const getHighLightData = useCallback(
    async (dto: GetEbookHighlightRequestDto) => {
      try {
        const data = await fetchHighlightsData(dto)
        setHighlights(data.map(item => ({ ...item, isNew: true })))
      } catch (error: any) {
        setError(error.message)
      }
    },
    [fetchHighlightsData],
  )

  const markHighlightAsMarked = useCallback((index: number) => {
    setHighlights(prevHighlights =>
      prevHighlights.map((highlight, idx) => (idx === index ? { ...highlight, isNew: false } : highlight)),
    )
  }, [])

  const deleteHighlight = async (dto: DeleteEbookHighlightRequestDto) => {
    try {
      const data = await deleteHighlightData(dto)
      setHighlights(prevHighlights => {
        const updatedHighlights = prevHighlights.filter(h => {
          return h.id !== dto.id
        })
        return updatedHighlights
      })
    } catch (error: any) {
      setError(error.message)
    }
  }

  return {
    error,
    highlights,
    saveHighlight,
    getHighLightData,
    markHighlightAsMarked,
    deleteHighlight,
    updateHighlight,
  }
}
