import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { desktopViewMixin } from 'lodestar-app-element/src/helpers'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaShareAlt } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import styled, { css, ThemeContext } from 'styled-components'
import { BREAK_POINT } from '../../../../components/common/Responsive'
import VideoPlayer from '../../../../components/common/VideoPlayer'
import { useProgramPlansEnrollmentsAggregateList } from '../../../../hooks/program'
import { Program, ProgramContentSectionType } from '../../../../types/program'
import ProgramIntroTabs from '../../Secondary/ProgramIntroTabs'
import SecondaryProgramPlanCard from '../../Secondary/SecondaryProgramPlanCard'
import SocialSharePopover from '../../Secondary/SocialSharePopover'
import { colors } from '../../Secondary/style'

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

const EbookProgramPageContent: React.VFC<{
  program: Program & ProgramContentSectionType
}> = ({ program }) => {
  const theme = useContext(ThemeContext)
  const { loading: loadingProgramPlansEnrollmentsAggregateList, programPlansEnrollmentsAggregateList } =
    useProgramPlansEnrollmentsAggregateList(program?.plans.map(plan => plan.id) || [])
  const { moduleData, title, coverUrl } = program
  const bookSubTitle = moduleData[layoutTemplateConfigMap.bookSubTitle]
  const bookInformation = moduleData[layoutTemplateConfigMap.bookInformation]
  const contentInformation = moduleData[layoutTemplateConfigMap.contentInformation]

  const [isPlanListSticky, setIsPlanListSticky] = useState(false)

  const planBlockRef = useRef<HTMLDivElement | null>(null)
  const planListHeightRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loadingProgramPlansEnrollmentsAggregateList) {
      setIsPlanListSticky(window.innerHeight > (planListHeightRef.current?.clientHeight || 0) + 104)
    }
  }, [loadingProgramPlansEnrollmentsAggregateList])

  const hasEbookTrialSection = program.contentSections.find(section =>
    section.contents.some(content => {
      const isTrial = content?.displayMode === 'trial' || content?.displayMode === 'loginToTrial'
      return isTrial && content.contentType === 'ebook'
    }),
  )
  const ebookTrialContent = hasEbookTrialSection?.contents.find(content => {
    const isTrial = content?.displayMode === 'trial' || content?.displayMode === 'loginToTrial'
    return isTrial && content.contentType === 'ebook'
  })

  return (
    <div>
      <StyledProgramIntroBlock>
        <div className="container">
          <div className="row">
            <StyledContentWrapper className="col-12 col-lg-8">
              <Flex gridGap="5">
                <Box>
                  <Box marginBottom="20px" boxShadow="md" width="248px" height="248px">
                    <Image src={coverUrl || ''} alt="cover" />
                  </Box>
                  <Flex alignItems="center" gridGap="2" width="100%">
                    <Link href={`/programs/${program.id}/contents/${ebookTrialContent?.id}`} width="100%">
                      <StyledButton>試閱</StyledButton>
                    </Link>
                    <Box width="20%" display="flex" justifyContent="center">
                      <SocialSharePopover url={window.location.href}>
                        <FaShareAlt color="#9b9b9b" fontSize="20px" />
                      </SocialSharePopover>
                    </Box>
                  </Flex>
                </Box>

                <Flex flexDirection="column">
                  <Text fontSize="xl" as="b">
                    {title}
                  </Text>
                  <Text fontSize="lg" as="b" color={theme['@primary-color']} marginBottom="20px">
                    {bookSubTitle}
                  </Text>
                  <BraftContent>{bookInformation}</BraftContent>
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
