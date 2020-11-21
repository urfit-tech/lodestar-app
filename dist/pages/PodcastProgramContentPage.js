var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import { BREAK_POINT } from '../components/common/Responsive';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import PodcastProgramCover from '../components/podcast/PodcastProgramCover';
import CreatorCard from '../containers/common/CreatorCard';
import { usePodcastProgramContent } from '../hooks/podcast';
var StyledContentWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2.5rem 1rem 4rem;\n\n  @media (min-width: ", "px) {\n    padding: 4rem 1rem;\n    height: calc(100vh - 64px);\n    overflow-y: auto;\n\n    > div {\n      margin: 0 auto;\n      max-width: 38.75rem;\n    }\n  }\n"], ["\n  padding: 2.5rem 1rem 4rem;\n\n  @media (min-width: ", "px) {\n    padding: 4rem 1rem;\n    height: calc(100vh - 64px);\n    overflow-y: auto;\n\n    > div {\n      margin: 0 auto;\n      max-width: 38.75rem;\n    }\n  }\n"])), BREAK_POINT);
var PodcastProgramContentPage = function () {
    var podcastProgramId = useParams().podcastProgramId;
    var currentMemberId = useAuth().currentMemberId;
    var _a = usePodcastProgramContent(podcastProgramId), loadingPodcastProgram = _a.loadingPodcastProgram, podcastProgram = _a.podcastProgram;
    if (loadingPodcastProgram || !podcastProgram) {
        return (React.createElement(DefaultLayout, { noFooter: true },
            React.createElement(Skeleton, { active: true })));
    }
    return (React.createElement(DefaultLayout, { noFooter: true },
        React.createElement("div", { className: "row no-gutters" },
            React.createElement("div", { className: "col-12 col-lg-4" }, typeof currentMemberId === 'string' && (React.createElement(PodcastProgramCover, { memberId: currentMemberId, podcastProgramId: podcastProgramId, coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, publishedAt: podcastProgram.publishedAt, tags: podcastProgram.tags, description: podcastProgram.abstract }))),
            React.createElement("div", { className: "col-12 col-lg-8" },
                React.createElement(StyledContentWrapper, null,
                    podcastProgram.instructorIds.map(function (instructorId) { return (React.createElement("div", { key: instructorId, className: "mb-5" },
                        React.createElement(CreatorCard, { id: instructorId }))); }),
                    React.createElement("div", { className: "mb-5" },
                        React.createElement(BraftContent, null, podcastProgram.description ? podcastProgram.description : null)))))));
};
export default PodcastProgramContentPage;
var templateObject_1;
//# sourceMappingURL=PodcastProgramContentPage.js.map