import { Box, Text } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import styled from 'styled-components'
import ProgramContentPlayer from '../../../../components/program/ProgramContentPlayer'
import { ProgramContent } from '../../../../types/program'

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
  font-color: #585858;
  text-align: center;
  font-weight: bold;
`
const SubTitle = styled(Text)`
  font-size: 16px;
  font-color: #585858;
  text-align: center;
  font-weight: bold;
`

const ControlButton = styled(Box)`
  font-size: 14px;
  color: #21b1b1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PreviewPlayer: React.VFC<{
  trailProgramContents: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}> = ({ trailProgramContents }) => {
  const [currentTrail, setCurrentTrail] = useState<number>(0)
  const { id: programContentId, contentSectionTitle } = trailProgramContents[currentTrail]
  return (
    <>
      <HeaderWrapper>
        <ControlButton
          cursor="pointer"
          onClick={() => {
            if (currentTrail - 1 > 0) return
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
          cursor="pointer"
          onClick={() => {
            if (currentTrail + 1 >= trailProgramContents.length) return
            setCurrentTrail(c => c + 1)
          }}
        >
          下一則
          <FaChevronDown style={{ transform: 'rotate(270deg)' }} className="m-1" />
        </ControlButton>
      </HeaderWrapper>
      <ProgramContentPlayer programContentId={programContentId} />
    </>
  )
}

export default PreviewPlayer
