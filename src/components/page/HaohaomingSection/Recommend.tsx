import { Card, Carousel, Icon } from 'antd'
import styled from 'styled-components'
import QuoteMark from '../../../images/quote.png'
import { RecommendProp } from './type'
import { Content, SectionTitle, StyledAvatar } from './util'

const StyledSection = styled.section`
  padding: 120px 0;
  background: white;

  .row {
    padding-top: 80px;
    background-image: url(${QuoteMark});
    background-position: right 90px top;
    background-size: 194px;
    background-repeat: no-repeat;
  }

  .section-title {
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    .row {
      padding-top: 0;
      background-position: right -70px top;
    }
    .section-title {
      justify-content: center;
    }
  }
`

const StyledWrapper = styled.div`
  padding: 24px;
`

const StyledCarousel = styled(Carousel)`
  margin: 0 auto;
  max-width: 600px;

  .slick-track {
    display: flex !important;
    align-items: center;
  }

  & > :first-child {
    z-index: 999;
    position: absolute;
    left: -7px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme['@primary-color']};
    font-size: 20px;
  }
  & > :last-child {
    z-index: 999;
    position: absolute;
    right: -7px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme['@primary-color']};
    font-size: 20px;
  }
`

const StyledCard = styled(Card)`
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      flex-direction: column;
      margin-left: 0;
      padding: 16px;
      text-align: center;
    }
  }
`

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const CardSubTitle = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 12px;
  margin-bottom: 15px;
`

const CustomArrow: React.FC<{
  type: string
  onClick?: () => void
}> = ({ type, onClick }) => <Icon type={type} onClick={onClick} />

const Recommend: React.VFC<RecommendProp> = ({ title, subtitle, recommenders }) => (
  <StyledSection>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-3 d-flex align-items-center section-title">
          <SectionTitle title={title || ''} subtitle={subtitle || ''} margin={false} />
        </div>
        <div className="col-12 col-md-9">
          <StyledCarousel
            arrows={true}
            autoplay={true}
            autoplaySpeed={5000}
            dots={false}
            draggable={true}
            pauseOnHover={true}
            prevArrow={<CustomArrow type="left" />}
            nextArrow={<CustomArrow type="right" />}
          >
            {recommenders?.map(recommender => (
              <StyledWrapper key={recommender.name}>
                <StyledCard>
                  <StyledAvatar src={recommender.photo} size={128} className=" m-3" />
                  <Content className="flex-grow-1 m-3">
                    <CardTitle>{recommender.name}</CardTitle>
                    <CardSubTitle>{recommender.jobTitle}</CardSubTitle>
                    <p>{recommender.words}</p>
                  </Content>
                </StyledCard>
              </StyledWrapper>
            ))}
          </StyledCarousel>
        </div>
      </div>
    </div>
  </StyledSection>
)

export default Recommend
