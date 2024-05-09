/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, LockIcon } from '@chakra-ui/icons'
import { Button, SkeletonText, Switch } from '@chakra-ui/react'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import Cookies from 'js-cookie'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import PracticeDescriptionBlock from '../../components/practice/PracticeDescriptionBlock'
import ProgramContentEbookReader from '../../components/program/ProgramContentEbookReader'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import AudioPlayerContext from '../../contexts/AudioPlayerContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import { isAndroid, isMobile } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useProgramContentById } from '../../hooks/program'
import { CarIcon } from '../../images'
import { ProgramContent, ProgramContentSection, ProgramRole } from '../../types/program'
import pageMessages from '../translation'
import { StyledContentBlock } from './index.styled'
import ProgramContentCreatorBlock from './ProgramContentCreatorBlock'
import ProgramContentExerciseBlock from './ProgramContentExerciseBlock'
import ProgramContentTabs from './ProgramContentTabs'
import ProgramContentPageMessages from './translation'
import type { Book } from 'epubjs'

const StyledTitleBlock = styled.div`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e8e8;
`

const StyledMobileTitle = styled.h3`
  font-size: 20px;
`

const StyledTitle = styled.h3`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e8e8;
  font-size: 20px;
`

const StyledUnpublishedBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  height: 368px;
  background-color: var(--gray-darker);
  color: #fff;
  p {
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.2px;
  }
`

const StyledBackgroundModeDescriptionBlock = styled(StyledUnpublishedBlock)`
  background-color: #e2e8ef;
  color: var(--gray-darker);
`

const StyledIcon = styled(Icon)`
  font-size: 64px;
`

const ProgramContentBlock: React.VFC<{
  programId: string
  programRoles: ProgramRole[]
  programContentSections: (ProgramContentSection & { contents: ProgramContent[] })[]
  programContentId: string
  issueEnabled?: boolean
  editors?: string[]
  ebookCurrentToc: string | null
  onEbookCurrentTocChange: (toc: string | null) => void
  ebookLocation: string | number
  onEbookLocationChange: (location: string | number) => void
  setEbook: React.Dispatch<React.SetStateAction<Book | null>>
}> = ({
  programId,
  programContentId,
  programRoles,
  programContentSections,
  issueEnabled,
  ebookCurrentToc,
  onEbookCurrentTocChange,
  ebookLocation,
  onEbookLocationChange,
  setEbook,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { loading: loadingApp, enabledModules } = useApp()
  const { authToken, currentMemberId, currentUserRole, isAuthenticated } = useAuth()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { programContent, loadingProgramContent, isEquityProgramContent } = useProgramContentById(
    programId,
    programContentId,
  )

  const { changeGlobalPlayingState, setup, close, changeBackgroundMode, isBackgroundMode } =
    useContext(AudioPlayerContext)
  const endedAtRef = useRef(0)

  const instructor = programRoles.filter(role => role.name === 'instructor')[0]

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress?.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(programContentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  const shouldUpdateProgress = !(
    loadingProgramContent ||
    programContentBodyType === 'video' ||
    programContentBodyType === 'audio' ||
    !insertProgress ||
    !refetchProgress ||
    initialProgress === 1 ||
    !currentMemberId ||
    !isAuthenticated ||
    !isEquityProgramContent ||
    (programContentBodyType &&
      ['text', 'practice', 'exam'].includes(programContentBodyType) &&
      moment().isBefore(moment(programContent?.publishedAt))) ||
    programContent?.publishedAt === null
  )

  useEffect(() => {
    if (!shouldUpdateProgress) {
      return
    }

    insertProgress(programContentId, {
      progress: 1,
      lastProgress: 1,
    }).then(() => refetchProgress())
  }, [
    loadingProgramContent,
    programContentBodyType,
    programContentId,
    currentMemberId,
    isAuthenticated,
    isEquityProgramContent,
    programContent?.publishedAt,
  ])

  if (
    loadingProgramContent ||
    loadingApp ||
    loadingProgramContent ||
    !programContent ||
    !insertProgress ||
    !refetchProgress
  ) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }
  const insertProgramProgress = async (progress: number) => {
    try {
      const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
      await insertProgress(programContentId, {
        progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
        lastProgress: progress,
      })
    } catch (error) {
      console.error(`Failed to insert program progress`, error)
    }
  }

  const insertPlayerEventLog = async (data: { playbackRate: number; startedAt: number; endedAt: number }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
        {
          programContentId,
          data,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
    } catch (error) {
      console.error(`Failed to insert player event log`, error)
    }
  }

  return (
    <div
      id="program_content_block"
      className={isEquityProgramContent && programContent.programContentBody?.type === 'ebook' ? '' : 'pt-4 p-sm-4'}
    >
      <div className="d-flex justify-content-center">
        {programContent.displayMode === 'loginToTrial' && !isAuthenticated ? (
          <Button
            colorScheme="primary"
            className="mb-4"
            onClick={() => {
              Cookies.set('redirect', window.location.href)
              history.push(`/auth?programContentId=${programContentId}`)
            }}
          >
            <LockIcon className="mr-2 mb-1" />
            {formatMessage(pageMessages.ProgramContentBlock.loginTrial)}
          </Button>
        ) : (
          !isEquityProgramContent && (
            <Button
              colorScheme="primary"
              className="mb-4"
              onClick={() => history.push(`/programs/${programId}?visitIntro=1`)}
            >
              <LockIcon className="mr-2 mb-1" />
              {formatMessage(productMessages.program.content.unPurchased)}
            </Button>
          )
        )}
      </div>
      {!!isEquityProgramContent &&
        isBackgroundMode &&
        programContent.videos[0]?.data?.source !== 'youtube' &&
        programContent.contentType === 'video' && (
          <StyledBackgroundModeDescriptionBlock>
            <CarIcon className="mb-2" style={{ display: 'block' }} />
            <p>{formatMessage(ProgramContentPageMessages.ProgramContentBlock.currentlyInBackgroundMode)}</p>
            <p>{formatMessage(ProgramContentPageMessages.ProgramContentBlock.backgroundModeDescription)}</p>
          </StyledBackgroundModeDescriptionBlock>
        )}
      {!!isEquityProgramContent && programContent.contentType === 'video' ? (
        (!isBackgroundMode || programContent.videos[0]?.data?.source === 'youtube') &&
        ((!!isEquityProgramContent && moment().isAfter(moment(programContent.publishedAt))) ||
          currentUserRole === 'app-owner') && (
          <ProgramContentPlayer
            programContentId={programContentId}
            nextProgramContent={nextProgramContent}
            onVideoEvent={e => {
              if (Math.abs(e.videoState.endedAt - endedAtRef.current) >= 5) {
                insertPlayerEventLog({ ...e.videoState, startedAt: endedAtRef.current || e.videoState.startedAt })
                if (e.type === 'progress') {
                  insertProgramProgress(e.progress)
                }
                endedAtRef.current = e.videoState.endedAt
              }
              if (e.type === 'ended') {
                insertPlayerEventLog({ ...e.videoState, startedAt: endedAtRef.current || e.videoState.startedAt })
                insertProgramProgress(1)?.then(() => refetchProgress())
              }
            }}
          />
        )
      ) : !!isEquityProgramContent && programContent.contentType === 'ebook' ? (
        <ProgramContentEbookReader
          setEbook={setEbook}
          programContentId={programContent.id}
          isTrial={programContent.displayMode === 'trial'}
          ebookCurrentToc={ebookCurrentToc}
          onEbookCurrentTocChange={onEbookCurrentTocChange}
          location={ebookLocation}
          onLocationChange={onEbookLocationChange}
        />
      ) : null}
      {!!isEquityProgramContent &&
        moment().isBefore(moment(programContent.publishedAt)) &&
        currentUserRole !== 'app-owner' && (
          <StyledUnpublishedBlock>
            <StyledIcon as={LockIcon} className="mb-3" />
            <p>{formatMessage(ProgramContentPageMessages.ProgramContentBlock.theContentWillAt)}</p>
            <p>
              {`${moment(programContent.publishedAt).format('YYYY/MM/DD HH:mm')} ${formatMessage(
                commonMessages.text.publish,
              )}`}
            </p>
          </StyledUnpublishedBlock>
        )}
      {(!isEquityProgramContent ||
        (!!isEquityProgramContent &&
          !includes(programContent.programContentBody?.type, ['ebook', 'practice', 'exercise', 'exam']) &&
          programContent.videos[0]?.data?.source !== 'youtube')) && (
        <StyledContentBlock className="mb-3">
          {isMobile &&
          !isAndroid &&
          enabledModules.background_mode &&
          programContent.programContentBody?.type !== 'audio' ? (
            <StyledTitleBlock>
              <StyledMobileTitle className="mb-2">{programContent.title}</StyledMobileTitle>
              <div className="d-flex justify-content-end">
                <span className="mr-2">
                  {formatMessage(ProgramContentPageMessages.ProgramContentBlock.backgroundMode)}
                </span>
                <Switch
                  colorScheme="whatsapp"
                  onChange={() => {
                    if (isBackgroundMode) {
                      changeBackgroundMode?.(false)
                      changeGlobalPlayingState?.(false)
                      close?.()
                    }
                    if (!isBackgroundMode && !!isEquityProgramContent) {
                      setup?.({
                        backgroundMode: true,
                        title: programContent?.title || '',
                        contentSectionTitle: programContent.contentSectionTitle || '',
                        programId: programId,
                        contentId: programContentId,
                        contentType: programContent.contentType || '',
                        videoId: programContent.videos[0]?.id,
                        source: programContent.videos[0]?.options?.cloudflare
                          ? 'cloudflare'
                          : programContent.videos[0]?.data?.source,
                        cloudfront: programContent.videos[0]?.options?.cloudfront,
                      })
                      changeBackgroundMode?.(true)
                      changeGlobalPlayingState?.(true)
                    }
                  }}
                  isChecked={isBackgroundMode}
                />
              </div>
            </StyledTitleBlock>
          ) : (
            <StyledTitle className="mb-4 text-center">{programContent.title}</StyledTitle>
          )}
          {!!isEquityProgramContent &&
            programContent.programContentBody &&
            (moment().isAfter(moment(programContent.publishedAt)) || currentUserRole === 'app-owner') &&
            !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
              <BraftContent>{programContent.programContentBody.description}</BraftContent>
            )}
        </StyledContentBlock>
      )}
      {enabledModules.practice &&
        !!isEquityProgramContent &&
        programContent.programContentBody?.type === 'practice' &&
        (moment().isAfter(moment(programContent.publishedAt)) || currentUserRole === 'app-owner') && (
          <div className="mb-4">
            <PracticeDescriptionBlock
              programContentId={programContentId}
              isCoverRequired={!!programContent.metadata?.isCoverRequired}
              title={programContent.title}
              description={programContent.programContentBody?.description || ''}
              duration={programContent.duration || 0}
              score={programContent.metadata?.difficulty || 0}
              attachments={programContent.attachments || []}
            />
          </div>
        )}
      {/* TODO: combine two modules in exam */}
      {(enabledModules.exercise || enabledModules.exam) &&
        !!isEquityProgramContent &&
        (programContent.programContentBody?.type === 'exercise' ||
          programContent.programContentBody?.type === 'exam') &&
        (moment().isAfter(moment(programContent.publishedAt)) || currentUserRole === 'app-owner') && (
          <ProgramContentExerciseBlock programContent={programContent} nextProgramContentId={nextProgramContent?.id} />
        )}
      {!!isEquityProgramContent &&
        !includes(programContent.programContentBody?.type, ['ebook']) &&
        (moment().isAfter(moment(programContent.publishedAt)) || currentUserRole === 'app-owner') && (
          <ProgramContentTabs
            programId={programId}
            programRoles={programRoles}
            programContent={programContent}
            issueEnabled={issueEnabled}
          />
        )}
      {(!isEquityProgramContent ||
        (!!isEquityProgramContent &&
          !includes(programContent.programContentBody?.type, ['practice', 'ebook']) &&
          instructor)) && <ProgramContentCreatorBlock memberId={instructor.memberId} />}
    </div>
  )
}

export default ProgramContentBlock
