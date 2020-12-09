import { Icon } from '@chakra-ui/react'
import { Button, Divider } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin } from '../../helpers'
import { useEnrolledPodcastProgramIds } from '../../hooks/podcast'
import { ReactComponent as PauseCircleIcon } from '../../images/pause-circle.svg'
import { ReactComponent as PlayCircleIcon } from '../../images/play-circle.svg'
import { BraftContent } from '../common/StyledBraftEditor'
const StyledWrapper = styled.div<{ coverUrl?: string }>`
  padding: 4rem 1.5rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${props => props.coverUrl || ''});
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;

  ${desktopViewMixin(css`
    height: calc(100vh - 64px);
    padding: 4rem;
    text-align: left;
  `)}
`
const StyledTitle = styled.h1`
  margin-bottom: 2.5rem;
  color: white;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.23px;
  overflow: hidden;

  ${desktopViewMixin(css`
    font-size: 40px;
    font-weight: bold;
    letter-spacing: 1px;
  `)}
`
const StyledMeta = styled.div`
  font-size: 14px;
  letter-spacing: 0.8px;

  span:not(:first-child) {
    margin-left: 0.5rem;
  }
`
const StyledDescription = styled.div`
  font-size: 14px;
  letter-spacing: 0.8px;

  p {
    color: white;
  }
`
const StyledIcon = styled(Icon)`
  && {
    color: white;
    font-size: 40px;
  }
`
const StyledLink = styled(Link)`
  color: white;
`

const PodcastProgramCover: React.FC<{
  memberId: string
  podcastProgramId: string
  coverUrl: string | null
  title: string
  publishedAt: Date
  tags: string[]
  description?: string | null
}> = ({ memberId, podcastProgramId, coverUrl, title, publishedAt, tags, description }) => {
  const {
    isPlaying,
    visible,
    playlist,
    currentPlayingId,
    loadingPodcastProgram,
    maxDuration,
    playNow,
    setIsPlaying,
    setupPlaylist,
  } = useContext(PodcastPlayerContext)
  const { enrolledPodcastProgramIds } = useEnrolledPodcastProgramIds(memberId)
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false)

  useEffect(() => {
    if (!playlist && !isPlayerInitialized) {
      setIsPlayerInitialized(true)
      setupPlaylist &&
        setupPlaylist(
          enrolledPodcastProgramIds.includes(podcastProgramId)
            ? {
                id: null,
                podcastProgramIds: enrolledPodcastProgramIds,
                currentIndex: enrolledPodcastProgramIds.findIndex(id => id === podcastProgramId),
              }
            : {
                id: null,
                podcastProgramIds: [podcastProgramId],
                currentIndex: 0,
                isPreview: true,
              },
        )
    }
  }, [enrolledPodcastProgramIds, playlist, podcastProgramId, isPlayerInitialized, setupPlaylist])

  const handlePlay = () => {
    if (isPlayerInitialized && visible && setIsPlaying) {
      setIsPlaying(true)
      return
    }
    if (!playNow) {
      return
    }
    const position = playlist?.podcastProgramIds.findIndex(id => id === podcastProgramId)
    playNow(
      playlist && position && position > -1
        ? {
            ...playlist,
            currentIndex: position,
          }
        : enrolledPodcastProgramIds.includes(podcastProgramId)
        ? {
            id: null,
            podcastProgramIds: enrolledPodcastProgramIds,
            currentIndex: enrolledPodcastProgramIds.findIndex(id => id === podcastProgramId),
          }
        : {
            id: null,
            podcastProgramIds: [podcastProgramId],
            currentIndex: 0,
            isPreview: true,
          },
    )
  }

  return (
    <StyledWrapper coverUrl={coverUrl || ''}>
      <StyledMeta className="mb-4">{moment(publishedAt).format('YYYY-MM-DD')}</StyledMeta>

      <StyledMeta className="mb-3">
        {tags.map(tag => (
          <StyledLink key={tag} to={`/search?tag=${tag}&tab=podcasts`}>
            #{tag}
          </StyledLink>
        ))}
      </StyledMeta>

      <StyledTitle>{title}</StyledTitle>

      <StyledDescription className="mb-2">
        <BraftContent>{description}</BraftContent>
      </StyledDescription>

      <div className="d-flex align-items-center justify-content-between">
        <div className="flex-grow-1 mr-2">
          <Divider />
        </div>
        <div className="flex-shrink-0">
          {loadingPodcastProgram || maxDuration === 0 ? (
            <Icon as={AiOutlineLoading} style={{ fontSize: '44px' }} />
          ) : podcastProgramId === currentPlayingId ? (
            <Button type="link" onClick={() => setIsPlaying && setIsPlaying(!isPlaying)}>
              {isPlaying ? <StyledIcon as={PauseCircleIcon} /> : <StyledIcon as={PlayCircleIcon} />}
            </Button>
          ) : (
            <Button type="link" loading={loadingPodcastProgram} onClick={handlePlay}>
              <StyledIcon as={PlayCircleIcon} />
            </Button>
          )}
        </div>
      </div>
    </StyledWrapper>
  )
}

export default PodcastProgramCover
