var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Button } from 'antd';
import React, { useContext } from 'react';
import ReactGA from 'react-ga';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useMember } from '../../hooks/member';
import { useEnrolledPlanIds, useProgram } from '../../hooks/program';
import { useAuth } from '../auth/AuthContext';
import { AuthModalContext } from '../auth/AuthModal';
import AdminCard from '../common/AdminCard';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import PriceLabel from '../common/PriceLabel';
import { BraftContent } from '../common/StyledBraftEditor';
var StyledAdminCard = styled(AdminCard)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n\n  header {\n    margin-bottom: 20px;\n    border-bottom: solid 1px #cdcdcd;\n    padding-bottom: 20px;\n\n    h2.title {\n      margin: 0 0 20px;\n      letter-spacing: 0.2px;\n      font-size: 16px;\n      font-weight: bold;\n    }\n  }\n"], ["\n  color: ", ";\n\n  header {\n    margin-bottom: 20px;\n    border-bottom: solid 1px #cdcdcd;\n    padding-bottom: 20px;\n\n    h2.title {\n      margin: 0 0 20px;\n      letter-spacing: 0.2px;\n      font-size: 16px;\n      font-weight: bold;\n    }\n  }\n"])), function (props) { return props.theme['@label-color']; });
var StyledCountDownBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 20px;\n  span {\n    font-size: 14px;\n  }\n"], ["\n  margin-top: 20px;\n  span {\n    font-size: 14px;\n  }\n"])));
var StyledBraftContent = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 12px;\n  font-size: 14px;\n"], ["\n  margin-bottom: 12px;\n  font-size: 14px;\n"])));
var ProgramSubscriptionPlanCard = function (_a) {
    var _b;
    var memberId = _a.memberId, programId = _a.programId, programPlan = _a.programPlan, cardProps = __rest(_a, ["memberId", "programId", "programPlan"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var isAuthenticated = useAuth().isAuthenticated;
    var setAuthModalVisible = useContext(AuthModalContext).setVisible;
    var program = useProgram(programId).program;
    var enrolledProgramIds = useEnrolledPlanIds(memberId).programPlanIds;
    var member = useMember(memberId).member;
    var salePrice = programPlan.salePrice, listPrice = programPlan.listPrice, discountDownPrice = programPlan.discountDownPrice, periodType = programPlan.periodType;
    var isOnSale = (((_b = programPlan.soldAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0) > Date.now();
    var enrolled = enrolledProgramIds.includes(programPlan.id);
    return (React.createElement(StyledAdminCard, __assign({ key: programPlan.id }, cardProps),
        React.createElement("header", null,
            React.createElement("h2", { className: "title" }, programPlan.title),
            React.createElement(PriceLabel, { variant: "full-detail", listPrice: listPrice, salePrice: isOnSale ? salePrice : undefined, downPrice: discountDownPrice, periodType: periodType }),
            programPlan.isCountdownTimerVisible && programPlan.soldAt && isOnSale && (React.createElement(StyledCountDownBlock, null,
                React.createElement(CountDownTimeBlock, { expiredAt: programPlan === null || programPlan === void 0 ? void 0 : programPlan.soldAt, icon: true })))),
        React.createElement(StyledBraftContent, null,
            React.createElement(BraftContent, null, programPlan.description)),
        (program === null || program === void 0 ? void 0 : program.isSoldOut) ? (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.soldOut))) : enrolled ? (React.createElement(Button, { block: true, onClick: function () { return history.push("/programs/" + programId + "/contents"); } }, formatMessage(commonMessages.button.enter))) : (React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
                var setVisible = _a.setVisible;
                return (React.createElement(Button, { type: "primary", block: true, onClick: function () {
                        if (!isAuthenticated) {
                            setAuthModalVisible && setAuthModalVisible(true);
                        }
                        else {
                            ReactGA.plugin.execute('ec', 'addProduct', {
                                id: programPlan.id,
                                name: programPlan.title,
                                category: 'ProgramPlan',
                                price: "" + programPlan.listPrice,
                                quantity: '1',
                                currency: 'TWD',
                            });
                            ReactGA.plugin.execute('ec', 'setAction', 'add');
                            ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                            setVisible();
                        }
                    } },
                    "\b",
                    formatMessage(commonMessages.button.subscribeNow)));
            }, paymentType: "subscription", defaultProductId: "ProgramPlan_" + programPlan.id, 
            // TODO: Should take care of this warningText (maybe it would move to bottom)
            warningText: listPrice <= 0 || (typeof salePrice === 'number' && salePrice <= 0)
                ? formatMessage(productMessages.program.defaults.warningText)
                : '', member: member }))));
};
export default ProgramSubscriptionPlanCard;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ProgramSubscriptionPlanCard.js.map