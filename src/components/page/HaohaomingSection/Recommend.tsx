import { Card, Carousel, Icon } from 'antd'
import styled from 'styled-components'
import QuoteMark from '../../../images/quote.png'
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

const recommenders = [
  {
    photo: `https://static.kolable.com/images/haohaoming/番茄.jpg`,
    name: '番茄',
    jobTitle: 'Elfin restaurant&lounge 精靈餐酒館 共同創辦人',
    words: '接觸到少年以後氣色變的超好，業績也不斷再創新高！',
  },
  {
    photo: `https://static.kolable.com/images/haohaoming/游弘宇.jpg`,
    name: '游弘宇',
    jobTitle: 'YOTTA執行長',
    words: '少年是我在創業圈遇過最具有執行力與感染力的男人',
  },
  {
    photo: `https://static.kolable.com/images/haohaoming/BEN.jpg`,
    name: 'Ben',
    jobTitle: 'ICHEF Co-Founder',
    words: '講話幽默風趣卻隱含人生哲理的大師級人物。',
  },
  {
    photo: `https://static.kolable.com/images/haohaoming/Ronald.jpg`,
    name: 'Ronald',
    jobTitle: '車麻吉創辦人',
    words: '人生道路的隱形守護神',
  },
  {
    photo: `https://static.kolable.com/images/haohaoming/陳欽章.jpg`,
    name: '陳欽章醫師',
    jobTitle: '台灣牙e通創辦人暨執行長 ',
    words:
      '空口說白話是玄學，但用無數案例的驗證堆疊出的鐵口直斷，是少年讓人信服之處，讓人相信這是一門經得起檢驗的『科學』',
  },
]

const CustomArrow: React.FC<{
  type: string
  onClick?: () => void
}> = ({ type, onClick }) => <Icon type={type} onClick={onClick} />

const Recommend = () => (
  <StyledSection>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-3 d-flex align-items-center section-title">
          <SectionTitle title="名人推薦" subtitle="RECOMMEND" margin={false} />
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
            {recommenders.map(recommender => (
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
