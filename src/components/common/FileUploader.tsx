import { Button, Icon } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { AiOutlineUpload } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'

const FileUploader: React.FC<{
  value?: File[]
  onChange?: (value: File[]) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={e => {
          if (!e.target.files || !e.target.files.length || !onChange) {
            return
          }

          // append new file into input value
          const files: File[] = value?.slice() || []
          for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i)
            file && !files.some(v => v.name === file.name) && files.push(file)
          }

          onChange(files)
          e.target.value = ''
          e.target.files = null
        }}
      />

      <Button leftIcon={<Icon as={AiOutlineUpload} />} onClick={() => inputRef.current?.click()} variant="outline">
        {formatMessage(commonMessages.ui.uploadFile)}
      </Button>
    </>
  )
}

export default FileUploader
