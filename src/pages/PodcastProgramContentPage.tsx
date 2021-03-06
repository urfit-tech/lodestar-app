import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import PodcastProgramCover from '../components/podcast/PodcastProgramCover'
import CreatorCard from '../containers/common/CreatorCard'
import { usePodcastProgramContent } from '../hooks/podcast'

const StyledContentWrapper = styled.div`
  padding: 2.5rem 1rem 4rem;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem 1rem;
    height: calc(100vh - 64px);
    overflow-y: auto;

    > div {
      margin: 0 auto;
      max-width: 38.75rem;
    }
  }
`

const PodcastProgramContentPage: React.VFC = () => {
  const { podcastProgramId } = useParams<{ podcastProgramId: string }>()
  const { currentMemberId } = useAuth()
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(podcastProgramId)

  if (loadingPodcastProgram || !podcastProgram) {
    return (
      <DefaultLayout noFooter>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout noFooter>
      <div className="row no-gutters">
        <div className="col-12 col-lg-4">
          {typeof currentMemberId === 'string' && (
            <PodcastProgramCover
              memberId={currentMemberId}
              podcastProgramId={podcastProgramId}
              coverUrl={podcastProgram.coverUrl}
              title={podcastProgram.title}
              publishedAt={podcastProgram.publishedAt}
              tags={podcastProgram.tags}
              description={podcastProgram.abstract}
            />
          )}
        </div>

        <div className="col-12 col-lg-8">
          <StyledContentWrapper>
            {podcastProgram.instructorIds.map(instructorId => (
              <div key={instructorId} className="mb-5">
                <CreatorCard id={instructorId} />
              </div>
            ))}
            <div className="mb-5">
              <BraftContent>{podcastProgram.description ? podcastProgram.description : null}</BraftContent>
            </div>
          </StyledContentWrapper>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default PodcastProgramContentPage
