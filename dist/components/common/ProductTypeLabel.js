import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
var messages = defineMessages({
    program: { id: 'common.program', defaultMessage: '單次課程' },
    programPlan: { id: 'common.programPlan', defaultMessage: '訂閱課程' },
    programContent: { id: 'common.programContent', defaultMessage: '課程內容' },
    programPackagePlan: { id: 'common.package', defaultMessage: '課程組合' },
    projectPlan: { id: 'common.project', defaultMessage: '專案方案' },
    card: { id: 'common.memberCard', defaultMessage: '會員卡' },
    activityTicket: { id: 'common.activity', defaultMessage: '線下實體' },
    merchandise: { id: 'common.merchandise', defaultMessage: '商品' },
    podcastProgram: { id: 'common.podcast', defaultMessage: '廣播' },
    podcastPlan: { id: 'common.podcast.subscription', defaultMessage: '廣播頻道' },
    appointmentPlan: { id: 'common.appointment', defaultMessage: '預約' },
    unknownType: { id: 'common.unknownType', defaultMessage: '未知' },
});
var ProductTypeLabel = function (_a) {
    var productType = _a.productType;
    var formatMessage = useIntl().formatMessage;
    switch (productType) {
        case 'Program':
            return React.createElement(React.Fragment, null, formatMessage(messages.program));
        case 'ProgramPlan':
            return React.createElement(React.Fragment, null, formatMessage(messages.programPlan));
        case 'ProgramContent':
            return React.createElement(React.Fragment, null, formatMessage(messages.programContent));
        case 'ProgramPackagePlan':
            return React.createElement(React.Fragment, null, formatMessage(messages.programPackagePlan));
        case 'ProjectPlan':
            return React.createElement(React.Fragment, null, formatMessage(messages.projectPlan));
        case 'Card':
            return React.createElement(React.Fragment, null, formatMessage(messages.card));
        case 'ActivityTicket':
            return React.createElement(React.Fragment, null, formatMessage(messages.activityTicket));
        case 'MerchandiseSpec':
            return React.createElement(React.Fragment, null, formatMessage(messages.merchandise));
        case 'PodcastProgram':
            return React.createElement(React.Fragment, null, formatMessage(messages.podcastProgram));
        case 'PodcastPlan':
            return React.createElement(React.Fragment, null, formatMessage(messages.podcastPlan));
        case 'AppointmentPlan':
            return React.createElement(React.Fragment, null, formatMessage(messages.appointmentPlan));
        default:
            return React.createElement(React.Fragment, null, formatMessage(messages.unknownType));
    }
};
export default ProductTypeLabel;
//# sourceMappingURL=ProductTypeLabel.js.map