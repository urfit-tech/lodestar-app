import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout';
import { commonMessages } from '../helpers/translation';
var ForbiddenPage = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    return (React.createElement(DefaultLayout, null,
        React.createElement("div", { className: "vw-100 pt-5 text-center" },
            React.createElement("div", { className: "mb-3" }, formatMessage(commonMessages.content.noAuthority)),
            React.createElement(Button, { className: "mr-2", onClick: function () { return history.goBack(); } }, formatMessage(commonMessages.button.previousPage)),
            React.createElement(Button, { type: "primary", onClick: function () { return history.push('/'); } }, formatMessage(commonMessages.button.home)))));
};
export default ForbiddenPage;
//# sourceMappingURL=ForbiddenPage.js.map