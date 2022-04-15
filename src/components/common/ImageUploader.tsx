import { Button, Icon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiOutlineUpload } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import FileUploader from './FileUploader'
import { CustomRatioImage } from './Image'

const StyledButton = styled(Button)<{ customButtonStyle?: { width?: string } }>`
  && {
    border-color: white;
    color: white;
    width: ${props => props?.customButtonStyle?.width};

    &:hover {
      border-color: var(--gray);
      color: var(--gray);
    }
  }
`

const StyledWrapper = styled.div<{ width?: string }>`
  position: relative;
  width: ${props => (props?.width ? props.width : '224px')};
`
const StyledMask = styled.div<{ width?: string; shape?: 'rounded' | 'circle' }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: all 0.6s;
  z-index: 1;
  opacity: 0;

  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : '4px'};
  width: ${props => props.width};
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.7);
  }
`

const ImageUploader: React.VFC<{
  file: File | null
  imgUrl?: string | null
  customStyle?: { shape?: 'rounded' | 'circle'; width?: string; ratio?: number }
  customButtonStyle?: { width: string }
  onChange?: (file: File) => void
}> = ({ file, imgUrl = null, customStyle, customButtonStyle, onChange }) => {
  const { formatMessage } = useIntl()
  const [imgSrc, setImgSrc] = useState<string | null>(imgUrl)

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const dataUrl = reader.result as string | null
        setImgSrc(dataUrl)
      }
    }
  }, [file])

  return (
    <StyledWrapper width={customStyle?.width ? customStyle.width : '224px'}>
      <CustomRatioImage
        width={customStyle?.width ? customStyle.width : '224px'}
        ratio={customStyle?.ratio ? customStyle.ratio : 9 / 16}
        src={imgSrc || EmptyCover}
        shape={customStyle?.shape ? customStyle.shape : 'rounded'}
      />
      <StyledMask
        className="d-flex justify-content-center align-items-center"
        width={customStyle?.width}
        shape={customStyle?.shape}
      >
        <FileUploader
          renderTrigger={({ onClick }) => (
            <StyledButton
              leftIcon={<Icon as={AiOutlineUpload} />}
              onClick={onClick}
              variant="outline"
              customButtonStyle={customButtonStyle}
            >
              {formatMessage(commonMessages.ui.uploadImage)}
            </StyledButton>
          )}
          accept="image/*"
          onChange={([file]) => onChange?.(file)}
          fileList={file ? [file] : []}
        />
      </StyledMask>
    </StyledWrapper>
  )
}

export default ImageUploader
