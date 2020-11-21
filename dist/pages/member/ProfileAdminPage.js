import { Typography } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useAuth } from '../../components/auth/AuthContext';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import ProfileAccountAdminCard from '../../components/profile/ProfileAccountAdminCard';
import ProfileBasicAdminCard from '../../components/profile/ProfileBasicAdminCard';
import ProfilePasswordAdminCard from '../../components/profile/ProfilePasswordAdminCard';
import { commonMessages } from '../../helpers/translation';
import UserIcon from '../../images/user.svg';
var ProfileAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: UserIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.personalSettings))),
        React.createElement("div", { className: "mb-3" }, currentMemberId && React.createElement(ProfileBasicAdminCard, { memberId: currentMemberId })),
        React.createElement("div", { className: "mb-3" }, currentMemberId && React.createElement(ProfileAccountAdminCard, { memberId: currentMemberId })),
        React.createElement("div", { className: "mb-3" }, currentMemberId && React.createElement(ProfilePasswordAdminCard, { memberId: currentMemberId }))));
};
export default ProfileAdminPage;
//# sourceMappingURL=ProfileAdminPage.js.map