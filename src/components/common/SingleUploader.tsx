import { Spinner } from '@chakra-ui/spinner'
import { Button, message, Upload } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { uploadFile } from '../../helpers'
import { commonMessages } from '../../helpers/translation'

const SingleUploader: React.FC<
  UploadProps & {
    path: string
    value?: UploadFile
    isPublic?: boolean
    onChange?: (value?: UploadFile) => void
    trigger?: (props: { loading: boolean; value?: UploadFile }) => React.ReactNode
    uploadText?: string
    reUploadText?: string
    onCancel?: () => void
    onUploading?: (info: UploadChangeParam<UploadFile>) => void
    onSuccess?: (info: UploadChangeParam<UploadFile>) => void
    onError?: (info: UploadChangeParam<UploadFile>) => void
  }
> = ({
  path,
  value,
  onChange,
  trigger,
  uploadText,
  reUploadText,
  onUploading,
  onSuccess,
  onError,
  onCancel,
  isPublic,
  ...uploadProps
}) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const uploadAbortController = useRef<AbortController>()
  const [loading, setLoading] = useState(false)

  const props: UploadProps = {
    ...uploadProps,
    fileList: value ? [value] : [],
    onChange: info => {
      onChange && onChange(info.file)
      if (info.file.status === 'uploading') {
        onUploading && onUploading(info)
      } else {
        setLoading(false)
        if (info.file.status === 'done') {
          onSuccess
            ? onSuccess(info)
            : message.success(`${info.file.name} ${formatMessage(commonMessages.event.successfullyUpload)}`)
        } else if (info.file.status === 'error') {
          onError
            ? onError(info)
            : message.error(`${info.file.name} ${formatMessage(commonMessages.status.uploadError)}`)
        }
      }
    },
    onRemove: () => {
      setLoading(false)
      onCancel && onCancel()
      onChange && onChange(undefined)
      uploadAbortController.current?.abort()
      uploadAbortController.current = undefined
    },
    customRequest: (option: any) => {
      const { file, onProgress, onError, onSuccess } = option
      const abortController = new AbortController()
      uploadAbortController.current = abortController
      setLoading(true)
      onChange && onChange(file)
      uploadFile(path, file, authToken, {
        onUploadProgress: progressEvent => {
          const total = progressEvent.total || file.size || 0
          onProgress({
            percent: total ? (progressEvent.loaded / total) * 100 : 0,
          })
        },
        signal: abortController.signal,
      })
        .then(onSuccess)
        .catch((error: Error) => {
          if (!abortController.signal.aborted) {
            onError(error)
          }
        })
        .finally(() => {
          if (uploadAbortController.current === abortController) {
            uploadAbortController.current = undefined
          }
        })
    },
  }
  return (
    <Upload {...props}>
      {trigger ? (
        trigger({ loading, value })
      ) : loading ? (
        <div>
          <Spinner />
          <div style={{ color: '#585858' }}>{formatMessage(commonMessages.status.uploading)}</div>
        </div>
      ) : (
        <Button icon="upload" loading={loading} disabled={loading}>
          {value
            ? reUploadText || formatMessage(commonMessages.button.reupload)
            : uploadText || formatMessage(commonMessages.ui.upload)}
        </Button>
      )}
    </Upload>
  )
}

export default SingleUploader
