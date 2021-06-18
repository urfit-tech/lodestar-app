import { Skeleton } from 'antd'
import React from 'react'
import CreatorCard from '../../components/common/CreatorCard'
import { usePublicMember } from '../../hooks/member'
import { StyledContentBlock } from './index.styled'

const ProgramContentCreatorBlock: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const { loadingMember, member } = usePublicMember(memberId)

  if (loadingMember) {
    return <Skeleton active avatar />
  }

  if (!member) {
    return null
  }

  return (
    <StyledContentBlock>
      <CreatorCard
        id={member.id}
        avatarUrl={member.pictureUrl}
        title={member.name || member.username}
        labels={[{ id: 'instructor', name: 'instructor' }]}
        jobTitle={member.title}
        description={member.abstract}
        withProgram
        withPodcast
        withAppointment
        withBlog
      />
    </StyledContentBlock>
  )
}

export default ProgramContentCreatorBlock
