import axios from 'axios'
import { useCallback, useRef } from 'react'
import { ReactReader } from 'react-reader'
import type { NavItem, Rendition } from 'epubjs'
import { gql, useApolloClient } from '@apollo/client'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'

const ProgramContentEbookReader: React.VFC<{
  programContentId: string
  ebookCurrentToc: string | null
  onEbookCurrentTocChange: (toc: string | null) => void
  location: string | number
  onLocationChange: (location: string | number) => void
}> = ({ programContentId, ebookCurrentToc, onEbookCurrentTocChange, location, onLocationChange }) => {
  const apolloClient = useApolloClient()
  const rendition = useRef<Rendition | undefined>(undefined)
  const toc = useRef<NavItem[]>([])
  const { currentMemberId } = useAuth()

  const convertFileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.addEventListener('loadend', e => {
        if (e.target && e.target.result) {
          resolve(e.target.result as ArrayBuffer)
        } else {
          reject(new Error('convert file to array buffer failed'))
        }
      })
      reader.addEventListener('error', reject)
      reader.readAsArrayBuffer(file)
    })
  }

  const getFileFromS3 = useCallback(async (key: string): Promise<ArrayBuffer> => {
    const response = await axios.get(`https://${process.env.REACT_APP_S3_BUCKET}/${key}`, {
      responseType: 'blob',
    })
    return convertFileToArrayBuffer(response.data)
  }, [])

  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url={`https://${process.env.REACT_APP_S3_BUCKET}/images/demo/ebook_test/7B_2048試閱本版本號3.0.epub`}
        showToc={false}
        tocChanged={_toc => (toc.current = _toc)}
        location={location}
        locationChanged={async (loc: string) => {
          const RegexToc = /\[([^\]]+)\]/
          const tocMatch = loc.match(RegexToc)
          if (rendition.current && toc.current && tocMatch && tocMatch[1]) {
            const { href } = rendition.current.location.start
            const { displayed: displayedEnd } = rendition.current.location.end
            const totalPage = displayedEnd.total
            const currentEndPage = displayedEnd.page
            onEbookCurrentTocChange(tocMatch[1])
            try {
              await apolloClient
                .query({
                  query: GetProgramContentEbookToc,
                  variables: { programContentId, href: `${href}#${tocMatch[1]}` },
                })
                .then(async ({ data }) => {
                  if (data.program_content_ebook_toc.length > 0) {
                    const programContentEbookTocId = data.program_content_ebook_toc[0].id
                    await apolloClient.mutate({
                      mutation: UpsertEbookTocProgress,
                      variables: {
                        memberId: currentMemberId,
                        programContentEbookTocId,
                        latestProgress: currentEndPage / totalPage > 1 ? 1 : (currentEndPage / totalPage).toFixed(5),
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
          onLocationChange(loc)
        }}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition
        }}
      />
    </div>
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

export default ProgramContentEbookReader
