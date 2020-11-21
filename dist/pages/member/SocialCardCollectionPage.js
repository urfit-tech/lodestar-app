var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Modal, Skeleton, Typography } from 'antd';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { CustomRatioImage } from '../../components/common/Image';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { commonMessages } from '../../helpers/translation';
import { useSocialCardCollection } from '../../hooks/member';
import IdentityIcon from '../../images/identity.svg';
var messages = defineMessages({
    youtubeChannel: { id: 'socialConnect.label.youtubeChannel', defaultMessage: 'YouTube 頻道' },
    plan: { id: 'socialConnect.label.plan', defaultMessage: '方案：{planName}' },
});
var StyledSectionTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledCard = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 2rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"], ["\n  padding: 2rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"])));
var StyledBadge = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  ::after {\n    position: absolute;\n    right: 0;\n    bottom: 0;\n    width: 24px;\n    height: 24px;\n    content: ' ';\n    background-image: url('", "');\n    background-size: contain;\n    background-position: center;\n  }\n"], ["\n  position: relative;\n  ::after {\n    position: absolute;\n    right: 0;\n    bottom: 0;\n    width: 24px;\n    height: 24px;\n    content: ' ';\n    background-image: url('", "');\n    background-size: contain;\n    background-position: center;\n  }\n"])), function (props) { return props.badgeUrl; });
var StyledCardTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledCardDescription = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  max-height: 3em;\n  overflow: hidden;\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: normal;\n  letter-spacing: 0.4px;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  max-height: 3em;\n  overflow: hidden;\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: normal;\n  letter-spacing: 0.4px;\n"])));
var StyledModal = styled(Modal)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  .ant-modal-body {\n    padding: 2rem;\n  }\n"], ["\n  .ant-modal-body {\n    padding: 2rem;\n  }\n"])));
var StyledModalTitle = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n"])));
var StyledModalMeta = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledModalDescription = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: pre-line;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: pre-line;\n"])));
var SocialCardCollectionPage = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useSocialCardCollection(), loadingSocialCards = _a.loadingSocialCards, socialCards = _a.socialCards;
    var _b = useState(null), selectedSocialCard = _b[0], setSelectedSocialCard = _b[1];
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: IdentityIcon, className: "mr-2" }),
            React.createElement("span", null, formatMessage(commonMessages.content.socialCard))),
        loadingSocialCards && React.createElement(Skeleton, { active: true }),
        socialCards.some(function (socialCard) { return socialCard.channel.type === 'youtube'; }) && (React.createElement(StyledSectionTitle, { className: "mb-4" }, formatMessage(messages.youtubeChannel))),
        React.createElement("div", { className: "row" }, socialCards.map(function (socialCard) { return (React.createElement("div", { key: socialCard.id, className: "col-6 col-lg-4" },
            React.createElement(StyledCard, { className: "d-flex align-items-center justify-content-start cursor-pointer", onClick: function () { return setSelectedSocialCard(socialCard); } },
                React.createElement(StyledBadge, { className: "flex-shrink-0 mr-4", badgeUrl: socialCard.plan.badgeUrl },
                    React.createElement(CustomRatioImage, { width: "84px", ratio: 1, src: socialCard.channel.profileUrl || '', shape: "circle" })),
                React.createElement("div", { className: "flex-grow-1" },
                    React.createElement(StyledCardTitle, null, socialCard.channel.name),
                    React.createElement(StyledCardDescription, null, formatMessage(messages.plan, { planName: socialCard.plan.name })))))); })),
        React.createElement(StyledModal, { visible: !!selectedSocialCard, title: null, footer: null, width: "24rem", centered: true, onCancel: function () { return setSelectedSocialCard(null); } }, selectedSocialCard && (React.createElement(React.Fragment, null,
            React.createElement(StyledModalTitle, { className: "mb-1" }, selectedSocialCard.channel.name),
            React.createElement(StyledModalMeta, null, formatMessage(messages.plan, { planName: selectedSocialCard.plan.name })),
            React.createElement(Divider, { className: "my-3" }),
            React.createElement(StyledModalDescription, null, selectedSocialCard.plan.description))))));
};
export default SocialCardCollectionPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=SocialCardCollectionPage.js.map