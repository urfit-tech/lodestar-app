import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import styled from 'styled-components'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { BREAK_POINT } from '../common/Responsive'
import { MoreLink, SectionLayout } from './PodcastAlbumCollectionSection'

const StyledCard = styled.div`
  border-radius: 12px;
  margin: 0 auto;
  padding: 40px;
  max-width: 640px;
  width: 100%;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;

  h3 {
    font-family: PingFangTC;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--gray-darker);
  }

  p {
    ${MultiLineTruncationMixin}
    -webkit-line-clamp: 4;
    font-family: Noto Sans TC;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }

  span.tag {
    border: solid 1px ${props => props.theme['@primary-color']};
    border-radius: 12px;
    padding: 3px 8px;
    font-family: Noto Sans TC;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
    color: ${props => props.theme['@primary-color']};
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 24px;

    img {
      margin-bottom: 0;
    }
  }
`

const StyledCardImgWrapper = styled.div`
  img {
    margin-bottom: 32px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    img {
      margin-bottom: 0;
    }
  }
`

const LittlestarFeaturedPodcastAlbumSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcastAlbum } = useFeaturePodcastAlbum({ categoryName: title })

  if (!podcastAlbum) return <></>
  return (
    <SectionLayout title={title} variant="primary-color">
      <StyledCard>
        <div className="row">
          <StyledCardImgWrapper className="col-12 col-lg-5">
            <img src={podcastAlbum.coverUrl || EmptyCover} alt={podcastAlbum.title} />
          </StyledCardImgWrapper>
          <div className="col-12 col-lg-7 d-flex align-items-center">
            <div className="flex-grow-1">
              <h3 className="mb-3">{podcastAlbum.title}</h3>
              {podcastAlbum.categoryNames.map(name => (
                <span className="tag mr-2">{name}</span>
              ))}
              <div className="mt-4">
                <p>{podcastAlbum.description}</p>
              </div>
              <div className="text-right">
                <MoreLink to={`/podcast-albums/${podcastAlbum.id}`} />
              </div>
            </div>
          </div>
        </div>
      </StyledCard>
    </SectionLayout>
  )
}

const useFeaturePodcastAlbum: (filter: { categoryName?: string }) => {
  status: string
  podcastAlbum: {
    id: string
    coverUrl: string | null
    title: string
    categoryNames: string[]
    description: string | null
  } | null
} = ({ categoryName }) => {
  const { loading, data, error } = useQuery<
    hasura.GET_PODCAST_ALBUM_BY_CATEGORY_NAME,
    hasura.GET_PODCAST_ALBUM_BY_CATEGORY_NAMEVariables
  >(
    gql`
      query GET_PODCAST_ALBUM_BY_CATEGORY_NAME($categoryName: String) {
        podcast_album(
          where: {
            podcast_album_categories: { category: { name: { _eq: $categoryName } } }
            published_at: { _lt: "now()" }
          }
          limit: 1
          order_by: { published_at: desc }
        ) {
          id
          cover_url
          title
          abstract
          podcast_album_categories(where: { category: { name: { _neq: $categoryName } } }) {
            id
            category {
              id
              name
            }
          }
        }
      }
    `,
    {
      variables: {
        categoryName,
      },
    },
  )

  const [podcastAlbum = null] = data?.podcast_album || []
  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    podcastAlbum: podcastAlbum && {
      id: podcastAlbum.id,
      coverUrl: podcastAlbum.cover_url || null,
      title: podcastAlbum.title,
      categoryNames: podcastAlbum.podcast_album_categories.map(v => v.category?.name).filter(notEmpty),
      description: podcastAlbum.abstract || '',
    },
  }
}

export default LittlestarFeaturedPodcastAlbumSection
