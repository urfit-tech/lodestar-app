import { useQuery } from '@apollo/react-hooks'
import { Icon, LockIcon } from '@chakra-ui/icons'
import { Button, SkeletonText, Switch } from '@chakra-ui/react'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { throttle } from 'lodash'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import { flatten, includes } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import AudioPlayer from '../../components/common/AudioPlayer'
import { EmptyBlock } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import PracticeDescriptionBlock from '../../components/practice/PracticeDescriptionBlock'
import ProgramContentPlayer from '../../components/program/ProgramContentPlayer'
import MediaPlayerContext from '../../contexts/MediaPlayerContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import { getFileDownloadableLink, isMobile } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { CarIcon } from '../../images'
import { DisplayModeEnum, ProgramContent, ProgramContentSection, ProgramRole } from '../../types/program'
import pageMessages from '../translation'
import { StyledContentBlock } from './index.styled'
import ProgramContentCreatorBlock from './ProgramContentCreatorBlock'
import ProgramContentExerciseBlock from './ProgramContentExerciseBlock'
import ProgramContentTabs from './ProgramContentTabs'
import ProgramContentPageMessages from './translation'

const StyledTitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}> = ({ programId, programRoles, programContentSections, programContentId, issueEnabled }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const {
    resourceList,
    currentResource,
    updateElementList,
    play: playInBackground,
    setMediaPlayerVisible,
  } = useContext(MediaPlayerContext)
  const { loading: loadingApp, enabledModules, id: appId } = useApp()
  const { authToken, currentMemberId, currentUserRole, isAuthenticated } = useAuth()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { loadingProgramContent, programContent } = useProgramContent(programContentId)
  const { hasProgramContentPermission, isLoginTrial } = useHasProgramContentPermission(programContentId)
  const [audioUrl, setAudioUrl] = useState<string>()

  const instructor = programRoles.filter(role => role.name === 'instructor')[0]
  const {
    params: { programContentId: currentContentId },
    url,
  } = useRouteMatch<{ programContentId: string }>()
  const urlParams = new URLSearchParams(window.location.search)

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress?.find(progress => progress.programContentId === programContentId)?.progress || 0

  const currentProgramContentProgress = programContentProgress?.find(
    progress => progress.programContentId === programContentId,
  )

  const lastProgress =
    (!!currentProgramContentProgress?.lastProgress && currentProgramContentProgress?.lastProgress !== 1) ||
    currentProgramContentProgress?.progress !== 1
      ? currentProgramContentProgress?.lastProgress || 0
      : 0

  const prevProgramContent = flatten(programContentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i + 1]?.id === programContentId,
  )
  const nextProgramContent = flatten(programContentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    if (
      loadingProgramContent ||
      programContentBodyType === 'video' ||
      programContentBodyType === 'audio' ||
      !insertProgress ||
      !refetchProgress ||
      initialProgress === 1 ||
      !currentMemberId ||
      !isAuthenticated ||
      !hasProgramContentPermission ||
      (programContentBodyType === 'text' && moment().isBefore(moment(programContent?.publishedAt)))
    ) {
      return
    }

    insertProgress(programContentId, {
      progress: 1,
      lastProgress: 1,
    }).then(() => refetchProgress())
  }, [
    initialProgress,
    insertProgress,
    loadingProgramContent,
    programContentBodyType,
    programContentId,
    refetchProgress,
    currentMemberId,
    isAuthenticated,
    hasProgramContentPermission,
    programContent?.publishedAt,
  ])

  useEffect(() => {
    if (programContentBodyType === 'audio') {
      getFileDownloadableLink(`audios/${appId}/${programId}/${programContentId}`, authToken).then(url => {
        setAudioUrl(url)
      })
    }
  }, [programContentBodyType, programContentId, programId])

  useEffect(() => {
    if (currentResource) {
      const programContentList = programContentSections.flatMap(contentSection => contentSection.contents) || []
      updateElementList?.(
        programContentList.map(content => ({
          title: content.title,
          type: 'ProgramContent',
          options: {
            programId: programId,
            contentType: content.contentType,
            videoId: content.contentType === 'video' ? content?.videos?.[0]?.id : undefined,
          },
          target: content.id,
        })) || [],
      )
      const currentIndex = programContentList.findIndex(content => content.id === programContentId)
      currentIndex >= 0 && playInBackground?.(currentIndex)
    }
  }, [programId])

  if (loadingApp || loadingProgramContent || !programContent || !insertProgress || !refetchProgress) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }
  const insertProgramProgress = throttle(async (progress: number) => {
    const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
    return await insertProgress(programContentId, {
      progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
      lastProgress: progress,
    }).catch(() => {})
  }, 5000)

  return (
    <div id="program_content_block" className="pt-4 p-sm-4">
      {((programContent.contentType === 'video' && !hasProgramContentPermission) ||
        (programContent.contentType !== 'video' && !programContent.programContentBody)) && (
        <div className="d-flex justify-content-center">
          {!hasProgramContentPermission && isLoginTrial ? (
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
            <Button
              colorScheme="primary"
              className="mb-4"
              onClick={() => history.push(`/programs/${programId}?visitIntro=1`)}
            >
              <LockIcon className="mr-2 mb-1" />
              {formatMessage(productMessages.program.content.unPurchased)}
            </Button>
          )}
        </div>
      )}

      {currentResource && (
        <StyledBackgroundModeDescriptionBlock>
          <CarIcon className="mb-2" style={{ display: 'block' }} />
          <p>{formatMessage(ProgramContentPageMessages.ProgramContentBlock.currentlyInBackgroundMode)}</p>
          <p>{formatMessage(ProgramContentPageMessages.ProgramContentBlock.backgroundModeDescription)}</p>
        </StyledBackgroundModeDescriptionBlock>
      )}

      {programContent.contentType === 'video' &&
        !currentResource &&
        ((hasProgramContentPermission && moment().isAfter(moment(programContent.publishedAt))) ||
          currentUserRole === 'app-owner') && (
          <ProgramContentPlayer
            programContentId={programContentId}
            nextProgramContent={nextProgramContent}
            onVideoEvent={e => {
              if (e.type === 'progress') {
                insertProgramProgress(e.progress)
              } else {
                axios
                  .post(
                    `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
                    {
                      programContentId,
                      data: e.videoState,
                    },
                    { headers: { authorization: `Bearer ${authToken}` } },
                  )
                  .then(({ data: { code, result } }) => {
                    if (code === 'SUCCESS') {
                      return
                    }
                  })
                  .catch(() => {})
                if (e.type === 'ended') {
                  insertProgramProgress(1)?.then(() => refetchProgress())
                }
              }
            }}
          />
        )}

      {programContent.contentType === 'audio' &&
        !currentResource &&
        ((hasProgramContentPermission && moment().isAfter(moment(programContent.publishedAt))) ||
          currentUserRole === 'app-owner') && (
          <AudioPlayer
            autoPlay
            title={programContent.title}
            audioUrl={audioUrl}
            lastProgress={lastProgress}
            onPrev={
              prevProgramContent
                ? () => {
                    history.push(
                      `${url.replace(currentContentId, prevProgramContent?.id || '')}?back=${urlParams.get('back')}`,
                    )
                  }
                : undefined
            }
            onNext={
              nextProgramContent
                ? () => {
                    history.push(
                      `${url.replace(currentContentId, nextProgramContent?.id || '')}?back=${urlParams.get('back')}`,
                    )
                  }
                : undefined
            }
            onAudioEvent={e => {
              if (e.type === 'progress') {
                insertProgramProgress(e.progress)
              } else {
                axios
                  .post(
                    `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
                    {
                      programContentId,
                      data: e.audioState,
                    },
                    { headers: { authorization: `Bearer ${authToken}` } },
                  )
                  .then(({ data: { code, result } }) => {
                    if (code === 'SUCCESS') {
                      return
                    }
                  })
                  .catch(() => {})
                if (e.type === 'ended') {
                  insertProgramProgress(1)
                }
              }
            }}
          />
        )}

      {moment().isBefore(moment(programContent.publishedAt)) &&
        hasProgramContentPermission &&
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

      {!includes(programContent.programContentBody?.type, ['practice', 'exercise', 'exam']) && (
        <StyledContentBlock className="mb-3">
          {isMobile && enabledModules.background_mode ? (
            <StyledTitleBlock>
              <StyledMobileTitle>{programContent.title}</StyledMobileTitle>
              <div>
                <span className="mr-2">
                  {formatMessage(ProgramContentPageMessages.ProgramContentBlock.backgroundMode)}
                </span>
                <Switch
                  colorScheme="whatsapp"
                  onChange={e => {
                    if (currentResource) {
                      updateElementList?.([])
                      setMediaPlayerVisible?.(false)
                      refetchProgress()
                    } else {
                      const programContentList =
                        programContentSections.flatMap(contentSection => contentSection.contents) || []
                      updateElementList?.(
                        programContentList
                          .filter(content => !content.videos?.some(video => video?.data?.source === 'youtube'))
                          .map(content => ({
                            title: content.title,
                            type: 'ProgramContent',
                            options: {
                              programId: programId,
                              contentType: content.contentType,
                              videoId: content.contentType === 'video' ? content?.videos?.[0]?.id : undefined,
                            },
                            target: content.id,
                          })) || [],
                      )
                      const currentIndex = programContentList.findIndex(content => content.id === programContentId)
                      currentIndex >= 0 && playInBackground?.(currentIndex)
                    }
                  }}
                  isChecked={currentResource ? true : false}
                />
              </div>
            </StyledTitleBlock>
          ) : (
            <StyledTitle className="mb-4 text-center">{programContent.title}</StyledTitle>
          )}

          {programContent.programContentBody &&
            ((moment().isAfter(moment(programContent.publishedAt)) && hasProgramContentPermission) ||
              currentUserRole === 'app-owner') &&
            !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
              <BraftContent>{programContent.programContentBody.description}</BraftContent>
            )}
        </StyledContentBlock>
      )}

      {enabledModules.practice &&
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
      {/* // TODO: combine two modules in exam */}
      {(enabledModules.exercise || enabledModules.exam) &&
        (programContent.programContentBody?.type === 'exercise' ||
          programContent.programContentBody?.type === 'exam') &&
        (moment().isAfter(moment(programContent.publishedAt)) || currentUserRole === 'app-owner') && (
          <ProgramContentExerciseBlock programContent={programContent} nextProgramContentId={nextProgramContent?.id} />
        )}

      {((hasProgramContentPermission && moment().isAfter(moment(programContent.publishedAt))) ||
        currentUserRole === 'app-owner') && (
        <ProgramContentTabs
          programId={programId}
          programRoles={programRoles}
          programContent={programContent}
          issueEnabled={issueEnabled}
        />
      )}

      {programContent.programContentBody?.type !== 'practice' && instructor && (
        <ProgramContentCreatorBlock memberId={instructor.memberId} />
      )}

      {resourceList.length > 0 && <EmptyBlock height="64px" />}
    </div>
  )
}

const useHasProgramContentPermission: (id: string) => {
  hasProgramContentPermission: boolean
  isTrial: boolean
  isLoginTrial: boolean
} = id => {
  const { currentMemberId, isAuthenticated } = useAuth()
  const { data } = useQuery<hasura.GET_PROGRAM_CONTENT_PERMISSION, hasura.GET_PROGRAM_CONTENT_PERMISSIONVariables>(
    gql`
      query GET_PROGRAM_CONTENT_PERMISSION($id: uuid!, $currentMemberId: String!) {
        program_content_enrollment(where: { program_content_id: { _eq: $id }, member_id: { _eq: $currentMemberId } }) {
          program_content_id
        }
      }
    `,
    {
      variables: {
        id,
        currentMemberId: currentMemberId || '',
      },
    },
  )
  const { data: programContentData } = useQuery<
    hasura.GET_PROGRAM_CONTENT_DISPLAY_MODE,
    hasura.GET_PROGRAM_CONTENT_DISPLAY_MODEVariables
  >(
    gql`
      query GET_PROGRAM_CONTENT_DISPLAY_MODE($id: uuid!) {
        program_content_by_pk(id: $id) {
          display_mode
        }
      }
    `,
    {
      variables: {
        id,
      },
    },
  )
  const displayMode = programContentData?.program_content_by_pk?.display_mode
  const isTrial = displayMode === DisplayModeEnum.trial
  const isLoginTrial = displayMode === DisplayModeEnum.loginToTrial

  return {
    hasProgramContentPermission:
      !!data?.program_content_enrollment?.length ||
      isTrial ||
      (isLoginTrial ? Boolean(currentMemberId && isAuthenticated) : false),
    isTrial,
    isLoginTrial,
  }
}

export { useHasProgramContentPermission }

export default ProgramContentBlock
