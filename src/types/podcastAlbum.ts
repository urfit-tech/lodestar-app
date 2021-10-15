import { Category } from './general'

export type PodcastAlbum = {
  id: string
  title: string
  coverUrl: string | null
  description: string
  categories: Category[]
  isPublic: boolean
  author: {
    id: string
    name: string
  }
  podcastPrograms: {
    id: string
    title: string
    durationSecond: number
  }[]
}

export type PodcastAlbumPreview = Pick<PodcastAlbum, 'id' | 'title'> & { podcastProgramIds: string[] }
