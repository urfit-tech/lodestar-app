import { Box } from '@chakra-ui/react'
import { forwardRef } from 'react'
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

interface Props {
  trailProgramContents: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}

export const PreviewBlock = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { trailProgramContents } = props
  return (
    <Wrapper ref={ref}>
      <PreviewPlayer trailProgramContents={trailProgramContents} />
    </Wrapper>
  )
})

export default PreviewBlock
