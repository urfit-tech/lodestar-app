import { SectionLayout } from './PodcastCollectionSection'

const LittlestarLastTimePodcastSection: React.VFC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcast } = useLatestPodcast()

  return (
    <SectionLayout title={title}>
      <img src={podcast.coverUrl} alt={podcast.title} />
      <div>
        {podcast.title}
        {podcast.programTitle}
        {podcast.categoryNames.map(name => (
          <span>{name}</span>
        ))}
      </div>
    </SectionLayout>
  )
}

const useLatestPodcast: () => {
  podcast: {
    coverUrl: string
    title: string
    programTitle: string
    categoryNames: string[]
  }
} = () => {
  return {
    podcast: {
      coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover1.png',
      title: '正確的洗手',
      programTitle: '',
      categoryNames: ['親子', '公衛防疫'],
    },
  }
}

export default LittlestarLastTimePodcastSection
