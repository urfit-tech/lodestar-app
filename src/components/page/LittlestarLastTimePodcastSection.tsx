import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { ReactComponent as PlayIcon } from '../../images/play.svg'
import { BREAK_POINT } from '../common/Responsive'
import { SectionLayout } from './PodcastAlbumCollectionSection'

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0 0;

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
    height: 75%;
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

const LittlestarLastTimePodcastSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { currentMemberId } = useAuth()
  const { lastWatchedPodcastAlbumPodcastProgram } = useLastWatchedPodcastAlbumPodcastProgram(currentMemberId || '')

  if (!currentMemberId || !lastWatchedPodcastAlbumPodcastProgram) return <></>

  return (
    <SectionLayout title={title}>
      <StyledRow className="row mx-auto">
        <div className="col-lg-6 p-lg-0">
          <StyledImg
            src={lastWatchedPodcastAlbumPodcastProgram?.coverUrl || ''}
            alt={lastWatchedPodcastAlbumPodcastProgram?.title}
          />
        </div>
        <div className="col-lg-6 p-lg-0 d-flex">
          <StyledCard className="flex-grow-1 d-flex flex-column justify-content-between m-0 m-lg-auto">
            <div className="mb-3">
              <h3 className="mb-4">{lastWatchedPodcastAlbumPodcastProgram?.podcastAlbum.title}</h3>
              <h4 className="mb-2">{lastWatchedPodcastAlbumPodcastProgram?.title}</h4>
              {lastWatchedPodcastAlbumPodcastProgram?.categoryNames.map(name => (
                <span className="tag mr-1">{name}</span>
              ))}
            </div>

            <div>
              <div className="play">
                <Link
                  to={`/podcasts/${lastWatchedPodcastAlbumPodcastProgram.id}?podcastAlbumId=${lastWatchedPodcastAlbumPodcastProgram.podcastAlbum.id}`}
                >
                  繼續播放
                  <Icon className="ml-2" as={PlayIcon} />
                </Link>
              </div>
            </div>
          </StyledCard>
        </div>
      </StyledRow>
    </SectionLayout>
  )
}

const useLastWatchedPodcastAlbumPodcastProgram: (memberId: string) => {
  status: 'loading' | 'error' | 'success' | 'idle'
  lastWatchedPodcastAlbumPodcastProgram: {
    id: string
    title: string
    coverUrl: string | null
    categoryNames: string[]
    podcastAlbum: {
      id: string
      title: string
    }
  } | null
} = memberId => {
  const { loading, error, data } = useQuery<
    hasura.GET_LAST_WATCHED_PODCAST_PROGRAM,
    hasura.GET_LAST_WATCHED_PODCAST_PROGRAMVariables
  >(
    gql`
      query GET_LAST_WATCHED_PODCAST_PROGRAM($memberId: String!) {
        podcast_program_progress(where: { member_id: { _eq: $memberId } }, order_by: { updated_at: desc }, limit: 1) {
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
      variables: { memberId },
      fetchPolicy: 'no-cache',
    },
  )
  const [lastWatchedPodcastAlbumPodcastProgram = null] = data?.podcast_program_progress || []
  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    lastWatchedPodcastAlbumPodcastProgram: lastWatchedPodcastAlbumPodcastProgram && {
      id: lastWatchedPodcastAlbumPodcastProgram.podcast_program.id,
      lastProgress: lastWatchedPodcastAlbumPodcastProgram.last_progress,
      title: lastWatchedPodcastAlbumPodcastProgram.podcast_album?.title || '',
      coverUrl: lastWatchedPodcastAlbumPodcastProgram.podcast_album?.cover_url || '',
      categoryNames:
        lastWatchedPodcastAlbumPodcastProgram.podcast_album?.podcast_album_categories.map(
          category => category.category?.name || '',
        ) || [],
      podcastAlbum: {
        id: lastWatchedPodcastAlbumPodcastProgram.podcast_album?.id || '',
        title: lastWatchedPodcastAlbumPodcastProgram.podcast_program.title || '',
      },
    },
  }
}

export default LittlestarLastTimePodcastSection
