var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PeriodTypeLabel from '../common/PeriodTypeLabel';
import PriceLabel from '../common/PriceLabel';
var StyledPodcastPlanLabel = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    border-radius: 4px;\n    border: 1px solid ", ";\n    padding: 16px;\n    user-select: none;\n    cursor: pointer;\n\n    h3 {\n      color: ", ";\n    }\n  }\n"], ["\n  && {\n    border-radius: 4px;\n    border: 1px solid ", ";\n    padding: 16px;\n    user-select: none;\n    cursor: pointer;\n\n    h3 {\n      color: ", ";\n    }\n  }\n"])), function (props) { return (props.active ? props.theme['@primary-color'] : 'var(--gray)'); }, function (props) { return (props.active ? props.theme['@primary-color'] : 'var(--gray-darker)'); });
var StyledPodcastPlanPrice = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  span:first-child {\n    color: ", ";\n  }\n  span:nth-child(2) {\n    text-decoration: line-through;\n    color: ", ";\n  }\n"], ["\n  span:first-child {\n    color: ", ";\n  }\n  span:nth-child(2) {\n    text-decoration: line-through;\n    color: ", ";\n  }\n"])), function (props) { return (props.active ? props.theme['@primary-color'] : 'var(--gray-darker)'); }, function (props) { return (props.active ? props.theme['@primary-color'] : 'var(--gray)'); });
var PodcastPlanSelector = function (_a) {
    var podcastPlans = _a.podcastPlans, value = _a.value, defaultValue = _a.defaultValue, onChange = _a.onChange;
    // trigger change event if default value exists
    useEffect(function () {
        onChange && defaultValue && onChange(defaultValue);
    }, [defaultValue, onChange]);
    return (React.createElement("div", { className: "row" }, podcastPlans.map(function (podcastPlan) {
        var _a;
        var isActive = podcastPlan.id === value;
        return (React.createElement("div", { className: "col-lg-4 col-6", key: podcastPlan.id },
            React.createElement(StyledPodcastPlanLabel, { className: "mb-3", active: isActive, onClick: function () { return onChange && onChange(podcastPlan.id); } },
                React.createElement("h3", null,
                    React.createElement(PeriodTypeLabel, { periodType: podcastPlan.periodType, periodAmount: podcastPlan.periodAmount })),
                React.createElement("span", { className: "mr-1" },
                    React.createElement(PriceLabel, { variant: "inline", listPrice: podcastPlan.listPrice, salePrice: (((_a = podcastPlan.soldAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) > Date.now() ? podcastPlan.salePrice : undefined, render: function (_a) {
                            var listPrice = _a.listPrice, salePrice = _a.salePrice, formatPrice = _a.formatPrice;
                            return (React.createElement(StyledPodcastPlanPrice, { active: isActive },
                                salePrice && React.createElement("span", null, formatPrice(salePrice)),
                                React.createElement("span", null, formatPrice(listPrice))));
                        } })))));
    })));
};
export default PodcastPlanSelector;
var templateObject_1, templateObject_2;
//# sourceMappingURL=PodcastPlanSelector.js.map