import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import type { Contents, Rendition } from 'epubjs'

const ProgramContentEbookReader: React.VFC<{ programContentId: string }> = () => {
  const rendition = useRef<Rendition | undefined>(undefined)
  const [location, setLocation] = useState<string | number>(0)
  const [source, setSource] = useState<ArrayBuffer | null>(null)

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
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition
          _rendition.hooks.content.register((contents: Contents) => {
            const body = contents.window.document.querySelector('body')
            if (body) {
              body.oncontextmenu = () => {
                return false
              }
            }
          })
        }}
      />
    </div>
  )
}

export default ProgramContentEbookReader
