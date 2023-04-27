import { gql, useQuery } from '@apollo/client'
import hasura from '../hasura'
import { PodcastAlbum, PodcastAlbumPreview } from '../types/podcastAlbum'

export const usePodcastAlbumPreview = (podcastAlbumId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_PODCAST_ALBUM_PREVIEW,
    hasura.GET_PODCAST_ALBUM_PREVIEWVariables
  >(
    gql`
      query GET_PODCAST_ALBUM_PREVIEW($podcastAlbumId: uuid!) {
        podcast_album_by_pk(id: $podcastAlbumId) {
          id
          title
          podcast_album_podcast_programs(order_by: { position: asc }) {
            id
            podcast_program_id
          }
        }
      }
    `,
    { variables: { podcastAlbumId } },
  )

  const podcastAlbumPreview: PodcastAlbumPreview = {
    id: data?.podcast_album_by_pk?.id,
    title: data?.podcast_album_by_pk?.title || '',
    podcastProgramIds: data?.podcast_album_by_pk?.podcast_album_podcast_programs.map(v => v.podcast_program_id) || [],
  }

  return {
    loadingPodcastAlbumPreview: loading,
    error,
    podcastAlbumPreview,
  }
}

export const usePodcastAlbum = (id: string) => {
  const { loading, error, data } = useQuery<hasura.GET_PODCAST_ALBUM, hasura.GET_PODCAST_ALBUMVariables>(
    gql`
      query GET_PODCAST_ALBUM($id: uuid!) {
        podcast_album_by_pk(id: $id) {
          id
          title
          cover_url
          description
          is_public
          author {
            id
            name
          }
          podcast_album_categories {
            id
            category {
              id
              name
            }
          }
          podcast_album_podcast_programs(order_by: { position: asc }) {
            id
            podcast_program {
              id
              title
              duration_second
              podcast_program_body {
                id
              }
            }
          }
        }
      }
    `,
    { variables: { id } },
  )

  const podcastAlbum: PodcastAlbum = {
    id: data?.podcast_album_by_pk?.id,
    title: data?.podcast_album_by_pk?.title || '',
    coverUrl: data?.podcast_album_by_pk?.cover_url || '',
    description: data?.podcast_album_by_pk?.description || '',
    isPublic: !!data?.podcast_album_by_pk?.is_public,
    categories:
      data?.podcast_album_by_pk?.podcast_album_categories?.map(v => ({
        id: v?.category?.id || '',
        name: v?.category?.name || '',
      })) || [],
    podcastPrograms:
      data?.podcast_album_by_pk?.podcast_album_podcast_programs.map(v => ({
        id: v.podcast_program?.id,
        title: v.podcast_program?.title || '',
        durationSecond: v.podcast_program?.duration_second || 0,
      })) || [],
    author: {
      id: data?.podcast_album_by_pk?.author?.id || '',
      name: data?.podcast_album_by_pk?.author?.name || '',
    },
  }

  return {
    loading,
    error,
    podcastAlbum,
  }
}
