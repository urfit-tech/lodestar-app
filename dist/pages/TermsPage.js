var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Card, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { termMessages } from '../helpers/translation';
var StyledTitle = styled(Typography.Title)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-bottom: 36px;\n    font-size: 24px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"], ["\n  && {\n    margin-bottom: 36px;\n    font-size: 24px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"])));
var StyledSubTitle = styled(Typography.Title)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    margin-top: 41px;\n    margin-bottom: 13px;\n    font-size: 20px;\n    font-weight: bold;\n  }\n"], ["\n  && {\n    margin-top: 41px;\n    margin-bottom: 13px;\n    font-size: 20px;\n    font-weight: bold;\n  }\n"])));
var StyledCard = styled(Card)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    margin-bottom: 20px;\n  }\n\n  .ant-card-body {\n    padding: 40px;\n  }\n\n  p,\n  li {\n    margin-bottom: 0;\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n  }\n\n  ol {\n    padding-left: 50px;\n    li {\n      padding-left: 16px;\n    }\n  }\n"], ["\n  && {\n    margin-bottom: 20px;\n  }\n\n  .ant-card-body {\n    padding: 40px;\n  }\n\n  p,\n  li {\n    margin-bottom: 0;\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n  }\n\n  ol {\n    padding-left: 50px;\n    li {\n      padding-left: 16px;\n    }\n  }\n"])));
var StyledSection = styled.section(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background: #f7f8f8;\n  padding-top: 56px;\n  padding-bottom: 80px;\n  text-align: justify;\n\n  & > ", " {\n    text-align: center;\n  }\n"], ["\n  background: #f7f8f8;\n  padding-top: 56px;\n  padding-bottom: 80px;\n  text-align: justify;\n\n  & > ", " {\n    text-align: center;\n  }\n"])), StyledTitle);
var TermsPage = function () {
    var formatMessage = useIntl().formatMessage;
    var name = useApp().name;
    return (React.createElement(DefaultLayout, null,
        React.createElement(StyledSection, null,
            React.createElement(StyledTitle, { level: 1 }, formatMessage(termMessages.defaults.term)),
            React.createElement("div", { className: "container" },
                React.createElement(StyledCard, null,
                    React.createElement(StyledTitle, { level: 2 }, formatMessage(termMessages.title.term)),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.scope)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.scope, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.personalData)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.personalData, { name: name })),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.personalData2)),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.link, { name: name })),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.link, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.policy)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.policy, { name: name })),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.policy2, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.cookie)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.cookie, { name: name }))),
                React.createElement(StyledCard, null,
                    React.createElement(StyledTitle, { level: 2 }, formatMessage(termMessages.title.terms)),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.terms)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.terms, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.confidentiality)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.confidentiality, { name: name })),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.confidentiality2, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.condition)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.condition, { name: name })),
                    React.createElement("ol", { className: "mt-4" },
                        React.createElement("li", null, formatMessage(termMessages.list.item1, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item2, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item3, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item4, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item5, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item6, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item7, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item8, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item9, { name: name })),
                        React.createElement("li", null, formatMessage(termMessages.list.item10, { name: name }))),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.suspension)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.suspension)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.suspension2, { name: name })),
                    React.createElement(StyledSubTitle, { level: 3 }, "\u7528\u6236\u8CAC\u4EFB"),
                    React.createElement("ol", { className: "mt-4" },
                        React.createElement("li", null, "\u7528\u6236\u61C9\u81EA\u884C\u627F\u64D4\u8CAC\u4EFB\u4F7F\u7528\u672C\u670D\u52D9\uFF0C\u5C0D\u65BC\u5728\u672C\u670D\u52D9\u6240\u5F9E\u4E8B\u7684\u6240\u6709\u884C\u70BA\u53CA\u5176\u7D50\u679C\u61C9\u81EA\u884C\u8CA0\u64D4\u4E00\u5207\u8CAC\u4EFB\u3002"),
                        React.createElement("li", null,
                            "\u82E5\u7528\u6236\u767C\u751F\u6216\u53EF\u80FD\u767C\u751F\u4E0B\u5217\u60C5\u4E8B\uFF0C",
                            name,
                            "\u4E0D\u9808\u4E8B\u5148\u544A\u77E5\u7528\u6236\uFF0C\u5373\u53EF\u4E2D\u6B62\u8A72\u7528\u6236\u4F7F\u7528\u672C\u670D\u52D9\u4E4B\u5168\u90E8\u6216\u4E00\u90E8\uFF0C\u505C\u7528\u6216\u522A\u9664",
                            name,
                            "\u5E33\u6236\u3001\u53D6\u6D88\u7528\u6236\u8207",
                            name,
                            "\u4E4B\u9593\u95DC\u65BC\u672C\u670D\u52D9\u7684\u5408\u7D04\uFF08\u5305\u62EC\u4F46\u4E0D\u9650\u65BC\u4F9D\u64DA\u672C\u689D\u6B3E\u6210\u7ACB\u7684\u5408\u7D04\uFF0C\u4EE5\u4E0B\u7686\u540C\uFF09\uFF0C\u6216\u63A1\u53D6",
                            name,
                            "\u5408\u7406\u8A8D\u70BA\u5FC5\u8981\u53CA\u9069\u7576\u7684\u4EFB\u4F55\u5176\u4ED6\u63AA\u65BD\uFF1A",
                            React.createElement("ol", null,
                                React.createElement("li", null, "\u7528\u6236\u9055\u53CD\u76F8\u95DC\u6CD5\u4EE4\u3001\u672C\u689D\u6B3E\u3001\u6216\u4EFB\u4F55\u500B\u5225\u689D\u6B3E\uFF1B"),
                                React.createElement("li", null, "\u7528\u6236\u70BA\u53CD\u793E\u6703\u52E2\u529B\u6216\u76F8\u95DC\u9EE8\u6D3E\u6210\u54E1\uFF1B"),
                                React.createElement("li", null,
                                    "\u7528\u6236\u900F\u904E\u6563\u64AD\u4E0D\u5BE6\u8CC7\u8A0A\uFF0C\u4F8B\u5982\u5229\u7528\u8A50\u6B3A\u65B9\u5F0F\u6216\u52E2\u529B\uFF0C\u6216\u900F\u904E\u5176\u4ED6\u4E0D\u6CD5\u65B9\u7834\u58DE",
                                    name,
                                    "\u7684\u4FE1\u8B7D\uFF1B"),
                                React.createElement("li", null,
                                    "\u7528\u6236\u906D\u8072\u8ACB\u88AB\u6263\u62BC\u3001\u5047\u6263\u62BC\u3001\u62CD\u8CE3\u3001\u9032\u5165\u7834\u7522\u3001\u6C11\u4E8B\u91CD\u6574\u6216\u985E\u4F3C\u7A0B\u5E8F\uFF0C\u6216",
                                    name,
                                    "\u5408\u7406\u8A8D\u70BA\u7528\u6236\u7684\u4FE1\u7528\u6709\u4E0D\u78BA\u5B9A\u6027\uFF1B\u6216"),
                                React.createElement("li", null,
                                    "\u7528\u6236\u8207",
                                    name,
                                    "\u4E4B\u9593\u7684\u4FE1\u4EFB\u95DC\u4FC2\u5DF2\u4E0D\u5B58\u5728\uFF0C\u6216\u56E0\u4E0A\u5217\u7B2C(1)\u6B3E\u81F3\u7B2C(4)\u6B3E\u4EE5\u5916\u4E8B\u7531\uFF0C\u4F7F",
                                    name,
                                    "\u5408\u7406\u8A8D\u70BA",
                                    name,
                                    "\u4E0D\u518D\u9069\u5408\u5411\u7528\u6236\u63D0\u4F9B\u672C\u670D\u52D9\u3002"))),
                        React.createElement("li", null,
                            "\u8D77\u56E0\u65BC\u7528\u6236\u4F7F\u7528\u672C\u670D\u52D9\uFF08\u5305\u62EC\u4F46\u4E0D\u9650\u65BC",
                            name,
                            "\u906D\u7B2C\u4E09\u4EBA\u5C0D\u65BC\u7528\u6236\u4F7F\u7528\u672C\u670D\u52D9\u63D0\u51FA\u640D\u5BB3\u8CE0\u511F\u8ACB\u6C42\uFF09\uFF0C\u81F4",
                            name,
                            "\u76F4\u63A5\u6216\u9593\u63A5\u8499\u53D7\u4EFB\u4F55\u640D\u5931/\u640D\u5BB3\uFF08\u5305\u62EC\u4F46\u4E0D\u9650\u65BC\u5F8B\u5E2B\u8CBB\u7528\u7684\u8CA0\u64D4\uFF09\u6642\uFF0C\u7528\u6236\u61C9\u4F9D\u7167",
                            name,
                            "\u7684\u8981\u6C42\u7ACB\u5373\u7D66\u4E88\u88DC\u511F\u8CE0\u511F\u3002")),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.title.report)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.report, { name: name }))),
                React.createElement(StyledCard, null,
                    React.createElement(StyledTitle, { level: 2 }, formatMessage(termMessages.title.refund)),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.refundPolicy)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.refund1)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.refund2)),
                    React.createElement(StyledSubTitle, { level: 3 }, formatMessage(termMessages.subtitle.refundMethod)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.refund3)),
                    React.createElement("p", null, formatMessage(termMessages.paragraph.refund4)))))));
};
export default TermsPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=TermsPage.js.map