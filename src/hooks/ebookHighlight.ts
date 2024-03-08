import { useCallback, useState } from 'react'
import { Highlight, SaveEbookHighlightRequestDto } from './model/api/ebookHighlightQraphql'
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
  const { saveHighlightData, fetchHighlightsData } = useEbookHighlightModel()

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
            console.log(data)
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
        console.log(data)
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
