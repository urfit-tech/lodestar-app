import { gql, useApolloClient, useQuery } from '@apollo/client'
import { Flex, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EpubView, ReactReader, ReactReaderStyle } from 'react-reader'
import styled from 'styled-components'
import hasura from '../../hasura'
import { deleteProgramContentEbookBookmark } from '../ebook/EbookBookmarkModal'
import { EbookReaderControlBar } from '../ebook/EbookReaderControlBar'
import { decryptData } from './decryptUtils'
import type { NavItem, Rendition, Book } from 'epubjs'

export const getChapter = (loc: string) => {
  const chapter = loc.match(/\[(.*?)\]/g)?.map((match: string) => match.slice(1, -1))[0] || ''
  return chapter
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
  setEbook: React.Dispatch<React.SetStateAction<Book | null>>
  ebookCurrentToc: string | null
  onEbookCurrentTocChange: (toc: string | null) => void
  location: string | number
  onLocationChange: (location: string | number) => void
}> = ({ programContentId, ebookCurrentToc, onEbookCurrentTocChange, location, onLocationChange, setEbook }) => {
  const { currentMemberId, authToken } = useAuth()
  const [source, setSource] = useState<ArrayBuffer | null>(null)
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { programContentBookmark, refetch: refetchBookmark } = useEbookBookmark(programContentId, currentMemberId)

  const [isCurrentPageBookmark, setCurrentPageBookmark] = useState<boolean>(false)
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isLocationGenerated, setIsLocationGenerated] = useState<boolean>(false)
  const [bookmarkId, setBookmarkId] = useState<string | undefined>(undefined)
  const [chapter, setChapter] = useState('')

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [ebookFontSize, setEbookFontSize] = useState(20)
  const [ebookLineHeight, setEbookLineHeight] = useState(1)

  const [bookmarkHighlightContent, setBookmarkHighlightContent] = useState('')

  const getEpubFromS3 = useCallback(async (programContentId: string, authToken: string) => {
    try {
      const ebookUrl = `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/ebook/${programContentId}.epub`

      const response = await axios.get(ebookUrl, {
        responseType: 'arraybuffer',
        headers: { authorization: `Bearer ${authToken}` },
      })

      // Extract the hash key from the auth token
      const hashKey = authToken.split('.')[2] || ''

      const decryptedData = decryptData(response.data, hashKey, 'demo')

      setSource(decryptedData)
    } catch (error) {
      handleError(error)
    }
  }, [])

  useEffect(() => {
    if (authToken) {
      getEpubFromS3(programContentId, authToken)
    }
  }, [authToken, programContentId, getEpubFromS3])

  useEffect(() => {
    rendition.current?.themes.override('color', getReaderTheme(theme).color)
    rendition.current?.themes.override('background-color', getReaderTheme(theme).backgroundColor)
    rendition.current?.themes.override('font-size', `${ebookFontSize}px`)
    rendition.current?.themes.override('line-height', ebookLineHeight.toString())
    rendition.current?.reportLocation()
  }, [theme, ebookFontSize, ebookLineHeight])

  const readerStyles = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: getReaderTheme(theme).backgroundColor,
      transition: 'none',
    },
  }

  return (
    <div>
      {source ? (
        <EbookReaderBookmarkIcon
          location={location}
          refetchBookmark={refetchBookmark}
          programContentId={programContentId}
          memberId={currentMemberId}
          highlightContent={bookmarkHighlightContent}
          chapter={chapter}
          bookmarkId={bookmarkId}
          isCurrentPageBookmark={isCurrentPageBookmark}
          setCurrentPageBookmarked={setCurrentPageBookmark}
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
                    const { start, end, atEnd } = rendition.current?.location || {}
                    if (start && end && rendition.current) {
                      // set chapter and check if current page is ended page
                      setChapter(getChapter(loc))
                      atEnd && setSliderValue(100)
                      // get current showing text
                      const splitCfi = start.cfi.split('/')
                      const baseCfi = splitCfi[0] + '/' + splitCfi[1] + '/' + splitCfi[2] + '/' + splitCfi[3]
                      const startCfi = start.cfi.replace(baseCfi, '')
                      const endCfi = end.cfi.replace(baseCfi, '')
                      const rangeCfi = [baseCfi, startCfi, endCfi].join(',')
                      rendition.current?.book.getRange(rangeCfi).then(range => {
                        const text = range?.toString()
                        const currentPageBookmark = programContentBookmark.find(
                          bookmark => text?.includes(bookmark.highlightContent) && getChapter(loc) === bookmark.chapter,
                        )
                        setCurrentPageBookmark(currentPageBookmark ? true : false)
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
                      onEbookCurrentTocChange(getChapter(loc))
                      try {
                        apolloClient
                          .query({
                            query: GetProgramContentEbookToc,
                            variables: { programContentId, href: `${href}#${getChapter(loc)}` },
                          })
                          .then(async ({ data }) => {
                            if (data.program_content_ebook_toc.length > 0) {
                              const programContentEbookTocId = data.program_content_ebook_toc[0].id
                              await apolloClient.mutate({
                                mutation: UpsertEbookTocProgress,
                                variables: {
                                  memberId: currentMemberId,
                                  programContentEbookTocId,
                                  latestProgress:
                                    currentEndPage / totalPage > 1 ? 1 : (currentEndPage / totalPage).toFixed(5),
                                  // for currentEndPage + 1, The last page may be blank or not fully filled
                                  finishedAt: (currentEndPage + 1) / totalPage >= 1 ? new Date() : null,
                                },
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
                    // initial theme
                    rendition.current.themes.override('color', '#424242')
                    rendition.current.themes.override('background-color', '#ffffff')
                    rendition.current.themes.override('font-size', `18px`)
                    rendition.current.themes.override('line-height', '1.5')
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
                  const percentage = (rendition.current?.currentLocation() as any)?.start?.percentage
                  setSliderValue(percentage * 100)
                }}
              >
                ‹
              </button>
              <button
                style={{ ...readerStyles.arrow, ...readerStyles.next }}
                onClick={async () => {
                  await rendition.current?.next()
                  const percentage = (rendition.current?.currentLocation() as any)?.start?.percentage
                  setSliderValue(percentage * 100)
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
          onLocationChange={(loc: undefined | string) => rendition.current?.display(loc)}
          onFontSizeChange={setEbookFontSize}
          onLineHeightChange={setEbookLineHeight}
          onThemeChange={setTheme}
          currentThemeData={getReaderTheme(theme)}
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
  isCurrentPageBookmark: boolean
  setCurrentPageBookmarked: (isBookmark: boolean) => void
  refetchBookmark: () => void
}> = ({
  refetchBookmark,
  memberId,
  isCurrentPageBookmark,
  programContentId,
  location,
  highlightContent,
  chapter,
  bookmarkId,
  setCurrentPageBookmarked,
}) => {
  const apolloClient = useApolloClient()

  const insertBookmark = async () => {
    await apolloClient.mutate({
      mutation: insertProgramContentEbookBookmark,
      variables: {
        memberId,
        programContentId,
        epubCfi: location,
        highlightContent: highlightContent,
        chapter,
      },
    })
    await refetchBookmark()
    setCurrentPageBookmarked(true)
  }

  const deleteBookmark = async () => {
    await apolloClient.mutate({
      mutation: deleteProgramContentEbookBookmark,
      variables: {
        id: bookmarkId,
      },
    })
    await refetchBookmark()
    setCurrentPageBookmarked(false)
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
      onClick={isCurrentPageBookmark ? () => deleteBookmark() : () => insertBookmark()}
    >
      <ReaderBookmark color={isCurrentPageBookmark ? '#FF7D62' : undefined} />
    </Flex>
  )
}

const GetProgramContentEbookToc = gql`
  query GetProgramContentEbookToc($programContentId: uuid!, $href: String!) {
    program_content_ebook_toc(where: { program_content_id: { _eq: $programContentId }, href: { _eq: $href } }) {
      id
    }
  }
`
const UpsertEbookTocProgress = gql`
  mutation UpsertEbookTocProgress(
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
        update_columns: [latest_progress, finished_at]
      }
    ) {
      affected_rows
    }
  }
`

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
