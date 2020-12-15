import { Icon } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { programMessages } from '../../helpers/translation'
import { ReactComponent as RocketIcon } from '../../images/icon-rocket.svg'

const StyledBlock = styled.div`
  margin: 50px 0;
`
export const StyledText = css`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledParagraph = styled.p`
  ${StyledText};
`
const PracticeDisplayedCollection: React.FC = () => {
  const { formatMessage } = useIntl()

  return (
    <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
      <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
      <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
    </StyledBlock>
  )
}

export default PracticeDisplayedCollection
