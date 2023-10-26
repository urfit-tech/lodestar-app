import { Icon } from '@chakra-ui/icons'
import { Dropdown, Form, Icon as AntdIcon, Menu } from 'antd'
import { CommonLargeTitleMixin, CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import React, { useContext, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AvatarImage } from '../../components/common/Image'
import PodcastProgramCard from '../../components/podcast/PodcastProgramCard'
import PodcastProgramTimeline, { PodcastProgramProps } from '../../containers/podcast/PodcastProgramTimeline'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { handleError } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useProductEnrollment } from '../../hooks/common'
import { useDeletePlaylist, usePlaylistCollection, useUpdatePlaylist } from '../../hooks/podcast'
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

const PodcastProgramCollectionBlock: React.VFC<{
  memberId: string
  podcastEnrollment: PodcastProgramProps[]
  loading: boolean
  isError: boolean
}> = ({ memberId, podcastEnrollment, loading, isError }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { setup } = useContext(PodcastPlayerContext)
  const { data: podcastPlanEnrollment } = useProductEnrollment('podcast-plan')

  const { playlists, totalPodcastProgramCount, refetchPlaylists } = usePlaylistCollection(memberId)
  const updatePlaylist = useUpdatePlaylist()
  const deletePlaylist = useDeletePlaylist()

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-12 col-lg-8 mb-5">
          <StyledTitle>{formatMessage(productMessages.podcast.title.podcast)}</StyledTitle>

          <PodcastProgramTimeline
            memberId={memberId}
            podcastPrograms={podcastEnrollment}
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
          {podcastPlanEnrollment.length === 0 ? (
            <StyledParagraph>{formatMessage(productMessages.podcast.content.unsubscribed)}</StyledParagraph>
          ) : (
            podcastPlanEnrollment.map(podcastPlan => (
              <Link key={podcastPlan.creator.id} to={`/creators/${podcastPlan.creator.id}?tabkey=podcasts`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <AvatarImage
                      shape="circle"
                      size="64px"
                      className="flex-shrink-0 mr-3"
                      src={podcastPlan.creator.pictureUrl}
                    />
                    <StyledEnrolledPodcastPlanCreatorName>
                      {podcastPlan.creator.name || podcastPlan.creator.username}
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
              if (podcastEnrollment.length === 0) {
                return
              }
              history.push(`/podcasts/${podcastEnrollment[0].id}`)
              setup?.({
                podcastProgramIds: podcastEnrollment.map(podcastProgram => podcastProgram.id),
                currentIndex: 0,
                title: `${formatMessage(productMessages.podcast.title.allPodcast)} (${podcastEnrollment.length})`,
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
                setup?.({
                  podcastProgramIds: playlist.podcastProgramIds,
                  currentIndex: 0,
                  title: `${playlist.title} (${playlist.podcastProgramIds.length})`,
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
