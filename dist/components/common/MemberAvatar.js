var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { usePublicMember } from '../../hooks/member';
import { AvatarImage } from './Image';
var MemberName = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #9b9b9b;\n"], ["\n  font-size: 14px;\n  color: #9b9b9b;\n"])));
var MemberAvatar = function (_a) {
    var memberId = _a.memberId, shape = _a.shape, size = _a.size, renderAvatar = _a.renderAvatar, renderText = _a.renderText, withName = _a.withName;
    var member = usePublicMember(memberId).member;
    if (!member) {
        return null;
    }
    return (React.createElement("div", { className: "d-flex align-items-center" },
        renderAvatar ? renderAvatar(member) : React.createElement(AvatarImage, { src: member.pictureUrl || '', shape: shape, size: size }),
        renderText && renderText(member),
        withName && React.createElement(MemberName, { className: "ml-3" }, member.name)));
};
export default MemberAvatar;
var templateObject_1;
//# sourceMappingURL=MemberAvatar.js.map