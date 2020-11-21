import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
var ShortenPeriodTypeLabel = function (_a) {
    var periodType = _a.periodType, withQuantifier = _a.withQuantifier;
    var formatMessage = useIntl().formatMessage;
    switch (periodType) {
        case 'D':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.day));
        case 'W':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.week));
        case 'M':
            return (React.createElement(React.Fragment, null, withQuantifier
                ? formatMessage(commonMessages.unit.monthWithQuantifier)
                : formatMessage(commonMessages.unit.month)));
        case 'Y':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.year));
        default:
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.period));
    }
};
export default ShortenPeriodTypeLabel;
//# sourceMappingURL=ShortenPeriodTypeLabel.js.map