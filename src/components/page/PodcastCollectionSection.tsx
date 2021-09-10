import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { BREAK_POINT } from '../common/Responsive'

const StyledSectionLayout = styled.section<{ variant?: 'primary-color' }>`
  ${props => props.variant === 'primary-color' && `background: ${props.theme['@primary-color']}`};
  padding: 80px 0;

  h2 {
    font-family: NotoSansCJKtc;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    color: var(--gray-darker);
    text-align: center;
    color: ${props => (props.variant === 'primary-color' ? 'white' : 'var(--gray-darker)')};
    margin-bottom: 42px;
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

const StyledCol = styled.div`
  @media (min-width: 320px) and (max-width: ${BREAK_POINT - 1}px) {
    &:nth-child(n + 5) {
      display: none;
    }
  }
`

const StyledCard = styled.div`
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;
`

const StyledCardContent = styled.div`
  padding: 20px;
  h3 {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }

  div.unit {
    font-family: NotoSansCJKtc;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.4px;
    color: var(--gray-dark);
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
  }
`

const StyledLink = styled(Link)`
  color: ${props => props.theme['@primary-color']};
`

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
          <StyledCol key={podcast.id} className="col-6 col-lg-3 my-3">
            <StyledCard>
              <img src={podcast.coverUrl || ''} alt={podcast.title} />
              <StyledCardContent>
                <h3>{podcast.title}</h3>
                <div className="unit mb-3">共 {podcast.programCount} 單元</div>
                {podcast.categoryNames.map(name => (
                  <span className="tag mr-2">{name}</span>
                ))}
              </StyledCardContent>
            </StyledCard>
          </StyledCol>
        ))}
      </div>
      <div className="text-center">
        <StyledLink className="d-inline-block mt-4" to="/">
          <MoreLink to="/" />
        </StyledLink>
      </div>
    </SectionLayout>
  )
}

export const MoreLink: React.VFC<{ to: string }> = ({ to }) => (
  <StyledLink className="d-inline-block mt-4" to={to}>
    查看更多 <AngleRightIcon className="d-inline-block m-auto" />
  </StyledLink>
)

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
        coverUrl: 'https://static.kolable.com/images/littlestar/podcast-cover3.png',
        title: '第 28 期 - 我從那裡來？',
        programCount: 10,
        categoryNames: ['親子', '公衛防疫'],
      })),
  }
}

export default PodcastCollectionSection
