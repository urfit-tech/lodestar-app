import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
var ProductTypeFormatter = function (_a) {
    var value = _a.value;
    var formatMessage = useIntl().formatMessage;
    switch (value) {
        case 'Program':
        case 'ProgramPlan':
        case 'ProgramContent':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.programs));
        case 'ProgramPackagePlan':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.packages));
        case 'ProjectPlan':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.projects));
        case 'Card':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.memberCards));
        case 'ActivityTicket':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.activities));
        case 'Merchandise':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.merchandise));
        case 'PodcastProgram':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.podcast));
        case 'PodcastPlan':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.ui.podcastSubscription));
        default:
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.type));
    }
};
export default ProductTypeFormatter;
//# sourceMappingURL=ProductTypeFormatter.js.map