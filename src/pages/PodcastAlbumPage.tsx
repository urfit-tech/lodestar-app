import { SkeletonText } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { render } from 'mustache'
import React, { useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import PodcastAlbumBanner from '../components/common/podcastAlbum/PodcastAlbumBanner'
import PodcastAlbumContentListBlock from '../components/common/podcastAlbum/PodcastAlbumContentListBlock'
import PodcastAlbumInstructorCollectionBlock from '../components/common/podcastAlbum/PodcastAlbumInstructorCollectionBlock'
import PodcastAlbumSubscriptionPlanCard from '../components/common/podcastAlbum/PodcastAlbumSubscriptionPlanCard'
import Responsive, { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import PodcastPlayerContext from '../contexts/PodcastPlayerContext'
import { desktopViewMixin } from '../helpers'
import { usePodcastAlbum } from '../hooks/podcastAlbum'
import ForbiddenPage from './ForbiddenPage'

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    order: 1;
    padding-left: 35px;
  `)}
`
const StyledPodcastAlbumIntroBlock = styled.div`
  position: relative;
  padding-top: 2.5rem;
  padding-bottom: 6rem;
  background: white;

  @media (min-width: ${BREAK_POINT}px) {
    padding-top: 3.5rem;
    padding-bottom: 1rem;
  }
`
const FixedBottomBlock = styled.div<{ bottomSpace?: string }>`
  margin: auto;
  position: fixed;
  width: 100%;
  bottom: ${props => props.bottomSpace || 0};
  left: 0;
  right: 0;
  z-index: 999;
`
const PodcastAlbumPage: React.VFC = () => {
  const { podcastAlbumId: id } = useParams<{ podcastAlbumId: string }>()
  const { id: appId, settings } = useApp()
  const { visible } = useContext(PodcastPlayerContext)
  const { loading, podcastAlbum } = usePodcastAlbum(id)
  const { resourceCollection } = useResourceCollection([`${appId}:podcast_album:${id}`])

  let seoMeta:
    | {
        title?: string
        description?: string
      }
    | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta'])?.PodcastAlbumPage
  } catch (error) {}

  const siteTitle = podcastAlbum?.title
    ? seoMeta?.title
      ? `${render(seoMeta.title, { programTitle: podcastAlbum.title })}`
      : podcastAlbum.title
    : appId

  const siteDescription = podcastAlbum?.description || settings['open_graph.description']
  const siteImage = podcastAlbum?.coverUrl || settings['open_graph.image']

  useEffect(() => {
    if (podcastAlbum) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: podcastAlbum.id,
        name: podcastAlbum.title,
        category: 'podcastAlbum',
        price: 0,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'detail')
      ReactGA.ga('send', 'pageview')
    }
  }, [podcastAlbum])

  if (loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!podcastAlbum) {
    return <ForbiddenPage />
  }

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: podcastAlbum.title,
    image: siteImage,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: settings['seo.name'],
      description: settings['open_graph.description'],
    },
  })

  return (
    <DefaultLayout white>
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      <PodcastAlbumBanner podcastAlbum={podcastAlbum} />

      <StyledPodcastAlbumIntroBlock>
        <div className="container">
          <div className="row">
            {!(settings['podcast_album.subscription_plan_card_is_public.disable'] === '1' && podcastAlbum.isPublic) && (
              <Responsive.Desktop>
                <StyledIntroWrapper className="col-12 col-lg-4">
                  {podcastAlbum.isPublic && <PodcastAlbumSubscriptionPlanCard podcastAlbum={podcastAlbum} />}
                </StyledIntroWrapper>
              </Responsive.Desktop>
            )}

            <div
              className={`col-12 mb-5 ${
                !(
                  settings['podcast_album.subscription_plan_card_is_public.disable'] === '1' && podcastAlbum.isPublic
                ) && 'col-lg-8'
              }`}
            >
              <div className="my-5">
                <BraftContent>{podcastAlbum.description}</BraftContent>
              </div>
              <PodcastAlbumContentListBlock
                podcastAlbum={podcastAlbum}
                podcastPrograms={podcastAlbum.podcastPrograms}
              />
            </div>
          </div>

          {!(settings['podcast_album.instuctor_collection.disable'] === '1') && (
            <div className="row">
              <div className="col-12 col-lg-8 mb-5">
                <PodcastAlbumInstructorCollectionBlock podcastAlbum={podcastAlbum} />
              </div>
            </div>
          )}
        </div>
      </StyledPodcastAlbumIntroBlock>

      {!(settings['podcast_album.subscription_plan_card_is_public.disable'] === '1' && podcastAlbum.isPublic) && (
        <Responsive.Default>
          <FixedBottomBlock bottomSpace={visible ? '92px' : ''}>
            <PodcastAlbumSubscriptionPlanCard podcastAlbum={podcastAlbum} />
          </FixedBottomBlock>
        </Responsive.Default>
      )}
    </DefaultLayout>
  )
}

export default PodcastAlbumPage
