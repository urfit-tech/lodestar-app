import { Box } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { usePostPreviewCollection } from '../../../../hooks/blog'
import { usePodcastProgramCollection } from '../../../../hooks/podcast'
import { usePublishedProgramCollection } from '../../../../hooks/program'
import EmptyCover from '../../../../images/empty-cover.png'
import ProgramPageMessages from '../../translation'
import CollapseContent from './CollapseContent'
import CollapseContentCard from './CollapseContentCard'

const StyledCollapseContentWrapper = styled(Box)`
  display: grid;
  grid-row-gap: 12px;
  margin-top: 24px;
  grid-template-columns: 1fr;
  place-items: center;
  padding-bottom: 24px;
`

const CollapseContentBlock: React.FC<{ creatorId: string }> = ({ creatorId }) => {
  const { programs } = usePublishedProgramCollection({
    instructorId: creatorId,
    isPrivate: false,
  })

  const { podcastPrograms } = usePodcastProgramCollection(creatorId)
  const { posts } = usePostPreviewCollection({ authorId: creatorId })

  const { formatMessage } = useIntl()
  return (
    <>
      {programs.length !== 0 && (
        <CollapseContent
          title={formatMessage(ProgramPageMessages.SecondaryInstructorCollectionBlock.course, {
            count: programs.length,
          })}
        >
          <StyledCollapseContentWrapper>
            {programs.map(program => (
              <CollapseContentCard
                imgSrc={program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl || EmptyCover}
                href={`/programs/${program.id}`}
                key={program.id}
              >
                {program.title}
              </CollapseContentCard>
            ))}
          </StyledCollapseContentWrapper>
        </CollapseContent>
      )}
      {podcastPrograms.length !== 0 && (
        <CollapseContent
          title={formatMessage(ProgramPageMessages.SecondaryInstructorCollectionBlock.podcastChannel, {
            count: podcastPrograms.length,
          })}
        >
          <StyledCollapseContentWrapper>
            {podcastPrograms.map(podcast => (
              <CollapseContentCard
                imgSrc={podcast.coverUrl || EmptyCover}
                href={`/podcasts/${podcast.id}`}
                key={podcast.id}
              >
                {podcast.title}
              </CollapseContentCard>
            ))}
          </StyledCollapseContentWrapper>
        </CollapseContent>
      )}
      {posts.length !== 0 && (
        <CollapseContent
          title={formatMessage(ProgramPageMessages.SecondaryInstructorCollectionBlock.mediaArticle, {
            count: posts.length,
          })}
        >
          <StyledCollapseContentWrapper>
            {posts.map(post => (
              <CollapseContentCard imgSrc={post.coverUrl || EmptyCover} href={`/posts/${post.id}`} key={post.id}>
                {post.title}
              </CollapseContentCard>
            ))}
          </StyledCollapseContentWrapper>
        </CollapseContent>
      )}
    </>
  )
}

export default CollapseContentBlock
