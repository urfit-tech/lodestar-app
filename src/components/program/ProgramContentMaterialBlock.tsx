import { AttachmentIcon } from '@chakra-ui/icons'
import { IconButton, Progress, useToast } from '@chakra-ui/react'
import { Spin } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { byteToSize, downloadFile, getFileDownloadableLink, getFileExtension, getFileName } from '../../helpers'
import { useMutateMaterialAuditLog, useProgramContentMaterial } from '../../hooks/program'
import { ReactComponent as DownloadIcon } from '../../images/download.svg'
import { ProgramContentMaterial } from '../../types/program'
import { BREAK_POINT } from '../common/Responsive'
import programMessages from './translation'

const StyledMaterial = styled.div`
  cursor: pointer;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;

  &:hover {
    border-color: ${props => props.theme['@primary-color']};
    & > button > svg > path {
      fill: ${props => props.theme['@primary-color']};
    }
  }

  & > button > svg {
    font-size: 1.5rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    & > button > svg {
      font-size: 20px;
    }
  }
`
const StyledFileName = styled.div`
  font-size: 14px;
`
const StyledDataName = styled.span`
  color: var(--gray-darker);
`
const StyledFileExtension = styled.span`
  display: inline-block;
`
const StyledDataSize = styled.span`
  color: var(--gray-dark);
`
const ProgramContentMaterialBlock: React.FC<{
  programContentId: string
  programId: string
}> = ({ programContentId, programId }) => {
  const toast = useToast()
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const { programContentMaterials, loadingProgramContentMaterials, errorProgramContentMaterials } =
    useProgramContentMaterial(programId)
  const { insertMaterialAuditLog } = useMutateMaterialAuditLog()
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({})
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({})

  const charLimit = window.innerWidth >= BREAK_POINT ? 50 : 20

  const handleDownloadMaterial = async (material: ProgramContentMaterial) => {
    try {
      const res = await insertMaterialAuditLog({
        variables: {
          data: { member_id: currentMemberId, target: material.id, action: 'download' },
        },
      })
      if (res.data?.insert_material_audit_log_one?.id) {
        const url = material.data.url && new URL(material.data.url)
        if (url) {
          window.open(material.data.url)
          return
        }
        setIsDownloading(prev => ({ ...prev, [material.id]: true }))
        try {
          const materialLink = await getFileDownloadableLink(
            `materials/${appId}/${programContentId}_${material.data.name}`,
            authToken,
          )

          const response = await axios.get(materialLink, {
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
              const { loaded, total } = progressEvent
              setDownloadProgress(prev => ({
                ...prev,
                [material.id]: Math.floor((loaded / total) * 100),
              }))
            },
          })

          if (response.data) {
            downloadFile(material.data.name, { url: response.request.responseURL }).then(() => {
              setIsDownloading(prev => ({ ...prev, [material.id]: false }))
            })
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(error)
          }
          setIsDownloading(prev => ({ ...prev, [material.id]: false }))
        }
      }
    } catch (error) {
      toast({
        title: 'Download material failed.',
        status: 'error',
        duration: 3000,
        isClosable: false,
        position: 'top',
      })
    }
  }
  return (
    <>
      {loadingProgramContentMaterials ? (
        <Spin />
      ) : errorProgramContentMaterials || !programContentMaterials ? (
        formatMessage(programMessages.ProgramContentMaterialBlock.loadingMaterialError)
      ) : (
        programContentMaterials
          .map(material => ({
            ...material,
            data: {
              ...material.data,
              name: material.data?.name || formatMessage(programMessages.ProgramContentMaterialBlock.attachment),
            },
          }))
          .map(
            material =>
              material.programContentId === programContentId && (
                <StyledMaterial key={material.id} className="mb-3" onClick={() => handleDownloadMaterial(material)}>
                  <div className="d-flex align-items-center justify-content-between">
                    <AttachmentIcon className="flex-shrink-0 mr-2" />
                    <StyledFileName className="flex-grow-1">
                      <StyledDataName>
                        {getFileName(material.data.name).length >= charLimit
                          ? `${getFileName(material.data.name).substring(0, charLimit)}..`
                          : getFileName(material.data.name).substring(0, charLimit)}
                      </StyledDataName>
                      <StyledFileExtension className="mr-2">{`.${getFileExtension(
                        material.data.name,
                      )}`}</StyledFileExtension>
                      {material.data.size && (
                        <StyledDataSize>{`(${byteToSize(material.data.size ?? 0)})`}</StyledDataSize>
                      )}
                    </StyledFileName>

                    <IconButton
                      aria-label="download"
                      variant="download"
                      icon={<DownloadIcon />}
                      isLoading={!!isDownloading[material.id]}
                      className="flex-shrink-0"
                    />
                  </div>
                  {isDownloading[material.id] && (
                    <Progress value={downloadProgress[material.id] || 0} size="xs" colorScheme="green" />
                  )}
                </StyledMaterial>
              ),
          )
      )}
    </>
  )
}

export default ProgramContentMaterialBlock
