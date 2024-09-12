import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { desktopViewMixin } from 'lodestar-app-element/src/helpers'
import queryString from 'query-string'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaShareAlt } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router'
import styled, { css, ThemeContext } from 'styled-components'
import { BREAK_POINT } from '../../../../components/common/Responsive'
import VideoPlayer from '../../../../components/common/VideoPlayer'
import ReviewCollectionBlock from '../../../../components/review/ReviewCollectionBlock'
import { useProgramPlansEnrollmentsAggregateList } from '../../../../hooks/program'
import EmptyCover from '../../../../images/empty-cover.png'
import { Program, ProgramContentSectionType } from '../../../../types/program'
import ProgramIntroTabs from '../../Secondary/ProgramIntroTabs'
import SecondaryProgramPlanCard from '../../Secondary/SecondaryProgramPlanCard'
import SocialSharePopover from '../../Secondary/SocialSharePopover'
import { colors } from '../../Secondary/style'

const StyledCoverImage = styled(Box)<{ coverUrl: string; coverMobileUrl: string }>`
  background-image: url(${props => props.coverMobileUrl || EmptyCover});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.coverUrl || EmptyCover});
  }
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

const StyledContentWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
  margin-bottom: 3rem;
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
  height: 315px;
`

const StyledIntroWrapper = styled.div`
  ${desktopViewMixin(css`
    padding-left: 35px;
  `)}
`

const StyledButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    font-weight: 600;
    border-radius: 21.5px;
    border: solid 1px ${props => props.theme['@primary-color']};
    background: ${colors.white};
    color: ${props => props.theme['@primary-color']};
  }
`

const layoutTemplateConfigMap = {
  bookSubTitle: '40a760a4-bca4-4249-be8d-8d6d611de807',
  bookInformation: 'a5328cbb-5635-47ec-bc7e-30a1d943042e',
  contentInformation: 'f5c67360-baaf-45d1-b98b-729e750eb16f',
}

const EbookTrialAndShareButtonGroup = ({
  programId,
  ebookTrialContentId,
  display,
  isHasEbookTrialSection,
}: {
  programId: string
  ebookTrialContentId: string
  display: { [key: string]: string }
  isHasEbookTrialSection: boolean
}) => {
  return (
    <Flex alignItems="center" gridGap="2" width="100%" display={display} marginTop="20px">
      {isHasEbookTrialSection && (
        <Link href={`/programs/${programId}/contents/${ebookTrialContentId}`} width="100%">
          <StyledButton>試看</StyledButton>
        </Link>
      )}
      <Box width="20%" display="flex" justifyContent="center">
        <SocialSharePopover url={window.location.href}>
          <FaShareAlt color="#9b9b9b" fontSize="20px" />
        </SocialSharePopover>
      </Box>
    </Flex>
  )
}

const EbookProgramPageContent: React.VFC<{
  program: Program & ProgramContentSectionType
}> = ({ program }) => {
  const { enabledModules } = useApp()
  const { pathname, search } = useLocation()
  const params = queryString.parse(search)
  const theme = useContext(ThemeContext)
  const { loading: loadingProgramPlansEnrollmentsAggregateList, programPlansEnrollmentsAggregateList } =
    useProgramPlansEnrollmentsAggregateList(program?.plans.map(plan => plan.id) || [])
  const { moduleData, title, coverUrl, coverMobileUrl } = program
  const bookSubTitle = moduleData?.[layoutTemplateConfigMap.bookSubTitle]
  const bookInformation = moduleData?.[layoutTemplateConfigMap.bookInformation]
  const contentInformation = moduleData?.[layoutTemplateConfigMap.contentInformation]

  const [isPlanListSticky, setIsPlanListSticky] = useState(false)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const planListHeightRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const customerReviewBlockRef = useRef<HTMLDivElement>(null)

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

  const ebookTrialSection = program.contentSections.find(section =>
    section.contents.some(content => {
      const isTrial = content?.displayMode === 'trial' || content?.displayMode === 'loginToTrial'
      return isTrial && content.contentType === 'ebook'
    }),
  )
  const ebookTrialContent = ebookTrialSection?.contents.find(content => {
    const isTrial = content?.displayMode === 'trial' || content?.displayMode === 'loginToTrial'
    return isTrial && content.contentType === 'ebook'
  })

  return (
    <div>
      <StyledProgramIntroBlock>
        <div className="container">
          <div className="row">
            <StyledContentWrapper className="col-12 col-lg-8">
              <Flex gridGap="5" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                <Box>
                  <Box boxShadow="md" width="248px" height="248px">
                    <StyledCoverImage coverUrl={coverUrl} coverMobileUrl={coverMobileUrl} />
                  </Box>
                  <EbookTrialAndShareButtonGroup
                    programId={program.id}
                    ebookTrialContentId={ebookTrialContent?.id || ''}
                    display={{ base: 'none', md: 'flex' }}
                    isHasEbookTrialSection={!!ebookTrialSection}
                  />
                </Box>

                <Flex flexDirection="column">
                  <Text fontSize="xl" as="b">
                    {title}
                  </Text>
                  <Text fontSize="lg" as="b" color={theme['@primary-color']} marginBottom="20px">
                    {bookSubTitle}
                  </Text>
                  <BraftContent>{bookInformation}</BraftContent>
                  <EbookTrialAndShareButtonGroup
                    programId={program.id}
                    ebookTrialContentId={ebookTrialContent?.id || ''}
                    display={{ base: 'flex', md: 'none' }}
                    isHasEbookTrialSection={!!ebookTrialSection}
                  />
                </Flex>
              </Flex>
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
                    <VideoPlayer
                      sources={[
                        { type: 'application/dash+xml', src: program.coverVideoUrl + '(format=mpd-time-cmaf)' },
                        { type: 'application/x-mpegURL', src: program.coverVideoUrl + '(format=m3u8-cmaf)' },
                      ]}
                    />
                  ) : (
                    <ReactPlayer url={program.coverVideoUrl} width="100%" height="100%" controls />
                  )}
                </StyledPlayer>
              )}
              <ProgramIntroTabs program={program} contentInformation={contentInformation} />
              {enabledModules.customer_review && (
                <div id="customer-review" ref={customerReviewBlockRef}>
                  <ReviewCollectionBlock path={pathname} targetId={program.id} />
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
  )
}

export default EbookProgramPageContent
