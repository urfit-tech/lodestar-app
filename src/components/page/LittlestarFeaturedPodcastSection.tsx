import styled from 'styled-components'
import { MultiLineTruncationMixin } from '../common'
import { BREAK_POINT } from '../common/Responsive'
import { MoreLink, SectionLayout } from './PodcastCollectionSection'

const StyledCard = styled.div`
  border-radius: 12px;
  margin: 0 auto;
  padding: 40px;
  max-width: 640px;
  width: 100%;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;

  img {
    margin-bottom: 16px;
  }

  h3 {
    font-family: PingFangTC;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--gray-darker);
  }

  p {
    ${MultiLineTruncationMixin}
    -webkit-line-clamp: 4;
    font-family: NotoSansCJKtc;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }

  span.tag {
    border: solid 1px ${props => props.theme['@primary-color']};
    border-radius: 12px;
    padding: 3px 8px;
    font-family: NotoSansCJKtc;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
    color: ${props => props.theme['@primary-color']};
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 24px;

    img {
      margin-bottom: 0;
    }
  }
`

const LittlestarFeaturedPodcastSection: React.FC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcast } = useFeaturePodcast()
  return (
    <SectionLayout title={title} variant="primary-color">
      <StyledCard>
        <div className="row">
          <img className="col-12 col-lg-5" src={podcast.coverUrl} alt={podcast.title} />
          <div className="col-12 col-lg-7 d-flex align-items-center">
            <div>
              <h3 className="mb-3">{podcast.title}</h3>
              {podcast.categoryNames.map(name => (
                <span className="tag mr-2">{name}</span>
              ))}
              <p className="mt-4">{podcast.description}</p>
              <div className="text-right">
                <MoreLink to="/" />
              </div>
            </div>
          </div>
        </div>
      </StyledCard>
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
