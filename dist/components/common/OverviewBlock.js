var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledPodcastPlansCreators, useEnrolledPodcastProgramIds } from '../../hooks/podcast';
import { useEnrolledProgramIds } from '../../hooks/program';
import ArrowRightIcon from '../../images/angle-right.svg';
import EmptyCover from '../../images/empty-cover.png';
import { useAuth } from '../auth/AuthContext';
import PodcastProgramPopover from '../podcast/PodcastProgramPopover';
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  padding-left: 20px;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  overflow: hidden;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  padding-left: 20px;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  overflow: hidden;\n"])));
var StyledSideBarBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n  padding-left: 1.25rem;\n"], ["\n  margin-bottom: 2rem;\n  padding-left: 1.25rem;\n"])));
var StyledImage = styled.img(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 114px;\n  height: 70px;\n  object-fit: cover;\n"], ["\n  width: 114px;\n  height: 70px;\n  object-fit: cover;\n"])));
var StyledLink = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 24px;\n  color: ", ";\n  font-size: 14px;\n  cursor: pointer;\n  user-select: none;\n  transition: 0.5s;\n\n  &:hover {\n    opacity: 0.7;\n  }\n"], ["\n  margin-top: 24px;\n  color: ", ";\n  font-size: 14px;\n  cursor: pointer;\n  user-select: none;\n  transition: 0.5s;\n\n  &:hover {\n    opacity: 0.7;\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var OverviewBlock = function (_a) {
    var programs = _a.programs, podcastPrograms = _a.podcastPrograms, onChangeTab = _a.onChangeTab, onSubscribe = _a.onSubscribe;
    var currentMemberId = useAuth().currentMemberId;
    var formatMessage = useIntl().formatMessage;
    var enrolledProgramIds = useEnrolledProgramIds(currentMemberId || '').enrolledProgramIds;
    var enrolledPodcastProgramIds = useEnrolledPodcastProgramIds(currentMemberId || '').enrolledPodcastProgramIds;
    var enrolledPodcastPlansCreators = useEnrolledPodcastPlansCreators(currentMemberId || '').enrolledPodcastPlansCreators;
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledSideBarBlock, null,
            React.createElement("h4", { className: "mb-4" }, formatMessage(commonMessages.title.addCourse)),
            programs.slice(0, 3).map(function (program) { return (React.createElement(Link, { key: program.id, to: "/programs/" + program.id + (enrolledProgramIds.includes(program.id) ? '/contents' : '') },
                React.createElement("div", { className: "d-flex align-items-center mb-3" },
                    React.createElement(StyledImage, { className: "flex-shrink-0", src: program.coverUrl || EmptyCover, alt: program.title || program.id }),
                    React.createElement(StyledTitle, null, program.title)))); }),
            React.createElement(StyledLink, { onClick: function () { return onChangeTab && onChangeTab('programs'); } },
                formatMessage(commonMessages.content.browse),
                React.createElement(Icon, { src: ArrowRightIcon, className: "ml-2" }))),
        podcastPrograms.length > 0 && (React.createElement(StyledSideBarBlock, null,
            React.createElement("h4", { className: "mb-4" }, formatMessage(commonMessages.content.podcasts)),
            podcastPrograms.slice(0, 3).map(function (podcastProgram) {
                var isEnrolled = enrolledPodcastProgramIds.includes(podcastProgram.id);
                var isSubscribed = !!podcastProgram.instructor &&
                    enrolledPodcastPlansCreators.map(function (v) { return v.id; }).includes(podcastProgram.instructor.id);
                return (React.createElement(PodcastProgramPopover, { key: podcastProgram.id, isEnrolled: isEnrolled, isSubscribed: isSubscribed, podcastProgramId: podcastProgram.id, title: podcastProgram.title, listPrice: podcastProgram.listPrice, salePrice: podcastProgram.salePrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, description: podcastProgram.description, categories: podcastProgram.categories, instructor: podcastProgram.instructor, onSubscribe: onSubscribe },
                    React.createElement("div", { className: "d-flex align-items-center mb-3" },
                        React.createElement(StyledImage, { className: "flex-shrink-0", src: podcastProgram.coverUrl || EmptyCover, alt: podcastProgram.title }),
                        React.createElement(StyledTitle, null, podcastProgram.title))));
            }),
            React.createElement(StyledLink, { onClick: function () { return onChangeTab && onChangeTab('podcasts'); } },
                formatMessage(commonMessages.content.browse),
                React.createElement(Icon, { src: ArrowRightIcon, className: "ml-2" }))))));
};
export default OverviewBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=OverviewBlock.js.map