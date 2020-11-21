import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
var ProgramRoleFormatter = function (_a) {
    var value = _a.value;
    var formatMessage = useIntl().formatMessage;
    switch (value) {
        case 'owner':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.role.owner));
        case 'instructor':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.role.instructor));
        case 'assistant':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.role.assistant));
        default:
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.character));
    }
};
export default ProgramRoleFormatter;
//# sourceMappingURL=ProgramRoleFormatter.js.map