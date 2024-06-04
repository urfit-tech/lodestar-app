import { Box, Text } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import styled from 'styled-components'
import AudioPlayer from '../../../../components/common/AudioPlayer'
import ProgramContentPlayer from '../../../../components/program/ProgramContentPlayer'
import { getFileDownloadableLink } from '../../../../helpers'
import { useProgramContentById } from '../../../../hooks/program'
import { ProgramContent } from '../../../../types/program'
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

const Title = styled(Text)`
  font-size: 24px;
  font-color: ${colors.teal};
  text-align: center;
  font-weight: bold;
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

const PreviewPlayer: React.VFC<{
  trailProgramContents?: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}> = ({ trailProgramContents }) => {
  const [currentTrail, setCurrentTrail] = useState<number>(0)
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const {
    id: programContentId,
    contentSectionTitle,
    contentType,
    programId,
  } = trailProgramContents?.[currentTrail] || {}
  const { programContent } = useProgramContentById(programId || '', programContentId || '')
  const [audioUrl, setAudioUrl] = useState<string>()

  useEffect(() => {
    getFileDownloadableLink(`audios/${appId}/${programId}/${programContentId}`, authToken).then(url => {
      setAudioUrl(url)
    })
  }, [appId, authToken, programContentId, programId])

  if (!programContent || !trailProgramContents || !programContentId) {
    return null
  }

  return (
    <>
      <HeaderWrapper>
        <ControlButton
          disable={currentTrail === 0}
          cursor="pointer"
          onClick={() => {
            if (currentTrail === 0) return
            setCurrentTrail(c => c - 1)
          }}
        >
          <FaChevronDown style={{ transform: 'rotate(90deg)' }} className="m-1" />
          上一則
        </ControlButton>
        <Box>
          <Title>試看</Title>
          <SubTitle>{contentSectionTitle}</SubTitle>
        </Box>
        <ControlButton
          disable={currentTrail === trailProgramContents.length - 1}
          cursor="pointer"
          onClick={() => {
            if (currentTrail === trailProgramContents.length - 1) return
            setCurrentTrail(c => c + 1)
          }}
        >
          下一則
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
