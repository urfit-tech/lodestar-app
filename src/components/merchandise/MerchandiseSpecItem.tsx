import { useQuery } from '@apollo/react-hooks'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Divider, Menu, MenuButton, MenuItem, MenuList, Progress, Spinner } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { downloadFile, getFileDownloadableLink } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { CustomRatioImage } from '../common/Image'

const messages = defineMessages({
  download: { id: 'merchandise.ui.download', defaultMessage: '下載' },
  downloadAll: { id: 'merchandise.ui.downloadAll', defaultMessage: '全部下載' },
  isDownloading: { id: 'merchandise.ui.isDownloading', defaultMessage: '下載中' },
})

const StyledQuantity = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: 0.4px;
`

const MerchandiseSpecItem: React.VFC<{
  merchandiseSpecId: string
  quantity: number
  orderProductId: string
  orderProductFilenames?: string[]
}> = ({ merchandiseSpecId, quantity, orderProductId, orderProductFilenames = [] }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const { loadingMerchandiseSpec, merchandiseSpec } = useMerchandiseSpec(merchandiseSpecId)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  if (!appId || loadingMerchandiseSpec) {
    return <Spinner />
  }

  if (!merchandiseSpec) {
    return null
  }

  const files: {
    name: string
    from: string
  }[] = [
    ...merchandiseSpec.files.map(file => ({
      name: file.data.name,
      from: 'merchandise',
    })),
    ...orderProductFilenames.map(name => ({
      name,
      from: 'orderProduct',
    })),
  ]

  const handleDownload = async (index: number, type: 'single' | 'all') => {
    const fileKey =
      files[index].from === 'merchandise'
        ? `merchandise_files/${appId}/${merchandiseSpec.merchandise.id}_${files[index].name}`
        : `merchandise_files/${appId}/${orderProductId}_${files[index].name}`
    const fileLink = await getFileDownloadableLink(fileKey, authToken)
    const fileRequest = new Request(fileLink)
    try {
      const response = await fetch(fileRequest)
      setDownloadProgress(0)
      if (response.url) {
        await downloadFile(files[index].name, {
          url: response.url,
          onDownloadProgress: ({ loaded, total }) => {
            setDownloadProgress(Math.floor((loaded / total) * 100))
          },
        })
        if (type === 'single' || index === files.length - 1) {
          setIsDownloading(false)
          setDownloadProgress(0)
        }
      }
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error(error)
    }
  }
  const handleMenuItemClick = (index?: number) => {
    setIsDownloading(true)
    if (index !== undefined) {
      handleDownload(index, 'single')
    } else {
      const length = files.length
      for (let i = 0; i < length; i++) {
        handleDownload(i, 'all')
      }
    }
  }

  return (
    <div>
      <Divider className="mb-4" />

      <div className="d-flex align-items-center">
        <CustomRatioImage
          className="mr-3 flex-shrink-0"
          width="64px"
          ratio={1}
          src={merchandiseSpec.merchandise.coverUrl || EmptyCover}
          shape="rounded"
        />
        <div className="flex-grow-1">
          {merchandiseSpec.merchandise.title} - {merchandiseSpec.title}
        </div>

        {merchandiseSpec.merchandise.isPhysical && <StyledQuantity className="px-4">x{quantity}</StyledQuantity>}

        {files.length > 0 &&
          (isDownloading ? (
            <div className="d-flex align-items-center">
              <Progress className="mr-2" width="80px" value={downloadProgress} size="xs" colorScheme="green" />
              {downloadProgress}%
            </div>
          ) : (
            <div>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={isDownloading ? <Spinner size="sm" /> : <ChevronDownIcon />}
                  variant="outline"
                >
                  {formatMessage(messages.download)}
                </MenuButton>
                <MenuList>
                  {files.length > 1 && (
                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick()
                      }}
                    >
                      <b> {formatMessage(messages.downloadAll)}</b>
                    </MenuItem>
                  )}
                  {files.map((file, index) => (
                    <MenuItem
                      key={file.name}
                      onClick={() => {
                        handleMenuItemClick(index)
                      }}
                    >
                      {file.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          ))}
      </div>
    </div>
  )
}

const useMerchandiseSpec = (merchandiseSpecId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_MERCHANDISE_SPEC, hasura.GET_MERCHANDISE_SPECVariables>(
    gql`
      query GET_MERCHANDISE_SPEC($merchandiseSpecId: uuid!) {
        merchandise_spec_by_pk(id: $merchandiseSpecId) {
          id
          title
          merchandise_spec_files {
            id
            data
          }
          merchandise {
            id
            title
            is_physical
            merchandise_imgs(where: { type: { _eq: "cover" } }, limit: 1) {
              id
              url
            }
          }
        }
      }
    `,
    { variables: { merchandiseSpecId } },
  )

  const merchandiseSpec: {
    id: string
    title: string
    merchandise: {
      id: string
      title: string
      coverUrl: string | null
      isPhysical: boolean
    }
    files: {
      id: string
      data: any
    }[]
  } | null = data?.merchandise_spec_by_pk
    ? {
        id: data.merchandise_spec_by_pk.id,
        title: data.merchandise_spec_by_pk.title,
        merchandise: {
          id: data.merchandise_spec_by_pk.merchandise.id,
          title: data.merchandise_spec_by_pk.merchandise.title,
          coverUrl: data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]?.url || null,
          isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
        },
        files: data.merchandise_spec_by_pk.merchandise_spec_files.map(v => ({
          id: v.id,
          data: v.data,
        })),
      }
    : null

  return {
    loadingMerchandiseSpec: loading,
    errorMerchandiseSpec: error,
    merchandiseSpec,
    refetchMerchandiseSpec: refetch,
  }
}

export default MerchandiseSpecItem
