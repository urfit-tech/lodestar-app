import { Box, Text } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import AudioPlayer from '../../../../components/common/AudioPlayer'
import ProgramContentPlayer from '../../../../components/program/ProgramContentPlayer'
import { getFileDownloadableLink } from '../../../../helpers'
import { useProgramContentById } from '../../../../hooks/program'
import { ProgramContent } from '../../../../types/program'
import ProgramPageMessages from '../../translation'
import { colors } from '../style'

const HeaderWrapper = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (min-width: ${BREAK_POINT}px) {
    align-items: end;
  }
`

const SubTitle = styled(Text)`
  font-size: 16px;
  font-color: ${colors.teal};
  text-align: center;
  font-weight: bold;
`

const ControlButton = styled(Box)<{ disable: boolean }>`
  font-size: 14px;
  color: ${props => (props.disable ? colors.teal3 : colors.teal2)};
  display: flex;
  justify-content: center;
  align-items: center;
`

const PreviewPlayer: React.FC<{
  trialProgramContentMedias?: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}> = ({ trialProgramContentMedias }) => {
  const [currentTrial, setCurrentTrial] = useState<number>(0)
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const { formatMessage } = useIntl()
  const {
    id: programContentId,
    contentSectionTitle,
    contentType,
    programId,
  } = trialProgramContentMedias?.[currentTrial] || {}
  const { programContent } = useProgramContentById(programId || '', programContentId || '')
  const [audioUrl, setAudioUrl] = useState<string>()

  useEffect(() => {
    getFileDownloadableLink(`audios/${appId}/${programId}/${programContentId}`, authToken).then(url => {
      setAudioUrl(url)
    })
  }, [appId, authToken, programContentId, programId])

  if (!programContent || !trialProgramContentMedias || !programContentId) {
    return null
  }

  return (
    <>
      <HeaderWrapper>
        <ControlButton
          disable={currentTrial === 0}
          cursor="pointer"
          onClick={() => {
            if (currentTrial === 0) return
            setCurrentTrial(c => c - 1)
          }}
        >
          <FaChevronDown style={{ transform: 'rotate(90deg)' }} className="m-1" />
          {formatMessage(ProgramPageMessages.PreviewBlock.previous)}
        </ControlButton>
        <Box>
          <SubTitle>{contentSectionTitle}</SubTitle>
        </Box>
        <ControlButton
          disable={currentTrial === trialProgramContentMedias.length - 1}
          cursor="pointer"
          onClick={() => {
            if (currentTrial === trialProgramContentMedias.length - 1) return
            setCurrentTrial(c => c + 1)
          }}
        >
          {formatMessage(ProgramPageMessages.PreviewBlock.next)}
          <FaChevronDown style={{ transform: 'rotate(270deg)' }} className="m-1" />
        </ControlButton>
      </HeaderWrapper>
      {contentType === 'video' && <ProgramContentPlayer programContentId={programContentId} autoPlay={false} />}
      {contentType === 'audio' && (
        <AudioPlayer title={programContent.title} audioUrl={audioUrl} mode="preview" autoPlay={false} />
      )}
    </>
  )
}

export default PreviewPlayer
