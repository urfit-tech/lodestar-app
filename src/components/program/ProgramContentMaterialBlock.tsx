import { AttachmentIcon } from '@chakra-ui/icons'
import { IconButton, Progress } from '@chakra-ui/react'
import { Spin } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { byteToSize, downloadFile, getFileDownloadableLink, getFileExtension, getFileName } from '../../helpers'
import { useProgramContentMaterial } from '../../hooks/program'
import { ReactComponent as DownloadIcon } from '../../images/download.svg'
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
const ProgramContentMaterialBlock: React.VFC<{
  programContentId: string
}> = ({ programContentId }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const {
    loading: loadingProgramContentMaterials,
    error: errorProgramContentMaterials,
    data: programContentMaterials,
  } = useProgramContentMaterial(programContentId)
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({})
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({})

  const charLimit = window.innerWidth >= BREAK_POINT ? 50 : 20

  return (
    <>
      {loadingProgramContentMaterials ? (
        <Spin />
      ) : errorProgramContentMaterials || !programContentMaterials ? (
        formatMessage(programMessages.ProgramContentMaterialBlock.loadingMaterialError)
      ) : (
        programContentMaterials
          .filter(material => material.data.name)
          .map(material => (
            <StyledMaterial
              key={material.id}
              className="mb-3"
              onClick={async () => {
                setIsDownloading(prev => ({ ...prev, [material.id]: true }))
                const fileKey = `materials/${appId}/${programContentId}_${material.data.name}`
                const materialLink = await getFileDownloadableLink(fileKey, authToken)
                const materialRequest = new Request(materialLink)
                try {
                  const response = await fetch(materialRequest)
                  response.url &&
                    downloadFile(material.data.name, {
                      url: response.url,
                      onDownloadProgress: ({ loaded, total }) => {
                        setDownloadProgress(prev => ({
                          ...prev,
                          [material.id]: Math.floor((loaded / total) * 100),
                        }))
                      },
                    }).then(() => {
                      setIsDownloading(prev => ({ ...prev, [material.id]: false }))
                    })
                } catch (error) {
                  process.env.NODE_ENV === 'development' && console.error(error)
                }
              }}
            >
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
                  <StyledDataSize>{`(${byteToSize(material.data.size ?? 0)})`}</StyledDataSize>
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
          ))
      )}
    </>
  )
}

export default ProgramContentMaterialBlock
