import { Icon } from '@chakra-ui/icons'
import { Dropdown, Form, Icon as AntdIcon, Menu } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { CommonLargeTitleMixin, CommonTextMixin } from '../../components/common'
import { AvatarImage } from '../../components/common/Image'
import PodcastProgramCard from '../../components/podcast/PodcastProgramCard'
import PodcastProgramTimeline from '../../containers/podcast/PodcastProgramTimeline'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { handleError } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import {
  useDeletePlaylist,
  useEnrolledPodcastPlansCreators,
  useEnrolledPodcastPrograms,
  usePlaylistCollection,
  useUpdatePlaylist,
} from '../../hooks/podcast'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'

const StyledTitle = styled.h3`
  ${CommonLargeTitleMixin}
  margin-bottom: 32px;
`
const StyledParagraph = styled.p`
  ${CommonTextMixin}
`
const StyledEnrolledPodcastPlanCreatorName = styled.span`
  color: var(--gray-darker);
  transition: 0.3s;
  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`
const StyledPlaylistItem = styled.div`
  padding: 1rem 0.75rem;
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
`
const StyledInput = styled.input``

const PodcastProgramCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { playNow } = useContext(PodcastPlayerContext)
  const { enrolledPodcastPrograms, refetchPodcastProgramIds } = useEnrolledPodcastPrograms(memberId)
  const { enrolledPodcastPlansCreators, refetchPodcastPlan } = useEnrolledPodcastPlansCreators(memberId)
  const { playlists, totalPodcastProgramCount, refetchPlaylists } = usePlaylistCollection(memberId)
  const updatePlaylist = useUpdatePlaylist()
  const deletePlaylist = useDeletePlaylist()

  useEffect(() => {
    refetchPodcastProgramIds()
    refetchPodcastPlan()
  }, [refetchPodcastProgramIds, refetchPodcastPlan])

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-12 col-lg-8 mb-5">
          <StyledTitle>{formatMessage(productMessages.podcast.title.podcast)}</StyledTitle>

          <PodcastProgramTimeline
            memberId={memberId}
            podcastPrograms={enrolledPodcastPrograms}
            renderItem={({ podcastProgram, isEnrolled }) => (
              <Link to={`/podcasts/${podcastProgram.id}`} key={podcastProgram.id}>
                <PodcastProgramCard
                  coverUrl={podcastProgram.coverUrl}
                  title={podcastProgram.title}
                  instructor={podcastProgram.instructor}
                  salePrice={podcastProgram.salePrice}
                  listPrice={podcastProgram.listPrice}
                  duration={podcastProgram.duration}
                  durationSecond={podcastProgram.durationSecond}
                  isEnrolled={isEnrolled}
                  noPrice
                />
              </Link>
            )}
          />
        </div>

        <div className="col-12 col-lg-4 mb-5 pl-4">
          <StyledTitle>{formatMessage(productMessages.podcast.title.subscribe)}</StyledTitle>
          {enrolledPodcastPlansCreators.length === 0 ? (
            <StyledParagraph>{formatMessage(productMessages.podcast.content.unsubscribed)}</StyledParagraph>
          ) : (
            enrolledPodcastPlansCreators.map(enrolledPodcastPlansCreator => (
              <Link
                key={enrolledPodcastPlansCreator.id}
                to={`/creators/${enrolledPodcastPlansCreator.id}?tabkey=podcasts`}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <AvatarImage
                      shape="circle"
                      size="64px"
                      className="flex-shrink-0 mr-3"
                      src={enrolledPodcastPlansCreator.pictureUrl}
                    />
                    <StyledEnrolledPodcastPlanCreatorName>
                      {enrolledPodcastPlansCreator.name || enrolledPodcastPlansCreator.username}
                    </StyledEnrolledPodcastPlanCreatorName>
                  </div>
                  <Icon as={AngleRightIcon} />
                </div>
              </Link>
            ))
          )}

          <StyledTitle className="mt-5">{formatMessage(productMessages.podcast.title.playlist)}</StyledTitle>
          <StyledPlaylistItem
            className="cursor-pointer"
            onClick={() => {
              if (enrolledPodcastPrograms.length === 0) {
                return
              }
              history.push(`/podcasts/${enrolledPodcastPrograms[0].id}`)
              playNow &&
                playNow({
                  id: null,
                  podcastProgramIds: enrolledPodcastPrograms.map(podcastProgram => podcastProgram.id),
                  currentIndex: 0,
                })
            }}
          >
            {formatMessage(productMessages.podcast.title.allPodcast)} ({totalPodcastProgramCount})
          </StyledPlaylistItem>
          {playlists.map(playlist => (
            <PlaylistItem
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              count={playlist.podcastProgramIds.length}
              onSave={(id, title) =>
                updatePlaylist({ variables: { playlistId: id, title } })
                  .catch(handleError)
                  .then(() => refetchPlaylists())
              }
              onDelete={id =>
                deletePlaylist({ variables: { playlistId: id } })
                  .catch(handleError)
                  .then(() => refetchPlaylists())
              }
              onClick={() => {
                if (playlist.podcastProgramIds.length === 0) {
                  return
                }
                history.push(`/podcasts/${playlist.podcastProgramIds[0]}`)
                playNow &&
                  playNow({
                    id: playlist.id,
                    podcastProgramIds: playlist.podcastProgramIds,
                    currentIndex: 0,
                  })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const PlaylistItem: React.VFC<{
  id: string
  title: string
  count: number
  onSave?: (id: string, title: string) => Promise<any>
  onDelete?: (id: string) => void
  onClick?: () => void
}> = ({ id, title, count, onSave, onDelete, onClick }) => {
  const { formatMessage } = useIntl()

  const titleRef = useRef<HTMLInputElement | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <StyledPlaylistItem className="d-flex align-items-center">
      <div className="flex-grow-1">
        {isEditing ? (
          <Form
            onSubmit={e => {
              e.preventDefault()
              onSave && onSave(id, titleRef.current?.value || title).then(() => setIsEditing(false))
            }}
          >
            <StyledInput
              ref={titleRef}
              autoFocus
              defaultValue={title}
              placeholder={formatMessage(productMessages.podcast.title.playlistPlaceholder)}
              onBlur={e => {
                if (e.target.value !== title) {
                  onSave && onSave(id, e.target.value).then(() => setIsEditing(false))
                } else {
                  setIsEditing(false)
                }
              }}
            />
          </Form>
        ) : (
          <div className="cursor-pointer" onClick={() => onClick && onClick()}>
            {title} ({count})
          </div>
        )}
      </div>

      <Dropdown
        placement="bottomRight"
        trigger={['click']}
        overlay={
          <Menu>
            <Menu.Item onClick={() => setIsEditing(true)}>{formatMessage(commonMessages.button.edit)}</Menu.Item>
            <Menu.Item onClick={() => onDelete && onDelete(id)}>
              {formatMessage(commonMessages.button.delete)}
            </Menu.Item>
          </Menu>
        }
      >
        <AntdIcon type="more" />
      </Dropdown>
    </StyledPlaylistItem>
  )
}

export default PodcastProgramCollectionBlock
