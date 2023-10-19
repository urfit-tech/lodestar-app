import { gql, useMutation, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { uniq } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { PodcastProgramProps } from '../containers/podcast/PodcastProgramTimeline'
import hasura from '../hasura'
import { getFileDownloadableLink, notEmpty } from '../helpers'
import { StatusType } from '../types/general'
import { PlaylistProps, PodcastProgramContent, PodcastProgramContentProps } from '../types/podcast'

export const usePodcastProgramCollection = (creatorId?: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PODCAST_PROGRAM_COLLECTION,
    hasura.GET_PODCAST_PROGRAM_COLLECTIONVariables
  >(
    gql`
      query GET_PODCAST_PROGRAM_COLLECTION($creatorId: String) {
        podcast_program(
          order_by: { published_at: desc }
          where: {
            podcast_program_roles: { member_id: { _eq: $creatorId }, name: { _eq: "instructor" } }
            published_at: { _is_null: false }
          }
        ) {
          id
          cover_url
          title
          abstract
          duration
          duration_second
          list_price
          sale_price
          sold_at
          published_at
          support_locales
          is_individually_sale
          podcast_program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member {
              id
              picture_url
              name
              username
            }
          }
          podcast_program_categories(order_by: { position: asc_nulls_last }) {
            id
            category {
              id
              name
              position
            }
          }
        }
      }
    `,
    {
      variables: {
        creatorId: creatorId,
      },
    },
  )

  const podcastPrograms: PodcastProgramProps[] =
    loading || error || !data
      ? []
      : data.podcast_program.map(podcastProgram => {
          const instructorMember = podcastProgram.podcast_program_roles.length
            ? podcastProgram.podcast_program_roles[0].member
            : null

          return {
            id: podcastProgram.id,
            coverUrl: podcastProgram.cover_url || null,
            title: podcastProgram.title,
            description: podcastProgram.abstract || '',
            duration: podcastProgram.duration,
            durationSecond: podcastProgram.duration_second,
            instructor: instructorMember
              ? {
                  id: instructorMember.id || '',
                  avatarUrl: instructorMember.picture_url || null,
                  name: instructorMember.name || instructorMember.username || '',
                }
              : null,
            listPrice: podcastProgram.list_price,
            salePrice:
              podcastProgram.sold_at && new Date(podcastProgram.sold_at).getTime() > Date.now()
                ? podcastProgram.sale_price
                : undefined,
            categories: podcastProgram.podcast_program_categories.map(podcastProgramCategory => ({
              id: podcastProgramCategory.category.id,
              name: podcastProgramCategory.category.name,
              position: podcastProgramCategory.category.position,
            })),
            publishedAt: new Date(podcastProgram.published_at),
            supportLocales: podcastProgram.support_locales,
            isIndividuallySale: podcastProgram.is_individually_sale,
          }
        })

  return {
    loadingPodcastPrograms: loading,
    errorPodcastPrograms: error,
    podcastPrograms,
    refetchPodcastPrograms: refetch,
  }
}

export const usePodcastPlanIds = (creatorId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PODCAST_PLAN_IDS, hasura.GET_PODCAST_PLAN_IDSVariables>(
    gql`
      query GET_PODCAST_PLAN_IDS($creatorId: String!) {
        podcast_plan(where: { creator_id: { _eq: $creatorId } }) {
          id
        }
      }
    `,
    { variables: { creatorId } },
  )

  const podcastPlanIds: string[] =
    loading || !!error || !data ? [] : data.podcast_plan.map(podcastPlan => podcastPlan.id)

  return {
    loadingPodcastPlans: loading,
    errorPodcastPlans: error,
    podcastPlanIds,
    refetchPodcastPlans: refetch,
  }
}

export const useEnrolledPodcastProgramIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PODCAST_PROGRAM_IDS,
    hasura.GET_ENROLLED_PODCAST_PROGRAM_IDSVariables
  >(
    gql`
      query GET_ENROLLED_PODCAST_PROGRAM_IDS($memberId: String!) {
        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {
          podcast_program_id
        }
      }
    `,
    { variables: { memberId } },
  )

  const enrolledPodcastProgramIds: string[] =
    loading || error || !data
      ? []
      : data.podcast_program_enrollment.map(podcastProgram => podcastProgram.podcast_program_id)

  return {
    loadingPodcastProgramId: loading,
    errorPodcastProgramId: error,
    enrolledPodcastProgramIds,
    refetchPodcastProgramId: refetch,
  }
}

export const useEnrolledPodcastPrograms = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PODCAST_PROGRAMS,
    hasura.GET_ENROLLED_PODCAST_PROGRAMSVariables
  >(
    gql`
      query GET_ENROLLED_PODCAST_PROGRAMS($memberId: String!) {
        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {
          podcast_program {
            id
            cover_url
            title
            abstract
            duration
            duration_second
            list_price
            sale_price
            sold_at
            published_at
            support_locales
            podcast_program_categories(order_by: { position: asc_nulls_last }) {
              id
              category {
                id
                name
              }
            }
            podcast_program_roles(where: { name: { _eq: "instructor" } }) {
              id
              member {
                id
                picture_url
                name
                username
              }
            }
          }
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )
  const enrolledPodcastPrograms: PodcastProgramProps[] =
    loading || error || !data
      ? []
      : data.podcast_program_enrollment
          .map(enrollment => {
            if (!enrollment.podcast_program) {
              return null
            }

            const instructorMember = enrollment.podcast_program.podcast_program_roles.length
              ? enrollment.podcast_program.podcast_program_roles[0].member
              : null

            return {
              id: enrollment.podcast_program.id,
              coverUrl: enrollment.podcast_program.cover_url || null,
              title: enrollment.podcast_program.title,
              description: enrollment.podcast_program.abstract || '',
              duration: enrollment.podcast_program.duration || '',
              durationSecond: enrollment.podcast_program.duration_second,
              instructor: instructorMember
                ? {
                    id: instructorMember.id || '',
                    avatarUrl: instructorMember.picture_url || null,
                    name: instructorMember.name || instructorMember.username || '',
                  }
                : null,
              listPrice: enrollment.podcast_program.list_price,
              salePrice:
                enrollment.podcast_program.sold_at &&
                new Date(enrollment.podcast_program.sold_at).getTime() > Date.now()
                  ? enrollment.podcast_program.sale_price || undefined
                  : undefined,
              categories: enrollment.podcast_program.podcast_program_categories.map(podcastProgramCategory => ({
                id: podcastProgramCategory.category.id,
                name: podcastProgramCategory.category.name,
              })),
              publishedAt: new Date(enrollment.podcast_program.published_at),
              supportLocales: enrollment.podcast_program.support_locales,
            }
          })
          .filter(notEmpty)

  return {
    enrolledPodcastPrograms,
    loadingPodcastProgramIds: loading,
    refetchPodcastProgramIds: refetch,
  }
}

export const usePublishedPodcastPlans = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_PODCAST_PLANS,
    hasura.GET_PUBLISHED_PODCAST_PLANSVariables
  >(
    gql`
      query GET_PUBLISHED_PODCAST_PLANS($memberId: String!) {
        podcast_plan(where: { creator_id: { _eq: $memberId }, _and: { published_at: { _is_null: false } } }) {
          id
          creator_id
          is_subscription
          period_amount
          period_type
          list_price
          sale_price
          sold_at
        }
      }
    `,
    { variables: { memberId } },
  )
  const publishedPodcastPlans =
    loading || error || !data
      ? []
      : data.podcast_plan.map(PodcastPlan => ({
          id: PodcastPlan.id,
          periodAmount: PodcastPlan.period_amount,
          periodType: PodcastPlan.period_type as 'D' | 'W' | 'M' | 'Y',
          listPrice: PodcastPlan.list_price,
          salePrice: PodcastPlan.sale_price,
          soldAt: PodcastPlan.sold_at,
        }))

  return {
    publishedPodcastPlans,
    loadingPodcastPlans: loading,
    errorPodcastPlan: error,
    refetchPodcastPlans: refetch,
  }
}

export const useEnrolledPodcastProgramWithCreatorId: (creatorId: string) => {
  status: 'loading' | 'error' | 'success' | 'idle'
  enrolledPodcastProgramIds: string[]
  creatorName: string
} = creatorId => {
  const { currentMemberId } = useAuth()
  const { loading, error, data } = useQuery<
    hasura.GET_ENROLLED_PODCAST_PROGRAM_WITH_CREATOR_ID,
    hasura.GET_ENROLLED_PODCAST_PROGRAM_WITH_CREATOR_IDVariables
  >(
    gql`
      query GET_ENROLLED_PODCAST_PROGRAM_WITH_CREATOR_ID($memberId: String!, $creatorId: String) {
        podcast_program_enrollment(
          where: { member_id: { _eq: $memberId }, podcast_program: { creator: { id: { _eq: $creatorId } } } }
        ) {
          podcast_program {
            id
            creator {
              id
              name
            }
          }
        }
      }
    `,
    { variables: { memberId: currentMemberId || '', creatorId } },
  )

  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    enrolledPodcastProgramIds: (data && data.podcast_program_enrollment.map(v => v.podcast_program?.id)) || [],
    creatorName: (data && data.podcast_program_enrollment[0]?.podcast_program?.creator?.name) || '',
  }
}

export const useEnrolledPodcastPlansCreators = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PODCAST_PLAN,
    hasura.GET_ENROLLED_PODCAST_PLANVariables
  >(
    gql`
      query GET_ENROLLED_PODCAST_PLAN($memberId: String!) {
        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
          podcast_plan {
            creator {
              id
              picture_url
              name
              username
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const enrolledPodcastPlansCreators: {
    id: string
    pictureUrl: string | null
    name: string | null
    username: string
  }[] =
    loading || error || !data
      ? []
      : uniq(
          data.podcast_plan_enrollment.map(enrollment =>
            enrollment && enrollment.podcast_plan && enrollment.podcast_plan.creator
              ? {
                  id: enrollment.podcast_plan.creator.id || '',
                  pictureUrl: enrollment.podcast_plan.creator.picture_url || null,
                  name: enrollment.podcast_plan.creator.name || '',
                  username: enrollment.podcast_plan.creator.username || '',
                }
              : {
                  id: '',
                  pictureUrl: '',
                  name: '',
                  username: '',
                },
          ),
        )

  return {
    enrolledPodcastPlansCreators,
    loadingPodcastPlanIds: loading,
    refetchPodcastPlan: refetch,
  }
}
export const usePodcastProgram: (podcastProgramId: string) => {
  status: 'loading' | 'error' | 'success' | 'idle'
  podcastProgram: {
    id: string
    title: string
    coverUrl: string
    duration: number
    creator: {
      id: string
      name: string
      avatarUrl: string
    }
  }
} = podcastProgramId => {
  const { loading, error, data } = useQuery<hasura.GET_PODCAST_PROGRAM, hasura.GET_PODCAST_PROGRAMVariables>(
    gql`
      query GET_PODCAST_PROGRAM($podcastProgramId: uuid!) {
        podcast_program_by_pk(id: $podcastProgramId) {
          id
          title
          cover_url
          duration
          creator {
            id
            name
            picture_url
          }
        }
      }
    `,
    { variables: { podcastProgramId } },
  )

  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    podcastProgram: {
      id: data?.podcast_program_by_pk?.id || '',
      title: data?.podcast_program_by_pk?.title || '',
      coverUrl: data?.podcast_program_by_pk?.cover_url || '',
      duration: data?.podcast_program_by_pk?.duration || 0,
      creator: {
        id: data?.podcast_program_by_pk?.creator?.id || '',
        name: data?.podcast_program_by_pk?.creator?.name || '',
        avatarUrl: data?.podcast_program_by_pk?.creator?.picture_url || '',
      },
    },
  }
}
export const usePodcastProgramContent = (podcastProgramId: string) => {
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const [url, setUrl] = useState('')
  const [loadingUrl, setLoadingUrl] = useState(false)
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PODCAST_PROGRAM_WITH_BODY,
    hasura.GET_PODCAST_PROGRAM_WITH_BODYVariables
  >(
    gql`
      query GET_PODCAST_PROGRAM_WITH_BODY($podcastProgramId: uuid!) {
        podcast_program_by_pk(id: $podcastProgramId) {
          id
          title
          cover_url
          abstract
          content_type
          filename
          published_at
          creator_id
          podcast_program_categories {
            id
            category {
              id
              name
            }
          }
          podcast_program_tags {
            id
            tag {
              name
            }
          }
          podcast_program_body {
            id
            description
          }
          podcast_program_roles {
            id
            name
            member_id
          }
        }
      }
    `,
    { variables: { podcastProgramId } },
  )

  const contentType = data?.podcast_program_by_pk?.content_type
  const filename = data?.podcast_program_by_pk?.filename
  const audioFilename = filename ? filename : contentType ? `${podcastProgramId}.${contentType}` : null

  useEffect(() => {
    if (audioFilename) {
      setLoadingUrl(true)
      getFileDownloadableLink(`audios/${appId}/${audioFilename}`, authToken)
        .then(url => {
          setUrl(url)
        })
        .finally(() => setLoadingUrl(false))
    }
  }, [appId, audioFilename, authToken])

  const podcastProgram = useMemo<PodcastProgramContent | null>(() => {
    if (loading || error || !data || !data.podcast_program_by_pk) {
      return null
    }
    return {
      id: data.podcast_program_by_pk.id || '',
      title: data.podcast_program_by_pk.title || '',
      abstract: data.podcast_program_by_pk.abstract || '',
      description: data.podcast_program_by_pk.podcast_program_body?.description || null,
      coverUrl: data.podcast_program_by_pk.cover_url || null,
      publishedAt: data.podcast_program_by_pk.published_at && new Date(data.podcast_program_by_pk.published_at),
      tags: data.podcast_program_by_pk.podcast_program_tags.map(podcastProgramTag => podcastProgramTag.tag.name),
      categories: (data.podcast_program_by_pk.podcast_program_categories || []).map(programCategory => ({
        id: programCategory.category.id || '',
        name: programCategory.category.name || '',
      })),
      url,
      instructorIds:
        data.podcast_program_by_pk.podcast_program_roles
          .filter(role => role.name === 'instructor')
          .map(role => role.member_id) || [],
    }
  }, [data, error, loading, url])

  return {
    loadingPodcastProgram: loading || loadingUrl,
    errorPodcastProgram: error,
    podcastProgram,
    refetchPodcastProgram: refetch,
  }
}

export const usePlaylistCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PLAYLIST_COLLECTION>(
    gql`
      query GET_PLAYLIST_COLLECTION($memberId: String) {
        playlist(where: { member_id: { _eq: $memberId } }, order_by: { position: asc }) {
          id
          title
          playlist_podcast_programs {
            id
            podcast_program_id
          }
          playlist_podcast_programs_aggregate {
            aggregate {
              max {
                position
              }
            }
          }
        }
        podcast_program_enrollment_aggregate(where: { member_id: { _eq: $memberId } }) {
          aggregate {
            count
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const playlists: (PlaylistProps & {
    podcastProgramIds: string[]
  })[] =
    loading || error || !data
      ? []
      : data.playlist.map(playlist => ({
          id: playlist.id,
          title: playlist.title,
          podcastProgramIds: playlist.playlist_podcast_programs.map(
            playlistPodcastProgram => playlistPodcastProgram.podcast_program_id,
          ),
          maxPosition: playlist.playlist_podcast_programs_aggregate.aggregate?.max?.position || -1,
        }))

  return {
    loadingPlaylists: loading,
    errorPlaylists: error,
    playlists,
    totalPodcastProgramCount: data?.podcast_program_enrollment_aggregate.aggregate?.count || 0,
    refetchPlaylists: refetch,
  }
}

export const useCreatePlaylist = () => {
  const [createPlaylist] = useMutation<hasura.CREATE_PLAYLIST, hasura.CREATE_PLAYLISTVariables>(gql`
    mutation CREATE_PLAYLIST($memberId: String!, $title: String!, $position: Int!) {
      insert_playlist(objects: { member_id: $memberId, title: $title, position: $position }) {
        affected_rows
      }
    }
  `)

  return createPlaylist
}

export const useUpdatePlaylist = () => {
  const [updatePlaylist] = useMutation<hasura.UPDATE_PLAYLIST, hasura.UPDATE_PLAYLISTVariables>(gql`
    mutation UPDATE_PLAYLIST($playlistId: uuid!, $title: String!) {
      update_playlist(where: { id: { _eq: $playlistId } }, _set: { title: $title }) {
        affected_rows
      }
    }
  `)

  return updatePlaylist
}

export const useUpdatePlaylistPosition = () => {
  const [updatePlaylistPosition] = useMutation<
    hasura.UPDATE_PLAYLIST_POSITION,
    hasura.UPDATE_PLAYLIST_POSITIONVariables
  >(gql`
    mutation UPDATE_PLAYLIST_POSITION($data: [playlist_insert_input!]!) {
      insert_playlist(objects: $data, on_conflict: { constraint: playlist_pkey, update_columns: position }) {
        affected_rows
      }
    }
  `)

  return updatePlaylistPosition
}

export const useDeletePlaylist = () => {
  const [deletePlaylist] = useMutation<hasura.DELETE_PLAYLIST, hasura.DELETE_PLAYLISTVariables>(gql`
    mutation DELETE_PLAYLIST($playlistId: uuid!) {
      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {
        affected_rows
      }
      delete_playlist(where: { id: { _eq: $playlistId } }) {
        affected_rows
      }
    }
  `)

  return deletePlaylist
}

export const usePlaylistPodcastPrograms = (playlistId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PLAYLIST_PODCAST_PROGRAMS,
    hasura.GET_PLAYLIST_PODCAST_PROGRAMSVariables
  >(
    gql`
      query GET_PLAYLIST_PODCAST_PROGRAMS($playlistId: uuid!) {
        playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }, order_by: { position: asc }) {
          id
          podcast_program {
            id
            cover_url
            title
            duration
            duration_second
            podcast_program_roles(where: { name: { _eq: "instructor" } }) {
              id
              member {
                id
                picture_url
                name
                username
              }
            }
          }
        }
      }
    `,
    { fetchPolicy: 'network-only', variables: { playlistId } },
  )

  const podcastPrograms: PodcastProgramContentProps[] =
    loading || error || !data
      ? []
      : data.playlist_podcast_program.map(playlist => ({
          id: playlist.podcast_program.id,
          coverUrl: playlist.podcast_program.cover_url || null,
          title: playlist.podcast_program.title,
          duration: playlist.podcast_program.duration,
          durationSecond: playlist.podcast_program.duration_second,
          instructor: {
            id: playlist.podcast_program.podcast_program_roles[0]?.member?.id || '',
            avatarUrl: playlist.podcast_program.podcast_program_roles[0]?.member?.picture_url || null,
            name:
              playlist.podcast_program.podcast_program_roles[0]?.member?.name ||
              playlist.podcast_program.podcast_program_roles[0]?.member?.username ||
              '',
          },
        }))

  return {
    loadingPodcastPrograms: loading,
    errorPodcastPrograms: error,
    podcastPrograms,
    refetchPodcastPrograms: refetch,
  }
}

export const useUpdatePlaylistPodcastPrograms = () => {
  const [deletePlaylistPodcastPrograms] = useMutation<
    hasura.DELETE_PODCAST_PROGRAMS,
    hasura.DELETE_PODCAST_PROGRAMSVariables
  >(gql`
    mutation DELETE_PODCAST_PROGRAMS($podcastProgramId: uuid, $playlistIds: [uuid!]!) {
      delete_playlist_podcast_program(
        where: { podcast_program_id: { _eq: $podcastProgramId }, playlist_id: { _in: $playlistIds } }
      ) {
        affected_rows
      }
    }
  `)
  const [insertPlaylistPodcastPrograms] = useMutation<
    hasura.INSERT_PODCAST_PROGRAMS,
    hasura.INSERT_PODCAST_PROGRAMSVariables
  >(gql`
    mutation INSERT_PODCAST_PROGRAMS($data: [playlist_podcast_program_insert_input!]!) {
      insert_playlist_podcast_program(objects: $data) {
        affected_rows
      }
    }
  `)

  return async (
    podcastProgramId: string,
    removedPlaylistIds: string[],
    data: hasura.INSERT_PODCAST_PROGRAMSVariables['data'],
  ) => {
    await deletePlaylistPodcastPrograms({
      variables: {
        podcastProgramId,
        playlistIds: removedPlaylistIds,
      },
    })
    await insertPlaylistPodcastPrograms({ variables: { data } })
  }
}

export const useUpdatePodcastProgramPositions = () => {
  const [updatePodcastProgramPositions] = useMutation<
    hasura.UPDATE_PODCAST_PROGRAM_POSITIONS,
    hasura.UPDATE_PODCAST_PROGRAM_POSITIONSVariables
  >(gql`
    mutation UPDATE_PODCAST_PROGRAM_POSITIONS($playlistId: uuid!, $data: [playlist_podcast_program_insert_input!]!) {
      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {
        affected_rows
      }
      insert_playlist_podcast_program(objects: $data) {
        affected_rows
      }
    }
  `)

  return updatePodcastProgramPositions
}

export const usePublicPodcastProgramIds: (id?: string) => {
  status: 'loading' | 'error' | 'success' | 'idle'
  publicPodcastProgramIds: string[]
} = id => {
  const { loading, error, data } = useQuery<
    hasura.GET_PUBLIC_PODCAST_PROGRAMS_IDS_BY_PODCAST_ALBUM,
    hasura.GET_PUBLIC_PODCAST_PROGRAMS_IDS_BY_PODCAST_ALBUMVariables
  >(
    gql`
      query GET_PUBLIC_PODCAST_PROGRAMS_IDS_BY_PODCAST_ALBUM($id: uuid!) {
        podcast_album_by_pk(id: $id) {
          id
          podcast_album_podcast_programs(order_by: { position: asc }) {
            id
            podcast_program {
              id
            }
          }
        }
      }
    `,
    { variables: { id: id || '' } },
  )

  return {
    status: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    publicPodcastProgramIds:
      data?.podcast_album_by_pk?.podcast_album_podcast_programs.map(v => v.podcast_program?.id) || [],
  }
}

export const usePodcastProgramProgress: (programPodcastId: string) => {
  podcastProgramProgressStatus: StatusType
  podcastProgramProgress: {
    id: string
    progress: number
    lastProgress: number
  } | null
  refetchPodcastProgramProgress: () => void
} = programPodcastId => {
  const { currentMemberId } = useAuth()
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PODCAST_PROGRAM_PROGRESS,
    hasura.GET_PODCAST_PROGRAM_PROGRESSVariables
  >(
    gql`
      query GET_PODCAST_PROGRAM_PROGRESS($programPodcastId: uuid!, $memberId: String!) {
        podcast_program_progress(
          where: { podcast_program_id: { _eq: $programPodcastId }, member_id: { _eq: $memberId } }
        ) {
          id
          progress
          last_progress
        }
      }
    `,
    { variables: { programPodcastId, memberId: currentMemberId || '' } },
  )
  const [podcastProgramProgress = null] = data?.podcast_program_progress || []
  return {
    podcastProgramProgressStatus: loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle',
    podcastProgramProgress: podcastProgramProgress && {
      id: podcastProgramProgress.id,
      progress: podcastProgramProgress.progress,
      lastProgress: podcastProgramProgress.last_progress,
    },
    refetchPodcastProgramProgress: refetch,
  }
}
