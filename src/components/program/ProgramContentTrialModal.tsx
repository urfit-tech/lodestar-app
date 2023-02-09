import { Modal } from 'antd'
import BraftEditor from 'braft-editor'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getFileDownloadableLink } from '../../helpers'
import { useProgramContent } from '../../hooks/program'
import AudioPlayer from '../common/AudioPlayer'
import ProgramContentPlayer from './ProgramContentPlayer'

const StyledModal = styled(Modal)`
  margin: 0;
  padding: 0;
  width: 100% !important;
  max-width: 720px;

  .ant-modal-content {
    padding-bottom: 24px;
  }

  .ant-modal-header {
    padding: 24px;
    border-bottom: none;
    font-weight: bold;
  }

  .ant-modal-title {
    font-size: 18px;
  }

  .ant-modal-body {
    max-height: 70vh;
    overflow-y: auto;
    padding: 0 24px;
  }

  .ant-modal-body > div:not(:last-child) {
    margin-bottom: 40px;
  }
`

type ProgramContentTrialModalProps = {
  render?: React.VFC<{
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
  }>
  programId: string
  programContentId: string
}
const ProgramContentTrialModal: React.VFC<ProgramContentTrialModalProps> = ({
  render,
  programId,
  programContentId,
  ...modalProps
}) => {
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const { programContent } = useProgramContent(programContentId)
  const [visible, setVisible] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()

  useEffect(() => {
    getFileDownloadableLink(`audios/${appId}/${programId}/${programContentId}`, authToken).then(url => {
      setAudioUrl(url)
    })
  }, [programContentId, programId])

  return (
    <>
      {render && render({ setVisible })}

      <StyledModal
        title={programContent && programContent.title}
        footer={null}
        visible={visible}
        centered
        destroyOnClose
        onCancel={() => {
          setVisible(false)
        }}
        {...modalProps}
      >
        {programContent && programContent.programContentBody && (
          <>
            {programContent.programContentBody.type === 'video' && (
              <ProgramContentPlayer programContentId={programContentId} />
            )}
            {programContent.programContentBody.type === 'audio' && (
              <AudioPlayer title={programContent.title} audioUrl={audioUrl} mode="preview" autoPlay />
            )}
            {!BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
              <BraftContent>{programContent.programContentBody.description}</BraftContent>
            )}
          </>
        )}
      </StyledModal>
    </>
  )
}

export default ProgramContentTrialModal
