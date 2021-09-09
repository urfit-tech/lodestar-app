import styled from 'styled-components'

const StyledSectionLayout = styled.section<{ variant?: 'primary-color' }>`
  ${props => props.variant === 'primary-color' && `background: ${props.theme['@primary-color']}`};
  padding: 80px 0;

  h2 {
    font-family: NotoSansCJKtc;
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    line-height: 1.35;
    letter-spacing: 0.5px;
    color: ${props => (props.variant === 'primary-color' ? 'white' : 'var(--gray-darker)')};
    margin-bottom: 40px;
  }
`

export const SectionLayout: React.FC<{ title?: string; variant?: 'primary-color' }> = ({
  title,
  variant,
  children,
}) => {
  return (
    <StyledSectionLayout variant={variant}>
      <div className="container">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </StyledSectionLayout>
  )
}

const PodcastCollectionSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcasts } = useNewestPodcastCollection()
  return (
    <SectionLayout title={title}>
      <div className="row">
        {podcasts.map(podcast => (
          <div className="col-3">
            <img key={podcast.id} src={podcast.coverUrl || ''} alt={podcast.title} />
            <div>
              {podcast.title}
              {podcast.programCount}
              {podcast.categoryNames.map(name => (
                <span>{name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

const useNewestPodcastCollection: () => {
  podcasts: {
    id: string
    coverUrl: string | null
    title: string
    programCount: number
    categoryNames: string[]
  }[]
} = () => {
  return {
    podcasts: Array(8)
      .fill(null)
      .map((_, i) => ({
        id: i.toString(),
        coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover2.png',
        title: '第 28 期 - 我從那裡來？',
        programCount: 10,
        categoryNames: ['親子', '公衛防疫'],
      })),
  }
}

export default PodcastCollectionSection
