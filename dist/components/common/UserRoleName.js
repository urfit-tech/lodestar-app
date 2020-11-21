import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages, helperMessages } from '../../helpers/translation';
export var UserRoleName = function (_a) {
    var userRole = _a.userRole;
    var formatMessage = useIntl().formatMessage;
    switch (userRole) {
        case 'anonymous':
            return React.createElement(React.Fragment, null, formatMessage(helperMessages.role.anonymous));
        case 'general-member':
            return React.createElement(React.Fragment, null, formatMessage(helperMessages.role.generalMember));
        case 'content-creator':
            return React.createElement(React.Fragment, null, formatMessage(helperMessages.role.contentCreator));
        case 'app-owner':
            return React.createElement(React.Fragment, null, formatMessage(helperMessages.role.appOwner));
        default:
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.identity));
    }
};
export default UserRoleName;
//# sourceMappingURL=UserRoleName.js.map