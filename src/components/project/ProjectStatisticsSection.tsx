import React from 'react'
import styled from 'styled-components'
import { CommonTitleMixin } from '../common'
import { BREAK_POINT } from '../common/Responsive'

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
// const StyledCountDownBlock = styled.div`
//   z-index: 10;
// `
// const StyledCover = styled.div`
//   padding-bottom: 40px;
//   .row {
//     padding-top: 40px;
//   }
//   .col-lg-7 {
//     z-index: 4;
//   }
//   img {
//     display: none;
//   }
//   @media (min-width: ${BREAK_POINT}px) {
//     padding-bottom: 100px;
//     .row {
//       padding-top: 60px;
//       align-items: flex-end;
//     }
//     .col-lg-7 {
//       align-items: flex-end;
//     }
//     img {
//       display: block;
//     }
//   }
// `
// const StyledCountDownTime = styled.div`
//   background-color: #fff;
//   border-radius: 4px;
//   width: 100%;
//   height: 56px;
//   box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

//   .text-primary {
//     color: ${props => props.theme['@primary-color']};
//   }

//   @media (max-width: ${BREAK_POINT}px) {
//     .discount-down::before {
//       content: '優惠';
//     }
//   }
// `
// const StyledTitle = styled.h1`
//   font-weight: bold;
//   font-stretch: normal;
//   font-style: normal;
//   font-size: 40px;
//   line-height: 1.3;
//   letter-spacing: 1px;
//   @media (min-width: ${BREAK_POINT}px) {
//     font-size: 60px;
//     line-height: 1.35;
//     letter-spacing: 1.5px;
//   }
// `
// const StyledSubtitle = styled.h2`
//   font-size: 28px;
//   font-weight: bold;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: normal;
//   letter-spacing: 4px;
//   color: #ffc129;
// `
// const StyledDescription = styled.div`
//   margin-bottom: 40px;
//   font-size: 16px;
//   font-weight: 500;
//   line-height: 1.69;
//   letter-spacing: 0.2px;
//   color: var(--gray-darker);
//   > div:first-child {
//     display: inline-block;
//     border-top: 4px solid #ffc129;
//     padding: 40px 0;
//   }
// `
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
  margin-bottom: 20px;

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
    margin-bottom: 40px;
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
    .title {
      ${CommonTitleMixin}
      margin-bottom: 4px;
    }
    .description {
      letter-spacing: 0.4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-dark);
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    justify-content: space-around;
    height: 100px;
  }
`

type ProjectStatisticsSectionProps = {
  title: string
  subtitle: string
  items: { unit: string; amount: number; identity: string; description: string }[]
}
const ProjectStatisticsSection: React.FC<ProjectStatisticsSectionProps> = ({ title, subtitle, items }) => {
  return (
    <StyledSection>
      <StyledSlogan className="d-flex">
        <div className="container">
          <StyledHeader>
            <h3>{title}</h3>
            <h4>{subtitle}</h4>
          </StyledHeader>
          <StyleStatistics className="d-flex">
            {items.map(item => (
              <div key={item.identity} className="statistic">
                <span>
                  <span>{item.amount}</span>
                  <span>{item.unit}</span>
                </span>
                <div className="title">{item.identity}</div>
                <div className="description">{item.description}</div>
              </div>
            ))}
          </StyleStatistics>
        </div>
      </StyledSlogan>
    </StyledSection>
  )
}

export default ProjectStatisticsSection
