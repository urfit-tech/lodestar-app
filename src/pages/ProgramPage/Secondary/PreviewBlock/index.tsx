import { Box, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'
import styled from 'styled-components'
import { ProgramContent } from '../../../../types/program'
import { colors } from '../style'
import PreviewPlayer from './PreviewPlayer'

const Title = styled(Text)`
  display: flex;
  justify-content: start;
  font-size: 24px;
  font-color: ${colors.teal};
  text-align: center;
  font-weight: bold;
`

const Wrapper = styled(Box)`
  padding: 24px 18px;
  border-radius: 8px;
  background: ${colors.teal3};
  padding-bottom: 1rem;
  z-index: 0;
  :empty {
    display: none;
  }
`

interface Props {
  trialProgramContentMedias: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
  })[]
}

export const PreviewBlock = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { trialProgramContentMedias } = props
  return (
    <Box mt="2.5rem">
      <Title>試看/試聽</Title>
      <Wrapper ref={ref}>
        <PreviewPlayer trialProgramContentMedias={trialProgramContentMedias} />
      </Wrapper>
    </Box>
  )
})

export default PreviewBlock
