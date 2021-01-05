import { AttachmentIcon, DownloadIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { message, Spin } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { byteToSize, downloadFile, getFileDownloadableLink } from '../../helpers'
import { programMessages } from '../../helpers/translation'
import { useProgramContentMaterial } from '../../hooks/program'
import { useAuth } from '../auth/AuthContext'
import { BREAK_POINT } from '../common/Responsive'

const StyledMaterial = styled.div`
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;

  &:hover {
    border-color: ${props => props.theme['@primary-color']};
    & > button > svg {
      color: ${props => props.theme['@primary-color']};
    }
  }

  & > button > svg {
    cursor: pointer;
    font-size: 1.5rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    & > button > svg {
      font-size: 20px;
    }
  }
`
const ProgramContentMaterialBlock: React.FC<{
  programContentId: string
}> = ({ programContentId }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, apiHost } = useAuth()
  const { loading, programContentMaterials, error } = useProgramContentMaterial(programContentId)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  return (
    <>
      {loading ? (
        <Spin />
      ) : error || !programContentMaterials ? (
        formatMessage(programMessages.status.loadingMaterialError)
      ) : (
        programContentMaterials.map(material => (
          <StyledMaterial key={material.id} className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <AttachmentIcon className="mr-2" />
              <span className="mr-2">{material.data.name}</span>
              <span>{`(${byteToSize(material.data.size)})`}</span>
            </div>
            <IconButton
              aria-label="download"
              variant="download"
              icon={<DownloadIcon />}
              isLoading={isDownloading}
              onClick={async () => {
                setIsDownloading(true)
                const fileKey = `materials/${appId}/${programContentId}_${material.data.name}`
                const materialLink = await getFileDownloadableLink(fileKey, authToken, apiHost)
                const materialRequest = new Request(materialLink)
                try {
                  const response = await fetch(materialRequest)
                  response.url &&
                    downloadFile(response.url, material.data.name).then(() => {
                      setIsDownloading(false)
                    })
                } catch (error) {
                  message.error(error)
                }
              }}
            />
          </StyledMaterial>
        ))
      )}
    </>
  )
}

export default ProgramContentMaterialBlock
