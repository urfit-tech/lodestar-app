import { Box, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ProgramContent } from '../../../../types/program'
import ProgramPageMessages from '../../translation'
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
  const { formatMessage } = useIntl()
  const { trialProgramContentMedias } = props
  return (
    <Box mt="2.5rem">
      <Title>{formatMessage(ProgramPageMessages.PreviewBlock.preview)}</Title>
      <Wrapper ref={ref}>
        <PreviewPlayer trialProgramContentMedias={trialProgramContentMedias} />
      </Wrapper>
    </Box>
  )
})

export default PreviewBlock
