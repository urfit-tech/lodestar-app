import { Icon, Tag, Typography } from 'antd'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../../components/auth/AuthModal'
import ProgramContentTrialModal from '../../../components/program/ProgramContentTrialModal'
import { durationFormatter, isMobile } from '../../../helpers'
import { commonMessages, productMessages } from '../../../helpers/translation'
import { BookIcon, MicrophoneIcon } from '../../../images'
import PinIcon from '../../../images/pin-v-2.svg'
import { DisplayModeEnum, Program, ProgramContent, ProgramContentSectionType } from '../../../types/program'

const StyledPinnedIcon = styled.span<{ pin: boolean }>`
  ${({ pin }) =>
    pin &&
    `
      ::before{
        content: url('${PinIcon}');
        position: absolute;
        top: -11px;
        right: -11px;
        font-size: 20px; 
        z-index: 999;
      }
    `}
`
const StyledMobileProgramContentItem = styled.div<{ isEnrolled: boolean }>`
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

const StyledProgramContentItem = styled(StyledMobileProgramContentItem)<{ isEnrolled: boolean }>`
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

const layoutContent = document.getElementById('layout-content')

const SecondaryProgramContentListItem: React.VFC<{
  program: Program & ProgramContentSectionType
  item: ProgramContent
  isPinned: boolean
  isEquityProgram: boolean
}> = ({ program, item, isPinned, isEquityProgram }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const theme = useAppTheme()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

  const isEbookTrial =
    (item.contentType === 'ebook' && item.displayMode === DisplayModeEnum.trial) ||
    item.displayMode === DisplayModeEnum.loginToTrial

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

  if (item == null) return <></>

  return (
    <>
      {isMobile ? (
        <div style={{ position: 'relative' }}>
          <StyledPinnedIcon pin={isPinned} />
          <StyledMobileProgramContentItem
            key={item.id}
            isEnrolled={isEquityProgram}
            onClick={() => {
              if (isEquityProgram) {
                history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
              } else if (item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                const url = new URL(window.location.href)
                url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                url.searchParams.set('programContentId', item.id)
                window.history.pushState({}, '', url.toString())
                setAuthModalVisible?.(true)
              } else if (isEbookTrial) {
                history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
              }
            }}
          >
            <Typography.Text className="d-flex align-items-center">
              <span>{item.title}</span>
            </Typography.Text>

            <StyledDuration className="mt-2 d-flex align-items-center duration-text">
              {(item.displayMode === DisplayModeEnum.trial ||
                (item.displayMode === DisplayModeEnum.loginToTrial && isAuthenticated)) &&
              !isEquityProgram ? (
                item.contentType === 'ebook' ? (
                  <StyledTag color={theme.colors.primary[500]}>
                    {formatMessage(productMessages.program.content.trial)}
                  </StyledTag>
                ) : (
                  <ProgramContentTrialModal
                    programId={program.id}
                    programContentId={item.id}
                    render={({ setVisible }) => (
                      <StyledObscure onClick={() => setVisible(true)}>
                        <StyledTag color={theme.colors.primary[500]}>
                          {formatMessage(
                            item.contentType === 'audio'
                              ? productMessages.program.content.audioTrial
                              : productMessages.program.content.trial,
                          )}
                        </StyledTag>
                      </StyledObscure>
                    )}
                  />
                )
              ) : item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated ? (
                <StyledTag color={theme.colors.primary[500]}>
                  {formatMessage(
                    item.contentType === 'audio'
                      ? productMessages.program.content.audioTrial
                      : productMessages.program.content.trial,
                  )}
                </StyledTag>
              ) : null}
              {item.contentType === 'video' ? (
                <Icon type="video-camera" className="mr-2" />
              ) : item.contentType === 'audio' ? (
                <MicrophoneIcon className="mr-2" />
              ) : item.contentType === 'ebook' ? (
                <BookIcon className="mr-2" />
              ) : (
                <Icon type="file-text" className="mr-2" />
              )}
              {durationFormatter(item.duration) || ''}
              <span className="ml-2">
                {moment().isBefore(moment(item.publishedAt)) &&
                  ` (${moment(item.publishedAt).format('MM/DD')} ${formatMessage(commonMessages.text.publish)}) `}
              </span>
            </StyledDuration>
          </StyledMobileProgramContentItem>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <StyledPinnedIcon pin={isPinned} />
          <StyledProgramContentItem
            key={item.id}
            isEnrolled={isEquityProgram || isEbookTrial}
            onClick={() => {
              if (isEquityProgram) {
                history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
              } else if (item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                const url = new URL(window.location.href)
                url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                url.searchParams.set('programContentId', item.id)
                window.history.pushState({}, '', url.toString())
                setAuthModalVisible?.(true)
              } else if (isEbookTrial) {
                history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
              }
            }}
          >
            <Typography.Text className="d-flex align-items-center">
              {item.contentType === 'video' ? (
                <Icon type="video-camera" className="mr-2" />
              ) : item.contentType === 'audio' ? (
                <MicrophoneIcon className="mr-2" />
              ) : item.contentType === 'ebook' ? (
                <BookIcon className="mr-2" />
              ) : (
                <Icon type="file-text" className="mr-2" />
              )}
              <span>{item.title}</span>
            </Typography.Text>
            <StyledDuration>
              {(item.displayMode === DisplayModeEnum.trial ||
                (item.displayMode === DisplayModeEnum.loginToTrial && isAuthenticated)) &&
              !isEquityProgram ? (
                item.contentType === 'ebook' ? (
                  <StyledTag color={theme.colors.primary[500]}>
                    {formatMessage(productMessages.program.content.trial)}
                  </StyledTag>
                ) : (
                  <ProgramContentTrialModal
                    programId={program.id}
                    programContentId={item.id}
                    render={({ setVisible }) => (
                      <StyledObscure onClick={() => setVisible(true)}>
                        <StyledTag color={theme.colors.primary[500]}>
                          {formatMessage(
                            item.contentType === 'audio'
                              ? productMessages.program.content.audioTrial
                              : productMessages.program.content.trial,
                          )}
                        </StyledTag>
                      </StyledObscure>
                    )}
                  />
                )
              ) : item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated ? (
                <StyledObscure>
                  <StyledTag color={theme.colors.primary[500]}>
                    {formatMessage(
                      item.contentType === 'audio'
                        ? productMessages.program.content.audioTrial
                        : productMessages.program.content.trial,
                    )}
                  </StyledTag>
                </StyledObscure>
              ) : null}
              <span className="mr-2">
                {moment().isBefore(moment(item.publishedAt)) &&
                  ` (${moment(item.publishedAt).format('MM/DD')} ${formatMessage(commonMessages.text.publish)})`}
              </span>
              {durationFormatter(item.duration) || ''}
            </StyledDuration>
          </StyledProgramContentItem>
        </div>
      )}
    </>
  )
}

export default SecondaryProgramContentListItem
