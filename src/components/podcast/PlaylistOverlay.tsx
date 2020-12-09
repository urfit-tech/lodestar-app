import { Icon } from '@chakra-ui/icons'
import { Button, Dropdown, Icon as AntdIcon, List, Menu, Skeleton } from 'antd'
import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { ReactSortable } from 'react-sortablejs'
import styled, { css } from 'styled-components'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { productMessages } from '../../helpers/translation'
import {
  useEnrolledPodcastPrograms,
  usePlaylistCollection,
  usePlaylistPodcastPrograms,
  useUpdatePodcastProgramPositions,
} from '../../hooks/podcast'
import { ReactComponent as AddToPlaylistIcon } from '../../images/add-to-playlist.svg'
import EmptyCover from '../../images/empty-cover.png'
import { PlaylistProps, PodcastProgramContentProps } from '../../types/podcast'
import { AvatarImage, CustomRatioImage } from '../common/Image'
import PlaylistAdminModal from './PlaylistAdminModal'

const StyledWrapper = styled.div`
  width: 100vw;
  max-width: 28rem;
  height: 28rem;
  background: white;
  box-shadow: 0 6px 6px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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
const StyledMenu = styled(Menu)`
  max-height: 20rem;
  overflow: auto;
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
`
const StyledInstructorName = styled.div`
  color: var(--gray-dark);
  letter-spacing: 0.4px;
  font-size: 14px;
`
const StyledButton = styled(Button)<{ color?: string }>`
  color: ${props => props.color || 'var(--gray-dark)'};
  &:hover,
  &:hover .anticon {
    color: ${props => props.theme['@primary-color']};
  }
`

const PlaylistOverlay: React.FC<{
  memberId: string
  defaultPlaylistId: string | null
}> = ({ memberId, defaultPlaylistId }) => {
  const { formatMessage } = useIntl()
  const { playlists, totalPodcastProgramCount, refetchPlaylists } = usePlaylistCollection(memberId)

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(defaultPlaylistId)
  const selectedPlaylist = playlists.find(playlist => playlist.id === selectedPlaylistId)

  return (
    <StyledWrapper>
      <List
        size="small"
        header={
          <div className="d-flex align-items-center justify-content-between py-2 px-3">
            <StyledListTitle>
              {selectedPlaylistId ? selectedPlaylist?.title : formatMessage(productMessages.podcast.title.allPodcast)} (
              {selectedPlaylistId ? selectedPlaylist?.podcastProgramIds.length : totalPodcastProgramCount})
            </StyledListTitle>

            <Dropdown
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
            </Dropdown>
          </div>
        }
      >
        <StyledListContent>
          {selectedPlaylistId ? (
            <PlaylistPodcastProgramBlock
              memberId={memberId}
              playlists={playlists}
              playlistId={selectedPlaylistId}
              onRefetch={refetchPlaylists}
            />
          ) : (
            <AllPodcastProgramBlock memberId={memberId} playlists={playlists} onRefetch={refetchPlaylists} />
          )}
        </StyledListContent>
      </List>
    </StyledWrapper>
  )
}

const AllPodcastProgramBlock: React.FC<{
  memberId: string
  playlists: (PlaylistProps & {
    podcastProgramIds: string[]
  })[]
  onRefetch?: () => Promise<any>
}> = ({ memberId, playlists, onRefetch }) => {
  const history = useHistory()
  const { currentPlayingId, playNow } = useContext(PodcastPlayerContext)
  const { loadingPodcastProgramIds, enrolledPodcastPrograms } = useEnrolledPodcastPrograms(memberId)

  const [visible, setVisible] = useState(false)
  const [selectedPodcastProgramId, setSelectedPodcastProgramId] = useState<string | null>(null)

  if (loadingPodcastProgramIds) {
    return <Skeleton active />
  }

  return (
    <>
      {typeof selectedPodcastProgramId === 'string' && (
        <PlaylistAdminModal
          memberId={memberId}
          selectedPodcastProgramId={selectedPodcastProgramId}
          playlists={playlists}
          visible={visible}
          destroyOnClose
          onCancel={() => {
            setVisible(false)
            setSelectedPodcastProgramId(null)
          }}
          onRefetch={() => onRefetch && onRefetch()}
          onSuccess={() => {
            setVisible(false)
            setSelectedPodcastProgramId(null)
          }}
        />
      )}

      {enrolledPodcastPrograms.map(podcastProgram => (
        <PodcastProgramItem
          key={podcastProgram.id}
          id={podcastProgram.id}
          coverUrl={podcastProgram.coverUrl}
          title={podcastProgram.title}
          duration={podcastProgram.duration}
          durationSecond={podcastProgram.durationSecond}
          instructor={{
            id: podcastProgram.instructor?.id || '',
            avatarUrl: podcastProgram.instructor?.avatarUrl || null,
            name: podcastProgram.instructor?.name || '',
          }}
          isPlaying={podcastProgram.id === currentPlayingId}
          onPlay={podcastProgramId => {
            history.push(`/podcasts/${podcastProgramId}`)
            playNow &&
              playNow({
                id: null,
                podcastProgramIds: enrolledPodcastPrograms.map(podcastProgram => podcastProgram.id),
                currentIndex: enrolledPodcastPrograms.findIndex(
                  podcastProgram => podcastProgram.id === podcastProgramId,
                ),
              })
          }}
          onEdit={podcastProgramId => {
            setVisible(true)
            setSelectedPodcastProgramId(podcastProgramId)
          }}
        />
      ))}
    </>
  )
}

const PlaylistPodcastProgramBlock: React.FC<{
  memberId: string
  playlists: (PlaylistProps & {
    podcastProgramIds: string[]
  })[]
  playlistId: string
  onRefetch?: () => Promise<any>
}> = ({ memberId, playlists, playlistId, onRefetch }) => {
  const history = useHistory()
  const { currentPlayingId, playNow } = useContext(PodcastPlayerContext)
  const { loadingPodcastPrograms, podcastPrograms, refetchPodcastPrograms } = usePlaylistPodcastPrograms(playlistId)
  const updatePodcastProgramPositions = useUpdatePodcastProgramPositions()

  const [visible, setVisible] = useState(false)
  const [selectedPodcastProgramId, setSelectedPodcastProgramId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tmpPodcastProgramIds, setTmpPodcastProgramIds] = useState<string[]>([])

  if (loadingPodcastPrograms) {
    return <Skeleton active />
  }

  return (
    <>
      {typeof selectedPodcastProgramId === 'string' && (
        <PlaylistAdminModal
          memberId={memberId}
          selectedPodcastProgramId={selectedPodcastProgramId}
          playlists={playlists}
          visible={visible}
          destroyOnClose
          onCancel={() => {
            setVisible(false)
            setSelectedPodcastProgramId(null)
          }}
          onRefetch={() => {
            refetchPodcastPrograms()
            onRefetch && onRefetch()
          }}
          onSuccess={() => {
            setVisible(false)
            setSelectedPodcastProgramId(null)
          }}
        />
      )}

      <ReactSortable
        handle=".handler"
        list={podcastPrograms}
        setList={newPodcastPrograms =>
          setTmpPodcastProgramIds(newPodcastPrograms.map(podcastProgram => podcastProgram.id))
        }
        onEnd={evt => {
          if (loading) {
            return
          }
          setLoading(true)
          updatePodcastProgramPositions({
            variables: {
              playlistId,
              data: tmpPodcastProgramIds.map((podcastProgramId, index) => ({
                playlist_id: playlistId,
                podcast_program_id: podcastProgramId,
                position: index,
              })),
            },
          }).then(() =>
            refetchPodcastPrograms().then(({ data }) => {
              setTmpPodcastProgramIds(data.playlist_podcast_program.map(playlist => playlist.podcast_program.id))
              setLoading(false)
            }),
          )
        }}
      >
        {podcastPrograms.map(podcastProgram => (
          <PodcastProgramItem
            key={podcastProgram.id}
            id={podcastProgram.id}
            coverUrl={podcastProgram.coverUrl}
            title={podcastProgram.title}
            duration={podcastProgram.duration}
            durationSecond={podcastProgram.durationSecond}
            instructor={podcastProgram.instructor}
            withHandler
            isPlaying={podcastProgram.id === currentPlayingId}
            onPlay={podcastProgramId => {
              history.push(`/podcasts/${podcastProgramId}`)
              playNow &&
                playNow({
                  id: playlistId,
                  podcastProgramIds: podcastPrograms.map(podcastProgram => podcastProgram.id),
                  currentIndex: podcastPrograms.findIndex(podcastProgram => podcastProgram.id === podcastProgramId),
                })
            }}
            onEdit={podcastProgramId => {
              setVisible(true)
              setSelectedPodcastProgramId(podcastProgramId)
            }}
          />
        ))}
      </ReactSortable>
    </>
  )
}

const PodcastProgramItem: React.FC<
  PodcastProgramContentProps & {
    withHandler?: boolean
    isPlaying?: boolean
    onPlay?: (podcastProgramId: string) => void
    onEdit?: (podcastProgramId: string) => void
  }
> = ({ id, coverUrl, title, duration, instructor, withHandler, isPlaying, onPlay, onEdit }) => {
  return (
    <StyledListItem
      className={`d-flex align-items-center justify-content-between ${withHandler ? 'pr-4' : 'px-4'}`}
      variant={isPlaying ? 'playing' : undefined}
    >
      {withHandler && (
        <div className="flex-shrink-0">
          <AntdIcon type="drag" className="mx-1 cursor-pointer handler" />
        </div>
      )}

      <StyledCoverBlock className="cursor-pointer" onClick={() => onPlay && onPlay(id)}>
        <CustomRatioImage ratio={1} width="72px" src={coverUrl || EmptyCover} className="mr-2 flex-shrink-0" />
        <StyledDuration>{`${duration}`.padStart(2, '0')}:00</StyledDuration>
      </StyledCoverBlock>

      <div className="flex-grow-1 cursor-pointer" onClick={() => onPlay && onPlay(id)}>
        <StyledTitle>{title}</StyledTitle>
        <div className="d-flex align-items-center">
          <AvatarImage size="24px" src={instructor.avatarUrl} className="mr-1 flex-shrink-0" />
          <StyledInstructorName className="flex-grow-1">{instructor.name}</StyledInstructorName>
        </div>
      </div>

      {typeof onEdit !== 'undefined' && (
        <StyledButton type="link" className="flex-shrink-0 ml-4 p-0" onClick={() => onEdit(id)}>
          <Icon as={AddToPlaylistIcon} />
        </StyledButton>
      )}
    </StyledListItem>
  )
}

export default PlaylistOverlay
