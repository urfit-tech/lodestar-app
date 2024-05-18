import { Box } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BREAK_POINT } from '../../../components/common/Responsive'
import { commonMessages } from '../../../helpers/translation'
import { ReactComponent as PlayIcon } from '../../../images/play-fill.svg'
import { Program } from '../../../types/program'
import Banner from './Banner'
import { SecondaryEnrollButton, SecondaryOutlineButton } from './SecondaryCTAButton'
import SocialSharePopover from './SocialSharePopover'

const ContentWrapper = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  bottom: 40px;
  left: 16px;

  @media (min-width: ${BREAK_POINT}px) {
    left: 80px;
    bottom: 60px;
  }
`

const IconWrapper = styled.a`
  position: absolute;
  top: 24px;
  right: 24px;
`

const StyledInstructor = styled.h1`
  color: white;
  font-size: 16px;
`

const StyledTitle = styled.h1`
  color: white;
  font-size: 24px;
  line-height: 1.23;
  letter-spacing: 1px;
  font-weight: bold;
  max-width: 240px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
    max-width: 520px;
  }
`

const StyledTitleBlock = styled.div<{ noVideo?: boolean }>`
  position: relative;
  height: 100%;
`

const EnrollButton = styled(SecondaryEnrollButton)`
  && {
    width: 140px;
    height: 45px;
    border-radius: 21.5px;
    background-color: #ff2f1a;
    @media (min-width: ${BREAK_POINT}px) {
      width: 200px;
    }
  }
`

const PreviewButton = styled(SecondaryOutlineButton)`
  && {
    width: 140px;
    height: 45px;
    border-radius: 21.5px;
    border: solid 1px #fff;
    @media (min-width: ${BREAK_POINT}px) {
      width: 200px;
    }
  }
`

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 12px;
  width: 150px;
  @media (min-width: ${BREAK_POINT}px) {
    grid-template-columns: 1fr;
  }
`

const WordingWrapper = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 32px;
  }
`

const SecondaryProgramBanner: React.VFC<{
  program: Program & {
    tags: string[]
  }
  isEnrolledByProgramPackage?: boolean
  isDelivered?: boolean
  hasTrail?: boolean
  scrollToPreview: () => void | undefined
  scrollToPlanBlock: () => void | undefined
}> = ({ program, hasTrail, scrollToPreview, scrollToPlanBlock }) => {
  const { formatMessage } = useIntl()

  // TODO: use program banner video

  const testVideoUrl =
    'https://static.kolable.com/program_covers/cw/241a5e5d-5f1c-43ed-8e9e-15f6fedd8de0_video_1704882517657'

  return (
    <Box overflow="hidden">
      <Banner
        coverUrl={{
          videoUrl: testVideoUrl,
          mobileUrl: program.coverMobileUrl || undefined,
          desktopUrl: program.coverUrl || undefined,
        }}
      >
        <StyledTitleBlock>
          <IconWrapper>
            <SocialSharePopover url={window.location.href} />
          </IconWrapper>
          <ContentWrapper>
            <WordingWrapper>
              <StyledInstructor className="text-start">
                {program.roles
                  .filter(role => role.name === 'instructor')
                  .map(role => role.memberName)
                  .join(', ')}
              </StyledInstructor>
              <StyledTitle className="text-start">{program.title}</StyledTitle>
            </WordingWrapper>
            <ButtonWrapper>
              <EnrollButton onClick={scrollToPlanBlock}>{formatMessage(commonMessages.ui.ctaButton)}</EnrollButton>
              {hasTrail ? (
                <PreviewButton colorScheme="outlined" onClick={scrollToPreview} leftIcon={<PlayIcon />}>
                  {formatMessage(commonMessages.ui.previewButton)}
                </PreviewButton>
              ) : (
                <div />
              )}
            </ButtonWrapper>
          </ContentWrapper>
        </StyledTitleBlock>
      </Banner>
    </Box>
  )
}

export default SecondaryProgramBanner
