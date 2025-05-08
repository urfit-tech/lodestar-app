import { Flex, SkeletonCircle, SkeletonText, TabPanel, TabPanelProps, Text } from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React from 'react'
import styled from 'styled-components'
import { AvatarImage } from '../../../../components/common/Image'
import { colors } from '../style'

const AvatarBlock = styled.div`
  display: flex;
  margin: 24px 0px;
  gap: 24px;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    flex-direction: row;
  }
`

const InstructorName = styled(Text)`
  font-size: 24px;
  color: ${colors.gray1};
  font-weight: bold;
`

const InstructorSubtitle = styled(Text)`
  font-size: 16px;
  color: ${colors.teal2};
  font-weight: 500;
`

const TextWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (min-width: ${BREAK_POINT}px) {
    justify-content: center;
    align-items: start;
  }
`
const StyledPanel = styled(TabPanel)`
  padding-top: 0px !important;
`

const AvatarContainer = styled.div`
  flex-shrink: 0;
`

const InstructorPanel: React.FC<
  { instructorInfo: { instructorName: string; avatarUrl: string; instructorSubtitle: string } } & TabPanelProps
> = ({ instructorInfo, ...props }) => {
  if (!instructorInfo) {
    return (
      <>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </>
    )
  }

  const { instructorName, avatarUrl, instructorSubtitle } = instructorInfo
  return (
    <StyledPanel {...props}>
      <AvatarBlock>
        <AvatarContainer>
          <AvatarImage src={avatarUrl} size={128} />
        </AvatarContainer>
        <TextWrapper>
          <InstructorName>{instructorName}</InstructorName>
          <InstructorSubtitle>{instructorSubtitle}</InstructorSubtitle>
        </TextWrapper>
      </AvatarBlock>
      {props.children}
    </StyledPanel>
  )
}
export default InstructorPanel
