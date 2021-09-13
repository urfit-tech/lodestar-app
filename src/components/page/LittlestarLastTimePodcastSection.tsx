import { Icon } from '@chakra-ui/icons'
import styled from 'styled-components'
import { ReactComponent as PlayIcon } from '../../images/play.svg'
import { BREAK_POINT } from '../common/Responsive'
import { SectionLayout } from './PodcastCollectionSection'

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0 0;

  @media (min-width: ${BREAK_POINT}px) {
    border-radius: 8px;
  }
`

const StyledRow = styled.div`
  max-width: 700px;
`

const StyledCard = styled.div`
  height: 100%;
  padding: 40px;
  border-radius: 0 0 8px 8px;
  background-color: ${props => props.theme['@primary-color']};

  @media (min-width: ${BREAK_POINT}px) {
    height: 65%;
    border-radius: 0 8px 8px 0;
  }

  h3 {
    font-family: Noto Sans TC;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.3px;
    color: #fff;
  }

  h4 {
    font-family: Noto Sans TC;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #fff;
  }

  span.tag {
    font-family: Noto Sans TC;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.83;
    letter-spacing: 0.6px;
    color: #fff;
    width: 68px;
    padding: 1px 8px;
    border-radius: 10px;
    border: solid 1px #fff;
  }

  div.play {
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    transition: 0.3s;
    cursor: pointer;
    user-select: none;

    svg {
      font-size: 30px;
    }

    &:hover {
      opacity: 0.9;
    }
  }
`

const LittlestarLastTimePodcastSection: React.VFC<{
  options: {
    title?: string
  }
}> = ({ options: { title } }) => {
  const { podcast } = useLatestPodcast()

  return (
    <SectionLayout title={title}>
      <StyledRow className="row mx-auto">
        <div className="col-lg-6 p-lg-0">
          <StyledImg src={podcast.coverUrl} alt={podcast.title} />
        </div>
        <div className="col-lg-6 p-lg-0 d-flex">
          <StyledCard className="flex-grow-1 d-flex flex-column justify-content-between m-0 m-lg-auto">
            <div className="mb-3">
              <h3 className="mb-4">{podcast.title}</h3>
              <h4 className="mb-2">{podcast.programTitle}</h4>
              {podcast.categoryNames.map(name => (
                <span className="tag mr-1">{name}</span>
              ))}
            </div>

            <div className="text-right">
              <div className="play">
                繼續播放
                <Icon className="ml-2" as={PlayIcon} />
              </div>
            </div>
          </StyledCard>
        </div>
      </StyledRow>
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
      coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover3.png',
      title: '正確的洗手',
      programTitle: '第 35 期 - 對抗病毒大作戰 第 4 則',
      categoryNames: ['親子', '公衛防疫'],
    },
  }
}

export default LittlestarLastTimePodcastSection
