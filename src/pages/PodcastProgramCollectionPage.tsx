import { Button, Icon } from 'antd'
import { flatten, uniqBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useAuth } from '../components/auth/AuthContext'
import { AuthModalContext } from '../components/auth/AuthModal'
import { StyledBanner, StyledBannerTitle } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import PodcastProgramCard from '../components/podcast/PodcastProgramCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import CheckoutPodcastPlanModal from '../containers/checkout/CheckoutPodcastPlanModal'
import { useApp } from '../containers/common/AppContext'
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline'
import PopularPodcastCollection from '../containers/podcast/PopularPodcastCollection'
import LanguageContext from '../contexts/LanguageContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { useMember } from '../hooks/member'
import { usePodcastProgramCollection } from '../hooks/podcast'

const PodcastProgramCollectionPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { settings } = useApp()
  const { pageTitle } = useNav()
  const { currentLanguage } = useContext(LanguageContext)
  const { podcastPrograms } = usePodcastProgramCollection()
  const { member } = useMember(currentMemberId || '')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const categories = uniqBy(
    category => category.id,
    flatten(podcastPrograms.map(podcastProgram => podcastProgram.categories)),
  )

  let seoMeta:
    | {
        title?: string
        description?: string
      }
    | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta'])?.PodcastProgramCollectionPage
  } catch (error) {}

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: seoMeta?.title,
    description: seoMeta?.description,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: settings['seo.name'],
      description: settings['open_graph.description'],
    },
  })

  useEffect(() => {
    if (podcastPrograms) {
      podcastPrograms.forEach((podcastProgram, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: podcastProgram.id,
          name: podcastProgram.title,
          category: 'PodcastProgram',
          price: `${podcastProgram.listPrice}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: podcastProgram.id,
          name: podcastProgram.title,
          category: 'PodcastProgram',
          price: `${podcastProgram.listPrice}`,
          position: index + 1,
        })
      })
      ReactGA.plugin.execute('ec', 'setAction', 'detail')
      ReactGA.ga('send', 'pageview')
    }
  }, [podcastPrograms])

  return (
    <DefaultLayout white>
      <Helmet>
        <title>{seoMeta?.title}</title>
        <meta name="description" content={seoMeta?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoMeta?.title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content={seoMeta?.description} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon type="appstore" theme="filled" className="mr-3" />
            <span>{pageTitle || formatMessage(productMessages.podcast.title.broadcast)}</span>
          </StyledBannerTitle>

          <Button
            type={selectedCategoryId === null ? 'primary' : 'default'}
            shape="round"
            onClick={() => setSelectedCategoryId(null)}
            className="mb-2"
          >
            {formatMessage(commonMessages.button.allCategory)}
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              type={selectedCategoryId === category.id ? 'primary' : 'default'}
              shape="round"
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </StyledBanner>

      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => (
          <div className="container py-5">
            <div className="row">
              <div className="col-12 col-lg-8 mb-5">
                <PodcastProgramTimeline
                  memberId={currentMemberId}
                  podcastPrograms={podcastPrograms
                    .filter(
                      podcastProgram =>
                        !selectedCategoryId ||
                        podcastProgram.categories.some(category => category.id === selectedCategoryId),
                    )
                    .filter(
                      podcastProgram =>
                        !podcastProgram.supportLocales ||
                        podcastProgram.supportLocales.find(locale => locale === currentLanguage),
                    )}
                  renderItem={({ podcastProgram, isEnrolled, isSubscribed }) => (
                    <CheckoutPodcastPlanModal
                      renderTrigger={({ setVisible: setCheckoutModalVisible }) => (
                        <PodcastProgramPopover
                          key={podcastProgram.id}
                          isEnrolled={isEnrolled}
                          isSubscribed={isSubscribed}
                          podcastProgramId={podcastProgram.id}
                          title={podcastProgram.title}
                          listPrice={podcastProgram.listPrice}
                          salePrice={podcastProgram.salePrice}
                          duration={podcastProgram.duration}
                          durationSecond={podcastProgram.durationSecond}
                          description={podcastProgram.description}
                          categories={podcastProgram.categories}
                          instructor={podcastProgram.instructor}
                          onSubscribe={() =>
                            isAuthenticated
                              ? setCheckoutModalVisible()
                              : setAuthModalVisible && setAuthModalVisible(true)
                          }
                        >
                          <PodcastProgramCard
                            coverUrl={podcastProgram.coverUrl}
                            title={podcastProgram.title}
                            instructor={podcastProgram.instructor}
                            salePrice={podcastProgram.salePrice}
                            listPrice={podcastProgram.listPrice}
                            duration={podcastProgram.duration}
                            durationSecond={podcastProgram.durationSecond}
                            isEnrolled={isEnrolled}
                          />
                        </PodcastProgramPopover>
                      )}
                      paymentType="subscription"
                      creatorId={podcastProgram.instructor?.id || ''}
                      member={member}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-lg-4 pl-4">
                <PopularPodcastCollection />
              </div>
            </div>
          </div>
        )}
      </AuthModalContext.Consumer>
    </DefaultLayout>
  )
}

export default PodcastProgramCollectionPage
