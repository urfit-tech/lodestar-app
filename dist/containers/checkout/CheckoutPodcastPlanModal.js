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
import { Form } from 'antd';
import React from 'react';
import PodcastPlanSelector from '../../components/podcast/PodcastPlanSelector';
import { usePublishedPodcastPlans } from '../../hooks/podcast';
import CheckoutProductModal from './CheckoutProductModal';
var CheckoutPodcastPlanModal = function (_a) {
    var children = _a.children, creatorId = _a.creatorId, renderTrigger = _a.renderTrigger, modalProps = __rest(_a, ["children", "creatorId", "renderTrigger"]);
    var _b = usePublishedPodcastPlans(creatorId), loadingPodcastPlans = _b.loadingPodcastPlans, publishedPodcastPlans = _b.publishedPodcastPlans;
    if (loadingPodcastPlans) {
        return null;
    }
    if (!publishedPodcastPlans[0]) {
        return React.createElement(React.Fragment, null, renderTrigger({ setVisible: function () { } }));
    }
    return (React.createElement(CheckoutProductModal, __assign({ renderTrigger: renderTrigger, renderProductSelector: function (_a) {
            var productId = _a.productId, onProductChange = _a.onProductChange;
            return (React.createElement(PodcastPlanSelector, { podcastPlans: publishedPodcastPlans, value: productId.split('_')[1], onChange: function (podcastPlanId) { return onProductChange("PodcastPlan_" + podcastPlanId); } }));
        }, defaultProductId: "PodcastPlan_" + publishedPodcastPlans[0].id }, modalProps)));
};
export default Form.create()(CheckoutPodcastPlanModal);
//# sourceMappingURL=CheckoutPodcastPlanModal.js.map