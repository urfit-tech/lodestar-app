import { Divider, Icon, Tag, Typography } from 'antd'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../components/auth/AuthModal'
import ProgramContentTrialModal from '../../components/program/ProgramContentTrialModal'
import { durationFormatter, isMobile } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useEnrolledProgramIds } from '../../hooks/program'
import { MicrophoneIcon, BookIcon } from '../../images'
import { DisplayModeEnum, Program, ProgramContent, ProgramContentSection } from '../../types/program'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
`
const ProgramSectionBlock = styled.div`
  margin-bottom: 2.5rem;
`
const ProgramSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`

const MobileProgramContentItem = styled.div<{ isEnrolled: boolean }>`
  position: relative;
  margin-bottom: 12px;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f7f8f8;
  font-size: 14px;
  ${props => props.isEnrolled && `cursor: pointer;`}

  .ant-typography-secondary {
    font-size: 12px;
  }
`

const ProgramContentItem = styled(MobileProgramContentItem)<{ isEnrolled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledObscure = styled.span`
  &::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    cursor: pointer;
  }
`
const StyledTag = styled(Tag)`
  && {
    border: none;
  }
`
const StyledDuration = styled.span`
  font-size: 12px;
  color: rgb(155, 155, 155);
`

const ProgramContentListSection: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const theme = useAppTheme()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const isEnrolled = enrolledProgramIds.includes(program.id)

  const layoutContent = document.getElementById('layout-content')

  useEffect(() => {
    const autoScroll = setTimeout(() => {
      const url = new URL(window.location.href)
      const position = url.searchParams.get('position')
      let scrollY = 0
      try {
        scrollY = parseInt(position || '0')
      } catch {
        scrollY = 0
      }
      layoutContent?.scrollTo({ top: scrollY })
      url.searchParams.delete('position')
      window.history.replaceState({}, '', url.toString())
    }, 500)
    return () => {
      clearTimeout(autoScroll)
    }
  }, [])

  const programContentSections = program.contentSections
    .filter(programContentSection => programContentSection.contents.length)
    .map(programContentSection => ({
      id: programContentSection.id,
      title: programContentSection.title,
      description: programContentSection.description,
      contents: isEnrolled
        ? programContentSection.contents
        : programContentSection.contents.filter(programContent =>
            program.isIntroductionSectionVisible
              ? programContent
              : programContent.displayMode === DisplayModeEnum.trial ||
                programContent.displayMode === DisplayModeEnum.loginToTrial,
          ),
    }))
  return (
    <>
      {programContentSections.some(programContentSection => programContentSection.contents.length > 0) && (
        <>
          <StyledTitle>{formatMessage(productMessages.program.title.content)}</StyledTitle>
          <Divider className="mt-1" />
        </>
      )}
      {programContentSections.map(programContentSection => (
        <ProgramSectionBlock key={programContentSection.id}>
          {programContentSection.contents.length > 0 && (
            <ProgramSectionTitle className="mb-3">{programContentSection.title}</ProgramSectionTitle>
          )}
          {programContentSection.contents.map(programContent =>
            isMobile ? (
              <MobileProgramContentItem
                key={programContent.id}
                isEnrolled={isEnrolled}
                onClick={() => {
                  if (isEnrolled) {
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
                  } else if (programContent.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                    const url = new URL(window.location.href)
                    url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                    url.searchParams.set('programContentId', programContent.id)
                    window.history.pushState({}, '', url.toString())
                    setAuthModalVisible?.(true)
                  } else if (
                    programContent.contentType === 'ebook' &&
                    programContent.displayMode === DisplayModeEnum.trial
                  ) {
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
                  }
                }}
              >
                <Typography.Text className="d-flex align-items-center">
                  <span>{programContent.title}</span>
                </Typography.Text>

                <StyledDuration className="mt-2 d-flex align-items-center duration-text">
                  {(programContent.displayMode === DisplayModeEnum.trial ||
                    (programContent.displayMode === DisplayModeEnum.loginToTrial && isAuthenticated)) &&
                  !isEnrolled ? (
                    programContent.contentType === 'ebook' ? (
                      <StyledTag color={theme.colors.primary[500]}>
                        {formatMessage(productMessages.program.content.trial)}
                      </StyledTag>
                    ) : (
                      <ProgramContentTrialModal
                        programId={program.id}
                        programContentId={programContent.id}
                        render={({ setVisible }) => (
                          <StyledObscure onClick={() => setVisible(true)}>
                            <StyledTag color={theme.colors.primary[500]}>
                              {formatMessage(
                                programContent.contentType === 'audio'
                                  ? productMessages.program.content.audioTrial
                                  : productMessages.program.content.trial,
                              )}
                            </StyledTag>
                          </StyledObscure>
                        )}
                      />
                    )
                  ) : programContent.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated ? (
                    <StyledTag color={theme.colors.primary[500]}>
                      {formatMessage(
                        programContent.contentType === 'audio'
                          ? productMessages.program.content.audioTrial
                          : productMessages.program.content.trial,
                      )}
                    </StyledTag>
                  ) : null}
                  {programContent.contentType === 'video' ? (
                    <Icon type="video-camera" className="mr-2" />
                  ) : programContent.contentType === 'audio' ? (
                    <MicrophoneIcon className="mr-2" />
                  ) : programContent.contentType === 'ebook' ? (
                    <BookIcon className="mr-2" />
                  ) : (
                    <Icon type="file-text" className="mr-2" />
                  )}
                  {durationFormatter(programContent.duration) || ''}
                  <span className="ml-2">
                    {moment().isBefore(moment(programContent.publishedAt)) &&
                      ` (${moment(programContent.publishedAt).format('MM/DD')} ${formatMessage(
                        commonMessages.text.publish,
                      )}) `}
                  </span>
                </StyledDuration>
              </MobileProgramContentItem>
            ) : (
              <ProgramContentItem
                key={programContent.id}
                isEnrolled={isEnrolled}
                onClick={() => {
                  if (isEnrolled) {
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
                  } else if (programContent.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                    const url = new URL(window.location.href)
                    url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                    url.searchParams.set('programContentId', programContent.id)
                    window.history.pushState({}, '', url.toString())
                    setAuthModalVisible?.(true)
                  } else if (
                    programContent.contentType === 'ebook' &&
                    programContent.displayMode === DisplayModeEnum.trial
                  ) {
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
                  }
                }}
              >
                <Typography.Text className="d-flex align-items-center">
                  {programContent.contentType === 'video' ? (
                    <Icon type="video-camera" className="mr-2" />
                  ) : programContent.contentType === 'audio' ? (
                    <MicrophoneIcon className="mr-2" />
                  ) : programContent.contentType === 'ebook' ? (
                    <BookIcon className="mr-2" />
                  ) : (
                    <Icon type="file-text" className="mr-2" />
                  )}
                  <span>{programContent.title}</span>
                </Typography.Text>
                <StyledDuration>
                  {(programContent.displayMode === DisplayModeEnum.trial ||
                    (programContent.displayMode === DisplayModeEnum.loginToTrial && isAuthenticated)) &&
                  !isEnrolled ? (
                    programContent.contentType === 'ebook' ? (
                      <StyledTag color={theme.colors.primary[500]}>
                        {formatMessage(productMessages.program.content.trial)}
                      </StyledTag>
                    ) : (
                      <ProgramContentTrialModal
                        programId={program.id}
                        programContentId={programContent.id}
                        render={({ setVisible }) => (
                          <StyledObscure onClick={() => setVisible(true)}>
                            <StyledTag color={theme.colors.primary[500]}>
                              {formatMessage(
                                programContent.contentType === 'audio'
                                  ? productMessages.program.content.audioTrial
                                  : productMessages.program.content.trial,
                              )}
                            </StyledTag>
                          </StyledObscure>
                        )}
                      />
                    )
                  ) : programContent.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated ? (
                    <StyledObscure>
                      <StyledTag color={theme.colors.primary[500]}>
                        {formatMessage(
                          programContent.contentType === 'audio'
                            ? productMessages.program.content.audioTrial
                            : productMessages.program.content.trial,
                        )}
                      </StyledTag>
                    </StyledObscure>
                  ) : null}
                  <span className="mr-2">
                    {moment().isBefore(moment(programContent.publishedAt)) &&
                      ` (${moment(programContent.publishedAt).format('MM/DD')} ${formatMessage(
                        commonMessages.text.publish,
                      )})`}
                  </span>
                  {durationFormatter(programContent.duration) || ''}
                </StyledDuration>
              </ProgramContentItem>
            ),
          )}
        </ProgramSectionBlock>
      ))}
    </>
  )
}

export default ProgramContentListSection
