import { Button, message, Spin, Upload } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import axios, { Canceler } from 'axios'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { uploadFile } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useAuth } from '../auth/AuthContext'

const SingleUploader: React.VFC<
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
  const uploadCanceler = useRef<Canceler>()
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
          onSuccess ? onSuccess(info) : message.success(`${info.file.name} 上傳成功`)
        } else if (info.file.status === 'error') {
          onError ? onError(info) : message.error(`${info.file.name} 上傳失敗`)
        }
      }
    },
    onRemove: () => {
      setLoading(false)
      onCancel && onCancel()
      onChange && onChange(undefined)
      uploadCanceler.current && uploadCanceler.current()
    },
    customRequest: (option: any) => {
      const { file, onProgress, onError, onSuccess } = option
      setLoading(true)
      onChange && onChange(file)
      uploadFile(path, file, authToken, {
        onUploadProgress: progressEvent => {
          onProgress({
            percent: (progressEvent.loaded / progressEvent.total) * 100,
          })
        },
        cancelToken: new axios.CancelToken(canceler => {
          uploadCanceler.current = canceler
        }),
      })
        .then(onSuccess)
        .catch(onError)
    },
  }
  return (
    <Upload {...props}>
      {trigger ? (
        trigger({ loading, value })
      ) : loading ? (
        <div>
          <Spin />
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
