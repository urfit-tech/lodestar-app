import styled from 'styled-components'
import { PhilosophyProp } from './type'
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

const Philosophy: React.VFC<PhilosophyProp> = ({ title, subtitle, content }) => (
  <StyledSection>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="feature-image" />
        </div>

        <div className="col-12 col-md-6">
          <SectionTitle title={title || ''} subtitle={subtitle || ''} />
          <Content>
            <p>{content}</p>
          </Content>
        </div>
      </div>
    </div>
  </StyledSection>
)

export default Philosophy
