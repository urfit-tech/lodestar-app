import { useApolloClient } from '@apollo/react-hooks'
import { Button, SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { render } from 'mustache'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import Responsive, { BREAK_POINT } from '../../components/common/Responsive'
import { BraftContent } from '../../components/common/StyledBraftEditor'
import { Detail } from '../../components/common/Tracking'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ReviewCollectionBlock from '../../components/review/ReviewCollectionBlock'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin, rgba } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
import ForbiddenPage from '../ForbiddenPage'
import { PerpetualProgramBanner } from './ProgramBanner'
import ProgramContentListSection from './ProgramContentListSection'
import ProgramContentCountBlock from './ProgramInfoBlock/ProgramContentCountBlock'
import ProgramInfoCard, { StyledProgramInfoCard } from './ProgramInfoBlock/ProgramInfoCard'
import ProgramInstructorCollectionBlock from './ProgramInstructorCollectionBlock'
import ProgramPlanCard from './ProgramPlanCard'

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
  const tracking = useTracking()
  const { formatMessage } = useIntl()
  const { programId } = useParams<{ programId: string }>()
  const { pathname } = useLocation()
  const { currentMemberId, currentMember } = useAuth()
  const { id: appId, settings, enabledModules } = useApp()
  const { visible } = useContext(PodcastPlayerContext)
  const { loadingProgram, program } = useProgram(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const apolloClient = useApolloClient()
  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const params = queryString.parse(location.search)
  const [pageFrom] = useQueryParam('pageFrom', StringParam)

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
    ReactGA.ga('send', 'pageview')
  }, [])

  if (loadingProgram || enrolledProgramPackages.loading) {
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
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''

  const isEnrolledByProgramPackage = !!enrolledProgramPackages.data.length

  const isDelivered = isEnrolledByProgramPackage
    ? enrolledProgramPackages.data.some(programPackage =>
        programPackage.enrolledPlans.some(plan => !plan.isTempoDelivery)
          ? true
          : programPackage.programs.some(program => program.id === programId && program.isDelivered),
      )
    : false

  return (
    <DefaultLayout white footerBottomSpace={program.plans.length > 1 ? '60px' : '132px'}>
      <Detail type="program" id={program.id} />
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
        <PerpetualProgramBanner
          program={program}
          isEnrolledByProgramPackage={isEnrolledByProgramPackage}
          isDelivered={isDelivered}
        />
        <ProgramIntroBlock>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <Responsive.Default>
                  <StyledProgramInfoCard>
                    <ProgramContentCountBlock program={program} />
                  </StyledProgramInfoCard>
                </Responsive.Default>
                {program.abstract && (
                  <div className="mb-5">
                    <ProgramAbstract>{program.abstract}</ProgramAbstract>
                  </div>
                )}

                <div className="mb-5">
                  <BraftContent>{program.description}</BraftContent>
                </div>

                <div className="mb-5">
                  <ProgramContentListSection memberId={currentMemberId || ''} program={program} />
                </div>
              </div>
              <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4">
                <Responsive.Desktop>
                  <ProgramInfoCard instructorId={instructorId} program={program} />
                </Responsive.Desktop>

                {!isEnrolledByProgramPackage && (
                  <div className="mb-5">
                    <div id="subscription">
                      {program.plans
                        .filter(programPlan => programPlan.publishedAt)
                        .map(programPlan => (
                          <div key={programPlan.id} className="mb-3">
                            <ProgramPlanCard programId={program.id} programPlan={programPlan} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </StyledIntroWrapper>
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

      {!isEnrolledByProgramPackage && (
        <Responsive.Default>
          <FixedBottomBlock bottomSpace={visible ? '92px' : ''}>
            <StyledButtonWrapper>
              <Button
                variant="primary"
                isFullWidth
                onClick={() => planBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                {formatMessage(commonMessages.button.viewProject)}
              </Button>
            </StyledButtonWrapper>
          </FixedBottomBlock>
        </Responsive.Default>
      )}
    </DefaultLayout>
  )
}

export default ProgramPage
