import axios from 'axios'
import { useCallback, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import type { NavItem } from 'epubjs'

const ProgramContentEbookReader: React.VFC<{
  programContentId: string
  location: string | number
  onLocationChange: (location: string | number) => void
}> = ({ programContentId, location, onLocationChange }) => {
  const toc = useRef<NavItem[]>([])
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
        tocChanged={_toc => (toc.current = _toc)}
        location={location}
        locationChanged={(loc: string) => {
          onLocationChange(loc)
        }}
      />
    </div>
  )
}

export default ProgramContentEbookReader
