var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Icon } from 'antd';
import gql from 'graphql-tag';
import { flatten, uniqBy } from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AvatarImage } from '../../components/common/Image';
import { productMessages } from '../../helpers/translation';
var StyledSubTitle = styled.h2(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledCreatorName = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  overflow: hidden;\n  white-space: nowrap;\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  text-overflow: ellipsis;\n"], ["\n  overflow: hidden;\n  white-space: nowrap;\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  text-overflow: ellipsis;\n"])));
var StyledIcon = styled(Icon)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme['@primary-color']; });
var PopularPodcastCollection = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useQuery(GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION), loading = _a.loading, error = _a.error, data = _a.data;
    var creators = loading || error || !data
        ? []
        : uniqBy(function (creator) { return creator.id; }, flatten(data.podcast_program.map(function (podcastProgram) {
            return podcastProgram.podcast_program_roles.map(function (role) {
                var _a, _b, _c;
                return ({
                    id: ((_a = role.member) === null || _a === void 0 ? void 0 : _a.id) || '',
                    avatarUrl: (_b = role.member) === null || _b === void 0 ? void 0 : _b.picture_url,
                    name: ((_c = role.member) === null || _c === void 0 ? void 0 : _c.name) || '',
                });
            });
        })));
    return (React.createElement("div", null,
        React.createElement(StyledSubTitle, { className: "mb-4" }, formatMessage(productMessages.podcast.title.hottest)),
        creators.map(function (creator) { return (React.createElement(Link, { key: creator.id, to: "/creators/" + creator.id + "?tabkey=podcasts", className: "d-flex align-items-center justify-content-between mb-3" },
            React.createElement(AvatarImage, { size: 64, src: creator.avatarUrl, className: "flex-shrink-0 mr-4" }),
            React.createElement(StyledCreatorName, { className: "flex-grow-1 mr-3" }, creator.name),
            React.createElement(StyledIcon, { type: "right" }))); })));
};
var GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION = gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  query GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION {\n    podcast_program(where: { podcast_program_roles: { name: { _eq: \"instructor\" } } }) {\n      id\n      podcast_program_roles {\n        member {\n          id\n          picture_url\n          name\n          username\n        }\n      }\n    }\n  }\n"], ["\n  query GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION {\n    podcast_program(where: { podcast_program_roles: { name: { _eq: \"instructor\" } } }) {\n      id\n      podcast_program_roles {\n        member {\n          id\n          picture_url\n          name\n          username\n        }\n      }\n    }\n  }\n"])));
export default PopularPodcastCollection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=PopularPodcastCollection.js.map