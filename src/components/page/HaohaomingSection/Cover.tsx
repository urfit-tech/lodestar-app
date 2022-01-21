import { Button, Typography } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const StyledSection = styled.section`
  position: relative;
  padding: 0 12%;
  height: 41.4583vw;
  min-height: 420px;
  background-color: #ffdfdf;
  background-image: url('https://static.kolable.com/images/haohaoming/cloud.png');
  background-repeat: no-repeat;
  background-size: cover;

  @media (max-width: 768px) {
    padding: 0;
    height: calc(100vh - 64px);
  }
`
const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 8vw 0;
  width: 100%;
  height: 100%;
  background-image: url('https://static.kolable.com/images/haohaoming/master.png');
  background-size: 40vw auto;
  background-repeat: no-repeat;
  background-position: bottom right;

  @media (max-width: 768px) {
    align-items: flex-start;
    background-size: 80vw auto;
    background-position: bottom right -60px;
    padding: 30px 15px;
  }

  .row {
    height: 100%;
  }
  .row > div {
    display: flex;
  }
  .row > :first-child {
    align-items: center;
  }
  .row > :last-child {
    align-items: flex-end;
  }
`
const ChangeFateBlock = styled.div`
  width: 50%;

  .cover-title {
    color: ${props => props.theme['@heading-color']};
    font-size: 40px;
    letter-spacing: 1px;
    white-space: pre-line;
  }

  @media (max-width: 768px) {
    width: 100%;
    .cover-title {
      font-size: 28px;
    }
  }
`
const SubTitle = styled.div`
  margin-bottom: 4vw;
  width: 460px;
  max-width: 100%;
  color: ${props => props.theme['@heading-color']};
  font-size: 16px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
    width: 100%;
  }
`
const DefaultButton = styled(Button)`
  padding: 0px 40px;
`

const Cover: React.FC = () => {
  const history = useHistory()

  return (
    <StyledSection>
      <StyledContainer>
        <ChangeFateBlock>
          <Typography.Title level={1} className="cover-title">
            讓簡少年
            <br />
            帶領你
            <br />
            學習如何改變命運
          </Typography.Title>
          <SubTitle>
            生命的目的是盡可能多地成為你自己，將你天生的才能和能力與你生活經驗中的智慧結合起來，並將它們與你內在的精神融合在一起，然後把自己作為禮物送回世界。
          </SubTitle>
          <DefaultButton type="primary" size="large" onClick={() => history.push('/programs')}>
            探索課程
          </DefaultButton>
        </ChangeFateBlock>
      </StyledContainer>
    </StyledSection>
  )
}

export default Cover
