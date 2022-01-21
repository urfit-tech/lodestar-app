import { Carousel, Icon } from 'antd'
import styled from 'styled-components'
import Responsive from '../../common/Responsive'
import { Content, SectionTitle } from './util'

const StyledSection = styled.section`
  padding-bottom: 120px;
  background: white;
  color: ${props => props.theme['@heading-color']};
  text-align: justify;

  .feature-image {
    width: 100%;
    min-height: 320px;
    background-image: url(https://static.kolable.com/images/haohaoming/teacher1.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center top;

    @media (max-width: 768px) {
      min-height: 80vw;
    }
  }
`

const CustomPrevArrow: React.FC<{
  onClick?: () => void
}> = ({ onClick }) => <Icon type="left" onClick={onClick} />

const CustomNextArrow: React.FC<{
  onClick?: () => void
}> = ({ onClick }) => <Icon type="right" onClick={onClick} />

const TeacherIntroduction = () => (
  <StyledSection>
    <div className="container">
      <Carousel
        autoplay={true}
        arrows={false}
        dots={false}
        pauseOnHover={true}
        prevArrow={<CustomPrevArrow />}
        nextArrow={<CustomNextArrow />}
      >
        <div>
          <div className="row">
            <Responsive.Default>
              <div className="col-12 col-md-6">
                <div className="feature-image" />
              </div>
            </Responsive.Default>
            <div className="col-12 col-md-6">
              <SectionTitle title="簡少年 老師" subtitle="Jian Shaonian Teacher" />
              <Content>
                <p>
                  {
                    '15 歲開始學習三元理氣風水、紫微斗數、瀟湘面相和東霖姓名學，20 歲拜入台灣著名紫微斗數占驗派門下進修紫微命理'
                  }
                </p>
                <p>
                  {
                    '實戰派命理師，創辦數間營收千萬，估值破億之科技企業，兩岸知名新創企業玄學顧問，顧客身價總值破數十億美元，從獨角獸到 pre ipo 公司皆有，同時也是數十位風險投資公司高管之顧問，以投資諮詢，企業發展，創業風水見長'
                  }
                </p>
                <p>{'學生遍佈全球，線上視頻教學數十萬人，小米、騰訊、今日頭條、愛奇藝、優酷，皆有課程深度合作'}</p>
              </Content>
            </div>
            <Responsive.Desktop>
              <div className="col-12 col-md-6">
                <div className="feature-image" />
              </div>
            </Responsive.Desktop>
          </div>
        </div>
      </Carousel>
    </div>
  </StyledSection>
)

export default TeacherIntroduction
