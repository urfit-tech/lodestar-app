var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { productMessages } from '../../helpers/translation';
import { usePublicMember } from '../../hooks/member';
import CreatorCard from '../common/CreatorCard';
var StyledTitle = styled.h2(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 24px;\n  letter-spacing: 0.2px;\n  color: #585858;\n"], ["\n  font-size: 24px;\n  letter-spacing: 0.2px;\n  color: #585858;\n"])));
var ProgramInstructorCollectionBlock = function (_a) {
    var program = _a.program, title = _a.title;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement("div", null,
        React.createElement(StyledTitle, null, title || formatMessage(productMessages.program.title.instructorIntro)),
        React.createElement(Divider, { className: "mt-1" }),
        program.roles
            .filter(function (role) { return role.name === 'instructor'; })
            .map(function (role) { return (React.createElement(RoleProfile, { key: role.id, role: role })); })));
};
var RoleProfile = function (_a) {
    var role = _a.role;
    var _b = usePublicMember(role.memberId), loadingMember = _b.loadingMember, member = _b.member;
    if (loadingMember || !member) {
        return React.createElement(Skeleton, { active: true, avatar: true });
    }
    return (React.createElement(CreatorCard, { id: member.id, avatarUrl: member.pictureUrl, title: member.name || member.username, labels: [
            {
                id: role.id,
                name: role.name,
            },
        ], jobTitle: member.title, description: member.abstract, withProgram: true, withPodcast: true, withAppointment: true, withBlog: true, noPadding: true }));
};
export default ProgramInstructorCollectionBlock;
var templateObject_1;
//# sourceMappingURL=ProgramInstructorCollectionBlock.js.map