import { Flex, SkeletonCircle, SkeletonText, TabPanel, TabPanelProps, Text } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { AvatarImage } from '../../../../components/common/Image'

const AvatarBlock = styled.div`
  display: flex;
  margin: 24px 0px;
  gap: 24px;
`

const InstructorName = styled(Text)`
  font-size: 24px;
  color: #585858;
  font-weight: bold;
`

const InstructorSubtitle = styled(Text)`
  font-size: 16px;
  color: #21b1b1;
  font-weight: 500;
`

const InstructorPanel: React.VFC<
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
    <TabPanel {...props}>
      <AvatarBlock>
        <AvatarImage src={avatarUrl} size={128} />
        <Flex justifyContent="center" align-items="start" spacing={1} flexDirection="column">
          <InstructorName>{instructorName}</InstructorName>
          <InstructorSubtitle>{instructorSubtitle}</InstructorSubtitle>
        </Flex>
      </AvatarBlock>
      {props.children}
    </TabPanel>
  )
}
export default InstructorPanel
