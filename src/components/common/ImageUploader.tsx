import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import FileUploader from './FileUploader'
import { CustomRatioImage } from './Image'

const StyledWrapper = styled.div`
  position: relative;

  width: 224px;
`
const StyledMask = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 4px;
  transition: background 0.6s;
  z-index: 1;
  opacity: 0;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.7);
  }
`

const ImageUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  const handleChange = (value: File[]) => setFiles(value)

  useEffect(() => {
    const [file] = files
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImgSrc(reader.result as string | null)
      }
    }
  }, [files])

  return (
    <StyledWrapper>
      <CustomRatioImage width="224px" ratio={9 / 16} src={imgSrc || EmptyCover} shape="rounded" />
      <StyledMask className="d-flex justify-content-center align-items-center">
        <FileUploader fileList={files} onChange={handleChange} />
      </StyledMask>
    </StyledWrapper>
  )
}

export default ImageUploader
