import { useQuery } from '@apollo/react-hooks'
import { Skeleton } from '@chakra-ui/skeleton'
import gql from 'graphql-tag'
import Responsive from 'lodestar-app-element/src/components/common/Responsive'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import EmptyCover from '../../images/empty-cover.png'
import { MultiLineTruncationMixin } from '../common'
import { BREAK_POINT } from '../common/Responsive'

const StyledSectionLayout = styled.section<{ variant?: 'primary-color' }>`
  ${props => props.variant === 'primary-color' && `background: ${props.theme['@primary-color']}`};
  padding: 80px 0;

  h2 {
    font-family: Noto Sans TC;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    color: var(--gray-darker);
    text-align: center;
    color: ${props => (props.variant === 'primary-color' ? 'white' : 'var(--gray-darker)')};
    margin-bottom: 42px;
  }
`

export const SectionLayout: React.FC<{ title?: string; variant?: 'primary-color' }> = ({
  title,
  variant,
  children,
}) => {
  return (
    <StyledSectionLayout variant={variant}>
      <div className="container">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </StyledSectionLayout>
  )
}

const StyledCol = styled.div`
  @media (min-width: 320px) and (max-width: ${BREAK_POINT - 1}px) {
    &:nth-child(n + 5) {
      display: none;
    }
  }
`

const StyledCard = styled.div`
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
`
const StyledCardImgWrapper = styled.div`
  position: relative;
  ::before {
    float: left;
    padding-top: 100%;
    content: '';
  }
  ::after {
    display: block;
    content: '';
    clear: both;
  }
  > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
const StyledCardContent = styled.div`
  padding: 20px;

  h3 {
    ${MultiLineTruncationMixin}
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
    height: 44px;
  }

  div.unit {
    font-family: Noto Sans TC;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.4px;
    color: var(--gray-dark);
  }

  div.tag-group {
    height: 20px;
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
  }
`

const StyledLink = styled(Link)`
  color: ${props => props.theme['@primary-color']};
`

const PodcastAlbumCollectionSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { status, podcastAlbums } = useNewestPodcastAlbumCollection()

  if (status === 'loading') {
    return <Skeleton />
  }

  return (
    <SectionLayout title={title}>
      <div className="row">
        {podcastAlbums.map(podcastAlbum => (
          <StyledCol key={podcastAlbum.id} className="col-6 col-lg-3 my-3">
            <Link to={`/podcast-albums/${podcastAlbum.id}`}>
              <StyledCard>
                <StyledCardImgWrapper>
                  <img src={podcastAlbum.coverUrl || EmptyCover} alt={podcastAlbum.title} />
                </StyledCardImgWrapper>
                <StyledCardContent>
                  <h3>{podcastAlbum.title}</h3>
                  <div className="unit mb-3">共 {podcastAlbum.programCount} 單元</div>
                  <Responsive.Desktop>
                    <div className="tag-group">
                      {podcastAlbum.categoryNames.slice(0, 1).map(name => (
                        <span className="tag mr-2" key={name}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </Responsive.Desktop>
                </StyledCardContent>
              </StyledCard>
            </Link>
          </StyledCol>
        ))}
      </div>
      <div className="text-center">
        <MoreLink to="/podcast-albums" />
      </div>
    </SectionLayout>
  )
}

export const MoreLink: React.VFC<{ to: string }> = ({ to }) => (
  <StyledLink className="d-inline-block mt-4" to={to}>
    查看更多 <AngleRightIcon className="d-inline-block m-auto" />
  </StyledLink>
)

const useNewestPodcastAlbumCollection: () => {
  status: string
  podcastAlbums: {
    id: string
    coverUrl: string | null
    title: string
    programCount: number
    categoryNames: string[]
  }[]
} = () => {
  const { loading, data, error } = useQuery<hasura.GET_PODCAST_ALBUM_COLLECTION>(gql`
    query GET_PODCAST_ALBUM_COLLECTION {
      podcast_album(where: { published_at: { _is_null: false } }, order_by: { published_at: desc }) {
        id
        cover_url
        title
        podcast_album_categories {
          id
          category {
            id
            name
          }
        }
        podcast_album_podcast_programs_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  `)

  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    podcastAlbums:
      data?.podcast_album.map(v => ({
        id: v.id,
        coverUrl: v.cover_url,
        title: v.title,
        programCount: v.podcast_album_podcast_programs_aggregate?.aggregate?.count || 0,
        categoryNames: v.podcast_album_categories.map(w => w.category?.name).filter(notEmpty),
      })) || [],
  }
}

export default PodcastAlbumCollectionSection
