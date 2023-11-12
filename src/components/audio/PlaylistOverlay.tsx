import { CheckIcon } from '@chakra-ui/icons'
import { Icon } from '@chakra-ui/react'
import { List } from 'antd'
import React, { useContext } from 'react'
import { AiOutlineFileText, AiOutlineVideoCamera } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AudioPlayerContext from '../../contexts/AudioPlayerContext'
import { durationFormatter, rgba } from '../../helpers'
import { podcastMessages } from '../../helpers/translation'
import { MicrophoneIcon } from '../../images'
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
  playList: (ProgramContent & { programId?: string; contentSectionTitle?: string; progress?: number })[]
  currentIndex: number
}> = ({ title, playList, currentIndex }) => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { setup, changePlayingState } = useContext(AudioPlayerContext)

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
            const { title, programId, id: contentId, contentSectionTitle, contentType, progress = 0 } = item
            return (
              <PlayListItem
                key={index}
                title={title}
                progress={progress}
                programId={programId}
                programContentId={contentId}
                duration={item.duration || 0}
                isPlaying={index === currentIndex}
                contentType={contentType}
                onClick={() => {
                  if (contentType !== 'audio') {
                    history.push(`/programs/${programId}/contents/${contentId}`)
                  } else {
                    window.location.pathname.includes('contents') &&
                      history.push(`/programs/${programId}/contents/${contentId}`)
                  }
                  setup?.({
                    title,
                    contentSectionTitle: contentSectionTitle || '',
                    programId,
                    contentId,
                  })
                  changePlayingState?.(true)
                }}
              />
            )
          })}
        </StyledListContent>
      </List>
    </StyledWrapper>
  )
}
const PlayListItem: React.VFC<{
  withHandler?: boolean
  isPlaying?: boolean
  duration: number
  programId?: string
  progress: number
  programContentId?: string
  contentType?: string | null
  title: string
  onClick?: () => void
}> = ({ title, contentType, isPlaying, onClick, progress, duration, programId, programContentId }) => {
  const progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'

  return (
    <StyledListItem
      className={`d-flex align-items-center justify-content-between px-4 ${
        isPlaying ? 'playing' : undefined
      } ${progressStatus}`}
      onClick={onClick}
    >
      <div className="flex-grow-1 cursor-pointer" style={{ position: 'relative' }}>
        <StyledTitle>{title}</StyledTitle>
        {contentType === 'video' || contentType === 'audio' ? (
          <>
            <Icon
              as={contentType === 'video' ? AiOutlineVideoCamera : MicrophoneIcon}
              className="mr-2"
              fontSize="16px"
            />
            <span>{durationFormatter(duration)}</span>
          </>
        ) : contentType === 'practice' ? (
          <Icon as={PracticeIcon} className="mr-2" />
        ) : (
          <Icon as={AiOutlineFileText} fontSize="16px" className="mr-2" />
        )}
        <StyledIconWrapper>
          <Icon as={CheckIcon} />
        </StyledIconWrapper>
      </div>
    </StyledListItem>
  )
}

export default PlaylistOverlay
