import { Collapse, Icon } from 'antd'
import styled from 'styled-components'
import { FAQsProp } from './type'
import { SectionTitle } from './util'

const StyledSection = styled.section`
  position: relative;
  padding: 120px 0;
  background-color: white;
  text-align: center;

  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: 348px;
    width: 210px;
    height: 387px;
    background-image: url(https://static.kolable.com/images/haohaoming/section6_BGIcon.png);
    background-size: 100% 100%;
    @media (max-width: 767px) {
      display: none;
    }
  }
`

const StyledCollapse = styled(Collapse)`
  && {
    background: transparent;
    text-align: left;
  }
`

const StyledPanel = styled(Collapse.Panel)`
  position: relative;
  margin-bottom: 24px;
  border: 0;
  overflow: hidden;
  background: #f7f7f7;
  border-radius: 4px;
`

const FAQs: React.VFC<FAQsProp> = ({ title, subtitle, questions }) => (
  <StyledSection>
    <div className="container">
      <SectionTitle title={title || ''} subtitle={subtitle || ''} />

      <StyledCollapse
        accordion
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="right" rotate={isActive ? 90 : 0} />}
      >
        {questions?.map((v, i) => (
          <StyledPanel key={`question-${i}`} header={v.header}>
            <p>{v.answer}</p>
          </StyledPanel>
        ))}
      </StyledCollapse>
    </div>
  </StyledSection>
)

export default FAQs
