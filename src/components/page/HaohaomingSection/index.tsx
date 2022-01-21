import React from 'react'
import styled from 'styled-components'
import Courses from './Courses'
import Cover from './Cover'
import FAQs from './FAQs'
import Philosophy from './Philosophy'
import Recommend from './Recommend'
import Reviews from './Reviews'
import TeacherIntroduction from './TeacherIntroduction'

const StyleOverrideBlock = styled.div`
  && {
    .ant-typography,
    .ant-collapse-header {
      color: #585858;
    }
    .ant-btn-primary {
      color: #fff;
      background-color: #eb527a;
      border-color: #eb527a;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
      &:hover {
        background-color: #f77e9a;
        border-color: #f77e9a;
      }
    }
  }
`

const HomePage: React.VFC = () => (
  <StyleOverrideBlock>
    <Cover />
    <Courses />
    <Philosophy />
    <TeacherIntroduction />
    <Recommend />
    <Reviews />
    <FAQs />
  </StyleOverrideBlock>
)

export default HomePage
