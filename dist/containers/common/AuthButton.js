import { Button, Popover } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { AuthModalContext } from '../../components/auth/AuthModal';
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton';
import Responsive from '../../components/common/Responsive';
import { commonMessages } from '../../helpers/translation';
var AuthButton = function () {
    var formatMessage = useIntl().formatMessage;
    var setVisible = useContext(AuthModalContext).setVisible;
    return (React.createElement(React.Fragment, null,
        React.createElement(Responsive.Default, null,
            React.createElement(Button, { className: "ml-2 mr-2", onClick: function () { return setVisible && setVisible(true); } }, formatMessage(commonMessages.button.login)),
            React.createElement(Popover, { placement: "bottomRight", trigger: "click", content: React.createElement(Wrapper, null,
                    React.createElement(StyledList, { split: false },
                        React.createElement(CustomNavLinks, null))) },
                React.createElement(Button, { type: "link", icon: "menu" }))),
        React.createElement(Responsive.Desktop, null,
            React.createElement(Button, { className: "ml-2", onClick: function () { return setVisible && setVisible(true); } }, formatMessage(commonMessages.button.loginRegister)))));
};
export default AuthButton;
//# sourceMappingURL=AuthButton.js.map