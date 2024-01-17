import { gql, useApolloClient } from '@apollo/client'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import type { NavItem, Rendition } from 'epubjs'

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
  const { id: appId } = useApp()

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
  const decryptData = (encryptedData: ArrayBuffer, keyHex: string, ivHex: string): ArrayBuffer => {
    const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedData as unknown as number[])
    const hashKey = keyHex.length < 64 ? keyHex.padEnd(64, '0') : keyHex
    const hashIv = ivHex.length < 32 ? ivHex.padEnd(32, '0') : ivHex

    const salt = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_EBOOK_SALT as string)
    const iterations = Number(process.env.REACT_APP_EBOOK_ITERATION)
    const key = CryptoJS.PBKDF2(hashKey, salt, {
      keySize: 256 / 32,
      iterations: iterations,
    })
    const iv = CryptoJS.PBKDF2(hashIv, salt, {
      keySize: 128 / 32,
      iterations: iterations,
    })

    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedWordArray)

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedWords = decrypted.words
    const decryptedBytes = new Uint8Array(decryptedWords.length * 4)
    for (let i = 0; i < decryptedWords.length; i++) {
      decryptedBytes[i * 4] = (decryptedWords[i] >> 24) & 0xff
      decryptedBytes[i * 4 + 1] = (decryptedWords[i] >> 16) & 0xff
      decryptedBytes[i * 4 + 2] = (decryptedWords[i] >> 8) & 0xff
      decryptedBytes[i * 4 + 3] = decryptedWords[i] & 0xff
    }

    return decryptedBytes.buffer
  }

  const getFileFromS3 = useCallback(async (programContentId, authToken) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/ebook/${programContentId}.epub`,
        {
          responseType: 'arraybuffer',
          headers: { authorization: `Bearer ${authToken}` },
        },
      )

      let hashKey = ''
      const parts = authToken.split('.')
      if (parts.length === 3) {
        hashKey = parts[2]
      }

      const decryptedData = decryptData(response.data, hashKey, 'demo')

      console.log(decryptedData)

      setSource(decryptedData)
    } catch (error) {
      console.log(error)
      handleError(error)
    }
  }, [])

  useEffect(() => {
    if (authToken) {
      getFileFromS3(programContentId, authToken)
    }
  }, [authToken, programContentId, getFileFromS3])

  return (
    <div style={{ height: '100vh' }}>
      {source ? (
        <ReactReader
          url={source}
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
      ) : null}
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
