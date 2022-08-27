import { SkeletonText } from '@chakra-ui/react'
import { List } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { podcastMessages } from '../../helpers/translation'
import { usePodcastProgram } from '../../hooks/podcast'
import EmptyCover from '../../images/empty-cover.png'
import { AvatarImage, CustomRatioImage } from '../common/Image'
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
const StyledListItem = styled(List.Item)<{ variant?: 'playing' }>`
  ${props =>
    props.variant === 'playing'
      ? css`
          background-color: var(--gray-lighter);
        `
      : ''}
`
const StyledCoverBlock = styled.div`
  position: relative;
`
const StyledDuration = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0 0.25rem;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  letter-spacing: 0.58px;
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
const StyledInstructorName = styled.div`
  color: var(--gray-dark);
  letter-spacing: 0.4px;
  font-size: 14px;
`

const PlaylistOverlay: React.VFC<{}> = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { title, setup, podcastProgramIds, currentIndex } = useContext(PodcastPlayerContext)
  const [podcastAlbumId] = useQueryParam('podcastAlbumId', StringParam)

  return (
    <StyledWrapper>
      <List
        size="small"
        header={
          <div className="d-flex align-items-center justify-content-between py-2 px-3">
            <StyledListTitle>{title || formatMessage(podcastMessages.label.nowPlaying)}</StyledListTitle>

            {/* <Dropdown
                overlay={
                  <StyledMenu className="px-2">
                    <Menu.Item onClick={() => setSelectedPlaylistId(null)}>
                      {formatMessage(productMessages.podcast.title.allPodcast)} ({totalPodcastProgramCount})
                    </Menu.Item>
                    {playlists.map(playlist => (
                      <Menu.Item key={playlist.id} onClick={() => setSelectedPlaylistId(playlist.id)}>
                        {playlist.title} ({playlist.podcastProgramIds.length})
                      </Menu.Item>
                    ))}
                  </StyledMenu>
                }
                trigger={['click']}
                placement="bottomRight"
              >
                <StyledButton type="link" size="small" color="var(--gray-darker)">
                  <span>{formatMessage(productMessages.podcast.title.playlist)}</span>
                  <AntdIcon type="caret-down" />
                </StyledButton>
              </Dropdown> */}
          </div>
        }
      >
        <StyledListContent>
          {podcastProgramIds.map((podcastProgramId, index) => (
            <PlayListItem
              podcastProgramId={podcastProgramId}
              isPlaying={index === currentIndex}
              onPlay={podcastProgramId => {
                history.push(
                  `/podcasts/${podcastProgramId}${podcastAlbumId ? `?podcastAlbumId=${podcastAlbumId}` : ''}`,
                )
                setup?.({
                  currentIndex: index,
                })
              }}
            />
          ))}
        </StyledListContent>
      </List>
    </StyledWrapper>
  )
}
const PlayListItem: React.VFC<{
  podcastProgramId: string
  withHandler?: boolean
  isPlaying?: boolean
  onPlay?: (podcastProgramId: string) => void
}> = ({ podcastProgramId, isPlaying, onPlay }) => {
  const { status, podcastProgram } = usePodcastProgram(podcastProgramId)
  const { settings } = useApp()

  if (status !== 'success') {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }
  return (
    <StyledListItem
      className={`d-flex align-items-center justify-content-between px-4`}
      variant={isPlaying ? 'playing' : undefined}
    >
      <StyledCoverBlock className="cursor-pointer" onClick={() => onPlay && onPlay(podcastProgramId)}>
        <CustomRatioImage
          ratio={1}
          width="72px"
          src={podcastProgram.coverUrl || EmptyCover}
          className="mr-2 flex-shrink-0"
        />
        <StyledDuration>{`${podcastProgram.duration}`.padStart(2, '0')}:00</StyledDuration>
      </StyledCoverBlock>

      <div
        className="flex-grow-1 cursor-pointer"
        style={{ position: 'relative' }}
        onClick={() => onPlay && onPlay(podcastProgramId)}
      >
        <StyledTitle>{podcastProgram.title}</StyledTitle>
        {!settings['playlist_overlay.creator_display.disable'] && (
          <div className="d-flex align-items-center">
            <AvatarImage size="24px" src={podcastProgram.creator.avatarUrl} className="mr-1 flex-shrink-0" />
            <StyledInstructorName className="flex-grow-1">{podcastProgram.creator.name}</StyledInstructorName>
          </div>
        )}
      </div>
    </StyledListItem>
  )
}

export default PlaylistOverlay
