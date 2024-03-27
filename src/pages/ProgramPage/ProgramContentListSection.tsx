import { Collapse, IconButton } from '@chakra-ui/react'
import { Divider, Icon, Tag, Typography } from 'antd'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import React, { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../components/auth/AuthModal'
import ProgramContentTrialModal from '../../components/program/ProgramContentTrialModal'
import { durationFormatter, isMobile } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useEnrolledProgramIds } from '../../hooks/program'
import { BookIcon, MicrophoneIcon } from '../../images'
import PinIcon from '../../images/pin-v-2.svg'
import { DisplayModeEnum, Program, ProgramContent, ProgramContentSection } from '../../types/program'

const StyledTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
`
const ProgramSectionBlock = styled.div`
  margin-bottom: 2.5rem;
`
const ProgramSectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-size: 20px;
  font-weight: bold;
`

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

const StyleAllCollapsed = styled.div`
  font-size: 14px;
  font-color: #9b9b9b;
  cursor: pointer;
`

type ProgramContentSectionType = {
  contentSections: (ProgramContentSection & {
    contents: ProgramContent[]
  })[]
}

interface contentTitleCollapsedType {
  [key: string]: {
    isCollapsed: boolean
    isAllPinned: boolean
  }
}

const ProgramContentListSection: React.VFC<{
  program: Program & ProgramContentSectionType
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
      collapsed_status: programContentSection.collapsed_status,
      contents: isEnrolled
        ? programContentSection.contents
        : programContentSection.contents.filter(programContent =>
            program.isIntroductionSectionVisible
              ? programContent
              : programContent.displayMode === DisplayModeEnum.trial ||
                programContent.displayMode === DisplayModeEnum.loginToTrial,
          ),
    }))

  function transformProgramContentSections(sections: typeof programContentSections) {
    return sections.reduce((acc: contentTitleCollapsedType, sec) => {
      const isAllPinned = sec.contents.every(content => content.pinned_status)

      acc[sec.id] = {
        isCollapsed: isAllPinned ? true : sec.collapsed_status,
        isAllPinned: isAllPinned,
      }

      return acc
    }, {})
  }

  const checkAllCollapsed = (): boolean => {
    return Object.values(contentTitleCollapsed).every(val => val.isCollapsed === true)
  }

  const checkAllPinned = (): boolean => {
    return Object.values(contentTitleCollapsed).every(val => val.isAllPinned === true)
  }

  const getCollapsedSection = (propName: string): boolean => {
    return contentTitleCollapsed.hasOwnProperty(propName) && contentTitleCollapsed[propName].isCollapsed
  }

  const getPinnedContent = (propName: string): boolean => {
    return contentTitleCollapsed.hasOwnProperty(propName) && contentTitleCollapsed[propName].isAllPinned
  }

  const toggleAllCollapsed = () => {
    setContentTitleCollapsed(
      Object.fromEntries(
        Object.entries(contentTitleCollapsed).map(([key, value]) => [
          key,
          { ...value, isCollapsed: value.isAllPinned === false ? !allCollapsed : value.isCollapsed },
        ]),
      ),
    )
    setAllCollapsed(!allCollapsed)
  }

  const toggleContentCollapsed = (propName: string) => {
    setContentTitleCollapsed({
      ...contentTitleCollapsed,
      [propName]: {
        ...contentTitleCollapsed[propName],
        isCollapsed: !contentTitleCollapsed[propName].isCollapsed,
      },
    })
  }

  const [contentTitleCollapsed, setContentTitleCollapsed] = useState<contentTitleCollapsedType>(
    transformProgramContentSections(programContentSections),
  )
  const [allCollapsed, setAllCollapsed] = useState(checkAllCollapsed())

  useEffect(() => {
    setAllCollapsed(checkAllCollapsed())
  }, [contentTitleCollapsed])

  const ContentItem: React.VFC<{
    item: ProgramContent
    isPinned: boolean
  }> = ({ item, isPinned }) => {
    if (item == null) return <></>

    return (
      <>
        {isMobile ? (
          <div style={{ position: 'relative' }}>
            <StyledPinnedIcon pin={isPinned} />
            <MobileProgramContentItem
              key={item.id}
              isEnrolled={isEnrolled}
              onClick={() => {
                if (isEnrolled) {
                  history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
                } else if (item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                  const url = new URL(window.location.href)
                  url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                  url.searchParams.set('programContentId', item.id)
                  window.history.pushState({}, '', url.toString())
                  setAuthModalVisible?.(true)
                } else if (item.contentType === 'ebook' && item.displayMode === DisplayModeEnum.trial) {
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
                !isEnrolled ? (
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
            </MobileProgramContentItem>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <StyledPinnedIcon pin={isPinned} />
            <ProgramContentItem
              key={item.id}
              isEnrolled={isEnrolled}
              onClick={() => {
                if (isEnrolled) {
                  history.push(`/programs/${program.id}/contents/${item.id}?back=programs_${program.id}`)
                } else if (item.displayMode === DisplayModeEnum.loginToTrial && !isAuthenticated) {
                  const url = new URL(window.location.href)
                  url.searchParams.set('position', Math.floor(layoutContent?.scrollTop || 0).toString())
                  url.searchParams.set('programContentId', item.id)
                  window.history.pushState({}, '', url.toString())
                  setAuthModalVisible?.(true)
                } else if (item.contentType === 'ebook' && item.displayMode === DisplayModeEnum.trial) {
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
                !isEnrolled ? (
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
            </ProgramContentItem>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {programContentSections.some(programContentSection => programContentSection.contents.length > 0) && (
        <>
          <StyledTitle>
            {formatMessage(productMessages.program.title.content)}
            {!checkAllPinned() && (
              <StyleAllCollapsed onClick={() => !checkAllPinned() && toggleAllCollapsed()}>
                {allCollapsed ? '全部收合' : '全部展開'}
                <IconButton
                  icon={<FaChevronDown style={{ transform: allCollapsed ? 'rotate(0deg)' : 'rotate(270deg)' }} />}
                  aria-label="Rotate Icon"
                  variant="ghost"
                ></IconButton>
              </StyleAllCollapsed>
            )}
          </StyledTitle>
          <Divider className="mt-1" />

          {programContentSections.map(programContentSection => (
            <ProgramSectionBlock key={programContentSection.id}>
              {programContentSection.contents.length > 0 && (
                <>
                  <ProgramSectionTitle className="mb-3">
                    {programContentSection.title}
                    {!getPinnedContent(programContentSection.id) && (
                      <IconButton
                        icon={
                          <div>
                            <FaChevronDown
                              style={{
                                transform: !!getCollapsedSection(programContentSection.id)
                                  ? 'rotate(0deg)'
                                  : 'rotate(270deg)',
                              }}
                            />
                          </div>
                        }
                        aria-label="Rotate Icon"
                        variant="ghost"
                        onClick={() => toggleContentCollapsed(programContentSection.id)}
                      ></IconButton>
                    )}
                  </ProgramSectionTitle>

                  {programContentSection.contents.map(item => {
                    return (
                      <React.Fragment key={`${item.id}${item.title}`}>
                        <Collapse
                          in={
                            !!getCollapsedSection(programContentSection.id) &&
                            !getPinnedContent(programContentSection.id)
                          }
                          transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}
                        >
                          <ContentItem item={item} isPinned={false} />
                        </Collapse>
                        {(!getCollapsedSection(programContentSection.id) ||
                          !!getPinnedContent(programContentSection.id)) &&
                          item.pinned_status && <ContentItem item={item} isPinned={true} />}
                      </React.Fragment>
                    )
                  })}
                </>
              )}
            </ProgramSectionBlock>
          ))}
        </>
      )}
    </>
  )
}

export default ProgramContentListSection
