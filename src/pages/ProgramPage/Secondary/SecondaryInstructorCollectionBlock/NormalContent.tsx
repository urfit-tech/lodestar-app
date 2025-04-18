import React from 'react'
import styled from 'styled-components'
import { colors } from '../style'

const SectionBlock = styled.div`
  margin-bottom: 2.5rem;
`

const SectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.gray1};
  margin-bottom: 20px;
`

const NormalContent: React.FC<{ children: React.ReactNode; title: string }> = ({ title, children }) => {
  return (
    <SectionBlock>
      <SectionTitle>{title}</SectionTitle>
      <React.Fragment>{children}</React.Fragment>
    </SectionBlock>
  )
}
export default NormalContent
