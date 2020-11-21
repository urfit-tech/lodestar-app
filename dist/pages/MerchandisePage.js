var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Skeleton, Tabs } from 'antd';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import MerchandiseBlock from '../components/merchandise/MerchandiseBlock';
import { useMerchandise } from '../hooks/merchandise';
var messages = defineMessages({
    overview: { id: 'product.merchandise.tab.overview', defaultMessage: '商品概述' },
    qa: { id: 'product.merchandise.tab.qa', defaultMessage: '問與答' },
});
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  max-width: 960px;\n"], ["\n  max-width: 960px;\n"])));
var MerchandisePage = function () {
    var formatMessage = useIntl().formatMessage;
    var merchandiseId = useParams().merchandiseId;
    var merchandise = useMerchandise(merchandiseId).merchandise;
    useEffect(function () {
        if (merchandise) {
            var index = 1;
            for (var _i = 0, _a = merchandise.specs; _i < _a.length; _i++) {
                var spec = _a[_i];
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: spec.id,
                    name: merchandise.title + " - " + spec.title,
                    category: 'MerchandiseSpec',
                    price: "" + spec.listPrice,
                    position: index,
                });
                index += 1;
                if (index % 20 === 0)
                    ReactGA.ga('send', 'pageview');
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [merchandise]);
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledContainer, { className: "container" },
            React.createElement("div", { className: "my-4" }, merchandise && React.createElement(MerchandiseBlock, { merchandise: merchandise, withPaymentButton: true })),
            React.createElement(Tabs, { defaultActiveKey: "overview", className: "mb-5" },
                React.createElement(Tabs.TabPane, { tab: formatMessage(messages.overview), key: "overview", className: "my-3" }, merchandise ? React.createElement(BraftContent, null, merchandise.description) : React.createElement(Skeleton, null))))));
};
export default MerchandisePage;
var templateObject_1;
//# sourceMappingURL=MerchandisePage.js.map