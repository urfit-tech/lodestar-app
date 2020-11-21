import { Skeleton, Typography } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import DefaultLayout from '../../components/layout/DefaultLayout';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { useApp } from '../../containers/common/AppContext';
import VoucherCollectionBlock from '../../containers/voucher/VoucherCollectionBlock';
import { commonMessages } from '../../helpers/translation';
import GiftIcon from '../../images/gift.svg';
import NotFoundPage from '../NotFoundPage';
var VoucherCollectionAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    if (loading) {
        return (React.createElement(DefaultLayout, null,
            React.createElement(Skeleton, { active: true })));
    }
    if (!enabledModules.voucher) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: GiftIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.voucher))),
        React.createElement(VoucherCollectionBlock, null)));
};
export default VoucherCollectionAdminPage;
//# sourceMappingURL=VoucherCollectionAdminPage.js.map