import { Collapse, Icon } from 'antd'
import styled from 'styled-components'
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

const questions = [
  {
    header: '什麼是線上課程？請問在哪裡上課？上課時間？',
    answer: '桃桃喜網站的「線上課程」都可以隨時隨地透過電腦、手機、平板觀看購買後的課程影片，沒有時間和地點的限制！',
  },
  {
    header: '課程可以看幾次？',
    answer: '無限多次！桃桃喜的課程皆可無限次數重複觀看課程內容',
  },
  {
    header: '可以問老師問題嗎？',
    answer: '可以！每個課程單元都有留言討論區，可以把自己的問題留言給老師，老師收到通知後會儘速回答你的問題！',
  },
  {
    header: '可以免費試聽嗎?',
    answer: '課程介紹頁裡如果有標註「試聽」的內容，點擊即可免費試聽喔！',
  },
]

const FAQs = () => {
  return (
    <StyledSection>
      <div className="container">
        <SectionTitle title="常見問題" subtitle="Q&A" />

        <StyledCollapse
          accordion
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => <Icon type="right" rotate={isActive ? 90 : 0} />}
        >
          {questions.map((v, i) => (
            <StyledPanel key={`question-${i}`} header={v.header}>
              <p>{v.answer}</p>
            </StyledPanel>
          ))}
        </StyledCollapse>
      </div>
    </StyledSection>
  )
}

export default FAQs
