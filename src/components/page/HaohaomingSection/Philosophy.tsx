import styled from 'styled-components'
import { Content, SectionTitle } from './util'

const StyledSection = styled.section`
  position: relative;
  overflow-x: hidden;
  padding: 120px 0;
  background: white;
  color: ${props => props.theme['@heading-color']};
  text-align: justify;

  &::after {
    content: ' ';
    background-image: url(https://static.kolable.com/images/haohaoming/section3_BGIcon.png);
    background-size: 100% 100%;
    position: absolute;
    width: 83px;
    height: 290px;
    left: 0;
    bottom: 0;
    @media (max-width: 769px) {
      display: none;
    }
  }

  .col-12 {
    margin-bottom: 30px;
  }

  .feature-image {
    width: 100%;
    min-height: 320px;
    background-image: url(https://static.kolable.com/images/haohaoming/philosophy-feature.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center top;

    @media (max-width: 769px) {
      min-height: 80vw;
    }
  }
`

const Philosophy = () => (
  <StyledSection>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="feature-image" />
        </div>

        <div className="col-12 col-md-6">
          <SectionTitle title="真理大道，找回平衡" subtitle="The Way of truth, back to balance" />
          <Content>
            <p>
              {
                '人生成長的過程中，一路上充滿許多難題，有一些困難是我們沒有辦法改變的，我們就是不斷地在種種難題中學習「好好的存活」。'
              }
            </p>
            <p>
              {
                '每個人的本性有差異、環境有差異，唯一沒有差異的就是我們都可以學習操練大腦並自我超越。因此，我們要學習認識一己的本性、接受和別人不同之長處或短處，進而在環境困境中，發揮所長，累積經驗，讓自己的本性與週遭環境有良好之互動，並且有所超越，增長智慧，悠然自得，這就是所謂的心腦操練。'
              }
            </p>
          </Content>
        </div>
      </div>
    </div>
  </StyledSection>
)

export default Philosophy
