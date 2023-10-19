import { Icon } from '@chakra-ui/icons'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten, prop, sortBy, uniqBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../components/auth/AuthModal'
import CheckoutPodcastPlanModal from '../components/checkout/CheckoutPodcastPlanModal'
import { StyledBanner, StyledBannerTitle } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import PodcastProgramCard from '../components/podcast/PodcastProgramCard'
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover'
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline'
import PopularPodcastCollection from '../containers/podcast/PopularPodcastCollection'
import LocaleContext from '../contexts/LocaleContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { usePodcastProgramCollection } from '../hooks/podcast'
import { StyledButton } from './ProgramCollectionPage/ProgramCollectionPage'

const PodcastProgramCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { pageTitle } = useNav()
  const { currentLocale } = useContext(LocaleContext)
  const { podcastPrograms } = usePodcastProgramCollection()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const categories = sortBy(prop('position'))(
    uniqBy(category => category?.id, flatten(podcastPrograms.map(podcastProgram => podcastProgram.categories))),
  )

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
        <title>{pageTitle || formatMessage(productMessages.podcast.title.broadcast)}</title>
      </Helmet>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon as={AiFillAppstore} className="mr-3" />
            <span>{pageTitle || formatMessage(productMessages.podcast.title.broadcast)}</span>
          </StyledBannerTitle>

          <StyledButton
            colorScheme="primary"
            variant={selectedCategoryId === null ? 'solid' : 'outline'}
            onClick={() => setSelectedCategoryId(null)}
            className="mb-2"
          >
            {formatMessage(commonMessages.button.allCategory)}
          </StyledButton>
          {categories.map(category => (
            <StyledButton
              key={category?.id}
              colorScheme="primary"
              variant={selectedCategoryId === category?.id ? 'solid' : 'outline'}
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(category?.id || '')}
            >
              {category?.name}
            </StyledButton>
          ))}
        </div>
      </StyledBanner>

      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => (
          <div className="container py-5">
            <div className="row">
              <div className="col-12 col-lg-8 mb-5">
                <PodcastProgramTimeline
                  podcastPrograms={podcastPrograms
                    .filter(
                      podcastProgram =>
                        !selectedCategoryId ||
                        podcastProgram.categories?.some(category => category.id === selectedCategoryId),
                    )
                    .filter(
                      podcastProgram =>
                        !podcastProgram.supportLocales ||
                        podcastProgram.supportLocales.find(locale => locale === currentLocale),
                    )}
                  renderItem={({ podcastProgram, isEnrolled, isSubscribed }) => (
                    <CheckoutPodcastPlanModal
                      creatorId={podcastProgram.instructor?.id || ''}
                      renderTrigger={({ onOpen }) => (
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
                          isIndividuallySale={podcastProgram.isIndividuallySale}
                          onSubscribe={() => (isAuthenticated ? onOpen?.() : setAuthModalVisible?.(true))}
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
                            isIndividuallySale={podcastProgram.isIndividuallySale}
                          />
                        </PodcastProgramPopover>
                      )}
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
