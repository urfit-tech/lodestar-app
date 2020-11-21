var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Timeline } from 'antd';
import moment from 'moment';
import { groupBy } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { useEnrolledPodcastPlansCreators, useEnrolledPodcastPrograms } from '../../hooks/podcast';
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledProgram = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 1.25rem;\n"], ["\n  margin-bottom: 1.25rem;\n"])));
var PodcastProgramTimeline = function (_a) {
    var memberId = _a.memberId, podcastPrograms = _a.podcastPrograms, renderItem = _a.renderItem;
    var enrolledPodcastPrograms = useEnrolledPodcastPrograms(memberId || '').enrolledPodcastPrograms;
    var enrolledPodcastPlansCreators = useEnrolledPodcastPlansCreators(memberId || '').enrolledPodcastPlansCreators;
    var podcastProgramsGroupByDate = groupBy(function (podcast) { return moment(podcast.publishedAt).format('YYYY-MM-DD(dd)'); }, podcastPrograms);
    return (React.createElement(Timeline, null, Object.keys(podcastProgramsGroupByDate).map(function (date) { return (React.createElement(Timeline.Item, { key: date },
        React.createElement(StyledTitle, { className: "mb-4" }, date),
        renderItem &&
            podcastProgramsGroupByDate[date].map(function (podcastProgram) {
                var isEnrolled = enrolledPodcastPrograms.map(function (v) { return v.id; }).includes(podcastProgram.id);
                var isSubscribed = !!podcastProgram.instructor &&
                    enrolledPodcastPlansCreators.map(function (v) { return v.id; }).includes(podcastProgram.instructor.id);
                return (React.createElement(StyledProgram, { key: podcastProgram.id, className: "pl-3", id: podcastProgram.id }, renderItem && renderItem({ podcastProgram: podcastProgram, isEnrolled: isEnrolled, isSubscribed: isSubscribed })));
            }))); })));
};
export default PodcastProgramTimeline;
var templateObject_1, templateObject_2;
//# sourceMappingURL=PodcastProgramTimeline.js.map