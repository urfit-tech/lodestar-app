import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Icon } from '@chakra-ui/icons'
import { Flex, Spinner } from '@chakra-ui/react'
import { Input, Modal } from 'antd'
import axios from 'axios'
import { inRange } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EpubView, ReactReaderStyle } from 'react-reader'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { ReactComponent as QuoteIcon } from '../../images/quote.svg'
import { deleteProgramContentEbookBookmark } from '../ebook/EbookBookmarkModal'
import { EbookReaderControlBar } from '../ebook/EbookReaderControlBar'
import { decryptData } from './decryptUtils'
import type { NavItem, Rendition, Book, Location, Contents } from 'epubjs'

type ITextSelection = {
  text: string
  cfiRange: string
  color?: string
}

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

const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  .anticon {
    color: white;
  }
`

const CircleButton = styled.button`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: orange;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const StyledCommentModal = styled(Modal)`
  .ant-modal-content {
    /* width: 500px; */
    /* height: 402px; */
    width: 450px;
    /* padding: 15px 15px 15px 15px; */
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    background-color: #fff;
  }
  .ant-modal-body .headerContainer {
    color: #585858;
    font-size: 20px;
    font-weight: bold;
  }

  .ant-modal-body .modelContainer {
    margin-top: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .ant-modal-body .modelContainer .quote {
    width: 40px;
    height: 45px;
    color: #ffbe1e;
  }

  .ant-modal-body .modelContainer .commentArea {
    min-width: 350px;
  }

  .ant-modal-body .modelContainer .commentArea h2 {
    font-size: 20px;
    font-weight: bold;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 0.2px;
    font-family: NotoSansCJKtc;
    color: var(--gray-darker);
  }

  .ant-modal-body .modelContainer .commentArea p {
    margin-top: 25px;
    margin-bottom: 0px;
  }

  .ant-modal-footer {
    border-top: 0px;
    width: 450px;
  }

  @media screen and (max-width: 992px) {
    .ant-modal-body .modelContainer .commentArea {
      min-width: 200px;
    }
  }
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: 44px;
  padding: 0 12px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  background-color: #222;
  position: absolute;
  z-index: 1000;
  gap: 10px;
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

const ProgramContentEbookReader: React.VFC<{
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
  const [source, setSource] = useState<ArrayBuffer | null>(null)
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { refetchProgress } = useContext(ProgressContext)
  const { programContentBookmarks, refetch: refetchBookmark } = useEbookBookmark(programContentId, currentMemberId)
  const { upsertProgramContentEbookTocProgress, updateProgramContentEbookTocProgressFinishedAt } =
    useMutationProgramContentEbookTocProgress()

  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isLocationGenerated, setIsLocationGenerated] = useState<boolean>(false)
  const [currentPageBookmarkIds, setCurrentPageBookmarkIds] = useState<string[]>([])
  const [chapter, setChapter] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [ebookFontSize, setEbookFontSize] = useState(18)
  const [ebookLineHeight, setEbookLineHeight] = useState(1.5)
  const [bookmarkData, setBookmarkData] = useState<BookmarkData>()
  const [selections, setSelections] = useState<ITextSelection[]>([])
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const currentSelection = useRef<{ cfiRange: string | null; contents: Contents | null }>({
    cfiRange: null,
    contents: null,
  })
  const [openCommentModel, setOpenCommentModel] = useState(false)

  const showCommentModal = () => {
    setOpenCommentModel(true)
  }
  const handleOk = () => {
    setOpenCommentModel(false)
  }

  const handleCancel = () => {
    setOpenCommentModel(false)
  }

  const setCurrentSelection = (cfiRange: string, contents: Contents) => {
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

  const setRenderSelection = (cfiRange: string, contents: Contents, color: string = 'rgba(255, 190, 30, 0.5)') => {
    const range = rendition.current?.getRange(cfiRange)
    if (range) {
      const rangeText = range.toString()
      setSelections(list =>
        list.concat({
          text: rangeText,
          cfiRange,
          color,
        }),
      )
      rendition.current?.annotations.highlight(cfiRange, {}, function () {}, 'hl', {
        fill: color,
        'fill-opacity': '0.5',
        'mix-blend-mode': 'multiply',
      })
      const selection = contents.window.getSelection()
      selection?.removeAllRanges()
    }
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
  }, [theme, ebookFontSize, ebookLineHeight])

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection()
      if (!selection || selection.isCollapsed) {
        setToolbarVisible(false)
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const handleColor = () => {
    setRenderSelection(
      currentSelection.current.cfiRange as string,
      currentSelection.current.contents as Contents,
      'rgba(255, 190, 30, 0.5)',
    )
    setToolbarVisible(false)
  }

  return (
    <div>
      <StyledCommentModal visible={openCommentModel} onOk={handleOk} onCancel={handleCancel}>
        <div className="headerContainer">
          <h1>畫線註釋</h1>
        </div>
        <div className="modelContainer">
          <Icon as={QuoteIcon} className="quote" />
          <div className="commentArea">
            <h2>
              {currentSelection.current?.cfiRange &&
                rendition.current?.getRange(currentSelection.current?.cfiRange as string)?.toString()}
            </h2>
            <p>詮釋內容</p>
            <Input.TextArea rows={4} />
          </div>
        </div>
      </StyledCommentModal>

      <TextSelectionToolbar visible={toolbarVisible} position={toolbarPosition}>
        <StyledButton onClick={handleColor}>
          <CircleButton />
        </StyledButton>
        <StyledButton onClick={showCommentModal}>
          <EditOutlined />
        </StyledButton>
        <StyledButton>
          <DeleteOutlined />
        </StyledButton>
      </TextSelectionToolbar>
      {source && currentMemberId && chapter ? (
        <EbookReaderBookmarkIcon
          bookmarkData={bookmarkData}
          currentPageBookmarkIds={currentPageBookmarkIds}
          setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
          refetchBookmark={refetchBookmark}
        />
      ) : null}

      {source ? (
        <div style={{ height: '85vh' }}>
          <div style={readerStyles.container}>
            <div style={readerStyles.readerArea}>
              <div style={readerStyles.reader}>
                <EpubView
                  url={source}
                  showToc={false}
                  tocChanged={_toc => (toc.current = _toc)}
                  location={location}
                  locationChanged={async (epubCfi: string) => {
                    onLocationChange(epubCfi)
                    const { start, end, atEnd } = rendition.current?.location || {}

                    if (start && end && rendition.current) {
                      setSliderValue(start.percentage * 100)
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
                    // initial theme
                    rendition.current.themes.override('color', '#424242')
                    rendition.current.themes.override('background-color', '#ffffff')
                    rendition.current?.themes.default({ p: { 'font-size': '18px!important' } })
                    rendition.current?.themes.default({ p: { 'line-height': '1.5 !important' } })

                    rendition.current.on('selected', (cfiRange: string, contents: Contents) => {
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

                    rendition.current.on('click', (event: MouseEvent) => {
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
                  }}
                />
              </div>
              <button
                style={{ ...readerStyles.arrow, ...readerStyles.prev }}
                onClick={async () => {
                  await rendition.current?.prev()
                }}
              >
                ‹
              </button>
              <button
                style={{ ...readerStyles.arrow, ...readerStyles.next }}
                onClick={async () => {
                  await rendition.current?.next()
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Flex height="85vh" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}

      {source ? (
        <EbookReaderControlBar
          isLocationGenerated={isLocationGenerated}
          sliderValue={sliderValue}
          onSliderValueChange={setSliderValue}
          rendition={rendition}
          chapter={chapter}
          programContentBookmarks={programContentBookmarks}
          fontSize={ebookFontSize}
          lineHeight={ebookLineHeight}
          refetchBookmark={refetchBookmark}
          onLocationChange={(cfi: string) => rendition.current?.display(cfi)}
          onFontSizeChange={setEbookFontSize}
          onLineHeightChange={setEbookLineHeight}
          onThemeChange={setTheme}
          currentThemeData={getReaderTheme(theme)}
          setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
        />
      ) : null}
    </div>
  )
}

const EbookReaderBookmarkIcon: React.VFC<{
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
        href: bookmark.href,
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

type TextSelectionToolbarProps = {
  visible: boolean
  position: { top: number; left: number }
}

const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({ visible, position, children }) => {
  if (!visible) return null

  return <ToolbarContainer style={{ top: position.top + 55, left: position.left }}>{children}</ToolbarContainer>
}

export default ProgramContentEbookReader
