import { CheckIcon } from '@chakra-ui/icons'
import { HStack, Icon } from '@chakra-ui/react'
import { List } from 'antd'
import dayjs from 'dayjs'
import React, { useContext } from 'react'
import { AiOutlineFileText, AiOutlineVideoCamera } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import AudioPlayerContext from '../../contexts/AudioPlayerContext'
import { durationFormatter, rgba } from '../../helpers'
import { commonMessages, podcastMessages } from '../../helpers/translation'
import { MicrophoneIcon } from '../../images'
import { ReactComponent as LockIcon } from '../../images/icon-lock.svg'
import { ReactComponent as PracticeIcon } from '../../images/practice-icon.svg'
import { ProgramContent } from '../../types/program'
import { BREAK_POINT } from '../common/Responsive'

const StyledWrapper = styled.div`
  width: 100vw;
  max-width: 28rem;
  height: 28rem;
  background: white;
  box-shadow: 0 6px 6px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0;
`
const StyledListTitle = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
`
const StyledListContent = styled.div`
  max-height: 23rem;
  overflow: auto;
`

const StyledTitle = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: 190px;
  @media (min-width: 375px) {
    max-width: 295px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    max-width: 315px;
  }
`

const StyledIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 12px;
  width: 20px;
  height: 20px;
  border: 1px solid transparent;
  border-radius: 50%;
  text-align: center;
  font-size: 10px;
  line-height: 20px;
`

const StyledListItem = styled(List.Item)<{ variant?: 'playing' }>`
  &.playing {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
    color: ${props => props.theme['@primary-color']};
    & ${StyledTitle} {
      color: ${props => props.theme['@primary-color']};
    }
  }

  &.unread ${StyledIconWrapper} {
    border-color: #cdcdcd;
    color: transparent;
  }
  &.half ${StyledIconWrapper} {
    background: #cdcdcd;
    color: #9b9b9b;
  }
  &.done ${StyledIconWrapper} {
    background: ${props => props.theme['@primary-color']};
    color: white;
  }
  &.lock {
    opacity: 0.4;
    color: var(--gray-darker);
  }
`

const PlaylistOverlay: React.VFC<{
  title?: string
  playList: (ProgramContent & {
    programId?: string
    contentSectionTitle?: string
    progress?: number
    isLock: boolean
  })[]
  currentIndex: number
}> = ({ title, playList, currentIndex }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledWrapper>
      <List
        size="small"
        header={
          <div className="d-flex align-items-center justify-content-between py-2 px-3">
            <StyledListTitle>{title || formatMessage(podcastMessages.label.nowPlaying)}</StyledListTitle>
          </div>
        }
      >
        <StyledListContent>
          {playList.map((item, index) => {
            const {
              title,
              programId,
              id: contentId,
              contentSectionTitle,
              contentType,
              publishedAt,
              progress = 0,
              audios,
              duration,
              videos,
              isLock,
            } = item
            return (
              <PlayListItem
                key={index}
                title={title}
                progress={progress}
                publishedAt={publishedAt}
                contentId={contentId}
                programId={programId || ''}
                audios={audios}
                videos={videos}
                isLock={isLock}
                contentSectionTitle={contentSectionTitle || ''}
                duration={duration || 0}
                isPlaying={index === currentIndex}
                contentType={contentType}
              />
            )
          })}
        </StyledListContent>
      </List>
    </StyledWrapper>
  )
}
const PlayListItem: React.VFC<{
  isPlaying: boolean
  duration: number
  progress: number
  contentType: string | null
  title: string
  isLock: boolean
  videos: ProgramContent['videos']
  audios: ProgramContent['audios']
  contentSectionTitle: string
  contentId: string
  programId: string
  publishedAt: Date | null
}> = ({
  title,
  contentId,
  programId,
  isLock,
  contentType,
  isPlaying,
  contentSectionTitle,
  progress,
  duration,
  publishedAt,
  videos,
  audios,
}) => {
  const { formatMessage } = useIntl()
  const { setup, isBackgroundMode } = useContext(AudioPlayerContext)
  const history = useHistory()
  const location = useLocation()
  const pathname = location.pathname

  const progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'
  const videoSource = videos[0]?.data?.source
  const isPublish = (publishedAt && dayjs().isSame(publishedAt)) || dayjs().isAfter(publishedAt)

  return (
    <StyledListItem
      className={`d-flex align-items-center justify-content-between px-4 ${
        isPlaying ? 'playing' : isLock ? 'lock' : undefined
      } ${progressStatus} `}
      onClick={() => {
        if (pathname.includes('contents') && (contentType === 'audio' || contentType === 'video')) {
          history.push(`/programs/${programId}/contents/${contentId}`)
        }
        if (
          !pathname.includes('contents') &&
          (!isPublish ||
            isLock ||
            (contentType !== 'audio' && contentType !== 'video') ||
            (contentType === 'audio' && audios?.length === 0) ||
            (!isBackgroundMode && contentType === 'video') ||
            (isBackgroundMode && contentType === 'video' && (videoSource === 'youtube' || videos?.length === 0)))
        ) {
          history.push(`/programs/${programId}/contents/${contentId}`)
        } else {
          setup?.({
            backgroundMode: isBackgroundMode,
            title,
            contentSectionTitle: contentSectionTitle || '',
            source: videos[0]?.options?.cloudflare ? 'cloudflare' : videos[0]?.data?.source,
            videoId: videos[0]?.id,
            programId,
            contentId,
            contentType: contentType || '',
          })
        }
      }}
    >
      <div className="flex-grow-1 cursor-pointer" style={{ position: 'relative' }}>
        <StyledTitle>{title}</StyledTitle>
        {isLock ? (
          <HStack spacing="8px" alignItems="center">
            <Icon as={LockIcon} fontSize="16px" />
            <span>
              {(contentType === 'video' || contentType === 'audio') && <span>{durationFormatter(duration)}</span>}
            </span>
          </HStack>
        ) : contentType === 'video' || contentType === 'audio' ? (
          <HStack spacing="8px" alignItems="center">
            <Icon as={contentType === 'video' ? AiOutlineVideoCamera : MicrophoneIcon} fontSize="16px" />
            <span>
              {isPublish
                ? `${durationFormatter(duration)}`
                : publishedAt &&
                  `${durationFormatter(duration)} (${dayjs(publishedAt).format('MM/DD')}) ${formatMessage(
                    commonMessages.text.publish,
                  )}`}
            </span>
          </HStack>
        ) : contentType === 'practice' ? (
          <Icon as={PracticeIcon} fontSize="16px" />
        ) : (
          <Icon as={AiOutlineFileText} fontSize="16px" />
        )}
        <StyledIconWrapper>
          <Icon as={CheckIcon} />
        </StyledIconWrapper>
      </div>
    </StyledListItem>
  )
}

export default PlaylistOverlay
