import { useQuery } from '@apollo/react-hooks'
import { Divider } from '@chakra-ui/react'
import { Button, Spin } from 'antd'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import hasura from '../../hasura'
import { downloadFile, getFileDownloadableLink } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { useAuth } from '../auth/AuthContext'
import { CustomRatioImage } from '../common/Image'

const messages = defineMessages({
  download: { id: 'merchandise.ui.download', defaultMessage: '下載' },
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

  if (!appId || loadingMerchandiseSpec) {
    return <Spin />
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

  return (
    <div>
      <Divider />

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

        {files.length > 0 && (
          <Button
            loading={isDownloading}
            onClick={async () => {
              setIsDownloading(true)
              let counter = 0
              files.forEach(async file => {
                const fileKey =
                  file.from === 'merchandise'
                    ? `merchandise_files/${appId}/${merchandiseSpec.merchandise.id}_${file.name}`
                    : `merchandise_files/${appId}/${orderProductId}_${file.name}`
                const fileLink = await getFileDownloadableLink(fileKey, authToken)
                const fileRequest = new Request(fileLink)

                try {
                  const response = await fetch(fileRequest)

                  response.url &&
                    downloadFile(file.name, { url: response.url }).then(() => {
                      counter += 1
                      counter === files.length && setIsDownloading(false)
                    })
                } catch (error) {
                  process.env.NODE_ENV === 'development' && console.error(error)
                }
              })
            }}
          >
            {isDownloading ? formatMessage(messages.isDownloading) : formatMessage(messages.download)}
          </Button>
        )}
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
