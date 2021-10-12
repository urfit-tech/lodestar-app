import { Icon } from '@chakra-ui/react'
import { Button, Divider } from 'antd'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin } from '../../helpers'
import { useEnrolledPodcastProgramWithCreatorId } from '../../hooks/podcast'
import { usePodcastAlbumPodcastProgramIds } from '../../hooks/podcastAlbum'
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
const StyledRotateIcon = styled(Icon)`
  font-size: 44px;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`

const PodcastProgramCover: React.VFC<{
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
    playlistContent,
    currentPlayingId,
    loadingPodcastProgram,
    maxDuration,
    playNow,
    setIsPlaying,
    setupPlaylist,
  } = useContext(PodcastPlayerContext)

  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false)
  const [podcastAlbumId] = useQueryParam('podcastAlbumId', StringParam)
  const [instructorId] = useQueryParam('instructorId', StringParam)
  const { loading, podcastAlbumTitle, podcastAlbumPodcastProgramIds } = usePodcastAlbumPodcastProgramIds(
    podcastAlbumId || '',
  )
  const { status, enrolledPodcastProgramIds, creatorName } = useEnrolledPodcastProgramWithCreatorId(instructorId || '')

  useEffect(() => {
    if (playlistContent === null && !isPlayerInitialized) {
      if (loading === false) {
        setupPlaylist?.(
          podcastAlbumId
            ? {
                id: null,
                podcastAlbumId: podcastAlbumId,
                podcastProgramIds: podcastAlbumPodcastProgramIds,
                currentIndex: podcastAlbumPodcastProgramIds.findIndex(id => (id = podcastProgramId)),
                title: `${podcastAlbumTitle} (${podcastAlbumPodcastProgramIds.length})`,
              }
            : {
                id: null,
                podcastProgramIds: [podcastProgramId],
                currentIndex: 0,
                title,
              },
        )
        setIsPlayerInitialized(true)
      }
    }
  }, [
    isPlayerInitialized,
    loading,
    playlistContent,
    podcastAlbumId,
    podcastAlbumPodcastProgramIds,
    podcastAlbumTitle,
    podcastProgramId,
    setupPlaylist,
    title,
  ])

  useEffect(() => {
    if (playlistContent === null && !isPlayerInitialized) {
      if (status === 'success') {
        setupPlaylist?.(
          instructorId
            ? {
                id: null,
                podcastProgramIds: enrolledPodcastProgramIds,
                currentIndex: enrolledPodcastProgramIds.findIndex(id => (id = podcastProgramId)),
                title: `${creatorName}的專輯 (${enrolledPodcastProgramIds.length})`,
              }
            : {
                id: null,
                podcastProgramIds: [podcastProgramId],
                currentIndex: 0,
                title,
              },
        )
        setIsPlayerInitialized(true)
      }
    }
  }, [
    creatorName,
    enrolledPodcastProgramIds,
    instructorId,
    isPlayerInitialized,
    playlistContent,
    podcastProgramId,
    setupPlaylist,
    status,
    title,
  ])

  const handlePlay = () => {
    if (isPlayerInitialized && visible && setIsPlaying) {
      setIsPlaying(true)
      return
    }
    if (!playNow) {
      return
    }
    const position = playlistContent?.podcastProgramIds.findIndex(id => id === podcastProgramId) || 0
    playNow(
      playlistContent && position && position > -1
        ? {
            ...playlistContent,
            currentIndex: position,
          }
        : {
            id: null,
            podcastProgramIds: [podcastProgramId],
            currentIndex: 0,
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
          <Divider className="mb-3" />
        </div>
        <div className="flex-shrink-0">
          {loadingPodcastProgram || maxDuration === 0 ? (
            <StyledRotateIcon as={AiOutlineLoading} />
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
