import { message } from 'antd'
import { RcFile } from 'antd/lib/upload'
import axios, { AxiosRequestConfig } from 'axios'
import moment from 'moment'
import queryString from 'query-string'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { css, FlattenSimpleInterpolation } from 'styled-components'
import { v4 as uuid } from 'uuid'
import { BREAK_POINT } from '../components/common/Responsive'
import { ApiResponse } from '../types/general'
import { helperMessages } from './translation'

export const TPDirect = (window as any)['TPDirect']

export const getBase64 = (img: File, callback: (result: FileReader['result']) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const validateImage = (file: RcFile, fileSize?: number) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { formatMessage } = useIntl()
  const isImage = file.type.startsWith('image')
  if (!isImage) {
    message.error(helperMessages.messages.imageFormatError)
  }
  const size = fileSize || 2 * 1024 * 1024
  const inSize = file.size < size
  if (!inSize) {
    message.error(`
    ${formatMessage(helperMessages.messages.imageSizeError)}
     ${(size / 1024 / 1024).toFixed(0)}MB`)
  }
  return isImage && inSize
}

export const uploadFile = async (
  key: string,
  file: File | null,
  authToken: string | null,
  config?: AxiosRequestConfig,
) => {
  let signedUrl = ''
  file &&
    (await axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/sys/sign-url`,
        {
          operation: 'putObject',
          params: {
            Key: key,
            ContentType: file.type,
          },
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(res => {
        signedUrl = res.data.result
        return res.data.result
      })
      .then(url => {
        const { query } = queryString.parseUrl(url)
        return axios.put<{ status: number; data: string }>(url, file, {
          ...config,
          headers: {
            ...query,
            'Content-Type': file.type,
          },
        })
      }))
  return signedUrl
}

export const getFileDownloadableLink = async (key: string, authToken: string | null) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_BASE_ROOT}/sys/sign-url`,
    {
      operation: 'getObject',
      params: {
        Key: key,
      },
    },
    {
      headers: { authorization: `Bearer ${authToken}` },
    },
  )
  return data.result as string
}

export const downloadFile = async (fileName: string, config: AxiosRequestConfig) =>
  await axios({
    ...config,
    method: 'GET',
    responseType: 'blob',
  }).then((response: any) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  })

export const commaFormatter = (value?: number | string | null) =>
  value !== null && value !== undefined && `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const dateFormatter = (value: Date, format?: string) => moment(value).format(format || `YYYY/MM/DD HH:mm`)

export const dateRangeFormatter: (props: {
  startedAt: Date
  endedAt: Date
  dateFormat?: string
  timeFormat?: string
}) => string = ({ startedAt, endedAt, dateFormat = 'YYYY-MM-DD(dd)', timeFormat = 'HH:mm' }) => {
  const startedMoment = moment(startedAt)
  const endedMoment = moment(endedAt)
  const isInSameDay = startedMoment.format('YYYY/MM/DD') === endedMoment.format('YYYY/MM/DD')

  return 'STARTED_DATE STARTED_TIME ~ ENDED_DATE ENDED_TIME'
    .replace('STARTED_DATE', startedMoment.format(dateFormat))
    .replace('STARTED_TIME', startedMoment.format(timeFormat))
    .replace('ENDED_DATE', isInSameDay ? '' : endedMoment.format(dateFormat))
    .replace('ENDED_TIME', endedMoment.format(timeFormat))
    .replace(/  +/g, ' ')
}

export const durationFormatter = (value?: number | null) => {
  return typeof value === 'number' && `約 ${(value / 60).toFixed(0)} 分鐘`
}

export const durationFullFormatter = (seconds: number) => {
  if (seconds >= 3600) {
    const remainSeconds = seconds % 3600
    return `HOURS:MINUTES:SECONDS`
      .replace('HOURS', `${Math.floor(seconds / 3600)}`.padStart(2, '0'))
      .replace('MINUTES', `${Math.floor(remainSeconds / 60)}`.padStart(2, '0'))
      .replace('SECONDS', `${Math.floor(remainSeconds % 60)}`.padStart(2, '0'))
  } else {
    return `MINUTES:SECONDS`
      .replace('MINUTES', `${Math.floor(seconds / 60)}`.padStart(2, '0'))
      .replace('SECONDS', `${Math.floor(seconds % 60)}`.padStart(2, '0'))
  }
}

export const braftLanguageFn = (languages: { [lan: string]: any }, context: any) => {
  if (context === 'braft-editor') {
    languages['zh-hant'].controls.normal = '內文'
    return languages['zh-hant']
  }
}

export const getNotificationIconType = (type: string) => {
  switch (type) {
    case 'message':
      return 'message'
    case 'payment':
      return 'dollar'
    case 'content':
      return 'book'
    case 'reaction':
      return 'heart'
    default:
      return 'question'
  }
}

export const rgba = (hexCode: string, alpha: number) => {
  const hexColor = (hexCode || '#2d313a').replace('#', '')
  const r = parseInt(hexColor.slice(0, 2), 16)
  const g = parseInt(hexColor.slice(2, 4), 16)
  const b = parseInt(hexColor.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const hexToHsl = (hexCode: string) => {
  const hexColor = (hexCode || '#2d313a').replace('#', '')
  const r = parseInt(hexColor.slice(0, 2), 16) / 255
  const g = parseInt(hexColor.slice(2, 4), 16) / 255
  const b = parseInt(hexColor.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)

  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0)
    } else if (max === g) {
      h = (b - r) / d + 2
    } else {
      h = (r - g) / d + 4
    }
    h /= 6
  }
  s = s * 100
  s = Math.round(s)
  l = l * 100
  l = Math.round(l)
  h = Math.round(360 * h)
  return { h: h, s: s, l: l }
}

export const snakeToCamel = (snakeValue: string) =>
  snakeValue.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''))

export const handleError = (error: any) => {
  process.env.NODE_ENV === 'development' && console.error(error)
  if (error.response && error.response.data) {
    return message.error(error.response.data.message)
  }
  return message.error(error.message)
}

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined
}

export const camelCaseToDash = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
export const camelCaseToSnake = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}
export const getUserRoleLevel = (userRole?: string) => {
  switch (userRole) {
    case 'anonymous':
      return 0
    case 'general-member':
      return 1
    case 'content-creator':
      return 2
    case 'app-owner':
      return 3
    default:
      return -1
  }
}

export const desktopViewMixin = (children: FlattenSimpleInterpolation) => css`
  @media (min-width: ${BREAK_POINT}px) {
    ${children}
  }
`

export const createUploadFn = (appId: string, authToken: string | null) => {
  return async (params: {
    file: File
    success: (res: {
      url: string
      meta: {
        id: string
        title: string
        alt: string
        loop: boolean
        autoPlay: boolean
        controls: boolean
        poster: string
      }
    }) => void
  }) => {
    uploadFile(`images/${appId}/editor/${uuid()}`, params.file, authToken).then(signedUrl => {
      params.success({
        url: signedUrl.split('?')[0],
        meta: {
          id: '',
          title: '',
          alt: '',
          loop: false,
          autoPlay: false,
          controls: false,
          poster: '',
        },
      })
    })
  }
}

export const shippingMethodFormatter = (value?: string) => {
  switch (value) {
    case 'home-delivery':
      return '宅配'
    case 'seven-eleven':
      return '7-11 超商取貨'
    case 'family-mart':
      return '全家超商取貨'
    case 'hi-life':
      return '萊爾富超商取貨'
    case 'ok-mart':
      return 'OK 超商取貨'
    default:
      return '未知配送方式'
  }
}

export const isUUIDv4 = (uuid: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

export const byteToSize = (bytes: String | number) => {
  if (bytes === 0) return '0B'
  const k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(Number(bytes)) / Math.log(k))
  return `${(Number(bytes) / Math.pow(k, i)).toPrecision(3)}${sizes[i]}`
}

export const getFileName = (fileName: String) => {
  return fileName.substr(0, fileName.lastIndexOf('.'))
}

export const getFileExtension = (fileName: String) => {
  return fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length)
}

export const isHTMLString = (str: string) =>
  !(str || '')
    // replace html tag with content
    .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
    // remove remaining self closing tags
    .replace(/(<([^>]+)>)/gi, '')
    // remove extra space at start and end
    .trim()

export const useOnceAnimation = () => {
  const ref = useRef<HTMLImageElement>(null)
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    if (ref.current === null || activated) {
      return
    }

    const element = ref.current
    const observer = new IntersectionObserver(entries => entries.forEach(v => v.isIntersecting && setActivated(true)))
    observer.observe(element)

    return () => observer.unobserve(element)
  }, [activated])

  return { ref, activated }
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const hasJsonStructure = (data: string) => {
  try {
    JSON.parse(data)
  } catch (error) {
    return false
  }
  return true
}

export const getBraftContent = (data: string) => {
  if (hasJsonStructure(data)) {
    const json = JSON.parse(data)
    if (json.blocks) {
      return json.blocks
        .map((block: any) => block.text)
        .join('')
        .substring(0, 5000)
    }
    return ''
  }
  return decodeHtmlEntities(data)
}

export const decodeHtmlEntities = (data: string) => {
  const entityTables: { [key: string]: string } = {
    '&nbsp;': '\u00a0',
    '&darr;': '\u2193',
    '&hellip;': '\u2026',
  }

  const entitiesReg = /&([^&;]{2,});?/g
  return data.replace(/(<([^>]+)>)/gi, '').replace(entitiesReg, match => {
    if (entityTables.hasOwnProperty(match)) {
      return entityTables[match]
    }
    return match
  })
}

export const getRedeemLink = async (
  type: 'Voucher',
  target: string,
  authToken: string | null,
  config?: AxiosRequestConfig,
) =>
  await axios.request<ApiResponse<{ link: string }>>({
    ...config,
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_ROOT}/discount/get-redeem-link`,
    data: {
      type,
      target,
    },
    headers: { authorization: `Bearer ${authToken}` },
  })
