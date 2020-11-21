import React from 'react'
import CreatorCardComponents from '../../components/common/CreatorCard'
import { usePublicMember } from '../../hooks/member'

const CreatorCard: React.FC<{
  id: string
}> = ({ id }) => {
  const { member } = usePublicMember(id)

  return (
    <CreatorCardComponents
      id={id}
      avatarUrl={member?.pictureUrl}
      title={member?.name || member?.username || ''}
      labels={[]}
      jobTitle={member?.title}
      description={member?.abstract}
      withProgram
      withPodcast
      withAppointment
      withBlog
    />
  )
}

export default CreatorCard
