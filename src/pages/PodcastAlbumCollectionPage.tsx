import { useQuery } from '@apollo/client'
import { Button, Icon, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { flatten, prop, sortBy, uniqBy } from 'ramda'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { AiFillAppstore } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import EmptyCover from '../images/empty-cover.png'
import { Category, StatusType } from '../types/general'
import { PodcastAlbum } from '../types/podcastAlbum'

const messages = defineMessages({
  totalUnit: { id: 'podcast.content.totalUnit', defaultMessage: '共 {unitCount} 單元' },
})

const StyledButton = styled(Button)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

const StyledCard = styled.div`
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  overflow: hidden;
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

const StyledCardTitle = styled.h3`
  ${MultiLineTruncationMixin}
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  height: 44px;
`

const StyledUnit = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const PodcastAlbumCard: React.VFC<Pick<PodcastAlbum, 'title' | 'coverUrl'> & { unitCount: number }> = ({
  title,
  coverUrl,
  unitCount,
}) => {
  const { formatMessage } = useIntl()

  return (
    <StyledCard>
      <StyledCardImgWrapper>
        <img src={coverUrl || EmptyCover} alt={title} />
      </StyledCardImgWrapper>
      <div className="p-4">
        <StyledCardTitle className="mb-1">{title}</StyledCardTitle>
        <StyledUnit>{formatMessage(messages.totalUnit, { unitCount })}</StyledUnit>
      </div>
    </StyledCard>
  )
}

const PodcastAlbumCollectionPage: React.VFC = () => {
  const [defaultActive] = useQueryParam('active', StringParam)
  const [title] = useQueryParam('title', StringParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)

  const { pageTitle } = useNav()
  const { formatMessage } = useIntl()
  const { status, podcastAlbums } = usePodcastAlbumCollection({
    categoryId: defaultActive || undefined,
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(defaultActive || null)

  const categories: Category[] = sortBy(prop('position'))(
    uniqBy(
      category => category.id,
      flatten(podcastAlbums.map(podcastAlbum => podcastAlbum.categories).filter(notEmpty)),
    ),
  )

  useEffect(() => {
    if (podcastAlbums) {
      podcastAlbums.forEach((podcastAlbum, index) => {
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: podcastAlbum.id,
          name: podcastAlbum.title,
          category: 'PodcastAlbum',
          // price: `${salePrice || listPrice}`,
          position: index + 1,
        })
      })
      ReactGA.ga('send', 'pageview')
    }
  }, [podcastAlbums])

  return (
    <DefaultLayout white>
      <Helmet>
        <title>{title || pageTitle || formatMessage(productMessages.program.title.explore)}</title>
      </Helmet>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon as={AiFillAppstore} className="mr-3" />
            <span>{title || pageTitle || formatMessage(productMessages.program.title.explore)}</span>
          </StyledBannerTitle>

          {!noSelector && (
            <>
              <StyledButton
                colorScheme="primary"
                variant={selectedCategoryId === null ? 'solid' : 'outline'}
                className="mb-2"
                onClick={() => setSelectedCategoryId(null)}
              >
                {formatMessage(commonMessages.button.allCategory)}
              </StyledButton>
              {categories.map(category => (
                <StyledButton
                  key={category.id}
                  colorScheme="primary"
                  variant={selectedCategoryId === category.id ? 'solid' : 'outline'}
                  className="ml-2 mb-2"
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </StyledButton>
              ))}
            </>
          )}
        </div>
      </StyledBanner>

      <StyledCollection>
        <div className="container">
          <div className="row">
            {status === 'loading' ? (
              <SkeletonText mt="1" noOfLines={4} spacing="4" />
            ) : status === 'error' ? (
              <div>{formatMessage(commonMessages.status.readingFail)}</div>
            ) : (
              podcastAlbums
                .filter(
                  podcastAlbum =>
                    !selectedCategoryId || podcastAlbum.categories.some(category => category.id === selectedCategoryId),
                )
                .map(podcastAlbum => (
                  <div key={podcastAlbum.id} className="col-6 col-md-3 mb-4">
                    <Link to={`/podcast-albums/${podcastAlbum.id}`}>
                      <PodcastAlbumCard
                        coverUrl={podcastAlbum.coverUrl}
                        title={podcastAlbum.title}
                        unitCount={podcastAlbum.unitCount}
                      />
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

const usePodcastAlbumCollection: (options: { categoryId?: string }) => {
  status: StatusType
  podcastAlbums: (Pick<PodcastAlbum, 'id' | 'coverUrl' | 'title' | 'categories'> & { unitCount: number })[]
  refetch: () => void
} = ({ categoryId }) => {
  const condition: hasura.GET_PODCAST_ALBUMSVariables['condition'] = categoryId
    ? { published_at: { _is_null: false }, podcast_album_categories: { category: { id: { _eq: categoryId } } } }
    : { published_at: { _is_null: false } }
  const { loading, data, error, refetch } = useQuery<hasura.GET_PODCAST_ALBUMS, hasura.GET_PODCAST_ALBUMSVariables>(
    gql`
      query GET_PODCAST_ALBUMS($condition: podcast_album_bool_exp) {
        podcast_album(where: $condition, order_by: { published_at: desc }) {
          id
          cover_url
          title
          podcast_album_categories {
            id
            category {
              id
              name
              position
            }
          }
          podcast_album_podcast_programs_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    `,
    { variables: { condition } },
  )

  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    podcastAlbums:
      data?.podcast_album.map(v => ({
        id: v.id,
        coverUrl: v.cover_url || null,
        title: v.title,
        unitCount: v.podcast_album_podcast_programs_aggregate?.aggregate?.count || 0,
        categories: v.podcast_album_categories.map(v => ({
          id: v.category?.id || '',
          name: v.category?.name || '',
          position: v.category?.position || 0,
        })),
      })) || [],
    refetch,
  }
}

export default PodcastAlbumCollectionPage
