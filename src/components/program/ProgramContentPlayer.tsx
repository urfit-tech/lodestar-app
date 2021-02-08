import { CircularProgress, Icon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ReactComponent as IconNext } from '../../images/icon-next.svg'
import { ProgramContentBodyProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'

const StyledContainer = styled.div`
  position: relative;
`
const StyledCover = styled.div`
  z-index: 1;
  position: absolute;
  background: black;
  width: 100%;
  height: 100%;
`
const StyledCoverWrapper = styled.div`
  text-align: center;
`
const StyledCoverTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: #ffffff;
`
const StyledCoverSubtitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledIconWrapper = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;
  height: 72px;
  margin-bottom: 24px;
  svg {
    display: block !important;
  }
`
const StyledIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  color: white;
`
const StyledCancelButton = styled.span`
  width: 30px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
`

const message = defineMessages({
  next: { id: 'program.text.next', defaultMessage: '接下來' },
})

const ProgramContentPlayer: React.FC<
  ReactPlayerProps & {
    programContentBody: ProgramContentBodyProps
    nextProgramContent?: {
      id: string
      title: string
    }
    lastProgress?: number
  }
> = ({ programContentBody, nextProgramContent, lastProgress = 0, onProgress, onEnded }) => {
  const { formatMessage } = useIntl()
  const { currentMember } = useAuth()

  const [player, setPlayer] = useState<ReactPlayer | null>(null)
  const [isCoverShowing, setIsCoverShowing] = useState(false)

  return (
    <StyledContainer>
      {nextProgramContent && isCoverShowing && (
        <ProgramContentPlayerCover nextProgramContent={nextProgramContent} onSetIsCoverShowing={setIsCoverShowing} />
      )}
      <ReactPlayer
        url={`https://vimeo.com/${programContentBody.data.vimeoVideoId}`}
        width="100%"
        height="100%"
        playing={true}
        progressInterval={3000}
        controls
        config={{
          vimeo: {
            playerOptions: { responsive: true },
          },
        }}
        onReady={player => setPlayer(player)}
        onDuration={duration => player?.seekTo(duration * (lastProgress === 1 ? 0 : lastProgress), 'seconds')}
        onProgress={onProgress}
        onEnded={() => {
          setIsCoverShowing(true)
          onEnded?.()
        }}
      />

      {currentMember && (
        <div
          className="p-1 p-sm-2"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {`${formatMessage(productMessages.program.content.provide)} ${currentMember.name}-${
            currentMember.email
          } ${formatMessage(productMessages.program.content.watch)}`}
        </div>
      )}
    </StyledContainer>
  )
}

const ProgramContentPlayerCover: React.FC<{
  nextProgramContent: {
    id: string
    title: string
  }
  onSetIsCoverShowing?: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ nextProgramContent, onSetIsCoverShowing }) => {
  const history = useHistory()
  const {
    params: { programContentId: currentContentId },
    url,
  } = useRouteMatch<{ programContentId: string }>()
  const { formatMessage } = useIntl()

  return (
    <StyledCover className="d-flex align-items-center justify-content-center">
      <StyledCoverWrapper>
        <StyledCoverSubtitle className="mb-2">{formatMessage(message.next)}</StyledCoverSubtitle>
        <StyledCoverTitle className="mb-4">{nextProgramContent.title}</StyledCoverTitle>
        <CountDownPlayButton
          onPlayNext={() => {
            onSetIsCoverShowing?.(false)
            history.push(url.replace(currentContentId, nextProgramContent.id))
          }}
        />
        <StyledCancelButton onClick={() => onSetIsCoverShowing?.(false)}>
          {formatMessage(commonMessages.ui.cancel)}
        </StyledCancelButton>
      </StyledCoverWrapper>
    </StyledCover>
  )
}

const CountDownPlayButton: React.FC<{ duration?: number; onPlayNext?: () => void }> = ({
  duration = 5,
  onPlayNext,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const counter = setTimeout(() => {
      setProgress(progress => progress + 5)
    }, (duration * 1000) / 20)
    return () => clearTimeout(counter)
  }, [duration, progress])

  if (progress > 100) {
    onPlayNext?.()
  }

  return (
    <StyledIconWrapper onClick={() => onPlayNext?.()}>
      <CircularProgress trackColor="var(--gray-darker)" color="white" thickness="6px" value={progress} size="72px" />
      <StyledIcon as={IconNext} />
    </StyledIconWrapper>
  )
}

export default ProgramContentPlayer
