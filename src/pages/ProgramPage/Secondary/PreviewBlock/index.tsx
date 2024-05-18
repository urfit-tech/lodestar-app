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
  :empty {
    display: none;
  }
`

const PreviewBlock: React.VFC<{
  ref: React.RefObject<HTMLDivElement>
  trailProgramContents: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}> = ({ trailProgramContents, ref }) => {
  if (trailProgramContents.length === 0) {
    return null
  }

  return (
    <Wrapper ref={ref}>
      <PreviewPlayer trailProgramContents={trailProgramContents} />
    </Wrapper>
  )
}

export default PreviewBlock
