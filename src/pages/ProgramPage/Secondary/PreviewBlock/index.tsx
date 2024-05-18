import { Box } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { ProgramContent } from '../../../../types/program'
import PreviewPlayer from './PreviewPlayer'

const Wrapper = styled(Box)`
  padding: 24px 18px;
  border-radius: 8px;
  background: #f7f8f8;
  padding-bottom: 1rem;
`

const PreviewBlock: React.VFC<{
  trailProgramContents: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}> = ({ trailProgramContents }) => {
  if (trailProgramContents.length === 0) {
    return null
  }

  return (
    <Wrapper>
      <PreviewPlayer trailProgramContents={trailProgramContents} />
    </Wrapper>
  )
}

export default PreviewBlock
