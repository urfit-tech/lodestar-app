import { Heading } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'

const StyledSection = styled.section`
  padding: 60px 0 80px;
`
const StyledHeading = styled(Heading)`
  && {
    display: inline-block;
    position: relative;
    padding: 0 8px;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.6;
    letter-spacing: 0.8px;
    color: var(--gray-darker);

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: 18px;
      background-color: ${props => props.theme['@primary-color']};
      opacity: 0.1;
    }
  }
`
const StyledSubHeading = styled(Heading)`
  && {
    border-left: 4px solid ${props => props.theme['@primary-color']};
    padding-left: 12px;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.8px;
    color: var(--gray-darker);
  }
`
const StyledParagraph = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  text-align: justify;
  color: var(--gray-darker);
`
const StyledImage = styled.img`
  max-width: 100%;
`

const ContentSection: React.FC = () => {
  return (
    <StyledSection>
      <div className="container">
        <StyledHeading className="mb-4">全面向美髮時尚線上課程平台</StyledHeading>
        <StyledParagraph className="mb-5">
          尚課成立於 2020 年 10
          月，我們專注於整合美髮時尚相關的學術、技藝、觀念、專業知識等相關課程，並提供一個不受時間、空間限制，且隨時隨地、方便有效率的學習環境，也讓更多的優秀專業人才，可以分享個人專業知識。
        </StyledParagraph>

        <StyledSubHeading as="h3" className="mb-4">
          知識有價，一次創作，永續收益
        </StyledSubHeading>
        <StyledParagraph className="mb-5">
          『知識』囊括了理論、技法、經驗、心得，是經年累月努力獲得的，是為了讓生活更加美好的，更是需要播撒傳承的。但，絕不應該是免費的!我們期許著能幫助願意分享自身知識、技能的老師們，創造一份永續的被動式收入。
        </StyledParagraph>

        <StyledImage
          className="mb-5"
          src="https://static.kolable.com/images/sunk/adout-content-1-20201026.jpg"
          alt="about content 1"
        />

        <StyledSubHeading as="h3" className="mb-4">
          尚課不貴，一次購買，終身學習
        </StyledSubHeading>
        <StyledParagraph className="mb-5">
          對大部分人而言，『學習』是必需的，但也是昂貴且不易的。我們提供這樣的學習平台，就是認為學習這樣的事應該要更平價、更方便、更隨興的，重要的是只須付費一次就可以隨時、隨地、不限次數的學習才是理想的。
        </StyledParagraph>

        <StyledImage
          className="mb-5"
          src="https://static.kolable.com/images/sunk/adout-content-2-20201026.jpg"
          alt="about content 2"
        />

        <StyledSubHeading as="h3" className="mb-4">
          新時代女孩們當自強!
        </StyledSubHeading>
        <StyledParagraph className="mb-5">
          尚課的課程以美髮時尚為主，延伸至所有跟“美”相關的課程，例如:美髮、美容、時尚、穿搭、美顏、彩妝、攝影、手作、烹飪、親子以及更多，是以女性朋友為主的學習平台。
          <br />
          <br />
          我們將課程定位區分為『銅板課』、『單元課』、『系統套課』，希望讓所有人都可以找到適合自己的課程，並且用最平實的價格，隨時、隨地盡情的學習。最重要的是，即使仍在學習中的您，只要擁有任何專業知識或技能。隨時歡迎您建立課程，成為尚課優質講師。
        </StyledParagraph>

        <StyledImage src="https://static.kolable.com/images/sunk/adout-content-3-20201026.jpg" alt="about content 3" />
      </div>
    </StyledSection>
  )
}

export default ContentSection
