import { Button, Icon, Spinner } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import queryString from 'query-string'
import React, { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { defineMessage, useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link, useLocation, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import Responsive, { BREAK_POINT } from '../../../../components/common/Responsive'
import ReviewCollectionBlock from '../../../../components/review/ReviewCollectionBlock'
import MediaPlayerContext from '../../../../contexts/MediaPlayerContext'
import PodcastPlayerContext from '../../../../contexts/PodcastPlayerContext'
import { desktopViewMixin, handleError } from '../../../../helpers'
import { commonMessages } from '../../../../helpers/translation'
import {
  useEquityProgramByProgramId,
  useProgram,
  useProgramPlansEnrollmentsAggregateList,
} from '../../../../hooks/program'
import { useEnrolledProgramPackage } from '../../../../hooks/programPackage'
import { ReactComponent as PlayIcon } from '../../../../images/play-fill-icon.svg'
import { DisplayModeEnum } from '../../../../types/program'
import PreviewBlock from '../PreviewBlock'
import ProgramIntroTabs from '../ProgramIntroTabs'
import SecondaryProgramBanner from '../SecondaryProgramBanner'
import SecondaryProgramInfoCard from '../SecondaryProgramInfoCard'
import SecondaryProgramPlanCard from '../SecondaryProgramPlanCard'
import { colors } from '../style'

const VideoPlayer = lazy(() => import('../../../../components/common/VideoPlayer'))

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    padding-left: 35px;
  `)}
`
const StyledProgramAbstract = styled.span`
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  width: 100%;
  white-space: pre-line;
`
const StyledPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
`

const StyledContentWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
  margin-bottom: 3rem;
`

const StyledProgramIntroBlock = styled.div`
  position: relative;
  padding-top: 2.5rem;
  padding-bottom: 6rem;
  background: ${colors.white};

  @media (min-width: ${BREAK_POINT}px) {
    padding-top: 3.5rem;
    padding-bottom: 1rem;
  }
`

const StyledFixedBottomBlock = styled.div<{ bottomSpace?: string }>`
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
  background: ${colors.white};
`

const SecondaryProgramPageContent: React.FC = () => {
  const { formatMessage } = useIntl()
  const { programId } = useParams<{ programId: string }>()
  const { pathname, search } = useLocation()
  const params = queryString.parse(search)

  const { currentMemberId } = useAuth()
  const { settings, enabledModules } = useApp()
  const { visible: podcastPlayerVisible } = useContext(PodcastPlayerContext)
  const { visible: mediaPlayerVisible } = useContext(MediaPlayerContext)
  const { program, addProgramView } = useProgram(programId)
  const { data: enrolledProgramPackages } = useEnrolledProgramPackage(currentMemberId || '', { programId })
  const { isEquityProgram } = useEquityProgramByProgramId(programId)
  const { loading: loadingProgramPlansEnrollmentsAggregateList, programPlansEnrollmentsAggregateList } =
    useProgramPlansEnrollmentsAggregateList(program?.plans.map(plan => plan.id) || [])
  const [isPlanListSticky, setIsPlanListSticky] = useState(false)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const planListHeightRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)

  const scrollToPreview = () => previewRef?.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToPlanBlock = () => planBlockRef?.current?.scrollIntoView({ behavior: 'smooth' })

  try {
    const visitedPrograms = JSON.parse(sessionStorage.getItem('kolable.programs.visited') || '[]') as string[]
    if (!visitedPrograms.includes(programId)) {
      visitedPrograms.push(programId)
      sessionStorage.setItem('kolable.programs.visited', JSON.stringify(visitedPrograms))
      addProgramView()
    }
  } catch (error) {
    handleError(error)
  }

  useEffect(() => {
    ReactGA.ga('send', 'pageview')
  }, [])

  useEffect(() => {
    if (customerReviewBlockRef.current && params.moveToBlock === 'customer-review') {
      setTimeout(() => customerReviewBlockRef.current?.scrollIntoView({ behavior: 'smooth' }), 1000)
    }
  }, [customerReviewBlockRef, params])

  useEffect(() => {
    if (!loadingProgramPlansEnrollmentsAggregateList) {
      setIsPlanListSticky(window.innerHeight > (planListHeightRef.current?.clientHeight || 0) + 104)
    }
  }, [loadingProgramPlansEnrollmentsAggregateList])

  const isEnrolledByProgramPackage = !!enrolledProgramPackages.length

  const isDelivered = isEnrolledByProgramPackage
    ? enrolledProgramPackages.some(programPackage =>
        programPackage.enrolledPlans.some(plan => !plan.isTempoDelivery)
          ? true
          : programPackage.programs.some(program => program.id === programId && program.isDelivered),
      )
    : false

  let trialProgramContentMedias = program.contentSections
    .filter(programContentSection => programContentSection.contents.length)
    .map(programContentSection =>
      programContentSection.contents
        .filter(
          programContent =>
            programContent.displayMode === DisplayModeEnum.trial ||
            programContent.displayMode === DisplayModeEnum.loginToTrial,
        )
        .filter(programContent => programContent.contentType === 'audio' || programContent.contentType === 'video'),
    )
    .flat()

  // 如果沒有登入 只提供 trial
  if (!currentMemberId) {
    trialProgramContentMedias = trialProgramContentMedias.filter(
      trialProgramContent => trialProgramContent.displayMode === DisplayModeEnum.trial,
    )
  }

  return (
    <>
      <div>
        <SecondaryProgramBanner
          program={program}
          isEnrolledByProgramPackage={isEnrolledByProgramPackage}
          isDelivered={isDelivered}
          hasIntroductionVideo={!!program.coverVideoUrl}
          scrollToPreview={scrollToPreview}
          scrollToPlanBlock={scrollToPlanBlock}
        />
        <StyledProgramIntroBlock>
          <div className="container">
            <div className="row">
              <StyledContentWrapper className="col-12 col-lg-8">
                <SecondaryProgramInfoCard program={program} />
                <StyledProgramAbstract>{program?.abstract}</StyledProgramAbstract>
                {program.coverVideoUrl && (
                  <StyledPlayer ref={previewRef}>
                    {program.coverVideoUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
                      <video
                        controlsList="nodownload"
                        className="smartvideo"
                        src={program.coverVideoUrl}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : program.coverVideoUrl.includes('streaming.media.azure.net') ? (
                      <Suspense fallback={<Spinner />}>
                        <VideoPlayer
                          sources={[
                            { type: 'application/dash+xml', src: program.coverVideoUrl + '(format=mpd-time-cmaf)' },
                            { type: 'application/x-mpegURL', src: program.coverVideoUrl + '(format=m3u8-cmaf)' },
                          ]}
                        />
                      </Suspense>
                    ) : (
                      <ReactPlayer url={program.coverVideoUrl} width="100%" height="100%" controls />
                    )}
                  </StyledPlayer>
                )}
                <ProgramIntroTabs program={program} />
                {trialProgramContentMedias.length !== 0 ? (
                  <PreviewBlock trialProgramContentMedias={trialProgramContentMedias} />
                ) : null}
                {enabledModules.customer_review && (
                  <div id="customer-review" ref={customerReviewBlockRef}>
                    <ReviewCollectionBlock path={pathname} targetId={programId} />
                  </div>
                )}
              </StyledContentWrapper>

              <StyledIntroWrapper ref={planBlockRef} className="col-12 col-lg-4">
                <div
                  id="subscription"
                  className={`mb-5${isPlanListSticky ? ' programPlanSticky' : ''}`}
                  ref={planListHeightRef}
                >
                  {program.plans
                    .filter(programPlan => programPlan.publishedAt)
                    .map(programPlan => (
                      <div key={programPlan.id} className="mb-3">
                        <SecondaryProgramPlanCard
                          programId={program.id}
                          programPlan={programPlan}
                          enrollmentCount={
                            programPlansEnrollmentsAggregateList.find(v => v.id === programPlan.id)?.enrollmentCount
                          }
                          isProgramSoldOut={Boolean(program.isSoldOut)}
                          isPublished={Boolean(program.publishedAt)}
                        />
                      </div>
                    ))}
                </div>
              </StyledIntroWrapper>
            </div>
          </div>
        </StyledProgramIntroBlock>
      </div>

      {!isEnrolledByProgramPackage && (
        <Responsive.Default>
          <StyledFixedBottomBlock bottomSpace={podcastPlayerVisible || mediaPlayerVisible ? '92px' : ''}>
            {Number(settings['layout.program_page']) ? (
              <StyledButtonWrapper>
                <Link to={isEquityProgram ? `/programs/${program.id}/contents` : settings['link.program_page']}>
                  <Button isFullWidth leftIcon={<Icon as={PlayIcon} />}>
                    {formatMessage(defineMessage({ id: 'common.ui.start', defaultMessage: '開始進行' }))}
                  </Button>
                </Link>
              </StyledButtonWrapper>
            ) : isEquityProgram ? (
              <StyledButtonWrapper>
                <Link to={`${program.id}/contents`}>
                  <Button colorScheme="primary" isFullWidth>
                    {formatMessage(commonMessages.button.enter)}
                  </Button>
                </Link>
              </StyledButtonWrapper>
            ) : (
              <StyledButtonWrapper>
                <Button
                  colorScheme="primary"
                  isFullWidth
                  onClick={() => planBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {formatMessage(commonMessages.button.viewProject)}
                </Button>
              </StyledButtonWrapper>
            )}
          </StyledFixedBottomBlock>
        </Responsive.Default>
      )}
    </>
  )
}

export default SecondaryProgramPageContent
