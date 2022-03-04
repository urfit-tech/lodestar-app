import { Button, SkeletonText } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import queryString from 'query-string'
import React, { useContext, useEffect, useRef } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import Responsive, { BREAK_POINT } from '../../components/common/Responsive'
import { BraftContent } from '../../components/common/StyledBraftEditor'
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
import ProgramPageHelmet from './ProgramPageHelmet'
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
  const { formatMessage } = useIntl()
  const { programId } = useParams<{ programId: string }>()
  const { pathname } = useLocation()
  const { currentMemberId } = useAuth()
  const { id: appId, settings, enabledModules } = useApp()
  const { resourceCollection } = useResourceCollection([`${appId}:program:${programId}`])
  const { visible } = useContext(PodcastPlayerContext)
  const { loadingProgram, program } = useProgram(programId)
  const enrolledProgramPackages = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const params = queryString.parse(location.search)

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
      <ProgramPageHelmet program={program} />
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}

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
