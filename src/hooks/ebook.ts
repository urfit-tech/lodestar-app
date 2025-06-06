import { gql, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'
import hasura from '../hasura'
import {
  DeleteEbookHighlightRequestDto,
  Highlight,
  SaveEbookHighlightRequestDto,
  UpdateEbookHighlightRequestDto,
} from './model/api/ebookHighlightGraphql'
import { useEbookHighlightModel } from './model/ebookHighlightModel'

type GetEbookHighlightRequestDto = {
  programContentId: string
  memberId: string
}

type EbookHighlightViewModel = Highlight & {
  colorDone?: boolean
  underlineDone?: boolean
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
  percentage: number
}

export const useEbookHighlight = () => {
  const [error, setError] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<EbookHighlightViewModel[]>([])
  const { saveHighlightData, fetchHighlightsData, deleteHighlightData, updateHighlightData } = useEbookHighlightModel()

  const updateHighlight = useCallback(async (dto: UpdateEbookHighlightRequestDto) => {
    try {
      const data = await updateHighlightData(dto)
      if (data) {
        setHighlights(prevHighlights =>
          prevHighlights
            .map(highlight =>
              highlight.id === dto.id ? { ...highlight, color: data.color, annotation: data.annotation } : highlight,
            )
            .sort((a, b) => a.percentage - b.percentage),
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
      percentage,
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
          percentage,
        }

        try {
          const data = await saveHighlightData(highlightData)
          if (data) {
            setHighlights(prevHighlights =>
              [
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
                  percentage,
                  colorDone: false,
                  underlineDone: false,
                  createdAt: data.createdAt,
                },
              ].sort((a, b) => a.percentage - b.percentage),
            )
          }

          if (contents) {
            const selection = contents.window.getSelection()
            selection?.removeAllRanges()
          }
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
        setHighlights(
          data
            .map(item => ({ ...item, colorDone: false, underlineDone: false }))
            .sort((a, b) => a.percentage - b.percentage),
        )
      } catch (error: any) {
        setError(error.message)
      }
    },
    [fetchHighlightsData],
  )

  const markColorAnnotationAsMarked = useCallback((index: number) => {
    setHighlights(prevHighlights =>
      prevHighlights.map((highlight, idx) => (idx === index ? { ...highlight, colorDone: true } : highlight)),
    )
  }, [])

  const markUnderLineAnnotationAsMarked = useCallback((index: number) => {
    setHighlights(prevHighlights =>
      prevHighlights.map((highlight, idx) => (idx === index ? { ...highlight, underline: true } : highlight)),
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
    setHighlights,
    saveHighlight,
    getHighLightData,
    markColorAnnotationAsMarked,
    markUnderLineAnnotationAsMarked,
    deleteHighlight,
    updateHighlight,
  }
}

export const useGetEbookTrialPercentage = (programContentId: string) => {
  const { data } = useQuery<hasura.GetEbookTrialPercentage, hasura.GetEbookTrialPercentageVariables>(
    gql`
      query GetEbookTrialPercentage($programContentId: uuid!) {
        program_content_ebook(where: { program_content_id: { _eq: $programContentId } }) {
          id
          trial_percentage
        }
      }
    `,
    {
      variables: {
        programContentId,
      },
    },
  )

  const ebookTrialPercentage = data?.program_content_ebook[0].trial_percentage || 0
  return ebookTrialPercentage
}
