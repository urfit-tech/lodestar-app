import styled from 'styled-components'
import { useOnceAnimation } from '../../helpers'

const StyledFeature = styled.section`
  padding: 80px 0;

  img {
    height: 184px;
  }

  h2 {
    font-family: Noto Sans TC;
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    line-height: 1.35;
    letter-spacing: 0.5px;
    color: var(--gray-darker);
  }

  h3 {
    font-family: Noto Sans TC;
    font-size: 24px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: 0.77px;
    text-align: center;
    color: var(--gray-darker);
  }
  p {
    font-family: Noto Sans TC;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
    text-align: center;
    margin-bottom: 32px;

    @media (min-width: 992px) {
      margin: 0 40px;
      text-align: left;
    }
  }
`

const MisaFeatureSection: React.VFC<{
  options: {
    title: string
    features: {
      imgSrc: string
      title: string
      paragraph: string
    }[]
  }
}> = ({ options: { title, features } }) => {
  return (
    <StyledFeature>
      <div className="container">
        <h2 className="mb-5">{title}</h2>
        <div className="row">
          {features.map(feature => (
            <FeatureBlock {...feature} />
          ))}
        </div>
      </div>
    </StyledFeature>
  )
}

const FeatureBlock: React.VFC<{
  imgSrc: string
  title: string
  paragraph: string
}> = ({ imgSrc, title, paragraph }) => {
  const { ref, activated } = useOnceAnimation()

  return (
    <div className="col-12 col-lg-4">
      <img
        ref={ref}
        src={imgSrc}
        alt="feature"
        className={`mx-auto ${activated ? 'animate__animated animate__fadeInUp' : ''}`}
      />
      <h3 className="my-4">
        {title.split(' ')[0]}
        <br />
        {title.split(' ')[1]}
      </h3>
      <p>{paragraph}</p>
    </div>
  )
}

export default MisaFeatureSection
