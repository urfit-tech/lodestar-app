import { Divider, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { productMessages } from '../../../helpers/translation'
import { usePublicMember } from '../../../hooks/member'
import { PodcastAlbum } from '../../../types/podcastAlbum'
import CreatorCard from '../CreatorCard'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
  font-weight: bold;
`

const PodcastAlbumInstructorCollectionBlock: React.VFC<{
  podcastAlbum: PodcastAlbum
  customTitle?: string
}> = ({ podcastAlbum, customTitle }) => {
  const { formatMessage } = useIntl()

  return (
    <div>
      <StyledTitle>{customTitle || formatMessage(productMessages.program.title.instructorIntro)}</StyledTitle>
      <Divider className="mb-3" />
      <CreatorCollection key={podcastAlbum.id} creatorId={podcastAlbum.author.id} />
    </div>
  )
}

const CreatorCollection: React.VFC<{ creatorId: string }> = ({ creatorId }) => {
  const { loadingMember, member } = usePublicMember(creatorId)

  if (loadingMember || !member) {
    return (
      <>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </>
    )
  }

  return (
    <CreatorCard
      id={member.id}
      avatarUrl={member.pictureUrl}
      title={member.name || member.username}
      jobTitle={member.title}
      description={member.abstract}
      withProgram
      withPodcast
      withAppointment
      withBlog
      noPadding
    />
  )
}

export default PodcastAlbumInstructorCollectionBlock
