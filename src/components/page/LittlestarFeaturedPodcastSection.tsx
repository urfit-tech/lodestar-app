import { SectionLayout } from './PodcastCollectionSection'

const LittlestarFeaturedPodcastSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcast } = useFeaturePodcast()
  return (
    <SectionLayout title={title} variant="primary-color">
      <img src={podcast.coverUrl} alt={podcast.title} />
      <div>
        {podcast.title}
        {podcast.description}
        {podcast.categoryNames.map(name => (
          <span>{name}</span>
        ))}
      </div>
    </SectionLayout>
  )
}

const useFeaturePodcast: () => {
  podcast: {
    coverUrl: string
    title: string
    categoryNames: string[]
    description: string
  }
} = () => {
  return {
    podcast: {
      coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover3.png',
      title: '正確的洗手',
      categoryNames: ['親子', '公衛防疫'],
      description:
        '關於孩子如何正確洗手建立公共衛生觀念是一件很重要的事請，因為關於孩子如何正確洗手建立公共衛生觀念是一。關於孩子如何正確洗手建立公共衛生觀念是一件很重要的事請，因為關於孩子如何正確洗手建立公共衛生觀念是一',
    },
  }
}

export default LittlestarFeaturedPodcastSection
