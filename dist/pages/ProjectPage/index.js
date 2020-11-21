var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { render } from 'mustache';
import { props } from 'ramda';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Redirect, useParams } from 'react-router-dom';
import { useProject } from '../../hooks/project';
import LoadingPage from '../LoadingPage';
import FundingPage from './FundingPage';
import ModularPage from './ModularPage';
import OnSalePage from './OnSalePage';
var ProjectPage = function () {
    var projectId = useParams().projectId;
    var _a = useProject(projectId), loadingProject = _a.loadingProject, errorProject = _a.errorProject, project = _a.project;
    useEffect(function () {
        var _a;
        if (project) {
            (_a = project.projectPlans) === null || _a === void 0 ? void 0 : _a.forEach(function (projectPlan, index) {
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: projectPlan.id,
                    name: project.title + " - " + projectPlan.title,
                    category: 'ProjectPlan',
                    price: "" + projectPlan.listPrice,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: projectPlan.id,
                    name: project.title + " - " + projectPlan.title,
                    category: 'ProjectPlan',
                    price: "" + projectPlan.listPrice,
                    position: index + 1,
                });
            });
            ReactGA.plugin.execute('ec', 'setAction', 'detail');
            ReactGA.ga('send', 'pageview');
        }
    }, [project]);
    if (loadingProject) {
        return React.createElement(LoadingPage, null);
    }
    if (errorProject || !project || !project.publishedAt || project.publishedAt.getTime() > Date.now()) {
        return React.createElement(Redirect, { to: "/" });
    }
    if (project.template) {
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: render(project.template, props) } });
    }
    switch (project.type) {
        case 'funding':
        case 'pre-order':
            return React.createElement(FundingPage, __assign({}, project));
        // return <PreOrderContentBlock {...props} />
        case 'on-sale':
            return React.createElement(OnSalePage, __assign({}, project));
        case 'modular':
            return React.createElement(ModularPage, { projectId: project.id });
        default:
            return React.createElement("div", null, "Default Project Page");
    }
};
export default ProjectPage;
//# sourceMappingURL=index.js.map