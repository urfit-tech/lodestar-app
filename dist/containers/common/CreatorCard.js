import React from 'react';
import CreatorCardComponents from '../../components/common/CreatorCard';
import { usePublicMember } from '../../hooks/member';
var CreatorCard = function (_a) {
    var id = _a.id;
    var member = usePublicMember(id).member;
    return (React.createElement(CreatorCardComponents, { id: id, avatarUrl: member === null || member === void 0 ? void 0 : member.pictureUrl, title: (member === null || member === void 0 ? void 0 : member.name) || (member === null || member === void 0 ? void 0 : member.username) || '', labels: [], jobTitle: member === null || member === void 0 ? void 0 : member.title, description: member === null || member === void 0 ? void 0 : member.abstract, withProgram: true, withPodcast: true, withAppointment: true, withBlog: true }));
};
export default CreatorCard;
//# sourceMappingURL=CreatorCard.js.map