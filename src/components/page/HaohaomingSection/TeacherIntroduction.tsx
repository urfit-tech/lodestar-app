import { Carousel, Icon } from 'antd'
import styled from 'styled-components'
import Responsive from '../../common/Responsive'
import { TeacherIntroductionProp } from './type'
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

const TeacherIntroduction: React.VFC<TeacherIntroductionProp> = ({ title, subtitle, content }) => (
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
              <SectionTitle title={title || ''} subtitle={subtitle || ''} />
              <Content>
                <p>{content}</p>
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
