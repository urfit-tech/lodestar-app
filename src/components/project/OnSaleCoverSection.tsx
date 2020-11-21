import React from 'react'
import Icon from 'react-inlinesvg'
import styled from 'styled-components'
import CalendarOIcon from '../../images/calendar-alt-o.svg'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'
import FundingCoverBlock from './FundingCoverBlock'

const StyledSection = styled.section`
  position: relative;

  > img {
    display: none;
  }
  @media (min-width: ${BREAK_POINT}px) {
    > img {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      z-index: 1;
    }
  }
`
const StyledCountDownBlock = styled.div`
  z-index: 10;
`
const StyledCover = styled.div`
  padding-bottom: 40px;
  .row {
    padding-top: 40px;
  }
  .col-lg-7 {
    z-index: 4;
  }
  img {
    display: none;
  }
  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 100px;
    .row {
      padding-top: 60px;
      align-items: flex-end;
    }
    .col-lg-7 {
      align-items: flex-end;
    }
    img {
      display: block;
    }
  }
`
const StyledCountDownTime = styled.div`
  background-color: #fff;
  border-radius: 4px;
  width: 100%;
  height: 56px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  .text-primary {
    color: ${props => props.theme['@primary-color']};
  }

  @media (max-width: ${BREAK_POINT}px) {
    .discount-down::before {
      content: '優惠';
    }
  }
`
const StyledTitle = styled.h1`
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  font-size: 40px;
  line-height: 1.3;
  letter-spacing: 1px;
  @media (min-width: ${BREAK_POINT}px) {
    font-size: 60px;
    line-height: 1.35;
    letter-spacing: 1.5px;
  }
`
const StyledSubtitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 4px;
  color: #ffc129;
`
const StyledDescription = styled.div`
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  > div:first-child {
    display: inline-block;
    border-top: 4px solid #ffc129;
    padding: 40px 0;
  }
`
const StyledSlogan = styled.div`
  background-color: var(--gray-lighter);
  flex-flow: column;

  img {
    z-index: 2;
    width: 100%;
    height: auto;
    display: none;

    &:last-child {
      display: block;
      padding-bottom: 40px;
    }
  }
  > div {
    padding: 40px 24px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    justify-content: center;
    align-items: center;
    height: 356px;

    img {
      display: block;
      width: 300px;

      &:last-child {
        display: none;
      }
    }
  }
`
const StyledHeader = styled.div`
  text-align: center;
  padding-bottom: 20px;

  h3 {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
  }
  h4 {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 0;
  }
`
const StyleStatistics = styled.div`
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 300px;

  .statistic {
    span {
      font-size: 40px;
      line-height: 1.1;
      letter-spacing: 1px;
      color: #ffc129;
    }
    div {
      letter-spacing: 0.8px;
      font-size: 18px;
      font-weight: bold;
      color: var(--gray-darker);
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    justify-content: space-around;
    height: 100px;
  }
`
type Statistic = {
  unit: string
  amount: number
  identity: string
}
type OnSaleCoverSectionProps = {
  cover: {
    title: string
    abstract: string
    description: string
    introduction: string
    url: string
    type: string
  }
  header: {
    title: string
    subtitle: string
  }
  statistics: Statistic[]
  expiredAt: Date | null
}
const OnSaleCoverSection: React.FC<OnSaleCoverSectionProps> = ({ cover, header, statistics, expiredAt }) => {
  return (
    <StyledSection>
      <img src={`https://static.kolable.com/images/xuemi/bg-zero.png`} alt="background" />
      <div className="container pt-5">
        <div className="row flex-row-reverse">
          <StyledCountDownBlock className="col-12 col-lg-4">
            <StyledCountDownTime className="d-flex align-items-center justify-content-center">
              {<Icon src={CalendarOIcon} className="mr-2" />}
              {expiredAt && <CountDownTimeBlock expiredAt={expiredAt} />}
            </StyledCountDownTime>
          </StyledCountDownBlock>
        </div>
      </div>
      <StyledCover className="container">
        <div className="row">
          <div className="col-12 col-lg-5">
            <StyledTitle>{cover.title}</StyledTitle>
            <StyledSubtitle>{cover.abstract}</StyledSubtitle>
            <StyledDescription>
              {cover.description.split(' ').map(description => (
                <div key={description}>{description}</div>
              ))}
            </StyledDescription>
            <img src={`https://static.kolable.com/images/xuemi/quote.svg`} alt="quote" />
          </div>
          <div className="col-12 col-lg-7">
            <FundingCoverBlock coverType={cover.type} coverUrl={cover.url} />
          </div>
        </div>
      </StyledCover>
      <StyledSlogan className="d-flex">
        <img src={`https://static.kolable.com/images/xuemi/teachers-2.png`} alt="teachers" />
        <div className="container">
          <StyledHeader>
            <h3>{header.title}</h3>
            <h4>{header.subtitle}</h4>
          </StyledHeader>
          <StyleStatistics className="d-flex">
            {statistics.map(statistic => (
              <div key={statistic.identity} className="statistic">
                <span>
                  <span>{statistic.amount}</span>
                  <span>{statistic.unit}</span>
                </span>
                <div>{statistic.identity}</div>
              </div>
            ))}
          </StyleStatistics>
        </div>
        <img src={`https://static.kolable.com/images/xuemi/teachers-1.png`} alt="teachers" />
        <img src={`https://static.kolable.com/images/xuemi/teachers-m.png`} alt="teachers" />
      </StyledSlogan>
    </StyledSection>
  )
}

export default OnSaleCoverSection
