import { gql, useApolloClient, useQuery } from '@apollo/client'
import { Flex } from '@chakra-ui/react'
import axios from 'axios'
import JSZip from 'jszip'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import hasura from '../../hasura'
import { ReactComponent as MarkIcon } from '../../images/mark.svg'
import { EbookReaderControlBar } from '../ebook/EbookReaderControlBar'
import type { NavItem, Rendition } from 'epubjs'

const getChapter = (loc: string) => {
  const chapter = loc.match(/\[(.*?)\]/g)?.map((match: string) => match.slice(1, -1))[0] || ''
  return chapter
}

const ProgramContentEbookReader: React.VFC<{
  programContentId: string
  ebookCurrentToc: string | null
  onEbookCurrentTocChange: (toc: string | null) => void
  location: string | number
  onLocationChange: (location: string | number) => void
}> = ({ programContentId, ebookCurrentToc, onEbookCurrentTocChange, location, onLocationChange }) => {
  const { currentMemberId, authToken } = useAuth()
  const [source, setSource] = useState<ArrayBuffer | null>(null)
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { programContentBookmark, refetch: refetchBookmark } = useEbookBookmark(programContentId, currentMemberId)

  const fakeRendition = useRef<Rendition | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const [allLocations, setAllLocations] = useState<string[]>([])
  const [fakeLocation, setFakeLocation] = useState<string | number>(0)

  const [isCountingTotal, setCountingTotal] = useState<boolean>(true)
  const [totalPage, setTotalPage] = useState(0)
  const [chapter, setChapter] = useState('')

  const getFileFromS3 = useCallback(async (programContentId: string, authToken: string) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/ebook/${programContentId}.epub`,
      {
        responseType: 'blob',
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
    try {
      const zip = new JSZip()
      await zip.loadAsync(data).then(async zip => {
        setSource(await zip.generateAsync({ type: 'arraybuffer' }))
      })
    } catch (error) {
      handleError(error)
    }
  }, [])

  useEffect(() => {
    if (authToken) {
      getFileFromS3(programContentId, authToken)
    }
  }, [authToken, programContentId, getFileFromS3])

  const sliderOnChange = (value: number) => {
    setChapter(getChapter(allLocations[value - 1]))
    onLocationChange(allLocations[value - 1])
    setCurrentPage(value)
  }

  return (
    <div>
      {source ? (
        <div style={{ marginTop: '-85vh', height: '85vh', position: 'relative', zIndex: '-1' }}>
          <ReactReader
            url={source}
            location={fakeLocation}
            locationChanged={async (loc: string) => {
              await fakeRendition.current?.next()
              setFakeLocation(loc)
              setTotalPage(t => t + 1)
              setAllLocations(prev => [...prev, loc])
              if (fakeRendition.current?.location.atEnd) {
                setCountingTotal(false)
              }
            }}
            getRendition={async (_rendition: Rendition) => {
              fakeRendition.current = _rendition
            }}
          />
        </div>
      ) : null}
      {source ? (
        <div style={{ height: '85vh' }}>
          <ReactReader
            url={source}
            showToc={false}
            tocChanged={_toc => (toc.current = _toc)}
            location={location}
            locationChanged={async (loc: string) => {
              const currentLocationIndex = allLocations.findIndex(l => l === loc) + 1
              setCurrentPage(currentLocationIndex)
              setChapter(getChapter(loc))
              onLocationChange(loc)

              if (rendition.current && toc.current) {
                const { href } = rendition.current.location.start
                const { displayed: displayedEnd } = rendition.current.location.end
                const totalPage = displayedEnd.total
                const currentEndPage = displayedEnd.page
                onEbookCurrentTocChange(getChapter(loc))
                try {
                  await apolloClient
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
            getRendition={(_rendition: Rendition) => {
              rendition.current = _rendition
            }}
          />
        </div>
      ) : null}

      <EbookReaderControlBar
        sliderOnChange={sliderOnChange}
        isCountingTotal={isCountingTotal}
        totalPage={totalPage}
        currentPage={currentPage}
        chapter={chapter}
        programContentBookmark={programContentBookmark}
        refetchBookmark={refetchBookmark}
        onLocationChange={onLocationChange}
      />

      <EbookReaderBookmarkIcon
        location={location}
        refetchBookmark={refetchBookmark}
        programContentId={programContentId}
        memberId={currentMemberId}
      />
    </div>
  )
}

const EbookReaderBookmarkIcon: React.VFC<{
  memberId: string | null
  programContentId: string
  location: string | number
  refetchBookmark: () => void
}> = ({ refetchBookmark, memberId, programContentId, location }) => {
  const apolloClient = useApolloClient()

  return (
    <Flex
      style={{
        marginTop: '-85vh',
        marginLeft: '95%',
        position: 'relative',
        width: 'fit-content',
        zIndex: '1',
      }}
      onClick={async () => {
        await apolloClient.mutate({
          mutation: insertProgramContentEbookBookmark,
          variables: {
            memberId,
            programContentId,
            epubCfi: location,
          },
        })
        await refetchBookmark()
      }}
    >
      <MarkIcon fill="#E2E2E2" />
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
  mutation InsertEbookBookmark($memberId: String!, $programContentId: uuid!, $epubCfi: String!) {
    insert_program_content_ebook_bookmark(
      objects: { member_id: $memberId, program_content_id: $programContentId, epub_cfi: $epubCfi }
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
