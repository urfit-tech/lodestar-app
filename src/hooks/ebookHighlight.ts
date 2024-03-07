import { useCallback, useState } from 'react'
import { useEbookHighlightModel } from './model/ebookHighlightModel'

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

export const useEbookHighlight = () => {
  const [error, setError] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const { saveHighlightData, fetchHighlightsData } = useEbookHighlightModel()

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

        try {
          await saveHighlightData(highlightData)
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

  return {
    error,
    highlights,
    saveHighlight,
    getHighLightData,
    markHighlightAsMarked,
  }
}
