import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
var PeriodTypeLabel = function (_a) {
    var periodType = _a.periodType, periodAmount = _a.periodAmount;
    var formatMessage = useIntl().formatMessage;
    if (periodAmount && periodAmount > 1) {
        switch (periodType) {
            case 'D':
                return (React.createElement(React.Fragment, null, formatMessage({ id: 'common.periodType.per.day', defaultMessage: '每 {periodAmount} 天' }, { periodAmount: periodAmount })));
            case 'W':
                return (React.createElement(React.Fragment, null, formatMessage({ id: 'common.periodType.per.week', defaultMessage: '每 {periodAmount} 週' }, { periodAmount: periodAmount })));
            case 'M':
                return (React.createElement(React.Fragment, null, formatMessage({ id: 'common.periodType.per.month', defaultMessage: '每 {periodAmount} 月' }, { periodAmount: periodAmount })));
            case 'Y':
                return (React.createElement(React.Fragment, null, formatMessage({ id: 'common.periodType.per.year', defaultMessage: '每 {periodAmount} 年' }, { periodAmount: periodAmount })));
            default:
                return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.period));
        }
    }
    switch (periodType) {
        case 'D':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.perDay));
        case 'W':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.perWeek));
        case 'M':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.perMonth));
        case 'Y':
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unit.perYear));
        default:
            return React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.period));
    }
};
export default PeriodTypeLabel;
//# sourceMappingURL=PeriodTypeLabel.js.map