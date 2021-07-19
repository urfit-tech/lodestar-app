import { Button, Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { Form, message, Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import React, { useRef, useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useCreatePlaylist, useUpdatePlaylistPodcastPrograms } from '../../hooks/podcast'
import { PlaylistProps } from '../../types/podcast'

const messages = defineMessages({
  saveToPlaylist: { id: 'podcast.label.saveToPlaylist', defaultMessage: '儲存至清單' },
  createPlaylist: { id: 'podcast.ui.createPlaylist', defaultMessage: '新建清單' },
  titlePlaceholder: { id: 'podcast.text.titlePlaceholder', defaultMessage: '字數限12字元' },
  savedPlaylist: { id: 'podcast.text.savedPlaylist', defaultMessage: '已儲存清單' },
})

const StyledModal = styled(Modal)`
  width: 24rem;
`

const PlaylistAdminModal: React.VFC<
  ModalProps & {
    memberId: string
    playlists: (PlaylistProps & { podcastProgramIds: string[] })[]
    selectedPodcastProgramId: string
    onRefetch?: () => void
    onSuccess?: () => void
  }
> = ({ memberId, playlists, selectedPodcastProgramId, onRefetch, onSuccess, ...props }) => {
  const { formatMessage } = useIntl()

  const titleRef = useRef<HTMLInputElement | null>(null)
  const updatePlaylistPodcastPrograms = useUpdatePlaylistPodcastPrograms()
  const createPlaylist = useCreatePlaylist()

  const prevPlaylistIds = playlists
    .filter(playlist => playlist.podcastProgramIds.includes(selectedPodcastProgramId || ''))
    .map(playlist => playlist.id)
  const [checkedPlaylistIds, setCheckedPlaylistIds] = useState<string[]>(prevPlaylistIds)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    const title = titleRef.current?.value
    title &&
      createPlaylist({
        variables: {
          memberId,
          title,
          position: playlists.length,
        },
      }).then(() => {
        setIsEditing(false)
        onRefetch && onRefetch()
      })
  }

  return (
    <StyledModal
      title={formatMessage(messages.saveToPlaylist)}
      centered
      destroyOnClose
      okText={formatMessage(commonMessages.button.save)}
      cancelText={formatMessage(commonMessages.ui.cancel)}
      okButtonProps={{ loading }}
      onOk={() => {
        setLoading(true)
        updatePlaylistPodcastPrograms(
          selectedPodcastProgramId,
          prevPlaylistIds.filter(playlistId => !checkedPlaylistIds.includes(playlistId)),
          checkedPlaylistIds
            .filter(playlistId => !prevPlaylistIds.includes(playlistId))
            .map(playlistId => ({
              playlist_id: playlistId,
              podcast_program_id: selectedPodcastProgramId,
              position: playlists.find(playlist => playlist.id === playlistId)?.maxPosition || 0,
            })),
        ).then(() => {
          onRefetch && onRefetch()
          message.success(formatMessage(messages.savedPlaylist))
          setLoading(false)
          onSuccess && onSuccess()
        })
      }}
      {...props}
    >
      <CheckboxGroup
        defaultValue={checkedPlaylistIds}
        onChange={checkedValues => setCheckedPlaylistIds(checkedValues as string[])}
      >
        {playlists.map(playlist => (
          <div key={playlist.id}>
            <Checkbox value={playlist.id} colorScheme="primary" className="mb-3">
              {playlist.title}
            </Checkbox>
          </div>
        ))}
      </CheckboxGroup>

      {isEditing && (
        <Form
          className="mb-3"
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Checkbox colorScheme="primary">
            <input
              ref={titleRef}
              autoFocus
              placeholder={formatMessage(messages.titlePlaceholder)}
              onBlur={e => handleSubmit()}
            />
          </Checkbox>
        </Form>
      )}
      <div>
        <Button colorScheme="primary" variant="ghost" leftIcon={<BsPlus />} onClick={() => setIsEditing(true)}>
          {formatMessage(messages.createPlaylist)}
        </Button>
      </div>
    </StyledModal>
  )
}

export default PlaylistAdminModal
