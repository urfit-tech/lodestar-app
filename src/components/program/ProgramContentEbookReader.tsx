import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Flex, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { EpubView, ReactReaderStyle } from 'react-reader'
import styled from 'styled-components'
import hasura from '../../hasura'
import { deleteProgramContentEbookBookmark } from '../ebook/EbookBookmarkModal'
import { EbookReaderControlBar } from '../ebook/EbookReaderControlBar'
import { decryptData } from './decryptUtils'
import type { NavItem, Rendition, Book, Location } from 'epubjs'

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

const ProgramContentEbookReader: React.VFC<{
  programContentId: string
  istrial: boolean
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
  istrial,
}) => {
  const { currentMemberId, authToken } = useAuth()
  const [source, setSource] = useState<ArrayBuffer | null>(null)
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { programContentBookmark, refetch: refetchBookmark } = useEbookBookmark(programContentId, currentMemberId)
  const { deleteProgramContentEbookTocProgress, insertProgramContentEbookTocProgress } =
    useMutationProgramContentEbookTocProgress()

  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isLocationGenerated, setIsLocationGenerated] = useState<boolean>(false)
  const [bookmarkId, setBookmarkId] = useState<string | undefined>(undefined)
  const [chapter, setChapter] = useState('')

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [ebookFontSize, setEbookFontSize] = useState(18)
  const [ebookLineHeight, setEbookLineHeight] = useState(1.5)

  const [bookmarkHighlightContent, setBookmarkHighlightContent] = useState('')
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
    [istrial, appId],
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
    return istrial ? `trial_key_${process.env.REACT_APP_EBOOK_SALT}` : ''
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
    const location = rendition.current?.currentLocation() as any as Location
    setSliderValue(location?.start?.percentage * 100 || 0)
  }, [theme, ebookFontSize, ebookLineHeight])

  return (
    <div>
      {source && chapter ? (
        <EbookReaderBookmarkIcon
          location={location}
          refetchBookmark={refetchBookmark}
          programContentId={programContentId}
          memberId={currentMemberId}
          highlightContent={bookmarkHighlightContent}
          chapter={chapter}
          bookmarkId={bookmarkId}
          setBookmarkId={setBookmarkId}
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
                  locationChanged={(loc: string) => {
                    onLocationChange(loc)
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
                      rendition.current.book.getRange(rangeCfi).then(range => {
                        const text = range?.toString()
                        const currentPageBookmark = programContentBookmark.find(
                          bookmark => text?.includes(bookmark.highlightContent) && chapterLabel === bookmark.chapter,
                        )
                        setBookmarkId(currentPageBookmark ? currentPageBookmark.id : undefined)
                        setBookmarkHighlightContent(text?.slice(0, 20))
                      })
                    }

                    // toc nav and save progress
                    if (rendition.current && toc.current) {
                      const { href } = rendition.current.location.start
                      const { displayed: displayedEnd } = rendition.current.location.end
                      const totalPage = displayedEnd.total
                      const currentEndPage = displayedEnd.page
                      onEbookCurrentTocChange(href?.split('/').pop() || '')
                      try {
                        apolloClient
                          .query({
                            query: GetProgramContentEbookToc,
                            variables: { memberId: currentMemberId, programContentId, href: `%${href}%` },
                            fetchPolicy: 'no-cache',
                          })
                          .then(({ data }) => {
                            if (currentMemberId && data.program_content_ebook_toc.length > 0) {
                              const finishedAt =
                                data.program_content_ebook_toc[0]?.program_content_ebook_toc_progress_list[0]
                                  ?.finished_at
                              const programContentEbookTocId = data.program_content_ebook_toc[0].id
                              deleteProgramContentEbookTocProgress({
                                variables: {
                                  memberId: currentMemberId,
                                  programContentEbookTocId,
                                },
                              }).then(({ data: deleteData }) => {
                                if ((deleteData?.delete_program_content_ebook_toc_progress?.affected_rows || 0) > 0) {
                                  insertProgramContentEbookTocProgress({
                                    variables: {
                                      memberId: currentMemberId,
                                      programContentEbookTocId,
                                      latestProgress:
                                        currentEndPage / totalPage > 1 ? 1 : (currentEndPage / totalPage).toFixed(5),
                                      // for currentEndPage + 1, The last page may be blank or not fully filled
                                      finisherAt: finishedAt
                                        ? finishedAt
                                        : (currentEndPage + 1) / totalPage >= 1
                                        ? new Date()
                                        : null,
                                    },
                                  })
                                }
                              })
                            }
                          })
                      } catch (error) {
                        process.env.NODE_ENV === 'development' ?? console.error(error)
                      }
                    }
                  }}
                  getRendition={async (_rendition: Rendition) => {
                    rendition.current = _rendition
                    rendition.current.on('resized', (size: { width: number; height: number }) => {
                      console.log(`resized => width: ${size.width}, height: ${size.height}`)
                    })
                    await rendition.current?.book.locations.generate(150).then(() => {
                      setIsLocationGenerated(true)
                      setEbook(rendition.current?.book || null)
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
          programContentBookmark={programContentBookmark}
          fontSize={ebookFontSize}
          lineHeight={ebookLineHeight}
          refetchBookmark={refetchBookmark}
          onLocationChange={(cfi: string) => rendition.current?.display(cfi)}
          onFontSizeChange={setEbookFontSize}
          onLineHeightChange={setEbookLineHeight}
          onThemeChange={setTheme}
          currentThemeData={getReaderTheme(theme)}
          setBookmarkId={setBookmarkId}
        />
      ) : null}
    </div>
  )
}

const EbookReaderBookmarkIcon: React.VFC<{
  memberId: string | null
  programContentId: string
  location: string | number
  highlightContent: string
  chapter: string
  bookmarkId: string | undefined
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>
  refetchBookmark: () => void
}> = ({
  refetchBookmark,
  memberId,
  programContentId,
  location,
  highlightContent,
  chapter,
  bookmarkId,
  setBookmarkId,
}) => {
  const apolloClient = useApolloClient()

  const insertBookmark = async () => {
    const response = await apolloClient.mutate({
      mutation: insertProgramContentEbookBookmark,
      variables: {
        memberId,
        programContentId,
        epubCfi: location,
        highlightContent: highlightContent,
        chapter,
      },
    })
    const bookmarkId = response.data.insert_program_content_ebook_bookmark.returning[0].id
    setBookmarkId(bookmarkId)
    await refetchBookmark()
  }

  const deleteBookmark = async () => {
    await apolloClient.mutate({
      mutation: deleteProgramContentEbookBookmark,
      variables: {
        id: bookmarkId,
      },
    })
    setBookmarkId(undefined)
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
      onClick={bookmarkId ? () => deleteBookmark() : () => insertBookmark()}
    >
      <ReaderBookmark color={bookmarkId ? '#FF7D62' : undefined} />
    </Flex>
  )
}

const GetProgramContentEbookToc = gql`
  query PhGetProgramContentEbookTocAndCurrentMemberProgress(
    $programContentId: uuid!
    $href: String!
    $memberId: String!
  ) {
    program_content_ebook_toc(where: { program_content_id: { _eq: $programContentId }, href: { _ilike: $href } }) {
      id
      program_content_ebook_toc_progress_list(where: { member_id: { _eq: $memberId } }) {
        id
        finished_at
      }
    }
  }
`

export const useMutationProgramContentEbookTocProgress = () => {
  const [deleteProgramContentEbookTocProgress] = useMutation<
    hasura.DeleteProgramContentEbookTocProgress,
    hasura.DeleteProgramContentEbookTocProgressVariables
  >(gql`
    mutation DeleteProgramContentEbookTocProgress($memberId: String!, $programContentEbookTocId: uuid!) {
      delete_program_content_ebook_toc_progress(
        where: { member_id: { _eq: $memberId }, program_content_ebook_toc_id: { _eq: $programContentEbookTocId } }
      ) {
        affected_rows
      }
    }
  `)
  const [insertProgramContentEbookTocProgress] = useMutation<
    hasura.InsertProgramContentEbookTocProgress,
    hasura.InsertProgramContentEbookTocProgressVariables
  >(
    gql`
      mutation InsertProgramContentEbookTocProgress(
        $memberId: String!
        $programContentEbookTocId: uuid!
        $latestProgress: numeric!
        $finisherAt: timestamptz
      ) {
        insert_program_content_ebook_toc_progress_one(
          object: {
            member_id: $memberId
            program_content_ebook_toc_id: $programContentEbookTocId
            latest_progress: $latestProgress
            finished_at: $finisherAt
          }
        ) {
          id
        }
      }
    `,
  )

  return {
    deleteProgramContentEbookTocProgress,
    insertProgramContentEbookTocProgress,
  }
}

const insertProgramContentEbookBookmark = gql`
  mutation InsertEbookBookmark(
    $memberId: String!
    $programContentId: uuid!
    $epubCfi: String!
    $highlightContent: String!
    $chapter: String!
  ) {
    insert_program_content_ebook_bookmark(
      objects: {
        member_id: $memberId
        program_content_id: $programContentId
        epub_cfi: $epubCfi
        highlight_content: $highlightContent
        chapter: $chapter
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
        }
      }
    `,
    { variables: { programContentId, memberId: memberId || '' } },
  )

  const programContentBookmark =
    data?.program_content_ebook_bookmark.map(bookmark => {
      return {
        id: bookmark.id,
        epubCfi: bookmark.epub_cfi,
        createdAt: new Date(bookmark.created_at),
        highlightContent: bookmark.highlight_content,
        chapter: bookmark.chapter,
      }
    }) || []
  return {
    loading,
    error,
    programContentBookmark,
    refetch,
  }
}

export default ProgramContentEbookReader
