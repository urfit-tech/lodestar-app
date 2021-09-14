import { Button, SkeletonText } from '@chakra-ui/react'
import { render } from 'mustache'
import React, { useContext, useEffect, useRef } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import BlurredBanner from '../components/common/BlurredBanner'
import Responsive, { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import ProgramContentListSection from '../components/program/ProgramContentListSection'
import ProgramInfoBlock from '../components/program/ProgramInfoBlock'
import ProgramInstructorCollectionBlock from '../components/program/ProgramInstructorCollectionBlock'
import ProgramPerpetualPlanCard from '../components/program/ProgramPerpetualPlanCard'
import ProgramSubscriptionPlanSection from '../components/program/ProgramSubscriptionPlanSection'
import { useApp } from '../containers/common/AppContext'
import PodcastPlayerContext from '../contexts/PodcastPlayerContext'
import { desktopViewMixin, rgba } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { useProgram } from '../hooks/program'
import ForbiddenPage from './ForbiddenPage'

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    order: 1;
    padding-left: 35px;
  `)}
`
const StyledProgramAbstract = styled.span`
  padding-right: 2px;
  padding-bottom: 2px;
  background-image: linear-gradient(
    to bottom,
    transparent 40%,
    ${props => rgba(props.theme['@primary-color'], 0.1)} 40%
  );
  background-repeat: no-repeat;
  font-size: 20px;
  font-weight: bold;
  white-space: pre-line;
`
const StyledProgramIntroBlock = styled.div`
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
const StyledButtonWrapper = styled.div`
  padding: 0.5rem 0.75rem;
  background: white;
`

const PodcastAlbumPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { podcastAlbumId: id } = useParams<{ podcastAlbumId: string }>()
  const { currentMemberId } = useAuth()
  const { id: appId, settings } = useApp()
  const { visible } = useContext(PodcastPlayerContext)
  const { loadingProgram: loading, program: podcastAlbum } = useProgram(id)

  const planBlockRef = useRef<HTMLDivElement | null>(null)

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

  const siteDescription = podcastAlbum?.abstract || settings['open_graph.description']
  const siteImage = podcastAlbum?.coverUrl || settings['open_graph.image']

  useEffect(() => {
    if (podcastAlbum) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: podcastAlbum.id,
        name: podcastAlbum.title,
        category: 'podcastAlbum',
        price: `${podcastAlbum.listPrice}`,
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
    <DefaultLayout white footerBottomSpace={podcastAlbum.isSubscription ? '60px' : '132px'}>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <PodcastAlbumBanner
      // coverUrl={podcastAlbum.coverUrl}
      // title={podcastAlbum.title}
      // count={1234}
      // categories={[]}
      />

      <StyledProgramIntroBlock>
        <div className="container">
          <div className="row">
            {!podcastAlbum.isSubscription && (
              <StyledIntroWrapper className="col-12 col-lg-4">
                <ProgramInfoBlock program={podcastAlbum} />
              </StyledIntroWrapper>
            )}

            <div className="col-12 col-lg-8 mb-5">
              <StyledProgramAbstract>{podcastAlbum.abstract}</StyledProgramAbstract>

              <div className="my-5">
                <BraftContent>{podcastAlbum.description}</BraftContent>
              </div>

              <ProgramContentListSection memberId={currentMemberId || ''} program={podcastAlbum} />
            </div>

            {podcastAlbum.isSubscription && (
              <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4 mb-5">
                <ProgramSubscriptionPlanSection program={podcastAlbum} />
              </StyledIntroWrapper>
            )}
          </div>

          <div className="row">
            <div className="col-12 col-lg-8 mb-5">
              <ProgramInstructorCollectionBlock program={podcastAlbum} />
            </div>
          </div>
        </div>
      </StyledProgramIntroBlock>

      <Responsive.Default>
        <FixedBottomBlock bottomSpace={visible ? '92px' : ''}>
          {podcastAlbum.isSubscription ? (
            <StyledButtonWrapper>
              <Button
                variant="primary"
                isFullWidth
                onClick={() => planBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                {formatMessage(commonMessages.button.viewSubscription)}
              </Button>
            </StyledButtonWrapper>
          ) : (
            <ProgramPerpetualPlanCard memberId={currentMemberId || ''} program={podcastAlbum} />
          )}
        </FixedBottomBlock>
      </Responsive.Default>
    </DefaultLayout>
  )
}

const PodcastAlbumBanner: React.VFC<{
  // coverUrl: string | null
  // title: string
  // count: number
  // categoryNames: string[]
}> = (
  {
    // coverUrl, categoryNames, count, title
  },
) => {
  const {
    podcastAlbum: { coverUrl, count, title, categoryNames },
  } = usePodcastAlbum()
  return <BlurredBanner coverUrl={coverUrl}>12341</BlurredBanner>
}

const usePodcastAlbum = () => {
  return {
    podcastAlbum: {
      coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover3.png',
      count: 10,
      title: '第 28 期 - 我從那裡來？',
      categoryNames: ['親子', '公衛防疫'],
    },
  }
}

export default PodcastAlbumPage
