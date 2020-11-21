import { Spin, TreeSelect } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
var formatMessage = useIntl().formatMessage;
var ProductTypeLabel = {
    Program: formatMessage(commonMessages.ui.allPrograms),
    ProgramPlan: formatMessage(commonMessages.ui.allSubscriptions),
    ProgramContent: formatMessage(commonMessages.ui.allCourseContents),
    Card: formatMessage(commonMessages.ui.allMemberCards),
    ActivityTicket: formatMessage(commonMessages.ui.allActivities),
    Merchandise: formatMessage(commonMessages.ui.allMerchandise),
};
var ProductSelector = function (_a, ref) {
    var loading = _a.loading, error = _a.error, products = _a.products, value = _a.value, onChange = _a.onChange;
    var formatMessage = useIntl().formatMessage;
    if (loading) {
        return React.createElement(Spin, null);
    }
    if (error) {
        return React.createElement("div", null, formatMessage(commonMessages.status.loadingProductError));
    }
    var treeData = Object.keys(ProductTypeLabel)
        .filter(function (productType) { return ProductTypeLabel[productType] && products.filter(function (product) { return product.type === productType; }).length; })
        .map(function (productType) { return ({
        title: ProductTypeLabel[productType],
        value: productType,
        key: productType,
        children: products
            .filter(function (product) { return product.type === productType; })
            .map(function (product) {
            return {
                title: product.title,
                value: product.id,
                key: product.id,
            };
        }),
    }); });
    return (React.createElement(TreeSelect, { value: value, onChange: onChange, treeData: treeData, treeCheckable: true, showCheckedStrategy: "SHOW_PARENT", searchPlaceholder: formatMessage(commonMessages.form.placeholder.search), treeNodeFilterProp: "title", dropdownStyle: {
            maxHeight: '30vh',
        } }));
};
export default ProductSelector;
//# sourceMappingURL=ProductSelector.js.map