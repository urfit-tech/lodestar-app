var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledProgramIds } from '../../hooks/program';
import ProgramPaymentButton from '../checkout/ProgramPaymentButton';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import PriceLabel from '../common/PriceLabel';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"], ["\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"])));
var StyledCountDownBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 8px;\n  margin-bottom: 16px;\n  span {\n    font-size: 14px;\n  }\n"], ["\n  margin-top: 8px;\n  margin-bottom: 16px;\n  span {\n    font-size: 14px;\n  }\n"])));
var ProgramPerpetualPlanCard = function (_a) {
    var _b;
    var memberId = _a.memberId, program = _a.program;
    var enrolledProgramIds = useEnrolledProgramIds(memberId).enrolledProgramIds;
    var formatMessage = useIntl().formatMessage;
    var isEnrolled = enrolledProgramIds.includes(program.id);
    var isOnSale = (((_b = program.soldAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0) > Date.now();
    return (React.createElement(StyledWrapper, { className: "py-2" },
        React.createElement("div", { className: "container" }, isEnrolled ? (React.createElement(Link, { to: "/programs/" + program.id + "/contents" },
            React.createElement(Button, { block: true }, formatMessage(commonMessages.button.enter)))) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "text-center mb-2" },
                React.createElement(PriceLabel, { variant: "inline", listPrice: program.listPrice || 0, salePrice: isOnSale ? program.salePrice : undefined }),
                program.isCountdownTimerVisible && (program === null || program === void 0 ? void 0 : program.soldAt) && isOnSale && (React.createElement(StyledCountDownBlock, null,
                    React.createElement(CountDownTimeBlock, { expiredAt: program.soldAt, icon: true })))),
            React.createElement(ProgramPaymentButton, { program: program }))))));
};
export default ProgramPerpetualPlanCard;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramPerpetualPlanCard.js.map