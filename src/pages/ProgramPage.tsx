import { Button, SkeletonText } from '@chakra-ui/react'
import { render } from 'mustache'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import Responsive, { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import PerpetualProgramBanner from '../components/program/ProgramBanner/PerpetualProgramBanner'
import SubscriptionProgramBanner from '../components/program/ProgramBanner/SubscriptionProgramBanner'
import ProgramContentListSection from '../components/program/ProgramContentListSection'
import ProgramInfoBlock from '../components/program/ProgramInfoBlock'
import ProgramInstructorCollectionBlock from '../components/program/ProgramInstructorCollectionBlock'
import ProgramPerpetualPlanCard from '../components/program/ProgramPerpetualPlanCard'
import ProgramSubscriptionPlanSection from '../components/program/ProgramSubscriptionPlanSection'
import ReviewCollectionBlock from '../components/review/ReviewCollectionBlock'
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
const ProgramAbstract = styled.span`
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
const ProgramIntroBlock = styled.div`
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

const ProgramPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { programId } = useParams<{ programId: string }>()
  const { pathname } = useLocation()
  const { currentMemberId } = useAuth()
  const { id: appId, settings, enabledModules } = useApp()
  const { visible } = useContext(PodcastPlayerContext)
  const { loadingProgram, program } = useProgram(programId)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const params = queryString.parse(location.search)

  let seoMeta:
    | {
        title?: string
        description?: string
      }
    | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta'])?.ProgramPage
  } catch (error) {}

  const siteTitle = program?.title
    ? seoMeta?.title
      ? `${render(seoMeta.title, { programTitle: program.title })}`
      : program.title
    : appId

  const siteDescription = program?.abstract || settings['open_graph.description']
  const siteImage = program?.coverUrl || settings['open_graph.image']

  useEffect(() => {
    if (customerReviewBlockRef.current && params.moveToBlock) {
      customerReviewBlockRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [customerReviewBlockRef, params])

  useEffect(() => {
    if (program) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: program.id,
        name: program.title,
        category: 'Program',
        price: `${program.listPrice}`,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'detail')
      ReactGA.ga('send', 'pageview')
    }
  }, [program])

  if (loadingProgram) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!program) {
    return <ForbiddenPage />
  }

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: program.title,
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
    <DefaultLayout white footerBottomSpace={program.isSubscription ? '60px' : '132px'}>
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

      <div>
        {program.isSubscription ? (
          <SubscriptionProgramBanner program={program} />
        ) : (
          <PerpetualProgramBanner program={program} />
        )}

        <ProgramIntroBlock>
          <div className="container">
            <div className="row">
              {!program.isSubscription && (
                <StyledIntroWrapper className="col-12 col-lg-4">
                  <ProgramInfoBlock program={program} />
                </StyledIntroWrapper>
              )}

              <div className="col-12 col-lg-8">
                <div className="mb-5">
                  <ProgramAbstract>{program.abstract}</ProgramAbstract>
                </div>

                <div className="mb-5">
                  <BraftContent>{program.description}</BraftContent>
                </div>

                <div className="mb-5">
                  <ProgramContentListSection memberId={currentMemberId || ''} program={program} />
                </div>
              </div>

              {program.isSubscription && (
                <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4">
                  <div className="mb-5">
                    <ProgramSubscriptionPlanSection program={program} />
                  </div>
                </StyledIntroWrapper>
              )}
            </div>

            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="mb-5">
                  <ProgramInstructorCollectionBlock program={program} />
                </div>
              </div>
            </div>
            <div id="customer-review" ref={customerReviewBlockRef}>
              {enabledModules.customer_review && (
                <div className="row">
                  <div className="col-12 col-lg-8">
                    <div className="mb-5">
                      <ReviewCollectionBlock path={pathname} targetId={programId} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ProgramIntroBlock>
      </div>

      <Responsive.Default>
        <FixedBottomBlock bottomSpace={visible ? '92px' : ''}>
          {program.isSubscription ? (
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
            <ProgramPerpetualPlanCard memberId={currentMemberId || ''} program={program} />
          )}
        </FixedBottomBlock>
      </Responsive.Default>
    </DefaultLayout>
  )
}

export default ProgramPage
