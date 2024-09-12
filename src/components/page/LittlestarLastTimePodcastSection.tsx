import { gql, useQuery } from '@apollo/client'
import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/skeleton'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import hasura from '../../hasura'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as PlayIcon } from '../../images/play.svg'
import { BREAK_POINT } from '../common/Responsive'
import { SectionLayout } from './PodcastAlbumCollectionSection'

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0 0;
  aspect-ratio: 1;
  object-fit: cover;

  @media (min-width: ${BREAK_POINT}px) {
    border-radius: 8px;
  }
`

const StyledRow = styled.div`
  max-width: 700px;
`

const StyledCard = styled.div`
  height: 100%;
  padding: 40px;
  border-radius: 0 0 8px 8px;
  background-color: ${props => props.theme['@primary-color']};

  @media (min-width: ${BREAK_POINT}px) {
    height: 85%;
    border-radius: 0 8px 8px 0;
  }

  h3 {
    font-family: Noto Sans TC;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.3px;
    color: #fff;
  }

  h4 {
    font-family: Noto Sans TC;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #fff;
  }

  span.tag {
    font-family: Noto Sans TC;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.83;
    letter-spacing: 0.6px;
    color: #fff;
    width: 68px;
    padding: 1px 8px;
    border-radius: 10px;
    border: solid 1px #fff;
  }

  div.play {
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    transition: 0.3s;
    cursor: pointer;
    user-select: none;
    text-align: right;
    svg {
      font-size: 30px;
    }
    a:hover {
      opacity: 0.9;
      color: #fff;
    }
  }
`

const StyledTitle = styled.h3`
  display: -webkit-box;
  -webkit-line-clamp: 3; // rows number
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
`
const StyledSubTitle = styled.h4`
  display: -webkit-box;
  -webkit-line-clamp: 1; // rows number
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
`
const StyledLinkButton = styled(Button)`
  && {
    color: white;
  }
`

const LittlestarLastTimePodcastSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { status, lastWatchedPodcastProgram } = useLastWatchedPodcastProgram()
  const { setup } = useContext(PodcastPlayerContext)
  const history = useHistory()

  if (status === 'loading') return <Skeleton />
  if (lastWatchedPodcastProgram === null) return <></>

  return (
    <SectionLayout title={title}>
      <StyledRow className="row mx-auto">
        <div className="col-lg-6 p-lg-0">
          <StyledImg
            src={lastWatchedPodcastProgram.podcastAlbum.coverUrl || EmptyCover}
            alt={lastWatchedPodcastProgram.title}
          />
        </div>
        <div className="col-lg-6 p-lg-0 d-flex">
          <StyledCard className="flex-grow-1 d-flex flex-column justify-content-between m-0 m-lg-auto">
            <div className="mb-3">
              <StyledTitle className="mb-4">{lastWatchedPodcastProgram.title}</StyledTitle>
              <StyledSubTitle className="mb-2">{lastWatchedPodcastProgram.podcastAlbum.title}</StyledSubTitle>
              {lastWatchedPodcastProgram.podcastAlbum.categoryNames.map(name => (
                <span className="tag mr-1" key={name}>
                  {name}
                </span>
              ))}
            </div>

            <div>
              <div className="play">
                <StyledLinkButton
                  variant="link"
                  onClick={() => {
                    history.push(`/podcasts/${lastWatchedPodcastProgram.id}`)
                    setup?.({
                      title: lastWatchedPodcastProgram.podcastAlbum.title,
                      podcastProgramIds: lastWatchedPodcastProgram.podcastAlbum.podcastProgramIds,
                      currentIndex: lastWatchedPodcastProgram.podcastAlbum.podcastProgramIds.findIndex(
                        podcastProgramId => podcastProgramId === lastWatchedPodcastProgram.id,
                      ),
                    })
                  }}
                  rightIcon={<Icon className="ml-2" as={PlayIcon} />}
                >
                  繼續播放
                </StyledLinkButton>
              </div>
            </div>
          </StyledCard>
        </div>
      </StyledRow>
    </SectionLayout>
  )
}

const useLastWatchedPodcastProgram: () => {
  status: 'loading' | 'error' | 'success' | 'idle'
  lastWatchedPodcastProgram: {
    id: string
    title: string
    podcastAlbum: {
      id: string
      title: string
      coverUrl: string | null
      podcastProgramIds: string[]
      categoryNames: string[]
    }
  } | null
} = () => {
  const { currentMemberId } = useAuth()
  const { loading, error, data } = useQuery<
    hasura.GET_LAST_WATCHED_PODCAST_PROGRAM,
    hasura.GET_LAST_WATCHED_PODCAST_PROGRAMVariables
  >(
    gql`
      query GET_LAST_WATCHED_PODCAST_PROGRAM($memberId: String!) {
        podcast_program_progress(
          where: { member_id: { _eq: $memberId }, last_progress: { _neq: 0 }, podcast_album_id: { _is_null: false } }
          order_by: { updated_at: desc }
          limit: 1
        ) {
          id
          progress
          last_progress
          podcast_program {
            id
            title
          }
          podcast_album {
            id
            title
            cover_url
            podcast_album_podcast_programs {
              podcast_program_id
            }
            podcast_album_categories {
              id
              category {
                id
                name
              }
            }
          }
        }
      }
    `,
    {
      variables: { memberId: currentMemberId || '' },
      fetchPolicy: 'no-cache',
    },
  )
  const [lastWatchedPodcastProgram = null] = data?.podcast_program_progress || []
  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    lastWatchedPodcastProgram: lastWatchedPodcastProgram && {
      id: lastWatchedPodcastProgram.podcast_program.id,
      lastProgress: lastWatchedPodcastProgram.last_progress,
      title: lastWatchedPodcastProgram.podcast_program.title || '',
      podcastAlbum: {
        id: lastWatchedPodcastProgram.podcast_album?.id || '',
        title: lastWatchedPodcastProgram.podcast_album?.title || '',
        coverUrl: lastWatchedPodcastProgram.podcast_album?.cover_url || '',
        podcastProgramIds:
          lastWatchedPodcastProgram.podcast_album?.podcast_album_podcast_programs.map(v => v.podcast_program_id) || [],
        categoryNames:
          lastWatchedPodcastProgram.podcast_album?.podcast_album_categories.map(
            category => category.category?.name || '',
          ) || [],
      },
    },
  }
}

export default LittlestarLastTimePodcastSection
