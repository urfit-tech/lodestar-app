var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n\n  > img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    > img {\n      display: block;\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 300px;\n      z-index: 1;\n    }\n  }\n"], ["\n  position: relative;\n\n  > img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    > img {\n      display: block;\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 300px;\n      z-index: 1;\n    }\n  }\n"
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
])), BREAK_POINT);
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
var StyledSlogan = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: var(--gray-lighter);\n  flex-flow: column;\n\n  img {\n    z-index: 2;\n    width: 100%;\n    height: auto;\n    display: none;\n\n    &:last-child {\n      display: block;\n      padding-bottom: 40px;\n    }\n  }\n  > div {\n    padding: 40px 24px;\n  }\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    justify-content: center;\n    align-items: center;\n    height: 356px;\n\n    img {\n      display: block;\n      width: 300px;\n\n      &:last-child {\n        display: none;\n      }\n    }\n  }\n"], ["\n  background-color: var(--gray-lighter);\n  flex-flow: column;\n\n  img {\n    z-index: 2;\n    width: 100%;\n    height: auto;\n    display: none;\n\n    &:last-child {\n      display: block;\n      padding-bottom: 40px;\n    }\n  }\n  > div {\n    padding: 40px 24px;\n  }\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    justify-content: center;\n    align-items: center;\n    height: 356px;\n\n    img {\n      display: block;\n      width: 300px;\n\n      &:last-child {\n        display: none;\n      }\n    }\n  }\n"])), BREAK_POINT);
var StyledHeader = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  text-align: center;\n  margin-bottom: 20px;\n\n  h3 {\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n  }\n  h4 {\n    font-size: 16px;\n    font-weight: 500;\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n  }\n  @media (min-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"], ["\n  text-align: center;\n  margin-bottom: 20px;\n\n  h3 {\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n  }\n  h4 {\n    font-size: 16px;\n    font-weight: 500;\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n  }\n  @media (min-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"])), BREAK_POINT);
var StyleStatistics = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex-flow: column;\n  justify-content: space-between;\n  align-items: center;\n  text-align: center;\n  height: 300px;\n\n  .statistic {\n    span {\n      font-size: 40px;\n      line-height: 1.1;\n      letter-spacing: 1px;\n      color: #ffc129;\n    }\n    .title {\n      letter-spacing: 0.8px;\n      font-size: 18px;\n      font-weight: bold;\n      color: var(--gray-darker);\n      margin-bottom: 4px;\n    }\n    .description {\n      letter-spacing: 0.4px;\n      font-size: 14px;\n      font-weight: 500;\n      color: var(--gray-dark);\n    }\n  }\n\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    justify-content: space-around;\n    height: 100px;\n  }\n"], ["\n  flex-flow: column;\n  justify-content: space-between;\n  align-items: center;\n  text-align: center;\n  height: 300px;\n\n  .statistic {\n    span {\n      font-size: 40px;\n      line-height: 1.1;\n      letter-spacing: 1px;\n      color: #ffc129;\n    }\n    .title {\n      letter-spacing: 0.8px;\n      font-size: 18px;\n      font-weight: bold;\n      color: var(--gray-darker);\n      margin-bottom: 4px;\n    }\n    .description {\n      letter-spacing: 0.4px;\n      font-size: 14px;\n      font-weight: 500;\n      color: var(--gray-dark);\n    }\n  }\n\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    justify-content: space-around;\n    height: 100px;\n  }\n"])), BREAK_POINT);
var ProjectStatisticsSection = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, items = _a.items;
    return (React.createElement(StyledSection, null,
        React.createElement(StyledSlogan, { className: "d-flex" },
            React.createElement("div", { className: "container" },
                React.createElement(StyledHeader, null,
                    React.createElement("h3", null, title),
                    React.createElement("h4", null, subtitle)),
                React.createElement(StyleStatistics, { className: "d-flex" }, items.map(function (item) { return (React.createElement("div", { key: item.identity, className: "statistic" },
                    React.createElement("span", null,
                        React.createElement("span", null, item.amount),
                        React.createElement("span", null, item.unit)),
                    React.createElement("div", { className: "title" }, item.identity),
                    React.createElement("div", { className: "description" }, item.description))); }))))));
};
export default ProjectStatisticsSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ProjectStatisticsSection.js.map