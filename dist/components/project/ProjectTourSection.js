var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    height: 600px;\n  }\n"], ["\n  @media (min-width: ", "px) {\n    height: 600px;\n  }\n"])), BREAK_POINT);
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 20px;\n\n  @media (min-width: ", "px) {\n  }\n"], ["\n  padding: 20px;\n\n  @media (min-width: ", "px) {\n  }\n"])), BREAK_POINT);
var StyledStep = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 50px;\n\n  @media (min-width: ", "px) {\n    margin: 0;\n    height: 340px;\n  }\n"], ["\n  margin-bottom: 50px;\n\n  @media (min-width: ", "px) {\n    margin: 0;\n    height: 340px;\n  }\n"])), BREAK_POINT);
var StyledRoadmap = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  @media (max-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"], ["\n  @media (max-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"])), BREAK_POINT - 1);
var StyledHeader = styled.h4(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  margin-bottom: 40px;\n  font-size: 20px;\n  font-weight: bold;\n  color: var(--gray-darker);\n  text-align: center;\n\n  @media (min-width: ", "px) {\n    letter-spacing: 0.23px;\n    margin-bottom: 60px;\n    font-size: 28px;\n  }\n"], ["\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  margin-bottom: 40px;\n  font-size: 20px;\n  font-weight: bold;\n  color: var(--gray-darker);\n  text-align: center;\n\n  @media (min-width: ", "px) {\n    letter-spacing: 0.23px;\n    margin-bottom: 60px;\n    font-size: 28px;\n  }\n"])), BREAK_POINT);
var StyledIntro = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-flow: column;\n  justify-content: center;\n"])));
var StyledTitle = styled.h5(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  letter-spacing: 0.2px;\n  font-size: 16px;\n  font-weight: bold;\n  text-align: left;\n  color: var(--gray-darker);\n\n  @media (min-width: ", "px) {\n    letter-spacing: 0.77px;\n    text-align: center;\n    font-size: 20px;\n  }\n"], ["\n  letter-spacing: 0.2px;\n  font-size: 16px;\n  font-weight: bold;\n  text-align: left;\n  color: var(--gray-darker);\n\n  @media (min-width: ", "px) {\n    letter-spacing: 0.77px;\n    text-align: center;\n    font-size: 20px;\n  }\n"])), BREAK_POINT);
var StyledParagraph = styled.p(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  letter-spacing: 0.2px;\n  font-size: 16px;\n  font-weight: 500;\n  color: var(--gray-darker);\n  max-width: 213px;\n\n  span {\n    display: inline-block;\n  }\n\n  @media (min-width: ", "px) {\n    text-align: center;\n    margin: 0 auto;\n  }\n"], ["\n  letter-spacing: 0.2px;\n  font-size: 16px;\n  font-weight: 500;\n  color: var(--gray-darker);\n  max-width: 213px;\n\n  span {\n    display: inline-block;\n  }\n\n  @media (min-width: ", "px) {\n    text-align: center;\n    margin: 0 auto;\n  }\n"])), BREAK_POINT);
var StyledImage = styled.img(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var ProjectTourSection = function (_a) {
    var trips = _a.trips;
    return (React.createElement(StyledSection, { className: "d-flex justify-content-center align-items-center" },
        React.createElement(StyledWrapper, { className: "container" },
            React.createElement("div", { className: "row" }, trips.map(function (trip) { return (React.createElement(StyledRoadmap, { key: trip.header, className: "col-12 col-lg-6" },
                React.createElement(StyledHeader, null, trip.header),
                React.createElement("div", { className: "row" }, trip.steps.map(function (step) { return (React.createElement("div", { key: step.title, className: "col-12 col-lg-6" },
                    React.createElement(StyledStep, { className: "row" },
                        React.createElement(StyledImage, { className: "col-5 col-lg-12", src: step.featureUrl, alt: step.title }),
                        React.createElement(StyledIntro, { className: "col-7 col-lg-12" },
                            React.createElement(StyledTitle, null, step.title),
                            React.createElement(StyledParagraph, null, step.descriptions.map(function (description) { return (React.createElement("span", { key: description }, description)); })))))); })))); })))));
};
export default ProjectTourSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=ProjectTourSection.js.map