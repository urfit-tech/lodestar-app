import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Box, Button, Flex, Link, Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import { inRange } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { EpubView, ReactReaderStyle } from 'react-reader'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { useEbookHighlight, useGetEbookTrialPercentage } from '../../hooks/ebook'
import { Highlight } from '../../hooks/model/api/ebookHighlightGraphql'
import CommonModal from '../common/CommonModal'
import { deleteProgramContentEbookBookmark } from '../ebook/EbookBookmarkModal'
import EbookCommentModal from '../ebook/EbookCommentModel'
import EbookDeleteHighlightModal from '../ebook/EbookDeleteCommentModel'
import { EbookReaderControlBar } from '../ebook/EbookReaderControlBar'
import EbookTextSelectionToolbar from '../ebook/EbookTextSelectionToolbar'
import { decryptData } from './decryptUtils'
import programMessages from './translation'
import { NavItem, Rendition, Book, Location, Contents } from '../../types/epub'

const ReaderBookmark = styled.div`
  position: relative;
  width: 26px;
  height: 27px;
  background-color: ${props => (props.color ? props.color : '#E2E2E2')};

  &:after {
    content: '';
    position: absolute;
    top: 27px;
    right: 0;
    border-right: 13px solid ${props => (props.color ? props.color : '#E2E2E2')};
    border-left: 13px solid ${props => (props.color ? props.color : '#E2E2E2')};
    border-top: 13px solid rgba(0, 0, 0, 0);
    transform: rotate(180deg);
  }
`

export const getChapter = (book: Book, href: string) => {
  const currentNavItem = getNavItem(book, href)
  const parentNavItems = getParentNavItem(book, currentNavItem)
  const chapterLabel = [...parentNavItems, currentNavItem].map(item => item?.label).join(' ') || ''
  return chapterLabel
}

function flatten(chapters: any) {
  return [].concat.apply(
    [],
    chapters.map((chapter: NavItem) => ([] as NavItem[]).concat.apply([chapter], flatten(chapter.subitems))),
  ) as NavItem[]
}

const getNavItem = (book: Book, href: string) => {
  let match = flatten(book.navigation.toc).find((chapter: NavItem) => {
    return (
      book.canonical(chapter.href).includes(book.canonical(href)) ||
      book.canonical(href).includes(book.canonical(chapter.href))
    )
  }, null)

  return match
}

const getParentNavItem = (book: Book, navItem: NavItem | undefined) => {
  if (!navItem) {
    return []
  }

  let parentId = navItem.parent
  const allToc = flatten(book.navigation.toc)
  const parentNavItems = []
  while (parentId) {
    for (const toc of allToc) {
      if (parentId === toc.id) {
        parentNavItems.push(toc)
        parentId = toc.parent
      }
    }
  }
  return parentNavItems
}

const getReaderTheme = (theme: string): { color: string; backgroundColor: string } => {
  switch (theme) {
    case 'light':
      return {
        color: '#424242',
        backgroundColor: '#ffffff',
      }
    case 'dark':
      return {
        color: '#ffffff',
        backgroundColor: '#424242',
      }
    default:
      return {
        color: '',
        backgroundColor: '',
      }
  }
}

type BookmarkData = {
  highlightContent: string
  percentage: number
  chapter: string
  epubCfi: string
  href: string
  memberId: string
  programContentId: string
}

export type Bookmark = {
  id: any
  epubCfi: string
  createdAt: Date
  highlightContent: string
  chapter: string | null | undefined
  href: string
  percentage: number
}

const isSafari = /Safari/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent)
// When using the chrome browser on an ios phone, the word "CriOS" will appear in the userAgent

const ProgramContentEbookReader: React.FC<{
  programContentId: string
  isTrial: boolean
  setEbook: React.Dispatch<React.SetStateAction<Book | null>>
  ebookCurrentToc: string | null
  onEbookCurrentTocChange: (toc: string | null) => void
  location: string | number
  onLocationChange: (location: string | number) => void
}> = ({
  programContentId,
  ebookCurrentToc,
  onEbookCurrentTocChange,
  location,
  onLocationChange,
  setEbook,
  isTrial,
}) => {
  const { currentMemberId, authToken } = useAuth()
  const { programId } = useParams<{ programId: string }>()
  const [source, setSource] = useState<ArrayBuffer | null>(null)
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { refetchProgress } = useContext(ProgressContext)
  const { programContentBookmarks, refetch: refetchBookmark } = useEbookBookmark(programContentId, currentMemberId)
  const { highlights, saveHighlight, setHighlights, getHighLightData, deleteHighlight, updateHighlight } =
    useEbookHighlight()
  const ebookTrialPercentage = useGetEbookTrialPercentage(programContentId)
  const { formatMessage } = useIntl()
  const { upsertProgramContentEbookTocProgress, updateProgramContentEbookTocProgressFinishedAt } =
    useMutationProgramContentEbookTocProgress()

  const [sliderValue, setSliderValue] = useState<number>(0)
  const [modalState, setModalState] = useState<'trialComplete' | null | string>(null)
  const [isTrialCompleted, setIsTrialCompleted] = useState(false)
  const [isLocationGenerated, setIsLocationGenerated] = useState<boolean>(false)
  const [currentPageBookmarkIds, setCurrentPageBookmarkIds] = useState<string[]>([])
  const [chapter, setChapter] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [ebookFontSize, setEbookFontSize] = useState(19)
  const [ebookLineHeight, setEbookLineHeight] = useState(1.6)
  const [bookmarkData, setBookmarkData] = useState<BookmarkData>()
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const currentSelection = useRef<{
    cfiRange: string | null
    contents: Contents | null
  }>({
    cfiRange: null,
    contents: null,
  })
  const [openCommentModel, setOpenCommentModel] = useState(false)
  const [openDeleteHighlightModel, setDeleteHighlightModel] = useState(false)
  const [isRenditionReady, setIsRenditionReady] = useState(false)
  const [reRenderHighlightQueue, setReRenderHighlightQueue] = useState<string[]>([])
  const [forceReapplyHighlight, setForceReapplyHighlight] = useState(false)
  const [annotation, setAnnotation] = useState<Highlight | null>(null)
  const [highlightToDelete, setHighlightToDelete] = useState<Highlight | null>(null)

  const isDragging = useRef(false)
  const originalNextRef = useRef<(() => Promise<void>) | undefined>()
  const originalPrevRef = useRef<(() => Promise<void>) | undefined>()

  if (rendition.current) {
    if (!!openCommentModel || !isLocationGenerated) {
      rendition.current.next = () => {
        return Promise.resolve()
      }
      rendition.current.prev = () => {
        return Promise.resolve()
      }
    } else if (!!isTrialCompleted) {
      rendition.current.next = () => {
        return Promise.resolve()
      }
    } else {
      if (typeof originalNextRef.current === 'function') {
        rendition.current.next = originalNextRef.current
      }
      if (typeof originalPrevRef.current === 'function') {
        rendition.current.prev = originalPrevRef.current
      }
    }
  }

  const showCommentModal = (cfiRange: string | null, id: string | null = null) => {
    let highlightToComment

    highlightToComment = id
      ? highlights.find(highlight => highlight.id === id)
      : highlights.find(highlight => highlight.cfiRange === cfiRange)

    if (!highlightToComment) {
      highlightToComment = {
        id: null,
        annotation: null,
        text: rendition.current?.getRange(cfiRange as string).toString() || '',
        cfiRange: currentSelection.current.cfiRange as string,
        color: 'rgba(255, 190, 30, 0.5)',
        programContentId: programContentId,
        memberId: currentMemberId?.toString() || '',
        chapter: chapter,
        percentage: sliderValue,
      }
    }

    setAnnotation(highlightToComment)
    setOpenCommentModel(true)
    setToolbarVisible(false)
  }

  const handleCommentOk = () => {
    if (currentMemberId && annotation) {
      if (annotation?.id) {
        updateHighlight({
          id: annotation.id,
          color: annotation.color,
          annotation: annotation.annotation,
        })
      } else {
        const range = rendition.current?.getRange(annotation?.cfiRange as string)
        if (range) {
          saveHighlight({
            annotation: annotation?.annotation || null,
            range: range,
            cfiRange: annotation?.cfiRange as string,
            contents: currentSelection.current.contents as Contents,
            color: 'rgba(255, 190, 30, 0.5)',
            programContentId: programContentId,
            memberId: currentMemberId,
            chapter: chapter,
            percentage: sliderValue,
          })
        }
      }

      setAnnotation(null)
      setOpenCommentModel(false)
      setToolbarVisible(false)
    }
  }

  const handleCommentCancel = () => {
    setOpenCommentModel(false)
    setToolbarVisible(false)
  }

  const showDeleteHighlightModal = (cfiRange: string | null, id: string | null = null) => {
    const existingHighlight = id
      ? highlights.find(highlight => highlight.id === id)
      : highlights.find(highlight => highlight.cfiRange === cfiRange)

    if (existingHighlight) {
      setHighlightToDelete(existingHighlight)
      setDeleteHighlightModel(true)
      setToolbarVisible(false)
    }
  }

  const handleDeleteHighlightModalOk = () => {
    if (highlightToDelete?.id) {
      deleteHighlight({ id: highlightToDelete.id })

      rendition.current?.annotations.remove(highlightToDelete.cfiRange, 'highlight')
      rendition.current?.annotations.remove(highlightToDelete.cfiRange, 'underline')

      setDeleteHighlightModel(false)
      setToolbarVisible(false)
      setHighlightToDelete(null)
    }
  }

  const handleDeleteHighlightModalCancel = () => {
    setDeleteHighlightModel(false)
    setToolbarVisible(false)
  }

  const setCurrentSelection = (cfiRange: string, contents: any) => {
    currentSelection.current = { cfiRange, contents }
  }

  const { id: appId } = useApp()

  const getEpubFromS3 = useCallback(
    async (programContentId, authToken) => {
      try {
        const config = createRequestConfig(authToken)
        const ebookUrl = `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/ebook/${programContentId}.epub`
        const response = await axios.get(ebookUrl, config)

        const hashKey = calculateHashKey(authToken)
        const iv = appId
        const decryptedData = decryptData(response.data, hashKey, iv)

        setSource(decryptedData)
      } catch (error) {
        handleError(error)
      }
    },
    [isTrial, appId],
  )

  const createRequestConfig = (authToken: string) => {
    if (authToken) {
      return {
        responseType: 'arraybuffer' as const,
        headers: { Authorization: `Bearer ${authToken}` },
      }
    }
    return { responseType: 'arraybuffer' as const }
  }

  const calculateHashKey = (authToken: string) => {
    if (authToken) {
      return authToken.split('.')[2] || ''
    }
    return isTrial ? `trial_key_${process.env.REACT_APP_EBOOK_SALT}` : ''
  }

  const readerStyles = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: getReaderTheme(theme).backgroundColor,
      transition: 'none',
    },
  }

  useLayoutEffect(() => {
    getEpubFromS3(programContentId, authToken)
  }, [authToken, programContentId, getEpubFromS3])

  useLayoutEffect(() => {
    rendition.current?.themes.override('color', getReaderTheme(theme).color)
    rendition.current?.themes.override('background-color', getReaderTheme(theme).backgroundColor)
    rendition.current?.themes.override('font-size', `${ebookFontSize}px`)
    rendition.current?.themes.override('line-height', ebookLineHeight.toString())
    rendition.current?.themes.default({ p: { 'font-size': `${ebookFontSize}px !important` } })
    rendition.current?.themes.default({ p: { 'line-height': `${ebookLineHeight} !important` } })
    const location = rendition.current?.currentLocation() as any as Location
    setSliderValue(location?.start?.percentage * 100 || 0)
  }, [ebookFontSize, ebookLineHeight])

  useLayoutEffect(() => {
    rendition.current?.themes.override('color', getReaderTheme(theme).color)
    rendition.current?.themes.override('background-color', getReaderTheme(theme).backgroundColor)
  }, [theme])

  useEffect(() => {
    if (programContentId && currentMemberId) {
      getHighLightData({ programContentId, memberId: currentMemberId })
    }
  }, [programContentId, currentMemberId])

  const highlightClickEvent = (e: MouseEvent) => {
    e.stopPropagation()

    if (isDragging.current) {
      e.preventDefault()
      isDragging.current = false
      return
    }

    const {
      dataset: { id: dataId },
    } = e.target as HTMLElement

    const foundHighlight = highlights.find(highlight => highlight.id === dataId)

    if (foundHighlight) {
      const range = rendition.current?.getRange(foundHighlight.cfiRange)
      const content = rendition.current?.hooks.content

      if (range) {
        const rect = range.getBoundingClientRect()

        if (rect) {
          setToolbarPosition({
            top: rect.bottom, // Position the toolbar below the selected text
            left: rect.left % (content as any).context._layout.width,
          })
        }

        setCurrentSelection(foundHighlight.cfiRange, null)

        setToolbarVisible(true)
      }
    }
  }

  const reRenderAnnotation = () => {
    if (rendition.current && isRenditionReady) {
      let isChanged = false

      const updatedHighlights = highlights.map((highlight, index) => {
        let newHighlight = { ...highlight }
        if (!highlight.colorDone) {
          rendition.current?.annotations.highlight(
            highlight.cfiRange,
            {
              id: highlight.id,
            },
            (e: MouseEvent) => {
              highlightClickEvent(e)
            },
            'hl',
            {
              fill: highlight.color,
              'fill-opacity': '0.5',
              'mix-blend-mode': 'multiply',
            },
          )

          newHighlight.colorDone = true
          isChanged = true
        }

        if (highlight.annotation && !highlight.underlineDone) {
          rendition.current?.annotations.add(
            'underline',
            highlight.cfiRange,
            {
              id: highlight.id,
            },
            (e: MouseEvent) => {
              highlightClickEvent(e)
            },
            'underline',
            {
              stroke: 'transparent',
              'stroke-opacity': '0.5',
              'mix-blend-mode': 'none',
              'stroke-width': '1',
              'stroke-linecap': 'butt',
              'stroke-dasharray': '1,2',
            },
          )

          newHighlight.underlineDone = true
          isChanged = true
        }

        return newHighlight
      })

      if (isChanged) {
        setHighlights(updatedHighlights)
      }
    }
  }

  useEffect(() => {
    reRenderAnnotation()
  }, [highlights, isRenditionReady])

  const reapplyHighlightsAndAnnotations = () => {
    highlights.forEach((highlight, index) => {
      if (rendition.current && isRenditionReady) {
        rendition.current?.annotations.remove(highlight.cfiRange, 'highlight')
        if (highlight.annotation) {
          rendition.current?.annotations.remove(highlight.cfiRange, 'underline')
        }

        rendition.current?.annotations.highlight(
          highlight.cfiRange,
          {
            id: highlight.id,
          },
          (e: MouseEvent) => {
            highlightClickEvent(e)
          },
          'hl',
          {
            fill: highlight.color,
            'fill-opacity': '0.5',
            'mix-blend-mode': 'multiply',
          },
        )

        if (highlight.annotation) {
          rendition.current?.annotations.add(
            'underline',
            highlight.cfiRange,
            {
              id: highlight.id,
            },
            (e: MouseEvent) => {
              highlightClickEvent(e)
            },
            'underline',
            {
              stroke: 'transparent',
              'stroke-opacity': '0.5',
              'mix-blend-mode': 'none',
              'stroke-width': '1',
              'stroke-linecap': 'butt',
              'stroke-dasharray': '1,2',
            },
          )
        }
      }
    })
  }

  useEffect(() => {
    reapplyHighlightsAndAnnotations()
  }, [ebookFontSize, ebookLineHeight, sliderValue, theme, ebookLineHeight, forceReapplyHighlight])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (reRenderHighlightQueue.length < 2) {
        return false
      }
      reapplyHighlightsAndAnnotations()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [reRenderHighlightQueue])

  const handleColor = () => {
    const range = rendition.current?.getRange(currentSelection.current.cfiRange as string)

    const existingHighlight = highlights.find(highlight => highlight.cfiRange === currentSelection.current.cfiRange)

    if (currentMemberId && range && !existingHighlight) {
      saveHighlight({
        annotation: null,
        range: range,
        cfiRange: currentSelection.current.cfiRange as string,
        contents: currentSelection.current.contents as Contents,
        color: 'rgba(255, 190, 30, 0.5)',
        programContentId: programContentId,
        memberId: currentMemberId,
        chapter: chapter,
        percentage: sliderValue,
      })
    }

    setToolbarVisible(false)
  }

  const initSetting = () => {
    if (!rendition.current) return
    rendition.current.themes.override('color', '#424242')
    rendition.current.themes.override('background-color', '#ffffff')
    rendition.current?.themes.override('font-size', `${ebookFontSize}px`)
    rendition.current?.themes.override('line-height', ebookLineHeight.toString())
  }

  return (
    <Box height={{ base: '90vh', md: '85vh' }}>
      <CommonModal
        isCentered
        isOpen={modalState === 'trialComplete'}
        title={formatMessage(programMessages.ProgramContentEbookReader.trialCompleted)}
        onClose={() => {
          setModalState(null)
        }}
        renderFooter={() => (
          <Link href={`/programs/${programId}?visitIntro=1`}>
            <Button colorScheme="primary">{formatMessage(commonMessages.ui.purchase)}</Button>
          </Link>
        )}
      >
        <Text marginTop="16px">{formatMessage(programMessages.ProgramContentEbookReader.trialCompletedMessage)}</Text>
      </CommonModal>
      <EbookDeleteHighlightModal
        visible={openDeleteHighlightModel}
        onOk={() => {
          handleDeleteHighlightModalOk()
        }}
        onCancel={handleDeleteHighlightModalCancel}
      />
      <EbookCommentModal
        visible={openCommentModel}
        onOk={handleCommentOk}
        onCancel={handleCommentCancel}
        annotation={annotation}
        setAnnotation={setAnnotation}
      />
      <EbookTextSelectionToolbar
        visible={Boolean(toolbarVisible && source && currentMemberId)}
        position={toolbarPosition}
        onHighlight={handleColor}
        onComment={() => showCommentModal(currentSelection.current.cfiRange, null)}
        onDelete={() => showDeleteHighlightModal(currentSelection.current.cfiRange, null)}
        setVisible={setToolbarVisible}
      />
      {source && currentMemberId && chapter ? (
        <EbookReaderBookmarkIcon
          bookmarkData={bookmarkData}
          currentPageBookmarkIds={currentPageBookmarkIds}
          setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
          refetchBookmark={refetchBookmark}
        />
      ) : null}
      {source ? (
        <Box height={{ base: `${!!isSafari ? 'calc(100% - 125px)' : 'calc(100% - 50px)'}`, md: '100%' }}>
          <div style={readerStyles.container}>
            <div style={readerStyles.readerArea}>
              <div style={readerStyles.reader}>
                <EpubView
                  url={source}
                  epubOptions={{
                    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
                    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
                  }}
                  showToc={false}
                  tocChanged={_toc => (toc.current = _toc)}
                  location={location}
                  locationChanged={async (epubCfi: string) => {
                    onLocationChange(epubCfi)
                    const { start, end, atEnd } = rendition.current?.location || {}
                    // reRenderAnnotation()

                    if (start && end && rendition.current) {
                      const sliderPercentage = start.percentage * 100
                      setIsTrialCompleted(false)
                      setSliderValue(sliderPercentage)
                      if (isTrial && sliderPercentage >= ebookTrialPercentage) {
                        setModalState('trialComplete')
                        setIsTrialCompleted(true)
                      } else {
                        setIsTrialCompleted(false)
                        setSliderValue(sliderPercentage)
                      }
                      setToolbarVisible(false)
                      // if this page is end page, set slider value to 100
                      if (atEnd) {
                        setSliderValue(100)
                      }

                      // set chapter and check if current page is ended page
                      const chapterLabel = getChapter(rendition.current.book, rendition.current.location.start.href)
                      setChapter(chapterLabel)

                      // get current showing text
                      const splitCfi = start.cfi.split('/')
                      const baseCfi = splitCfi[0] + '/' + splitCfi[1] + '/' + splitCfi[2] + '/' + splitCfi[3]
                      const startCfi = start.cfi.replace(baseCfi, '')
                      const endCfi = end.cfi.replace(baseCfi, '')
                      const rangeCfi = [baseCfi, startCfi, endCfi].join(',')
                      const range = await rendition.current.book.getRange(rangeCfi)
                      const text = range?.toString()

                      // set check is currentPage in bookmark and bookmark data
                      const isPercentageInRange = (percentage: number) =>
                        inRange(percentage, start.percentage, end.percentage)
                      const currentPageBookmarks = programContentBookmarks.filter(bookmark =>
                        isPercentageInRange(bookmark.percentage),
                      )
                      setCurrentPageBookmarkIds(
                        currentPageBookmarks.length > 0 ? currentPageBookmarks.map(bookmark => bookmark.id) : [],
                      )
                      setBookmarkData({
                        percentage: start.percentage,
                        chapter: chapterLabel,
                        highlightContent: text?.slice(0, 20),
                        epubCfi: epubCfi,
                        href: start.href,
                        memberId: currentMemberId || '',
                        programContentId,
                      })
                    }

                    // toc nav and save progress
                    if (rendition.current && toc.current) {
                      const { href } = rendition.current.location.start
                      const { displayed: displayedEnd } = rendition.current.location.end
                      const totalPage = displayedEnd.total
                      const currentEndPage = displayedEnd.page
                      onEbookCurrentTocChange(href?.split('/').pop() || '')
                      if (currentMemberId) {
                        try {
                          apolloClient
                            .query({
                              query: GetProgramContentEbookTocId,
                              variables: { programContentId, href: `%${href}%` },
                              fetchPolicy: 'no-cache',
                            })
                            .then(({ data }) => {
                              if (currentMemberId && data.program_content_ebook_toc.length > 0) {
                                const programContentEbookTocId = data.program_content_ebook_toc[0].id
                                upsertProgramContentEbookTocProgress({
                                  variables: {
                                    memberId: currentMemberId,
                                    programContentEbookTocId,
                                    latestProgress:
                                      currentEndPage / totalPage > 1 ? 1 : (currentEndPage / totalPage).toFixed(5),
                                  },
                                }).then(() => {
                                  // for currentEndPage + 1, The last page may be blank or not fully filled
                                  if ((currentEndPage + 1) / totalPage >= 1) {
                                    updateProgramContentEbookTocProgressFinishedAt({
                                      variables: {
                                        memberId: currentMemberId,
                                        programContentEbookTocId,
                                        finishedAt: new Date(),
                                      },
                                    })
                                    refetchProgress?.()
                                  }
                                })
                              }
                            })
                        } catch (error) {
                          process.env.NODE_ENV === 'development' ?? console.error(error)
                        }
                      }
                    }
                  }}
                  getRendition={async (_rendition: Rendition) => {
                    rendition.current = _rendition

                    if (rendition.current) {
                      setIsRenditionReady(true)

                      originalNextRef.current = rendition.current.next.bind(rendition.current)
                      originalPrevRef.current = rendition.current.prev.bind(rendition.current)

                      rendition.current.spread('auto')

                      rendition.current.hooks.content.register((contents: any) => {
                        const doc = contents.document
                        const body = doc.body
                        // Disable Chrome mobile's "tap to search" on a web app
                        body.setAttribute('tabindex', '-1')
                      })

                      // initialize settings
                      initSetting()
                    }

                    rendition.current.on('mousedown', (event: MouseEvent) => {
                      isDragging.current = false
                    })

                    rendition.current.on('mousemove', (event: MouseEvent) => {
                      isDragging.current = true
                    })

                    rendition.current.on('resized', (size: { width: number; height: number }) => {
                      setReRenderHighlightQueue(prev => [...prev, `${size}`])
                    })

                    rendition.current.on('selected', (cfiRange: string, contents: Contents) => {
                      setTimeout(() => {
                        const rangeText = rendition.current?.getRange(cfiRange)?.toString()
                        if (rangeText) {
                          const range = rendition.current?.getRange(cfiRange)
                          if (range) {
                            const rect = range.getBoundingClientRect()

                            setToolbarPosition({
                              top: rect.bottom + contents.window.scrollY, // Position the toolbar below the selected text
                              left: rect.left % contents.content.clientWidth,
                            })
                          }

                          setCurrentSelection(cfiRange, contents)

                          setToolbarVisible(true)
                        }
                      }, 0)
                    })

                    rendition.current.on('selectionchange', (cfiRange: string, contents: Contents) => {
                      const rangeText = rendition.current?.getRange(cfiRange)?.toString()
                      if (rangeText) {
                        const range = rendition.current?.getRange(cfiRange)
                        if (range) {
                          const rect = range.getBoundingClientRect()

                          setToolbarPosition({
                            top: rect.bottom + contents.window.scrollY, // Position the toolbar below the selected text
                            left: rect.left % contents.content.clientWidth,
                          })
                        }

                        setCurrentSelection(cfiRange, contents)
                        setToolbarVisible(true)
                      }
                    })

                    rendition.current.themes.default({
                      '.epubjs-hl': {
                        fill: 'rgba(255, 190, 30, 0.5)',
                        'fill-opacity': '0.3',
                        'mix-blend-mode': 'multiply',
                      },
                    })

                    rendition.current.on('mousedown', (event: MouseEvent) => {
                      setToolbarVisible(false)
                    })

                    await rendition.current?.book.locations.generate(150).then(() => {
                      setIsLocationGenerated(true)
                      setEbook(rendition.current?.book || null)
                    })
                  }}
                  handleTextSelected={(cfiRange, contents) => {
                    contents.document.addEventListener('copy', e => {
                      e.preventDefault()
                    })
                    contents.document.addEventListener('contextmenu', e => {
                      e.preventDefault()
                    })
                    contents.document.addEventListener('dragstart', e => {
                      e.preventDefault()
                    })
                  }}
                />
              </div>
              <button
                style={{ ...readerStyles.arrow, ...readerStyles.prev }}
                onClick={async () => {
                  await rendition.current?.prev()
                  setIsTrialCompleted(false)
                  setForceReapplyHighlight(!forceReapplyHighlight)
                }}
              >
                ‹
              </button>
              <button
                style={{ ...readerStyles.arrow, ...readerStyles.next }}
                onClick={async () => {
                  if (isTrialCompleted) {
                    setModalState('trialComplete')
                  } else {
                    await rendition.current?.next()
                    setForceReapplyHighlight(!forceReapplyHighlight)
                  }
                }}
              >
                ›
              </button>
            </div>
          </div>
        </Box>
      ) : (
        <Flex height="85vh" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
      {source ? (
        <EbookReaderControlBar
          isLocationGenerated={isLocationGenerated}
          sliderValue={sliderValue}
          onModalStateChange={setModalState}
          onSliderValueChange={setSliderValue}
          ebookTrialPercentage={ebookTrialPercentage}
          isTrial={isTrial}
          rendition={rendition}
          chapter={chapter}
          programContentBookmarks={programContentBookmarks}
          programContentHighlights={highlights}
          fontSize={ebookFontSize}
          lineHeight={ebookLineHeight}
          refetchBookmark={refetchBookmark}
          onLocationChange={(cfi: string) => rendition.current?.display(cfi)}
          onFontSizeChange={setEbookFontSize}
          onLineHeightChange={setEbookLineHeight}
          onThemeChange={setTheme}
          currentThemeData={getReaderTheme(theme)}
          setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
          deleteHighlight={deleteHighlight}
          showDeleteHighlightModal={showDeleteHighlightModal}
          showCommentModal={showCommentModal}
        />
      ) : null}
    </Box>
  )
}

const EbookReaderBookmarkIcon: React.FC<{
  bookmarkData: BookmarkData | undefined
  currentPageBookmarkIds: string[]
  setCurrentPageBookmarkIds: React.Dispatch<React.SetStateAction<string[]>>
  refetchBookmark: () => void
}> = ({ refetchBookmark, bookmarkData, currentPageBookmarkIds, setCurrentPageBookmarkIds }) => {
  const apolloClient = useApolloClient()

  const insertBookmark = async () => {
    if (!bookmarkData) return

    const response = await apolloClient.mutate({
      mutation: insertProgramContentEbookBookmark,
      variables: {
        memberId: bookmarkData.memberId,
        programContentId: bookmarkData.programContentId,
        epubCfi: bookmarkData.epubCfi,
        highlightContent: bookmarkData.highlightContent,
        chapter: bookmarkData.chapter,
        href: bookmarkData.href,
        percentage: bookmarkData.percentage,
      },
    })

    const bookmarkId = response.data.insert_program_content_ebook_bookmark.returning[0].id
    setCurrentPageBookmarkIds([...(currentPageBookmarkIds ? currentPageBookmarkIds : []), bookmarkId])
    await refetchBookmark()
  }

  const deleteBookmark = async () => {
    currentPageBookmarkIds?.forEach(
      async id =>
        await apolloClient.mutate({
          mutation: deleteProgramContentEbookBookmark,
          variables: {
            id,
          },
        }),
    )
    setCurrentPageBookmarkIds([])
    await refetchBookmark()
  }

  return (
    <Flex
      cursor="pointer"
      style={{
        width: 'fit-content',
        position: 'absolute',
        zIndex: 2,
        right: '20px',
      }}
      onClick={currentPageBookmarkIds.length > 0 ? () => deleteBookmark() : () => insertBookmark()}
    >
      <ReaderBookmark color={currentPageBookmarkIds.length > 0 ? '#FF7D62' : undefined} />
    </Flex>
  )
}

const GetProgramContentEbookTocId = gql`
  query PhGetProgramContentEbookTocId($programContentId: uuid!, $href: String!) {
    program_content_ebook_toc(where: { program_content_id: { _eq: $programContentId }, href: { _ilike: $href } }) {
      id
    }
  }
`

export const useMutationProgramContentEbookTocProgress = () => {
  const [upsertProgramContentEbookTocProgress] = useMutation<
    hasura.UpsertProgramContentEbookTocProgress,
    hasura.UpsertProgramContentEbookTocProgressVariables
  >(gql`
    mutation UpsertProgramContentEbookTocProgress(
      $memberId: String!
      $programContentEbookTocId: uuid!
      $latestProgress: numeric!
      $finishedAt: timestamptz
    ) {
      insert_program_content_ebook_toc_progress(
        objects: {
          member_id: $memberId
          program_content_ebook_toc_id: $programContentEbookTocId
          latest_progress: $latestProgress
          finished_at: $finishedAt
        }
        on_conflict: {
          constraint: program_content_ebook_toc_pro_program_content_ebook_toc_id__key
          update_columns: [latest_progress]
        }
      ) {
        affected_rows
      }
    }
  `)

  const [updateProgramContentEbookTocProgressFinishedAt] = useMutation<
    hasura.UpdateProgramContentEbookTocProgressFinishedAt,
    hasura.UpdateProgramContentEbookTocProgressFinishedAtVariables
  >(gql`
    mutation UpdateProgramContentEbookTocProgressFinishedAt(
      $memberId: String!
      $programContentEbookTocId: uuid!
      $finishedAt: timestamptz
    ) {
      update_program_content_ebook_toc_progress(
        _set: { finished_at: $finishedAt }
        where: {
          member_id: { _eq: $memberId }
          program_content_ebook_toc_id: { _eq: $programContentEbookTocId }
          finished_at: { _is_null: true }
        }
      ) {
        affected_rows
      }
    }
  `)

  return {
    upsertProgramContentEbookTocProgress,
    updateProgramContentEbookTocProgressFinishedAt,
  }
}

const insertProgramContentEbookBookmark = gql`
  mutation InsertEbookBookmark(
    $memberId: String!
    $programContentId: uuid!
    $epubCfi: String!
    $highlightContent: String!
    $chapter: String!
    $percentage: numeric!
    $href: String!
  ) {
    insert_program_content_ebook_bookmark(
      objects: {
        member_id: $memberId
        program_content_id: $programContentId
        epub_cfi: $epubCfi
        highlight_content: $highlightContent
        chapter: $chapter
        percentage: $percentage
        href: $href
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`

const useEbookBookmark = (programContentId: string, memberId: string | null) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramContentEbookBookmark,
    hasura.GetProgramContentEbookBookmarkVariables
  >(
    gql`
      query GetProgramContentEbookBookmark($programContentId: uuid!, $memberId: String!) {
        program_content_ebook_bookmark(
          where: { program_content_id: { _eq: $programContentId }, member_id: { _eq: $memberId } }
          order_by: { created_at: desc }
        ) {
          id
          epub_cfi
          created_at
          highlight_content
          chapter
          percentage
          href
        }
      }
    `,
    { variables: { programContentId, memberId: memberId || '' } },
  )

  const programContentBookmarks =
    data?.program_content_ebook_bookmark.map(bookmark => {
      return {
        id: bookmark.id,
        epubCfi: bookmark.epub_cfi,
        createdAt: new Date(bookmark.created_at),
        highlightContent: bookmark.highlight_content,
        chapter: bookmark.chapter,
        href: bookmark.href ?? '',
        percentage: bookmark.percentage,
      }
    }) || []
  return {
    loading,
    error,
    programContentBookmarks,
    refetch,
  }
}

export default ProgramContentEbookReader
